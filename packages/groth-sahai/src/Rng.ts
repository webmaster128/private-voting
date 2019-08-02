import { BIG, CTXWithCurvePF12, ECP, ECP2, FP, RAND } from "amcl-js";

import { makeGeneratorsPF12 } from "./utils";

export class Rng {
  private readonly ctx: CTXWithCurvePF12;
  private readonly g1: ECP;
  private readonly g2: ECP2;
  private readonly n: BIG;
  private readonly p: BIG;
  private readonly rng: RAND;

  public constructor(ctx: CTXWithCurvePF12, seed: Uint8Array) {
    this.ctx = ctx;
    const { g1, g2 } = makeGeneratorsPF12(ctx);
    this.g1 = g1;
    this.g2 = g2;
    this.n = new this.ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Order);
    this.p = new this.ctx.BIG().rcopy(ctx.ROM_FIELD.Modulus);

    const rng = new this.ctx.RAND();
    rng.clean();
    rng.seed(seed.length, seed);
    this.rng = rng;
  }

  /**
   * Random point in the finite field Z_p
   */
  public makePointInZp(): FP {
    return new this.ctx.FP(this.ctx.BIG.randomnum(this.p, this.rng));
  }

  /**
   * Random factor a with a <= 0 < order of G1/G2
   */
  public makeFactor(): BIG {
    return this.ctx.BIG.randomnum(this.n, this.rng);
  }

  /**
   * List of random factors a with a <= 0 < order of G1/G2
   */
  public makeFactors(count: number): readonly BIG[] {
    return Array.from({ length: count }).map(() => this.ctx.BIG.randomnum(this.n, this.rng));
  }

  /**
   * Random point in G_1
   */
  public makePointInG1(): ECP {
    const r = this.makeFactor();
    return this.g1.mul(r);
  }

  /**
   * Random point in G_2
   */
  public makePointInG2(): ECP2 {
    const r = this.makeFactor();
    return this.g2.mul(r);
  }
}
