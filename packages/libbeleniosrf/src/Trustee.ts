import { ElGamal1 } from "ecc";

import { PublicBallot } from "./Ballot";
import { constants } from "./constants";
import { ElectionDecryptionKey, ElectionKeypair, ElectionPubkey } from "./ElectionKeypair";
import { intToMessage, Message } from "./Message";

const { ctx } = constants;

export class Trustee {
  private readonly pk: ElectionPubkey;
  private readonly dk: ElectionDecryptionKey;
  /** Space of all possible messages */
  private readonly M: readonly Message[];

  public constructor(electionKeypair: ElectionKeypair, k: number) {
    this.pk = electionKeypair.pk;
    this.dk = electionKeypair.dk;

    this.M = Array.from({ length: 2 ** k }).map((_, a) => {
      // a = 0, 1, ..., k-1
      return intToMessage(a, k);
    });
  }

  public decryptPlus(pb: PublicBallot): Message | null {
    // TODO: if pi not valid, return null

    const { c1, c2 } = pb.c;

    const F = new ElGamal1(ctx).decrypt(this.dk.d, c1, c2);
    for (const m of this.M) {
      if (this.pk.F(m).equals(F)) return m;
    }

    return null;
  }
}
