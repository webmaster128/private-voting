import { BIG, ECP, ECP2 } from "amcl-js";

import { constants } from "./constants";
import { ElGamal } from "./ElGamal";
import { B2, ThetaOnly } from "./GrothSahai";
import { Message } from "./Message";
import { PublicElection } from "./PublicElection";
import { Rng } from "./Rng";
import {
  serializeVerificationKey,
  UserKeypair,
  UserSigningKey,
  UserVerificationKey,
} from "./UserKeypair";
import { range } from "./utils";

const { ctx, g1, g1Inverse } = constants;

export interface EncryptedVote {
  readonly c1: ECP;
  readonly c2: ECP;
  readonly c3: ECP;
  /** T = X1^r is not explicitely included in the paper, but we need it for proof verification */
  readonly T: ECP;
}

export interface EncryptedVoteMeta {
  readonly r: BIG;
}

export interface GSProofs {
  /** Commitments */
  readonly C: {
    /** C_2m[i] is the commitment on m[i] in G_2, with i = 0, ..., k-1 */
    readonly C_2m: readonly B2[];
    /** C_2m_square[i] is the commitment on m[i]^2 in G_2, with i = 0, ..., k-1 */
    readonly C_2m_square: readonly B2[];
    /** The commitment on r */
    readonly C_r: B2;
  };
  /** Proofs. In here we use the BeleniosRF notation, where pi is the full proof, including pi and theta from the GS paper */
  readonly pi: {
    readonly pi_V: ThetaOnly;
    readonly pi_r: ThetaOnly;
    readonly pi_T: ThetaOnly;
    readonly pi_M: ThetaOnly;
    readonly pi_m: ThetaOnly[];
  };
}

export interface Sigma {
  readonly sigma1: ECP;
  readonly sigma2: ECP;
  readonly sigma3: ECP;
  readonly sigma4: ECP2;
  readonly sigma5: ECP;
}

export class VoteEncryptor {
  private readonly rng: Rng;
  private readonly election: PublicElection;
  private readonly upk: UserVerificationKey;
  private readonly usk: UserSigningKey;

  public constructor(rng: Rng, election: PublicElection, uKeypair: UserKeypair) {
    this.rng = rng;
    this.election = election;
    this.upk = uKeypair.vk;
    this.usk = uKeypair.sk;
  }

  public encryptPlus(m: Message): EncryptedVote & GSProofs {
    const { c1, c2, c3, r, T } = this.encrypt(m);
    const proofs = this.gsProve(r, T, m);
    return { c1, c2, c3, T, ...proofs };
  }

  /**
   * Implementation of "Figure 2: Our SRC scheme", step Sign+ (2)
   */
  public sign({ c1, c2 }: EncryptedVote): Sigma {
    const s = this.rng.makePointInZp();

    const sigma1 = c1.mul(s.f);
    const sigma2 = c2.mul(s.f);
    sigma2.add(this.usk.Y);
    const sigma3 = this.election.epk.g1.mul(s.f);
    const sigma4 = this.election.epk.g2.mul(s.f);
    const sigma5 = this.election.epk.P.mul(s.f);

    return { sigma1, sigma2, sigma3, sigma4, sigma5 };
  }

  private encrypt(m: Message): EncryptedVote & EncryptedVoteMeta {
    const r = this.rng.makeFactor();

    const FM = this.election.epk.F(m);
    const { c1, c2 } = ElGamal.encrypt(this.election.epk.P, FM, r);

    // From paper:
    // vk = (pp, X_1 , X_2)
    // c_3 = H(vk) ^ r
    // i.e. we need to serialize
    const vk = serializeVerificationKey(this.upk);
    const c3 = this.election.H(vk).mul(r);

    const T = this.upk.X1.mul(r);

    return { c1, c2, c3, T, r };
  }

  private gsProve(r: BIG, T: ECP, m: Message): GSProofs {
    const mBig = m.map(bit => new ctx.BIG(bit));

    const C_2m_rand = this.rng.makeFactors(m.length); // randomness for C_2m
    const C_2m_square_rand = this.rng.makeFactors(m.length); // randomness for C_2m_square
    const C_2m = this.election.epk.gs.commitScalarInG2(mBig, C_2m_rand);
    const C_2m_square = this.election.epk.gs.commitScalarInG2(
      mBig /* mi == mi^2 for m=0,1 */,
      C_2m_square_rand,
    );

    // Commitment to r
    const C_r_rand = this.rng.makeFactor();
    const [C_r] = this.election.epk.gs.commitScalarInG2([r], [C_r_rand]);

    // Compute GS proofs π = (π_r, π_T, π_m, π_V)

    // π_r := proof(g1*\overline{r} == c1)
    const pi_r = this.election.epk.gs.proveMultiScalarLinear1([g1], [C_r_rand]);

    // π_T := proof(X1^\overline{r} == \overline{w})
    const pi_T = this.election.epk.gs.proveMultiScalarLinear1([this.upk.X1], [C_r_rand]);

    // π_V := proof(H(vk)^\overline{r} == c3)
    const Hvk = this.election.H(serializeVerificationKey(this.upk));
    const pi_V = this.election.epk.gs.proveMultiScalarLinear1([Hvk], [C_r_rand]);

    // π_M := proof(c2 == u0 * product(u_i^m_i) * P^\overline{r})
    //      = proof(c2/u0 == product(u_i^m_i) * P^\overline{r})
    //
    //                                 / m_1 \
    //                                 | m_2 |
    // c2/u0 = (u_1, u_2, …, u_k, P) * |  ⋮  |
    //                                 | m_k |
    //                                 \  r  /
    // ^^^^^    ^^^^^^^^^^^^^^^^^^^      ^^^
    //   T   =          A            *    y
    //   public         public            secret
    //   constant       constant          scalar
    const pi_M = this.election.epk.gs.proveMultiScalarLinear1(
      [...this.election.epk.usig.slice(1), this.election.epk.P],
      [...C_2m_rand, C_r_rand],
    );

    const pi_m = range(m.length).map(i => {
      // π_m_i := proof(g^(mi*(1-mi)) == 0)
      //        = proof(g^(mi) * g^(-1)^(mi^2) == 0)
      //
      //                        /  mi  \
      //  0  =    (g, g^(-1)) * \ mi^2 /
      // ^^^       ^^^^^^^^^      ^^^^
      //  T   =     A         *    y
      //  public    public         secret
      //  constant  constant       scalar
      return this.election.epk.gs.proveMultiScalarLinear1(
        [g1, g1Inverse],
        [C_2m_rand[i], C_2m_square_rand[i]],
      );
    });

    return {
      C: {
        C_2m: C_2m,
        C_2m_square: C_2m_square,
        C_r: C_r,
      },
      pi: {
        pi_r: pi_r,
        pi_V: pi_V,
        pi_T: pi_T,
        pi_M: pi_M,
        pi_m: pi_m,
      },
    };
  }
}
