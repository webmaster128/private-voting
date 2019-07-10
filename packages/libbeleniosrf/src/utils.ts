/** Ensures all arguments are the same and returns the value */
export function same<T extends number | string>(first: T, ...others: T[]): T {
  if (others.some(other => other !== first)) {
    throw new Error("Values are not the same");
  }
  return first;
}

export function range(count: number): readonly number[] {
  return Array.from({ length: count }).map((_, index) => index);
}
