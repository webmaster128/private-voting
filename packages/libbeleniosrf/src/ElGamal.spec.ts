import { BIG, ECP, ECP2 } from "amcl-js";

import { constants } from "./constants";
import { ElGamal } from "./ElGamal";
import { Rng } from "./Rng";

const { ctx, g1, g2, n } = constants;

describe("ElGamal", () => {
  it("can encrypt and decrypt in G1", () => {
    const rng = new Rng(new Uint8Array([0x00, 0x11, 0x22]));
    const keypair = ElGamal.keyGen(rng);

    const nMinus1 = new ctx.BIG(n);
    nMinus1.sub(new ctx.BIG(1));

    const plaintexts: ECP[] = [
      g1.mul(new ctx.BIG(0)),
      g1.mul(new ctx.BIG(1)),
      g1.mul(new ctx.BIG(3344566)),
      g1.mul(new ctx.BIG(0x7fffffff)),
      g1.mul(nMinus1),
    ];

    for (const plaintext of plaintexts) {
      const M = plaintext;
      const r = rng.makeFactor();
      const c = ElGamal.encrypt(keypair.pk.P, M, r);
      const decrypted = ElGamal.decrypt(keypair.dk.d, c.c1, c.c2);
      expect(decrypted.equals(M)).toEqual(true);
    }
  });

  it("can encrypt and decrypt in G2", () => {
    const rng = new Rng(new Uint8Array([0x00, 0x11, 0x22]));
    const keypair = ElGamal.keyGen2(rng);

    const nMinus1 = new ctx.BIG(n);
    nMinus1.sub(new ctx.BIG(1));

    const plaintexts: ECP2[] = [
      g2.mul(new ctx.BIG(0)),
      g2.mul(new ctx.BIG(1)),
      g2.mul(new ctx.BIG(3344566)),
      g2.mul(new ctx.BIG(0x7fffffff)),
      g2.mul(nMinus1),
    ];

    for (const plaintext of plaintexts) {
      const M = plaintext;
      const r = rng.makeFactor();
      const c = ElGamal.encrypt2(keypair.pk.P, M, r);
      const decrypted = ElGamal.decrypt2(keypair.dk.d, c.c1, c.c2);
      expect(decrypted.equals(M)).toEqual(true);
    }
  });

  it("can decrypt sum", () => {
    const rng = new Rng(new Uint8Array([0x00, 0x11, 0x22]));
    const keypair = ElGamal.keyGen(rng);

    const messages: BIG[] = [
      new ctx.BIG(0),
      new ctx.BIG(1),
      new ctx.BIG(3),
      new ctx.BIG(5),
      new ctx.BIG(5),
      new ctx.BIG(11),
      new ctx.BIG(20),
    ]; // sum: 45

    const encryptedMessages = messages.map(message => {
      const r = rng.makeFactor();
      return ElGamal.encrypt(keypair.pk.P, g1.mul(message), r);
    });

    /**
     * Creates a new function that serves as a range generator.
     *
     * @param from the lower limit (inclusive)
     * @param to the upper limit (inclusive)
     */
    function makeRangeGenerator(from: number, to: number): () => BIG | undefined {
      let counter = from;
      function makeNextNumber(): BIG | undefined {
        if (counter > to) return undefined;
        else return new ctx.BIG(counter++);
      }
      return makeNextNumber;
    }

    const sum = ElGamal.decryptSum(keypair.dk.d, encryptedMessages, makeRangeGenerator(0, 50));
    expect(sum).toBeDefined();
    expect(ctx.BIG.comp(sum!, new ctx.BIG(45))).toEqual(0);
  });
});
