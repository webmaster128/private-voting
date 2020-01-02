import { BIG, CTXWithCurvePF12, ECP, ECP2, FP } from "amcl-js";

import { Rng } from "./Rng";
import { makeGeneratorsPF12 } from "./utils";

/** ElGamal on an elliptic curve */
export interface ElGamal<Point extends ECP | ECP2> {
  /**
   * KeyGen as defined in 3.1, ElGamal Encryption
   */
  keyGen(rng: Rng): { pk: { P: Point }; dk: { d: FP } };
  /**
   * ElGamal Encrypt
   */
  encrypt(P: Point, M: Point, r: BIG): { readonly c1: Point; readonly c2: Point };
  /**
   * ElGamal Decrypt
   */
  decrypt(d: FP, c1: Point, c2: Point): Point;
}

/** ElGamal on G1 */
export class ElGamal1 implements ElGamal<ECP> {
  private readonly ctx: CTXWithCurvePF12;
  private readonly g1: ECP;

  public constructor(ctx: CTXWithCurvePF12) {
    this.ctx = ctx;
    this.g1 = makeGeneratorsPF12(ctx).g1;
  }

  public keyGen(rng: Rng): { pk: { P: ECP }; dk: { d: FP } } {
    const d = rng.makePointInZp();
    const P = this.g1.mul(d.f);
    return {
      pk: { P },
      dk: { d },
    };
  }

  public encrypt(P: ECP, M: ECP, r: BIG): { readonly c1: ECP; readonly c2: ECP } {
    const c1 = this.g1.mul(r);
    const c2 = P.mul(r);
    c2.add(M);
    return { c1, c2 };
  }

  /**
   * ElGamal Decrypt
   *
   * The only operation on eliptic curve points as represented as * in the paper and addition
   * in amcl. So `c2*c1^(-d) = c2/c1^d` is expressed as `c2-c1*d`.
   */
  public decrypt(d: FP, c1: ECP, c2: ECP): ECP {
    const out = new this.ctx.ECP();
    out.copy(c2);
    out.sub(c1.mul(d.f));
    return out;
  }

  /**
   * Let m_0, m_1, …, m_n-1 be n messages and E(m_i) the encryption of m_i.
   * Now we can compute E(g^(m_0 + m_1 + … + m_n-1)) = E(g^m_0) * … * E(g^m_n-1),
   * get g^(m_0 + m_1 + … + m_n-1) via default decryption and loop over all possible sums
   * to get m_0 + m_1 + … + m_n-1.
   *
   * @param d the secret decryption key
   * @param messages the messages to be decrypted
   * @param messageGenerator a function that generates possible output messages
   */
  public decryptSum(
    d: FP,
    messages: readonly { c1: ECP; c2: ECP }[],
    messageGenerator: () => BIG | undefined,
  ): BIG | undefined {
    const sumComponent1 = new this.ctx.ECP();
    const sumComponent2 = new this.ctx.ECP();
    for (const { c1, c2 } of messages) {
      sumComponent1.add(c1);
      sumComponent2.add(c2);
    }

    // this is g^(m_0 + m_1 + … + m_n-1)
    const gm = this.decrypt(d, sumComponent1, sumComponent2);

    let msg: BIG | undefined;
    while ((msg = messageGenerator())) {
      if (this.g1.mul(msg).equals(gm)) {
        return msg;
      }
    }

    return undefined;
  }
}

/** ElGamal on G2 */
export class ElGamal2 implements ElGamal<ECP2> {
  private readonly ctx: CTXWithCurvePF12;
  private readonly g2: ECP2;

  public constructor(ctx: CTXWithCurvePF12) {
    this.ctx = ctx;
    this.g2 = makeGeneratorsPF12(ctx).g2;
  }

  public keyGen(rng: Rng): { pk: { P: ECP2 }; dk: { d: FP } } {
    const d = rng.makePointInZp();
    const P = this.g2.mul(d.f);
    return {
      pk: { P },
      dk: { d },
    };
  }

  public encrypt(P: ECP2, M: ECP2, r: BIG): { readonly c1: ECP2; readonly c2: ECP2 } {
    const c1 = this.g2.mul(r);
    const c2 = P.mul(r);
    c2.add(M);
    return { c1, c2 };
  }

  public decrypt(d: FP, c1: ECP2, c2: ECP2): ECP2 {
    const out = new this.ctx.ECP2();
    out.copy(c2);
    out.sub(c1.mul(d.f));
    return out;
  }
}
