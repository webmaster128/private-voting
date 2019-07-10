export type Message = readonly (0 | 1)[];

/**
 * Converts integer a to array of length k with elements 0s and 1s (Big Endian)
 */
export function intToMessage(a: number, k: number): Message {
  if (!Number.isInteger(a) || a < 0 || a > 0x7fffffff) {
    throw new Error("a must be a positive integer in int32 range");
  }

  return Array.from({ length: k }).map((_, i) => {
    // a: 0b1010
    //      ^^^^
    // i:   0123
    const ithBitSet = !!(a & (1 << (k - i - 1)));
    return ithBitSet ? 1 : 0;
  });
}
