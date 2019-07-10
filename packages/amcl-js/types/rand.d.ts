import { byte } from "./byte";

export interface RAND {
  /** Terminate and clean up */
  clean(): void;
  /**
   * Initialize RNG with some real entropy from some external source.
   * Initialise from at least 128 byte string of raw random entropy.
   */
  seed(rawlen: number, raw: ArrayLike<byte>): void;
  /** Get a random byte */
  getByte(): byte;
}

export interface RANDStatic {
  new (): RAND;
}
