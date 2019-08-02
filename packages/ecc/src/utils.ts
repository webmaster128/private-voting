import { CTXWithCurvePF12, ECP, ECP2 } from "amcl-js";

export function makeGeneratorsPF12(ctx: CTXWithCurvePF12): { g1: ECP; g2: ECP2 } {
  const g1 = new ctx.ECP();
  const g1x = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gx);

  if (ctx.ECP.CURVETYPE !== ctx.ECP.MONTGOMERY) {
    const g1y = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Gy);
    g1.setxy(g1x, g1y);
  } else {
    g1.setx(g1x);
  }

  // Get generator g2 for G2
  const [xa, xb] = [new ctx.FP(), new ctx.FP()];
  xa.rcopy(ctx.ROM_CURVE.CURVE_Pxa!);
  xb.rcopy(ctx.ROM_CURVE.CURVE_Pxb!);
  const g2x = new ctx.FP2(xa, xb);

  const [ya, yb] = [new ctx.FP(), new ctx.FP()];
  ya.rcopy(ctx.ROM_CURVE.CURVE_Pya!);
  yb.rcopy(ctx.ROM_CURVE.CURVE_Pyb!);
  const g2y = new ctx.FP2(ya, yb);

  const g2 = new ctx.ECP2();
  g2.setxy(g2x, g2y);

  return { g1, g2 };
}
