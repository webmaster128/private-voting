import { CTXWithCurvePF12, ECP, ECP2, FP12 } from "amcl-js";

export type FP12Matrix2x2 = readonly [readonly [FP12, FP12], readonly [FP12, FP12]];

function fp12One(ctx: CTXWithCurvePF12): FP12 {
  const out = new ctx.FP12();
  out.one();
  return out;
}

export function fp12Add(ctx: CTXWithCurvePF12, A: FP12, B: FP12): FP12 {
  const [a, b, c] = [A.geta(), A.getb(), A.getc()];
  a.add(B.geta());
  b.add(B.getb());
  c.add(B.getc());
  return new ctx.FP12(a, b, c);
}

export function fp12MatricesAdd(ctx: CTXWithCurvePF12, ...args: FP12Matrix2x2[]): FP12Matrix2x2 {
  const out = [[fp12One(ctx), fp12One(ctx)], [fp12One(ctx), fp12One(ctx)]] as const;
  for (const factor of args) {
    out[0][0].mul(factor[0][0]);
    out[0][1].mul(factor[0][1]);
    out[1][0].mul(factor[1][0]);
    out[1][1].mul(factor[1][1]);
  }
  return out;
}

export function fp12MatricesEqual(lhs: FP12Matrix2x2, rhs: FP12Matrix2x2): boolean {
  return (
    lhs[0][0].equals(rhs[0][0]) &&
    lhs[0][1].equals(rhs[0][1]) &&
    lhs[1][0].equals(rhs[1][0]) &&
    lhs[1][1].equals(rhs[1][1])
  );
}

/** Pairing e(P,Q) */
export function e(ctx: CTXWithCurvePF12, P: ECP, Q: ECP2): FP12 {
  // Special case for performance optimization
  if (P.is_infinity() || Q.is_infinity()) {
    return new ctx.FP12(1);
  }

  return ctx.PAIR.fexp(ctx.PAIR.ate(Q, P));
}

/** Double pairing e(P,Q)*e(R,S) */
export function ee(ctx: CTXWithCurvePF12, P: ECP, Q: ECP2, R: ECP, S: ECP2): FP12 {
  return ctx.PAIR.fexp(ctx.PAIR.ate2(Q, P, S, R));
}
