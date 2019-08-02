import { CTX } from "amcl-js";

import { fp12Add, fp12MatricesAdd, fp12MatricesEqual } from "./math";

const ctx = new CTX("BN254CX");

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
    expect(fp12Add(ctx, a, b).equals(expectedSum)).toEqual(true);
  });
});

describe("fp12MatricesAdd", () => {
  it("returns matrix of multiplicative identities for no argument", () => {
    const sum = fp12MatricesAdd(ctx);
    expect(sum[0][0].isunity()).toEqual(true);
    expect(sum[0][1].isunity()).toEqual(true);
    expect(sum[1][0].isunity()).toEqual(true);
    expect(sum[1][1].isunity()).toEqual(true);
  });

  it("returns original for one argument", () => {
    const a = [[new ctx.FP12(11), new ctx.FP12(22)], [new ctx.FP12(33), new ctx.FP12(44)]] as const;

    const sum = fp12MatricesAdd(ctx, a);
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

    const sum = fp12MatricesAdd(ctx, a, b);
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

    const sum = fp12MatricesAdd(ctx, a, b, b);
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

    const sum = fp12MatricesAdd(ctx, a, b, b, b);
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
