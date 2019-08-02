import { CTX } from "amcl-js";

import { Pairings } from "./Pairings";
import { makeGeneratorsPF12 } from "./utils";

const ctx = new CTX("BN254CX");
const { g1, g2 } = makeGeneratorsPF12(ctx);

describe("Pairings", () => {
  const pairings = new Pairings(ctx);

  describe("e", () => {
    it("satisfies e(aP, bQ) == e(P,Q)^ab == e(bP, aQ)", () => {
      const rng = new ctx.RAND();
      const n = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Order);
      const a = ctx.BIG.randomnum(n, rng);
      const b = ctx.BIG.randomnum(n, rng);

      // Use arbitrary points P, Q. Must hold for all.
      const P = g1.mul(new ctx.BIG(5));
      const Q = g2.mul(new ctx.BIG(8));

      // e(aP, bQ) == e(bP, aQ)
      const aP = P.mul(a);
      const bQ = Q.mul(b);
      const aQ = Q.mul(a);
      const bP = P.mul(b);
      const eaPbQ = pairings.e(aP, bQ);
      const ebPaQ = pairings.e(bP, aQ);
      expect(eaPbQ).toEqual(ebPaQ);

      // e(aP, bQ) == e(P,Q)^ab
      const ePQ = pairings.e(P, Q);
      const ePGab = new ctx.FP12(ePQ).pow(a).pow(b);
      expect(eaPbQ).toEqual(ePGab);
    });

    it("satisfies e(P+R,Q) == e(P,Q)*e(R,Q)", () => {
      // Use arbitrary points P, R, Q. Must hold for all.
      const P = g1.mul(new ctx.BIG(5));
      const R = g1.mul(new ctx.BIG(42));
      const Q = g2.mul(new ctx.BIG(8));

      const PR = new ctx.ECP();
      PR.copy(P);
      PR.add(R);

      const ePRQ = pairings.e(PR, Q);
      const ePQ = pairings.e(P, Q);
      const eRQ = pairings.e(R, Q);

      const ePQeRQ = new ctx.FP12(ePQ); // the product e(P,Q)*e(R,Q)
      ePQeRQ.mul(eRQ);
      expect(ePRQ.equals(ePQeRQ)).toEqual(true);
    });

    it("satisfies e(P,Q+R) == e(P,Q)*e(P,R)", () => {
      // Use arbitrary points P, Q, R. Must hold for all.
      const P = g1.mul(new ctx.BIG(5));
      const Q = g2.mul(new ctx.BIG(8));
      const R = g2.mul(new ctx.BIG(42));

      const QR = new ctx.ECP2();
      QR.copy(Q);
      QR.add(R);

      const ePQR = pairings.e(P, QR);
      const ePQ = pairings.e(P, Q);
      const ePR = pairings.e(P, R);

      const ePQePR = new ctx.FP12(ePQ); // the product e(P,Q)*e(P,R)
      ePQePR.mul(ePR);
      expect(ePQR.equals(ePQePR)).toEqual(true);
    });

    it("maps infinity to the neutral element", () => {
      {
        // e(P, 0)
        const P = g1.mul(new ctx.BIG(5));
        const infinity = new ctx.ECP2();
        const result = pairings.e(P, infinity);
        expect(result.isunity()).toEqual(true);
      }

      {
        // e(0, Q)
        const infinity = new ctx.ECP();
        const Q = g2.mul(new ctx.BIG(55));
        const result = pairings.e(infinity, Q);
        expect(result.isunity()).toEqual(true);
      }

      {
        // e(0, 0)
        const infinity1 = new ctx.ECP();
        const infinity2 = new ctx.ECP2();
        const result = pairings.e(infinity1, infinity2);
        expect(result.isunity()).toEqual(true);
      }
    });
  });

  describe("ee", () => {
    it("satisfies e(P+R,Q) == e(P,Q)*e(R,Q) == ee(P, Q, R, Q)", () => {
      // Use arbitrary points P, R, Q. Must hold for all.
      const P = g1.mul(new ctx.BIG(5));
      const R = g1.mul(new ctx.BIG(42));
      const Q = g2.mul(new ctx.BIG(8));

      const PR = new ctx.ECP();
      PR.copy(P);
      PR.add(R);

      const ePRQ = pairings.e(PR, Q);
      const ePQeRQ = pairings.ee(P, Q, R, Q);
      expect(ePRQ.equals(ePQeRQ)).toEqual(true);
    });

    it("satisfies e(P,Q+R) == e(P,Q)*e(P,R) == ee(P, Q, P, R)", () => {
      // Use arbitrary points P, Q, R. Must hold for all.
      const P = g1.mul(new ctx.BIG(5));
      const Q = g2.mul(new ctx.BIG(8));
      const R = g2.mul(new ctx.BIG(42));

      const QR = new ctx.ECP2();
      QR.copy(Q);
      QR.add(R);

      const ePQR = pairings.e(P, QR);
      const ePQePR = pairings.ee(P, Q, P, R);
      expect(ePQR.equals(ePQePR)).toEqual(true);
    });
  });
});
