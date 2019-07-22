import { Ballot, PublicBallot } from "./Ballot";

export class Publisher {
  public publish(b: Ballot): PublicBallot {
    return {
      c: {
        c1: b.c.c1,
        c2: b.c.c2,
        C: {
          C_r: b.c.C.C_r,
          C_2m: b.c.C.C_2m,
          C_2m_square: b.c.C.C_2m_square,
        },
        pi: {
          pi_r: b.c.pi.pi_r,
          pi_m: b.c.pi.pi_m,
          pi_M: b.c.pi.pi_M,
        },
      },
      sigma: {
        sigma1: b.sigma.sigma1,
        sigma2: b.sigma.sigma2,
        sigma3: b.sigma.sigma3,
        sigma4: b.sigma.sigma4,
      },
    };
  }
}
