import { CTX } from "amcl-js";

import { ElGamal1, ElGamal2 } from "./ElGamal";
import { GrothSahai, SetupGS } from "./GrothSahai";
import { e } from "./math";
import { Rng } from "./Rng";
import { makeGeneratorsPF12 } from "./utils";

const ctx = new CTX("BN254CX");
const { g1, g2 } = makeGeneratorsPF12(ctx);
const n = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Order);

describe("GrothSahai", () => {
  const rng = new Rng(ctx, new Uint8Array([0x00, 0x11, 0x22]));
  const crs = SetupGS(ctx, rng);

  it("can be constructed", () => {
    const gs = new GrothSahai(ctx, crs);
    expect(gs).toBeTruthy();
  });

  describe("commitScalarInG1", () => {
    it("commits scalars in G1 by ElGamal-encrypting g1*x", () => {
      const r = rng.makeFactor();

      const x = rng.makeFactor(); // random scalar
      const X = g1.mul(x);

      const gs = new GrothSahai(ctx, crs);
      const [commitment] = gs.commitScalarInG1([x], [r]);

      // https://eprint.iacr.org/2007/155, 20160411:065033, page 24, "Commitments"
      // (r + x*t)
      const elGamalFactor = ctx.BIG.modmul(x, crs.u.t, n);
      elGamalFactor.add(r);

      const Q = crs.u.u1[1];
      const { c1, c2 } = new ElGamal1(ctx).encrypt(Q, X, elGamalFactor);

      expect(commitment[0].equals(c1)).toEqual(true);
      expect(commitment[1].equals(c2)).toEqual(true);
    });
  });

  describe("commitScalarInG2", () => {
    it("commits scalars in G2 by ElGamal-encrypting g2*x", () => {
      const r = rng.makeFactor();

      const x = rng.makeFactor(); // random scalar
      const X = g2.mul(x);

      const gs = new GrothSahai(ctx, crs);
      const [commitment] = gs.commitScalarInG2([x], [r]);

      // https://eprint.iacr.org/2007/155, 20160411:065033, page 24, "Commitments"
      // (r + x*t)
      const elGamalFactor = ctx.BIG.modmul(x, crs.v.t, n);
      elGamalFactor.add(r);

      const Q = crs.v.v1[1];
      const { c1, c2 } = new ElGamal2(ctx).encrypt(Q, X, elGamalFactor);

      expect(commitment[0].equals(c1)).toEqual(true);
      expect(commitment[1].equals(c2)).toEqual(true);
    });
  });

  describe("commitElementInG1", () => {
    it("commits elements in G1 by ElGamal-encrypting them", () => {
      const [r1, r2] = rng.makeFactors(2);

      const X = g1.mul(rng.makeFactor()); // random element in G1

      const gs = new GrothSahai(ctx, crs);
      const [commitment] = gs.commitElementInG1([X], [[r1, r2]]);

      // https://eprint.iacr.org/2007/155, 20160411:065033, page 24, "Commitments"
      // (r1 + r2*t)
      const elGamalFactor = ctx.BIG.modmul(r2, crs.u.t, n);
      elGamalFactor.add(r1);

      const Q = crs.u.u1[1];
      const { c1, c2 } = new ElGamal1(ctx).encrypt(Q, X, elGamalFactor);

      expect(commitment[0].equals(c1)).toEqual(true);
      expect(commitment[1].equals(c2)).toEqual(true);
    });
  });

  describe("commitElementInG2", () => {
    it("commits elements in G2 by ElGamal-encrypting them", () => {
      const [r1, r2] = rng.makeFactors(2);

      const X = g2.mul(rng.makeFactor()); // random element in G2

      const gs = new GrothSahai(ctx, crs);
      const [commitment] = gs.commitElementInG2([X], [[r1, r2]]);

      // https://eprint.iacr.org/2007/155, 20160411:065033, page 24, "Commitments"
      // (r1 + r2*t)
      const elGamalFactor = ctx.BIG.modmul(r2, crs.v.t, n);
      elGamalFactor.add(r1);

      const Q = crs.v.v1[1];
      const { c1, c2 } = new ElGamal2(ctx).encrypt(Q, X, elGamalFactor);

      expect(commitment[0].equals(c1)).toEqual(true);
      expect(commitment[1].equals(c2)).toEqual(true);
    });
  });

  it("has working iota1", () => {
    const X = g1.mul(rng.makeFactor());
    const gs = new GrothSahai(ctx, crs);
    const result = gs.iota1(X);
    expect(result[0].is_infinity()).toEqual(true);
    expect(result[1].equals(X)).toEqual(true);
  });

  it("has working iota2", () => {
    const Y = g2.mul(rng.makeFactor());
    const gs = new GrothSahai(ctx, crs);
    const result = gs.iota2(Y);
    expect(result[0].is_infinity()).toEqual(true);
    expect(result[1].equals(Y)).toEqual(true);
  });

  describe("F", () => {
    it("works as expected via iota", () => {
      const X = g1.mul(rng.makeFactor());
      const Y = g2.mul(rng.makeFactor());

      const gs = new GrothSahai(ctx, crs);
      const result = gs.F(gs.iota1(X), gs.iota2(Y));
      expect(result[0][0].isunity()).toEqual(true);
      expect(result[0][1].isunity()).toEqual(true);
      expect(result[1][0].isunity()).toEqual(true);
      expect(result[1][1].equals(e(ctx, X, Y))).toEqual(true);
    });

    it("works for arbitrary elements", () => {
      const X1 = g1.mul(rng.makeFactor());
      const X2 = g1.mul(rng.makeFactor());
      const Y1 = g2.mul(rng.makeFactor());
      const Y2 = g2.mul(rng.makeFactor());

      const gs = new GrothSahai(ctx, crs);
      const result = gs.F([X1, X2], [Y1, Y2]);
      expect(result[0][0].equals(e(ctx, X1, Y1))).toEqual(true);
      expect(result[0][1].equals(e(ctx, X1, Y2))).toEqual(true);
      expect(result[1][0].equals(e(ctx, X2, Y1))).toEqual(true);
      expect(result[1][1].equals(e(ctx, X2, Y2))).toEqual(true);
    });

    it("returns ones for infinity in one of the arguments", () => {
      const X1 = g1.mul(rng.makeFactor());
      const X2 = g1.mul(rng.makeFactor());
      const Y1 = g2.mul(rng.makeFactor());
      const Y2 = g2.mul(rng.makeFactor());
      const gs = new GrothSahai(ctx, crs);

      {
        const result = gs.F([X1, X2], [new ctx.ECP2(), new ctx.ECP2()]);
        expect(result[0][0].isunity()).toEqual(true);
        expect(result[0][1].isunity()).toEqual(true);
        expect(result[1][0].isunity()).toEqual(true);
        expect(result[1][1].isunity()).toEqual(true);
      }

      {
        const result = gs.F([new ctx.ECP(), new ctx.ECP()], [Y1, Y2]);
        expect(result[0][0].isunity()).toEqual(true);
        expect(result[0][1].isunity()).toEqual(true);
        expect(result[1][0].isunity()).toEqual(true);
        expect(result[1][1].isunity()).toEqual(true);
      }
    });
  });

  describe("proveMultiScalarLinear1", () => {
    it("has bijective property", () => {
      const gs = new GrothSahai(ctx, crs);
      const s = rng.makeFactor();
      const A = g1.mul(rng.makeFactor()); // public constant

      // theta = s^T*iota1(A) = iota1(s^T*A)
      const iotaSTA = gs.iota1(A.mul(s));
      const { theta } = gs.proveMultiScalarLinear1([A], [s]);
      expect(theta[0].equals(iotaSTA[0])).toEqual(true);
      expect(theta[1].equals(iotaSTA[1])).toEqual(true);
    });
  });

  describe("proveMultiScalarLinear2", () => {
    it("has bijective property", () => {
      const gs = new GrothSahai(ctx, crs);
      const R = [rng.makeFactor(), rng.makeFactor()] as const;
      const b = rng.makeFactor(); // public constant

      // pi = R^T*iotaPrime2(b) = iotaPrime2(R^T*b)
      const [r1ib1, r1ib2] = gs.iotaPrime2(ctx.BIG.modmul(R[0], b, n));
      const [r2ib1, r2ib2] = gs.iotaPrime2(ctx.BIG.modmul(R[1], b, n));
      const iotaPrime2RTB = [[r1ib1, r1ib2], [r2ib1, r2ib2]] as const;
      const { pi } = gs.proveMultiScalarLinear2([b], [R]);
      expect(pi[0][0].equals(iotaPrime2RTB[0][0])).toEqual(true);
      expect(pi[0][1].equals(iotaPrime2RTB[0][1])).toEqual(true);
      expect(pi[1][0].equals(iotaPrime2RTB[1][0])).toEqual(true);
      expect(pi[1][1].equals(iotaPrime2RTB[1][1])).toEqual(true);
    });
  });

  describe("proveMultiScalarLinear1/verifyMultiScalarLinear1", () => {
    const gs = new GrothSahai(ctx, crs);

    it("can prove and verify secret constant y", () => {
      const y = rng.makeFactor(); // secret
      const A = g1.mul(rng.makeFactor()); // public
      const T1 = A.mul(y); // public

      const s = rng.makeFactor();
      const dPrime = gs.commitScalarInG2([y], [s]);
      const proof = gs.proveMultiScalarLinear1([A], [s]);

      expect(gs.verifyMultiScalarLinear1([A], dPrime, T1, proof)).toEqual(true);
    });

    it("can prove and verify secret constant y for n = 3", () => {
      const y = [rng.makeFactor(), rng.makeFactor(), rng.makeFactor()]; // secret
      const A = [g1.mul(rng.makeFactor()), g1.mul(rng.makeFactor()), g1.mul(rng.makeFactor())]; // public
      const T1 = new ctx.ECP(); // public
      T1.add(A[0].mul(y[0]));
      T1.add(A[1].mul(y[1]));
      T1.add(A[2].mul(y[2]));

      const s = [rng.makeFactor(), rng.makeFactor(), rng.makeFactor()];
      const dPrime = gs.commitScalarInG2(y, s);
      const proof = gs.proveMultiScalarLinear1(A, s);

      expect(gs.verifyMultiScalarLinear1(A, dPrime, T1, proof)).toEqual(true);
    });

    it("fails when different s, s' are used for commiting and proving", () => {
      const y = rng.makeFactor(); // secret
      const A = g1.mul(rng.makeFactor()); // public
      const T1 = A.mul(y); // public

      const s = rng.makeFactor();
      const sPrime = rng.makeFactor();
      const dPrime = gs.commitScalarInG2([y], [s]);
      const proof = gs.proveMultiScalarLinear1([A], [sPrime]);

      expect(gs.verifyMultiScalarLinear1([A], dPrime, T1, proof)).toEqual(false);
    });
  });

  describe("proveMultiScalarLinear2/verifyMultiScalarLinear2", () => {
    const gs = new GrothSahai(ctx, crs);

    it("can prove and verify secret element X", () => {
      const X = g1.mul(rng.makeFactor()); // secret
      const b = rng.makeFactor(); // public
      const T1 = X.mul(b); // public

      const R = [rng.makeFactor(), rng.makeFactor()] as const;
      const c = gs.commitElementInG1([X], [R]);
      const proof = gs.proveMultiScalarLinear2([b], [R]);

      expect(gs.verifyMultiScalarLinear2(c, [b], T1, proof)).toEqual(true);
    });

    it("can prove and verify secret element X for m = 3", () => {
      const X = [rng.makePointInG1(), rng.makePointInG1(), rng.makePointInG1()]; // secret
      const b = rng.makeFactors(3); // public
      const T1 = new ctx.ECP(); // public
      T1.add(X[0].mul(b[0]));
      T1.add(X[1].mul(b[1]));
      T1.add(X[2].mul(b[2]));

      const R = [
        [rng.makeFactor(), rng.makeFactor()],
        [rng.makeFactor(), rng.makeFactor()],
        [rng.makeFactor(), rng.makeFactor()],
      ] as const;
      const c = gs.commitElementInG1(X, R);
      const proof = gs.proveMultiScalarLinear2(b, R);

      expect(gs.verifyMultiScalarLinear2(c, b, T1, proof)).toEqual(true);
    });

    it("fails when different R, R' are used for commiting and proving", () => {
      const X = g1.mul(rng.makeFactor()); // secret
      const b = rng.makeFactor(); // public
      const T1 = X.mul(b); // public

      const R = [rng.makeFactor(), rng.makeFactor()] as const;
      const RPrime = [rng.makeFactor(), rng.makeFactor()] as const;
      const c = gs.commitElementInG1([X], [R]);
      const proof = gs.proveMultiScalarLinear2([b], [RPrime]);

      expect(gs.verifyMultiScalarLinear2(c, [b], T1, proof)).toEqual(false);
    });
  });
});
