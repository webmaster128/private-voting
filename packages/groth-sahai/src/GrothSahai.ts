import { BIG, CTXWithCurvePF12, ECP, ECP2 } from "amcl-js";

import { fp12MatricesAdd, fp12MatricesEqual, FP12Matrix2x2 } from "./math";
import { Pairings } from "./Pairings";
import { Rng } from "./Rng";
import { makeGeneratorsPF12, range, same } from "./utils";

/** Type of element in module B_1 = G1×G1 */
export type B1 = readonly [ECP, ECP];
/** Type of element in module B_2 = G2×G2 */
export type B2 = readonly [ECP2, ECP2];

export interface CommitmentKeyInG1 {
  readonly u1: B1;
  readonly u2: B1;
  /** factor between u1 and u2 */
  readonly t: BIG;
}

export interface CommitmentKeyInG2 {
  readonly v1: B2;
  readonly v2: B2;
  /** factor between v1 and v2 */
  readonly t: BIG;
}

/**
 * u is an element in G1^4, v is an element in G2^4
 *
 * u2 is a multiple of u1; v2 is a multiple of v1.
 */
export interface CommonReferenceString {
  readonly u: CommitmentKeyInG1;
  readonly v: CommitmentKeyInG2;
}

function makeCommitmentKeyForG1(ctx: CTXWithCurvePF12, rng: Rng): CommitmentKeyInG1 {
  const { g1 } = makeGeneratorsPF12(ctx);

  const u1: B1 = [
    new ctx.ECP(g1), // generator P
    new ctx.ECP(rng.makePointInG1()), // a*P for random a and generator P
  ];

  // u2 = t*u1, i.e. we create a perfectly binding commitment key
  const t = rng.makeFactor();
  const u2: B1 = [u1[0].mul(t), u1[1].mul(t)];

  return { u1, u2, t };
}

function makeCommitmentKeyForG2(ctx: CTXWithCurvePF12, rng: Rng): CommitmentKeyInG2 {
  const { g2 } = makeGeneratorsPF12(ctx);

  const v1: B2 = [
    new ctx.ECP2(g2), // generator P
    rng.makePointInG2(), // a*P for random a and generator P
  ];

  // v2 = t*v1, i.e. we create a perfectly binding commitment key
  const t = rng.makeFactor();
  const v2: B2 = [v1[0].mul(t), v1[1].mul(t)];

  return { v1, v2, t };
}

/**
 * Setup_GS as described in 3.1, "Groth-Sahai Proofs"
 *
 * Groth-Sahai proofs will be used to "to prove consistency and knowledge of encryptions".
 *
 *
 * @returns a common reference string "CRS" in G1^4, G2^4
 */
export function SetupGS(ctx: CTXWithCurvePF12, rng: Rng): CommonReferenceString {
  return {
    u: makeCommitmentKeyForG1(ctx, rng),
    v: makeCommitmentKeyForG2(ctx, rng),
  };
}

export type Pi = readonly [readonly [ECP2, ECP2], readonly [ECP2, ECP2]];
export type Theta = readonly [ECP, ECP];

export interface PiOnly {
  readonly pi: Pi;
}

export interface ThetaOnly {
  readonly theta: Theta;
}

export type GSProof = PiOnly | ThetaOnly | (PiOnly & ThetaOnly);

/**
 * Groth-Sahai poofs as defined in https://eprint.iacr.org/2007/155, 20160411:065033.
 * This uses "Instantiation based on the SXDH assumption", page 25.
 *
 * A_1 = G1
 * A_2 = G2
 * A_T = GT
 * B_1 = G1×G1
 * B_2 = G2×G2
 * B_T = GT×GT×GT×GT
 *
 */
export class GrothSahai {
  private readonly ctx: CTXWithCurvePF12;

  /** Commitment key u = (u1, u2) in G1×G1 */
  private readonly u1: B1;
  /** Commitment key u = (u1, u2) in G1×G1 */
  private readonly u2: B1;
  /** Commitment key v = (v1, v2) in G2×G2 */
  private readonly v1: B2;
  /** Commitment key v = (v1, v2) in G2×G2 */
  private readonly v2: B2;
  /**
   * Temporary value as defined in https://eprint.iacr.org/2007/155, 20160411:065033, page 25
   * u := u_2 + (infinity, generator) for G1
   */
  private readonly uaux: B1;
  /**
   * Temporary value as defined in https://eprint.iacr.org/2007/155, 20160411:065033, page 25
   * u := u_2 + (infinity, generator) for G2
   */
  private readonly vaux: B2;

  public constructor(ctx: CTXWithCurvePF12, crs: CommonReferenceString) {
    this.ctx = ctx;
    const { g1, g2 } = makeGeneratorsPF12(ctx);

    this.u1 = crs.u.u1;
    this.u2 = crs.u.u2;
    this.v1 = crs.v.v1;
    this.v2 = crs.v.v2;

    const uaux2ndComponent = new ctx.ECP(crs.u.u2[1]);
    uaux2ndComponent.add(g1);
    this.uaux = [this.u2[0], uaux2ndComponent];

    const vaux2ndComponent = new ctx.ECP2(crs.v.v2[1]);
    vaux2ndComponent.add(g2);
    this.vaux = [this.v2[0], vaux2ndComponent];
  }

  /**
   * The "inclusion map" from module A (G1) into module B (G1×G1)
   *
   * https://eprint.iacr.org/2007/155, version 20160411:065033, page 24
   *
   * @param X a group element in G1
   */
  public iota1(X: ECP): B1 {
    const infinity = new this.ctx.ECP();
    return [infinity, new this.ctx.ECP(X)];
  }

  /**
   * The "inclusion map" from module A (G2) into module B (G2×G2)
   *
   * https://eprint.iacr.org/2007/155, version 20160411:065033, page 24
   *
   * @param Y a group element in G2
   */
  public iota2(Y: ECP2): B2 {
    const infinity = new this.ctx.ECP2();
    return [infinity, new this.ctx.ECP2(Y)];
  }

  /**
   * https://eprint.iacr.org/2007/155, version 20160411:065033, page 25
   *
   * @param z a scalar with 0 <= z < order of G1
   */
  public iotaPrime1(z: BIG): B1 {
    return [this.uaux[0].mul(z), this.uaux[1].mul(z)];
  }

  /**
   * https://eprint.iacr.org/2007/155, version 20160411:065033, page 25
   *
   * @param z a scalar with 0 <= z < order of G2
   */
  public iotaPrime2(z: BIG): B2 {
    return [this.vaux[0].mul(z), this.vaux[1].mul(z)];
  }

  /**
   * A mapping from B_1×B_2 into B_T, as defined in the GS paper.
   *
   * @param X an element in B_1 (B_1 = G1×G1)
   * @param Y an element in B_2 (B_2 = G2×G2)
   * @returns an element in B_T (B_T = GT×GT×GT×GT)
   */
  public F(X: B1, Y: B2): FP12Matrix2x2 {
    const pairings = new Pairings(this.ctx);
    return [
      [pairings.e(X[0], Y[0]), pairings.e(X[0], Y[1])],
      [pairings.e(X[1], Y[0]), pairings.e(X[1], Y[1])],
    ];
  }

  /**
   * C_i' for i = 1 from 3.1, "Groth-Sahai Proofs"
   *
   * Creates a commitment to a scalar in G1
   *
   * @param x a m-element vector of scalars to be committed
   */
  public commitScalarInG1(x: readonly BIG[], r: readonly BIG[]): readonly B1[] {
    // c' := iotaPrime1(x) + r*u_1
    // from https://eprint.iacr.org/2007/155, version 20160411:065033, page 27

    const m = same(x.length, r.length);

    return range(m).map(
      (i): B1 => {
        const out = this.iotaPrime1(x[i]);
        out[0].add(this.u1[0].mul(r[i]));
        out[1].add(this.u1[1].mul(r[i]));
        return out;
      },
    );
  }

  /**
   * C_i' for i = 2 from 3.1, "Groth-Sahai Proofs"
   *
   * Creates a commitment to a scalar in G2
   *
   * @param y a n-element vector of scalars to be committed
   */
  public commitScalarInG2(y: readonly BIG[], s: readonly BIG[]): readonly B2[] {
    // d' := iotaPrime2(y) + s*v_1
    // from https://eprint.iacr.org/2007/155, version 20160411:065033, page 27

    const n = same(y.length, s.length);

    return range(n).map(
      (i): B2 => {
        const out = this.iotaPrime2(y[i]);
        out[0].add(this.v1[0].mul(s[i]));
        out[1].add(this.v1[1].mul(s[i]));
        return out;
      },
    );
  }

  /**
   * C_1 from 3.1, "Groth-Sahai Proofs"
   *
   * Creates a commitment to an element in G1
   *
   * @param X a m-element vector of elements in G1
   * @param R a m×2 martrix of random integers in [0, order of G1)
   */
  public commitElementInG1(X: readonly ECP[], R: readonly (readonly [BIG, BIG])[]): B1[] {
    // c := iota(X) + r_1*u_1 + r_2*u_2
    // from https://eprint.iacr.org/2007/155, version 20160411:065033, page 24

    const m = same(X.length, R.length);

    return range(m).map(
      (i): B1 => {
        const out = this.iota1(X[i]);

        const [r1, r2] = R[i];
        out[0].add(this.u1[0].mul(r1));
        out[1].add(this.u1[1].mul(r1));

        out[0].add(this.u2[0].mul(r2));
        out[1].add(this.u2[1].mul(r2));

        return out;
      },
    );
  }

  /**
   * C_2 from 3.1, "Groth-Sahai Proofs"
   *
   * Creates a commitment to an element in G2
   *
   * @param Y a n-element vector of elements in G2
   * @param S a n×2 martrix of random integers in [0, order of G1)
   */
  public commitElementInG2(Y: readonly ECP2[], S: readonly (readonly [BIG, BIG])[]): readonly B2[] {
    // d := iota(Y) + s_1*v_1 + s_2*v_2
    // from https://eprint.iacr.org/2007/155, version 20160411:065033, page 27

    const n = same(Y.length, S.length);

    return range(n).map(
      (i): B2 => {
        const out = this.iota2(Y[i]);

        const [s1, s2] = S[i];
        out[0].add(this.v1[0].mul(s1));
        out[1].add(this.v1[1].mul(s1));

        out[0].add(this.v2[0].mul(s2));
        out[1].add(this.v2[1].mul(s2));

        return out;
      },
    );
  }

  /**
   * Special case for m=1.
   *
   * from https://eprint.iacr.org/2007/155, version 20160411:065033, page 27, NIWI proof 3.
   *
   * @param A an element in G1^n
   * @param s a n-element vector
   */
  public proveMultiScalarLinear1(A: readonly ECP[], s: readonly BIG[]): ThetaOnly {
    // prove that A * y = T_1, with public A, public T_1 in G1 and secret scalar y

    const _n = same(A.length, s.length);

    // theta := s^T * iota1(A)

    const zero: B1 = [new this.ctx.ECP(), new this.ctx.ECP()];
    const theta = A.reduce((current, _, i): B1 => {
      const iota = this.iota1(A[i]);
      current[0].add(iota[0].mul(s[i]));
      current[1].add(iota[1].mul(s[i]));
      return current;
    }, zero);

    return { theta: theta };
  }

  /**
   * Special case for m=1.
   *
   * from https://eprint.iacr.org/2007/155, version 20160411:065033, page 27, NIWI proof 3.
   *
   * @param b a m-element vector of scalars
   * @param R a m×2 matrix of random integers in [0, order of G1)
   */
  public proveMultiScalarLinear2(b: readonly BIG[], R: readonly (readonly [BIG, BIG])[]): PiOnly {
    // prove that X * b = T_1, with secret X, public T_1 in G1 and public scalar b

    const _m = same(b.length, R.length);

    // pi := R^T * iotaPrime2(b)

    const zero: Pi = [
      [new this.ctx.ECP2(), new this.ctx.ECP2()],
      [new this.ctx.ECP2(), new this.ctx.ECP2()],
    ];
    const pi = b.reduce((current, _, i): Pi => {
      const iota = this.iotaPrime2(b[i]);
      const [r1, r2] = R[i];

      current[0][0].add(iota[0].mul(r1));
      current[0][1].add(iota[1].mul(r1));
      current[1][0].add(iota[0].mul(r2));
      current[1][1].add(iota[1].mul(r2));

      return current;
    }, zero);

    return { pi: pi };
  }

  public verifyMultiScalarLinear1(
    A: readonly ECP[],
    dPrime: readonly B2[],
    T1: ECP,
    proof: ThetaOnly,
  ): boolean {
    const zeroPi: Pi = [
      [new this.ctx.ECP2(), new this.ctx.ECP2()],
      [new this.ctx.ECP2(), new this.ctx.ECP2()],
    ];
    return this.verifyMultiScalar(A, dPrime, [], [], T1, zeroPi, proof.theta);
  }

  public verifyMultiScalarLinear2(
    c: readonly B1[],
    b: readonly BIG[],
    T1: ECP,
    proof: PiOnly,
  ): boolean {
    const zeroTheta: Theta = [new this.ctx.ECP(), new this.ctx.ECP()];
    return this.verifyMultiScalar([], [], c, b, T1, proof.pi, zeroTheta);
  }

  /**
   * Multi-scalar verification in G1
   * as decribesd in https://eprint.iacr.org/2007/155, version 20160411:065033, page 28, "Verifier" 2.
   */
  public verifyMultiScalar(
    A: readonly ECP[],
    dPrime: readonly B2[],
    c: readonly B1[],
    b: readonly BIG[],
    T1: ECP,
    pi: Pi,
    theta: Theta,
  ): boolean {
    const thisClass = this;

    /** dot for n = 1 */
    function dot1(x: B1, y: B2): FP12Matrix2x2 {
      return thisClass.F(x, y);
    }

    function dot(xs: readonly B1[], ys: readonly B2[]): FP12Matrix2x2 {
      if (xs.length !== ys.length) {
        throw new Error("The number of x and the number of y do not match");
      }

      const summands = xs.map((x, index) => {
        const y = ys[index];
        return thisClass.F(x, y);
      });
      return fp12MatricesAdd(thisClass.ctx, ...summands);
    }

    function iotaTildeT(Z: ECP): FP12Matrix2x2 {
      return thisClass.F(thisClass.iota1(Z), thisClass.iotaPrime2(new thisClass.ctx.BIG(1)));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function iotaHatT(Z: ECP2): FP12Matrix2x2 {
      return thisClass.F(thisClass.iotaPrime1(new thisClass.ctx.BIG(1)), thisClass.iota2(Z));
    }

    const lhsParts = new Array<FP12Matrix2x2>();

    const n = same(A.length, dPrime.length);
    for (let i = 0; i < n; ++i) {
      lhsParts.push(dot1(this.iota1(A[i]), dPrime[i]));
    }

    const m = same(c.length, b.length);
    for (let i = 0; i < m; ++i) {
      lhsParts.push(dot1(c[i], this.iotaPrime2(b[i])));
    }
    // gamma is always 0 in our use case

    const lhs = fp12MatricesAdd(this.ctx, ...lhsParts);
    const rhs = fp12MatricesAdd(
      this.ctx,
      iotaTildeT(T1),
      dot([this.u1, this.u2], pi),
      this.F(theta, this.v1),
    );

    return fp12MatricesEqual(lhs, rhs);
  }
}
