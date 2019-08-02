import { CTXWithCurvePF12, ECP, ECP2, FP12 } from "amcl-js";

export class Pairings {
  private readonly ctx: CTXWithCurvePF12;

  public constructor(ctx: CTXWithCurvePF12) {
    this.ctx = ctx;
  }

  /** Pairing e(P,Q) */
  public e(P: ECP, Q: ECP2): FP12 {
    // Special case for performance optimization
    if (P.is_infinity() || Q.is_infinity()) {
      return new this.ctx.FP12(1);
    }

    return this.ctx.PAIR.fexp(this.ctx.PAIR.ate(Q, P));
  }

  /** Double pairing e(P,Q)*e(R,S) */
  public ee(P: ECP, Q: ECP2, R: ECP, S: ECP2): FP12 {
    return this.ctx.PAIR.fexp(this.ctx.PAIR.ate2(Q, P, S, R));
  }
}
