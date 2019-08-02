import { BIG, ECP, ECP2, FP, RAND } from "amcl-js";

import { constants } from "./constants";

const { ctx, n, p, g1, g2 } = constants;

export class Rng {
  private readonly rng: RAND;

  public constructor(seed: Uint8Array) {
    const rng = new ctx.RAND();
    rng.clean();
    rng.seed(seed.length, seed);
    this.rng = rng;
  }

  /**
   * Random point in the finite field Z_p
   */
  public makePointInZp(): FP {
    return new ctx.FP(ctx.BIG.randomnum(p, this.rng));
  }

  /**
   * Random factor a with a <= 0 < order of G1/G2
   */
  public makeFactor(): BIG {
    return ctx.BIG.randomnum(n, this.rng);
  }

  /**
   * List of random factors a with a <= 0 < order of G1/G2
   */
  public makeFactors(count: number): readonly BIG[] {
    return Array.from({ length: count }).map(() => ctx.BIG.randomnum(n, this.rng));
  }

  /**
   * Random point in G_1
   */
  public makePointInG1(): ECP {
    const r = this.makeFactor();
    return g1.mul(r);
  }

  /**
   * Random point in G_2
   */
  public makePointInG2(): ECP2 {
    const r = this.makeFactor();
    return g2.mul(r);
  }
}
