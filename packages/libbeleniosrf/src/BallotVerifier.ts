import { Pairings } from "ecc";

import { Ballot } from "./Ballot";
import { constants } from "./constants";
import { ElectionPubkey } from "./ElectionKeypair";
import { PublicElection } from "./PublicElection";
import { serializeVerificationKey, UserVerificationKey } from "./UserKeypair";
import { EncryptedVote, GSProofs } from "./VoteEncryptor";

const { ctx, g1, g2, g1Inverse } = constants;

export class BallotVerifier {
  private readonly pairings: Pairings;
  private readonly election: PublicElection;
  private readonly epk: ElectionPubkey;

  public constructor(election: PublicElection) {
    this.pairings = new Pairings(ctx);
    this.election = election;
    this.epk = election.epk;
  }

  public verifyPlus(vk: UserVerificationKey, b: Ballot): boolean {
    const { P } = this.epk;
    const { z } = vk.pp;
    const { X2 } = vk;
    const { c1, c2 } = b.c;
    const { sigma1, sigma2, sigma3, sigma4, sigma5 } = b.sigma;

    if (!this.verifyProofs(vk, b.c)) return false;

    // test e(σ1, g2) = e(c1, σ4) from Verify+ (3a)
    if (!this.pairings.e(sigma1, g2).equals(this.pairings.e(c1, sigma4))) return false;

    // test e(σ2, g2) = e(z, X2) e(c2, σ4) from Verify+ (3b)
    if (!this.pairings.e(sigma2, g2).equals(this.pairings.ee(z, X2, c2, sigma4))) return false;

    // test e(σ3, g2) = e(g1, σ4) from Verify+ (3c)
    if (!this.pairings.e(sigma3, g2).equals(this.pairings.e(g1, sigma4))) return false;

    // test e(σ5, g2) = e(P, σ4) from Verify+ (3c)
    if (!this.pairings.e(sigma5, g2).equals(this.pairings.e(P, sigma4))) return false;

    return true;
  }

  private verifyProofs(vk: UserVerificationKey, c: EncryptedVote & GSProofs): boolean {
    const { pi_r, pi_V, pi_T, pi_M, pi_m } = c.pi;
    const { c1, c2, c3, C, T } = c;

    // g1^r == c1
    if (!this.epk.gs.verifyMultiScalarLinear1([g1], [C.C_r], c1, pi_r)) return false;

    // X1^r == T
    if (!this.epk.gs.verifyMultiScalarLinear1([vk.X1], [C.C_r], T, pi_T)) return false;

    // H(vk)^r == c3
    const Hvk = this.election.H(serializeVerificationKey(vk));
    if (!this.epk.gs.verifyMultiScalarLinear1([Hvk], [C.C_r], c3, pi_V)) return false;

    // u0 * u1^m1 * … * uk^mk * P^r == c2
    {
      const A = [...vk.pp.usig.slice(1), this.epk.P];
      const dPrime = [...C.C_2m, C.C_r];
      // T1 = c2 / u_0
      const T1 = new ctx.ECP(c2);
      T1.sub(this.epk.usig[0]);
      if (!this.epk.gs.verifyMultiScalarLinear1(A, dPrime, T1, pi_M)) return false;
    }

    // g^mi * g^(-mi^2) == 0
    {
      if (pi_m.length !== this.election.k) {
        throw new Error("Invalid number of proofs in pi_m");
      }

      const A = [g1, g1Inverse];
      const T1 = new ctx.ECP();
      for (let i = 0; i < pi_m.length; ++i) {
        const dPrime = [C.C_2m[i], C.C_2m_square[i]];
        if (!this.epk.gs.verifyMultiScalarLinear1(A, dPrime, T1, pi_m[i])) return false;
      }
    }

    return true;
  }
}
