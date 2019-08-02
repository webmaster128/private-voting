import { CTX } from "amcl-js";

import { Fp12Matrices } from "./Fp12Matrices";

const ctx = new CTX("BN254CX");

describe("Fp12Matrices", () => {
  const fp12Matrices = new Fp12Matrices(ctx);

  describe("add", () => {
    it("returns matrix of multiplicative identities for no argument", () => {
      const sum = fp12Matrices.add();
      expect(sum[0][0].isunity()).toEqual(true);
      expect(sum[0][1].isunity()).toEqual(true);
      expect(sum[1][0].isunity()).toEqual(true);
      expect(sum[1][1].isunity()).toEqual(true);
    });

    it("returns original for one argument", () => {
      const a = [
        [new ctx.FP12(11), new ctx.FP12(22)],
        [new ctx.FP12(33), new ctx.FP12(44)],
      ] as const;

      const sum = fp12Matrices.add(a);
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

      const sum = fp12Matrices.add(a, b);
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

      const sum = fp12Matrices.add(a, b, b);
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

      const sum = fp12Matrices.add(a, b, b, b);
      expect(sum[0][0].equals(expectedSum[0][0])).toEqual(true);
      expect(sum[0][1].equals(expectedSum[0][1])).toEqual(true);
      expect(sum[1][0].equals(expectedSum[1][0])).toEqual(true);
      expect(sum[1][1].equals(expectedSum[1][1])).toEqual(true);
    });
  });

  describe("equal", () => {
    it("returns true for identical matrices", () => {
      const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;

      expect(fp12Matrices.equal(a, a)).toEqual(true);
    });

    it("returns true for equal matrices", () => {
      const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      const b = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;

      expect(fp12Matrices.equal(a, b)).toEqual(true);
    });

    it("returns false for mismatch in cell 0,0", () => {
      const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      const b = [[new ctx.FP12(0), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      expect(fp12Matrices.equal(a, b)).toEqual(false);
    });

    it("returns false for mismatch in cell 0,1", () => {
      const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      const b = [[new ctx.FP12(1), new ctx.FP12(0)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      expect(fp12Matrices.equal(a, b)).toEqual(false);
    });

    it("returns false for mismatch in cell 1,0", () => {
      const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      const b = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(0), new ctx.FP12(4)]] as const;
      expect(fp12Matrices.equal(a, b)).toEqual(false);
    });

    it("returns false for mismatch in cell 1,1", () => {
      const a = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(4)]] as const;
      const b = [[new ctx.FP12(1), new ctx.FP12(2)], [new ctx.FP12(3), new ctx.FP12(0)]] as const;
      expect(fp12Matrices.equal(a, b)).toEqual(false);
    });
  });
});
