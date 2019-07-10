import { constants } from "./constants";
import { e, ee, fp12Add, fp12MatricesAdd, fp12MatricesEqual } from "./math";

const { ctx, g1, g2 } = constants;

describe("fp12Add", () => {
  it("does component-wise addition", () => {
    const a = new ctx.FP12(
      new ctx.FP4(new ctx.FP2(100, 200), new ctx.FP2(300, 400)),
      new ctx.FP4(new ctx.FP2(500, 600), new ctx.FP2(700, 800)),
      new ctx.FP4(new ctx.FP2(900, 1000), new ctx.FP2(1100, 1200)),
    );
    const b = new ctx.FP12(
      new ctx.FP4(new ctx.FP2(1, 2), new ctx.FP2(3, 4)),
      new ctx.FP4(new ctx.FP2(5, 6), new ctx.FP2(7, 8)),
      new ctx.FP4(new ctx.FP2(9, 10), new ctx.FP2(11, 12)),
    );
    const expectedSum = new ctx.FP12(
      new ctx.FP4(new ctx.FP2(101, 202), new ctx.FP2(303, 404)),
      new ctx.FP4(new ctx.FP2(505, 606), new ctx.FP2(707, 808)),
      new ctx.FP4(new ctx.FP2(909, 1010), new ctx.FP2(1111, 1212)),
    );
    expect(fp12Add(a, b).equals(expectedSum)).toEqual(true);
  });
});

describe("fp12MatricesAdd", () => {
  it("returns matrix of multiplicative identities for no argument", () => {
    const sum = fp12MatricesAdd();
    expect(sum[0][0].isunity()).toEqual(true);
    expect(sum[0][1].isunity()).toEqual(true);
    expect(sum[1][0].isunity()).toEqual(true);
    expect(sum[1][1].isunity()).toEqual(true);
  });

  it("returns original for one argument", () => {
    const a = [[new ctx.FP12(11), new ctx.FP12(22)], [new ctx.FP12(33), new ctx.FP12(44)]] as const;

    const sum = fp12MatricesAdd(a);
    expect(sum[0][0].equals(a[0][0])).toEqual(true);
    expect(sum[0][1].equals(a[0][1])).toEqual(true);
    expect(sum[1][0].equals(a[1][0])).toEqual(true);
    expect(sum[1][1].equals(a[1][1])).toEqual(true);
  });

  it("does component-wise multiplication", () => {
    const a = [
      [new ctx.FP12(100), new ctx.FP12(200)],
      [new ctx.FP12(300), new ctx.FP12(400)],
    ] as const;
    const b = [[new ctx.FP12(0), new ctx.FP12(1)], [new ctx.FP12(2), new ctx.FP12(3)]] as const;
    const expectedSum = [
      [new ctx.FP12(0), new ctx.FP12(200)],
      [new ctx.FP12(600), new ctx.FP12(1200)],
    ] as const;

    const sum = fp12MatricesAdd(a, b);
    expect(sum[0][0].equals(expectedSum[0][0])).toEqual(true);
    expect(sum[0][1].equals(expectedSum[0][1])).toEqual(true);
    expect(sum[1][0].equals(expectedSum[1][0])).toEqual(true);
    expect(sum[1][1].equals(expectedSum[1][1])).toEqual(true);
  });

  it("works for 3 arguments", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(0), new ctx.FP12(1)], [new ctx.FP12(2), new ctx.FP12(3)]] as const;
    const expectedSum = [
      [new ctx.FP12(0), new ctx.FP12(2)],
      [new ctx.FP12(12), new ctx.FP12(36)],
    ] as const;

    const sum = fp12MatricesAdd(a, b, b);
    expect(sum[0][0].equals(expectedSum[0][0])).toEqual(true);
    expect(sum[0][1].equals(expectedSum[0][1])).toEqual(true);
    expect(sum[1][0].equals(expectedSum[1][0])).toEqual(true);
    expect(sum[1][1].equals(expectedSum[1][1])).toEqual(true);
  });

  it("works for 4 arguments", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(0), new ctx.FP12(1)], [new ctx.FP12(2), new ctx.FP12(3)]] as const;
    const expectedSum = [
      [new ctx.FP12(0), new ctx.FP12(2)],
      [new ctx.FP12(24), new ctx.FP12(108)],
    ] as const;

    const sum = fp12MatricesAdd(a, b, b, b);
    expect(sum[0][0].equals(expectedSum[0][0])).toEqual(true);
    expect(sum[0][1].equals(expectedSum[0][1])).toEqual(true);
    expect(sum[1][0].equals(expectedSum[1][0])).toEqual(true);
    expect(sum[1][1].equals(expectedSum[1][1])).toEqual(true);
  });
});

describe("fp12MatricesEqual", () => {
  it("returns true for identical matrices", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;

    expect(fp12MatricesEqual(a, a)).toEqual(true);
  });

  it("returns true for equal matrices", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;

    expect(fp12MatricesEqual(a, b)).toEqual(true);
  });

  it("returns false for mismatch in cell 0,0", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(0), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    expect(fp12MatricesEqual(a, b)).toEqual(false);
  });

  it("returns false for mismatch in cell 0,1", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(1), new ctx.FP12(0)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    expect(fp12MatricesEqual(a, b)).toEqual(false);
  });

  it("returns false for mismatch in cell 1,0", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(0), new ctx.FP12(4)]] as const;
    expect(fp12MatricesEqual(a, b)).toEqual(false);
  });

  it("returns false for mismatch in cell 1,1", () => {
    const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
    const b = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(0)]] as const;
    expect(fp12MatricesEqual(a, b)).toEqual(false);
  });
});

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
    const eaPbQ = e(aP, bQ);
    const ebPaQ = e(bP, aQ);
    expect(eaPbQ).toEqual(ebPaQ);

    // e(aP, bQ) == e(P,Q)^ab
    const ePQ = e(P, Q);
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

    const ePRQ = e(PR, Q);
    const ePQ = e(P, Q);
    const eRQ = e(R, Q);

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

    const ePQR = e(P, QR);
    const ePQ = e(P, Q);
    const ePR = e(P, R);

    const ePQePR = new ctx.FP12(ePQ); // the product e(P,Q)*e(P,R)
    ePQePR.mul(ePR);
    expect(ePQR.equals(ePQePR)).toEqual(true);
  });

  it("maps infinity to the neutral element", () => {
    {
      // e(P, 0)
      const P = g1.mul(new ctx.BIG(5));
      const infinity = new ctx.ECP2();
      const result = e(P, infinity);
      expect(result.isunity()).toEqual(true);
    }

    {
      // e(0, Q)
      const infinity = new ctx.ECP();
      const Q = g2.mul(new ctx.BIG(55));
      const result = e(infinity, Q);
      expect(result.isunity()).toEqual(true);
    }

    {
      // e(0, 0)
      const infinity1 = new ctx.ECP();
      const infinity2 = new ctx.ECP2();
      const result = e(infinity1, infinity2);
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

    const ePRQ = e(PR, Q);
    const ePQeRQ = ee(P, Q, R, Q);
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

    const ePQR = e(P, QR);
    const ePQePR = ee(P, Q, P, R);
    expect(ePQR.equals(ePQePR)).toEqual(true);
  });
});
