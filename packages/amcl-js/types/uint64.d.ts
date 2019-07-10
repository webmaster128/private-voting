export interface UInt64 {
  readonly top: number;
  readonly bot: number;
  /** Add other number to this in-place */
  add(other: UInt64): this;
  copy(): this;
  /** Shift this one byte to the left in-place */
  shlb(): this;
}

export interface UInt64Static {
  new (top: number, bot: number): UInt64;
}
