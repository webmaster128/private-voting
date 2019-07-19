import { ElectionDecryptionKey, ElectionKeypair, ElectionPubkey } from "./ElectionKeypair";
import { ElGamal1 } from "./ElGamal";
import { intToMessage, Message } from "./Message";
import { EncryptedVote } from "./VoteEncryptor";

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

  public decryptPlus(c: EncryptedVote): Message | null {
    // TODO: if pi not valid, return null

    const F = new ElGamal1().decrypt(this.dk.d, c.c1, c.c2);
    for (const m of this.M) {
      if (this.pk.F(m).equals(F)) return m;
    }

    return null;
  }
}
