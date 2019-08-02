import { ECP, ECP2 } from "amcl-js";
import { Rng } from "ecc";

import { PP } from "./ElectionKeypair";

export interface UserVerificationKey {
  readonly pp: PP;
  readonly X1: ECP;
  readonly X2: ECP2;
}

export interface UserSigningKey {
  readonly Y: ECP;
}

export interface UserKeypair {
  /** Verification key (public) */
  readonly vk: UserVerificationKey;
  /** Signing key (private) */
  readonly sk: UserSigningKey;
}

/**
 * Implementation of SKeyGen from 3.2
 */
export function makeUserKeypair(rng: Rng, pp: PP): UserKeypair {
  const x = rng.makePointInZp();

  const X1 = pp.g1.mul(x.f);
  const X2 = pp.g2.mul(x.f);
  const Y = pp.z.mul(x.f);

  return {
    vk: { pp: pp, X1: X1, X2: X2 },
    sk: { Y: Y },
  };
}

export function serializeVerificationKey({ pp, X1, X2 }: UserVerificationKey): Uint8Array {
  const json = JSON.stringify({
    p: pp.p.toString(),
    g1: pp.g1.toString(),
    g2: pp.g2.toString(),
    z: pp.z.toString(),
    usig: pp.usig.map(u => u.toString()),
    X1: X1.toString(),
    X2: X2.toString(),
  });
  return new Uint8Array([...Buffer.from(json)]);
}
