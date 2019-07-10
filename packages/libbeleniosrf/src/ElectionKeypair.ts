import { BIG, ECP, ECP2, FP } from "amcl-js";

import { constants } from "./constants";
import { ElGamal } from "./ElGamal";
import { CommonReferenceString, GrothSahai, SetupGS } from "./GrothSahai";
import { Message } from "./Message";
import { Rng } from "./Rng";

const { ctx } = constants;

export interface PP {
  readonly p: BIG;
  readonly g1: ECP;
  readonly g2: ECP2;

  readonly z: ECP;
  /** u_0 in the paper is usig[0] in the code */
  readonly usig: readonly ECP[];
}

export interface ElectionPubkey extends PP {
  readonly F: (m: Message) => ECP;
  readonly P: ECP;
  /** TODO: Remove field once GrothSahai class provides all functionality */
  readonly crs: CommonReferenceString;
  readonly h: {
    readonly h1: ECP;
    readonly h2: ECP;
  };
  readonly gs: GrothSahai;
}

export interface ElectionDecryptionKey {
  /** The secret ElGamal exponent */
  readonly d: FP;
}

export interface ElectionKeypair {
  readonly pk: ElectionPubkey;
  readonly dk: ElectionDecryptionKey;
}

/**
 * h=(h1,h2) used for the message hash H in 3.3 (1) of the paper
 */
function makeH(rng: Rng): { h1: ECP; h2: ECP } {
  const h1 = rng.makePointInG1();
  const h2 = rng.makePointInG1();
  return { h1, h2 };
}

/**
 * Setup as defined in 3.3, "Asymmetric Waters signature scheme"
 */
function Setup(rng: Rng, k: number): { readonly F: (m: Message) => ECP; readonly pp: PP } {
  const z = rng.makePointInG1();

  const usig = new Array<ECP>(k + 1);
  for (let i = 0; i <= k; i++) {
    usig[i] = rng.makePointInG1();
  }

  /**
   * As defined in _Setup_ (paper 3.3, Asymmetric Waters signature scheme)
   */
  function F(m: Message): ECP {
    if (m.length !== k) {
      throw new Error(`Message length ${m.length} does not match k: ${k}`);
    }
    const out = new ctx.ECP(usig[0]);
    for (let i = 1; i <= k; i++) {
      // m_1 of the paper is m[0] in code
      if (m[i - 1] !== 0) out.add(usig[i]);
    }
    return out;
  }

  return {
    F: F,
    pp: {
      p: constants.p,
      g1: constants.g1,
      g2: constants.g2,
      z: z,
      usig: usig,
    },
  };
}

/**
 * An implementation of EKeyGen
 */
export function makeElectionKeypair(rng: Rng, k: number): ElectionKeypair {
  const crs = SetupGS(rng);
  const { F, pp } = Setup(rng, k);
  const elgamalKeypair = ElGamal.keyGen(rng);

  return {
    pk: {
      F: F,
      ...pp,
      ...elgamalKeypair.pk,
      crs: crs,
      h: makeH(rng),
      gs: new GrothSahai(crs),
    },
    dk: { ...elgamalKeypair.dk },
  };
}
