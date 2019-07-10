import { BIG, ECP, ECP2, FP } from "amcl-js";

import { constants } from "./constants";
import { Rng } from "./Rng";

const { ctx, g1, g2 } = constants;

/**
 * ElGamal on an elliptic curve
 */
export class ElGamal {
  /**
   * KeyGen as defined in 3.1, ElGamal Encryption
   */
  public static keyGen(rng: Rng): { pk: { P: ECP }; dk: { d: FP } } {
    const d = rng.makePointInZp();
    const P = g1.mul(d.f);
    return {
      pk: { P },
      dk: { d },
    };
  }

  public static keyGen2(rng: Rng): { pk: { P: ECP2 }; dk: { d: FP } } {
    const d = rng.makePointInZp();
    const P = g2.mul(d.f);
    return {
      pk: { P },
      dk: { d },
    };
  }

  /**
   * ElGamal Encrypt
   */
  public static encrypt(P: ECP, M: ECP, r: BIG): { readonly c1: ECP; readonly c2: ECP } {
    const c1 = g1.mul(r);
    const c2 = P.mul(r);
    c2.add(M);
    return { c1, c2 };
  }

  public static encrypt2(P: ECP2, M: ECP2, r: BIG): { readonly c1: ECP2; readonly c2: ECP2 } {
    const c1 = g2.mul(r);
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
  public static decrypt(d: FP, c1: ECP, c2: ECP): ECP {
    const out = new ctx.ECP();
    out.copy(c2);
    out.sub(c1.mul(d.f));
    return out;
  }

  public static decrypt2(d: FP, c1: ECP2, c2: ECP2): ECP2 {
    const out = new ctx.ECP2();
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
  public static decryptSum(
    d: FP,
    messages: readonly ({ c1: ECP; c2: ECP })[],
    messageGenerator: () => BIG | undefined,
  ): BIG | undefined {
    const sumComponent1 = new ctx.ECP();
    const sumComponent2 = new ctx.ECP();
    for (const { c1, c2 } of messages) {
      sumComponent1.add(c1);
      sumComponent2.add(c2);
    }

    // this is g^(m_0 + m_1 + … + m_n-1)
    const gm = ElGamal.decrypt(d, sumComponent1, sumComponent2);

    let msg: BIG | undefined;
    while ((msg = messageGenerator())) {
      if (g1.mul(msg).equals(gm)) {
        return msg;
      }
    }

    return undefined;
  }
}