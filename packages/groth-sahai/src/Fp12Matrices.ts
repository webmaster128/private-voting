import { CTXWithCurvePF12, FP12 } from "amcl-js";

export type FP12Matrix2x2 = readonly [readonly [FP12, FP12], readonly [FP12, FP12]];

export class Fp12Matrices {
  private readonly ctx: CTXWithCurvePF12;

  public constructor(ctx: CTXWithCurvePF12) {
    this.ctx = ctx;
  }

  public add(...args: FP12Matrix2x2[]): FP12Matrix2x2 {
    const identity = [
      [new this.ctx.FP12(1), new this.ctx.FP12(1)],
      [new this.ctx.FP12(1), new this.ctx.FP12(1)],
    ] as const;

    const out = identity;
    for (const factor of args) {
      out[0][0].mul(factor[0][0]);
      out[0][1].mul(factor[0][1]);
      out[1][0].mul(factor[1][0]);
      out[1][1].mul(factor[1][1]);
    }
    return out;
  }

  public equal(lhs: FP12Matrix2x2, rhs: FP12Matrix2x2): boolean {
    return (
      lhs[0][0].equals(rhs[0][0]) &&
      lhs[0][1].equals(rhs[0][1]) &&
      lhs[1][0].equals(rhs[1][0]) &&
      lhs[1][1].equals(rhs[1][1])
    );
  }
}
