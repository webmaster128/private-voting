import { BIG, ECP } from "amcl-js";

import { constants } from "./constants";
import { ElectionPubkey } from "./ElectionKeypair";

const { ctx } = constants;

/**
 * The public view on an election, used by the voter to cast a vote
 */
export class PublicElection {
  public readonly epk: ElectionPubkey;
  public readonly k: number;

  public constructor(epk: ElectionPubkey, k: number) {
    this.epk = epk;
    this.k = k;
  }

  /**
   * H as defined in 3.3 (1)
   */
  public H(x: Uint8Array): ECP {
    const { h1, h2 } = this.epk.h;

    const out = h1.mul(this.HPrime(x));
    out.add(h2);
    return out;
  }

  /** "a collision-resistant hash function" */
  private HPrime(x: Uint8Array): BIG {
    const { p } = this.epk;

    const hashBytes = ctx.MPIN.hashit(ctx.MPIN.SHA512, 0 /* optional hash input */, x);
    const hash = ctx.BIG.fromBytes(hashBytes);
    hash.mod(p);
    return hash;
  }
}
