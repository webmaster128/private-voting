import { ECP, ECP2 } from "amcl-js";
import { B2, ThetaOnly } from "groth-sahai";

import { EncryptedVote, GSProofs, Sigma } from "./VoteEncryptor";

export interface Ballot {
  readonly c: EncryptedVote & GSProofs;
  readonly sigma: Sigma;
}

export interface PublicBallot {
  readonly c: {
    readonly c1: ECP;
    readonly c2: ECP;
    /** Commitments */
    readonly C: {
      /** The commitment on r */
      readonly C_r: B2;
      /** C_2m[i] is the commitment on m[i] in G_2, with i = 0, ..., k-1 */
      readonly C_2m: readonly B2[];
      /** C_2m_square[i] is the commitment on m[i]^2 in G_2, with i = 0, ..., k-1 */
      readonly C_2m_square: readonly B2[];
    };
    /** Proofs. In here we use the BeleniosRF notation, where pi is the full proof, including pi and theta from the GS paper */
    readonly pi: {
      readonly pi_r: ThetaOnly;
      /** Proves that each element in m is a bit */
      readonly pi_m: ThetaOnly[];
      readonly pi_M: ThetaOnly;
    };
  };
  readonly sigma: {
    readonly sigma1: ECP;
    readonly sigma2: ECP;
    readonly sigma3: ECP;
    readonly sigma4: ECP2;
  };
}
