/* eslint-disable no-console */
import { Rng } from "ecc";

import { Ballot } from "./Ballot";
import { BallotVerifier } from "./BallotVerifier";
import { constants } from "./constants";
import { makeElectionKeypair } from "./ElectionKeypair";
import { Message } from "./Message";
import { PublicElection } from "./PublicElection";
import { Publisher } from "./Publisher";
import { Randomizer } from "./Randomizer";
import { Trustee } from "./Trustee";
import { makeUserKeypair } from "./UserKeypair";
import { VoteEncryptor } from "./VoteEncryptor";

const { ctx } = constants;

function fromHex(hex: string): Uint8Array {
  return new Uint8Array([...Buffer.from(hex, "hex")]);
}

// like https://gist.github.com/pyrros/4fddd7d49ae7c9c935f5d6a9a27d14c3
describe("Belenios RF integrationtest", () => {
  // a very poor seed, don't copy into production code
  const defaultSeed = fromHex("aabbccddeeff00112233445566778899");

  it("is a Weierstrass context", () => {
    expect(ctx.ECP.CURVETYPE).toEqual(ctx.ECP.WEIERSTRASS);
  });

  it("can do the full flow described in the paper", () => {
    const rng = new Rng(ctx, defaultSeed);

    const k = 2;
    const electionKeypair = makeElectionKeypair(rng, k);

    const election = new PublicElection(electionKeypair.pk, k);
    const verifier = new BallotVerifier(election);
    const randomizer = new Randomizer(rng, election);

    const userKeypair = makeUserKeypair(rng, electionKeypair.pk);

    // User registers their public key

    const encryptor = new VoteEncryptor(rng, election, userKeypair);
    const m: Message = Array.from({ length: k }).map(
      () => Math.floor(Math.random() + 0.5) as 0 | 1,
    );
    const c = encryptor.encryptPlus(m);
    const sigma = encryptor.sign(c);

    const b: Ballot = { c, sigma };
    const bPrime = randomizer.randomize(userKeypair.vk, b);

    expect(verifier.verifyPlus(userKeypair.vk, b)).toEqual(true);
    expect(verifier.verifyPlus(userKeypair.vk, bPrime)).toEqual(true);

    const publisher = new Publisher();
    const pb = publisher.publish(b);

    const trustee = new Trustee(electionKeypair, k);

    const decryptedB = trustee.decryptPlus(b);
    expect(decryptedB).toEqual(m);
    const decryptedBPrime = trustee.decryptPlus(bPrime);
    expect(decryptedBPrime).toEqual(m);
    const decryptedPB = trustee.decryptPlus(pb);
    expect(decryptedPB).toEqual(m);
  });
});
