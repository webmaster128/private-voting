import { CTX } from "amcl-js";

import { Rng } from "./Rng";

describe("Rng", () => {
  const ctx = new CTX("BN254CX");
  const n = new ctx.BIG().rcopy(ctx.ROM_CURVE.CURVE_Order);
  const p = new ctx.BIG().rcopy(ctx.ROM_FIELD.Modulus);
  const defaultSeed = new Uint8Array([0x00, 0x11, 0x22]);

  it("produces non-constant values", () => {
    const rng = new Rng(ctx, defaultSeed);
    const values = [rng.makeFactor(), rng.makeFactor(), rng.makeFactor()];
    expect(values[0]).not.toEqual(values[1]);
    expect(values[1]).not.toEqual(values[2]);
    expect(values[2]).not.toEqual(values[0]);
  });

  it("is deterministic", () => {
    const rng1 = new Rng(ctx, defaultSeed);
    const rng2 = new Rng(ctx, defaultSeed);
    expect(rng1.makeFactor()).toEqual(rng2.makeFactor());
    expect(rng1.makeFactor()).toEqual(rng2.makeFactor());
    expect(rng1.makeFactor()).toEqual(rng2.makeFactor());
  });

  describe("makeFactor", () => {
    const rng = new Rng(ctx, defaultSeed);

    it("works", () => {
      const b = rng.makeFactor();
      expect(ctx.BIG.comp(b, n)).toEqual(-1);
    });
  });

  describe("makeFactors", () => {
    const rng = new Rng(ctx, defaultSeed);

    it("works for count 0", () => {
      const factors = rng.makeFactors(0);
      expect(factors.length).toEqual(0);
    });

    it("works for count 1", () => {
      const factors = rng.makeFactors(1);
      expect(factors.length).toEqual(1);
      expect(ctx.BIG.comp(factors[0], n)).toEqual(-1);
    });

    it("works for count 5", () => {
      const factors = rng.makeFactors(5);
      expect(factors.length).toEqual(5);
      expect(ctx.BIG.comp(factors[0], n)).toEqual(-1);
      expect(ctx.BIG.comp(factors[1], n)).toEqual(-1);
      expect(ctx.BIG.comp(factors[2], n)).toEqual(-1);
      expect(ctx.BIG.comp(factors[3], n)).toEqual(-1);
      expect(ctx.BIG.comp(factors[4], n)).toEqual(-1);
    });
  });

  describe("makePointInZp", () => {
    it("is strictly smaller than p", () => {
      // Strange test since in theory, FP can only store values v with 0 <= v < p
      const rng = new Rng(ctx, defaultSeed);
      for (let i = 0; i < 500; i++) {
        const b = rng.makePointInZp();
        expect(ctx.BIG.comp(b.redc(), p)).toEqual(-1);
      }
    });
  });
});
