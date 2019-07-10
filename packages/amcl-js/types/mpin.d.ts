import { byte } from "./byte";

export interface MPINStatic {
  readonly SHA256: 32;
  readonly SHA384: 48;
  readonly SHA512: 64;

  /** Hash number (optional) and byte string to point on curve */
  hashit(sha: 32 | 48 | 64, n: number, B: ArrayLike<byte>): ArrayLike<byte>;
}
