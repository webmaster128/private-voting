import { byte } from "./byte";
import { RAND } from "./rand";

export interface BIG {
  /** Internal data store */
  readonly w: readonly number[];
  /** set to zero */
  zero(): this;
  /** set to one */
  one(): this;
  /** Conditional move of ctx.BIG depending on d using XOR - no branches */
  cmove(b: BIG, d: boolean): void;
  /** copy from another BIG */
  copy(other: BIG): this;
  /** copy from bottom half of ctx.DBIG */
  hcopy(y: DBIG): this;
  /** copy from ROM */
  rcopy(y: ArrayLike<number>): this;
  /** XOR the top word with x */
  xortop(x: number): void;
  /** OR the top word with x */
  ortop(x: number): void;
  /** Normalise this, i.e. force all digits to be < 2^BASEBITS */
  norm(): number;
  /** Quick shift right by `k` bits (less than a word); returns the shifted out part */
  fshr(k: number): number;
  /** General shift right by `k` bits; returns this */
  shr(k: number): this;
  /** Quick shift left by  `k` bits (less than a word); returns the shifted out part */
  fshl(k: number): number;
  /** General shift left by `k` bits; returns this */
  shl(k: number): this;
  /** this+=x */
  add(x: BIG): void;
  /** this-=x */
  sub(x: BIG): void;
  /** reverse subtract this=x-this */
  rsub(x: BIG): void;
  /** return length in bits */
  nbits(): number;
  /** convert this to string */
  toString(): string;
  /** convert this BIG to byte array */
  tobytearray(buffer: ArrayLike<byte>, offset: number): this;
  /** convert this to byte array */
  toBytes(buffer: ArrayLike<byte>): void;
  /** reduce this mod m */
  mod(m: BIG): void;
  /** this/=m */
  div(m: BIG): void;
  /** return parity of this */
  parity(): 0 | 1;
  /** return n-th bit of this */
  bit(n: number): 0 | 1;
  /** return last n bits of this */
  lastbits(n: number): number;
  isok(): boolean;
  /** Jacobi Symbol (this/p). Returns 0, 1 or -1 */
  jacobi(p: BIG): -1 | 0 | 1;
  /** this=1/this mod p. Binary method */
  invmodp(p: BIG): void;
  /** return this^e mod m */
  powmod(e: BIG, m: BIG): BIG;
}

export type BIGSource = BIG | number;

export interface BIGStatic {
  /** Number of words in BIG */
  readonly NLEN: number;
  /** Number of words in DBIG */
  readonly DNLEN: number;
  /** Number of bytes in the context's modulus */
  readonly MODBYTES: number;

  /** convert from byte array to BIG */
  frombytearray(b: ArrayLike<byte>, offset: number): BIG;
  /** convert from byte array to BIG */
  fromBytes(b: ArrayLike<byte>): BIG;
  /** return a*b where product fits a BIG */
  smul(a: BIG, b: BIG): BIG;
  /** Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
  comp(a: BIG, b: BIG): -1 | 0 | 1;
  /** Create random b with 0 <= b < q in portable way, one bit at a time */
  randomnum(q: BIG, rng: RAND): BIG;
  /** Return a*b mod m */
  modmul(a: BIG, b: BIG, m: BIG): BIG;
  /** return a^2 mod m */
  modsqr(a: BIG, m: BIG): BIG;
  /** return -a mod m */
  modneg(a: BIG, m: BIG): BIG;
  /** Arazi and Qi inversion mod 256 */
  invmod256(a: number): number;

  /** Create new instance from data. If unset, the instance is zero. */
  new (data?: BIGSource): BIG;
}

export interface DBIG {
  /** Internal data store */
  readonly w: readonly number[];

  /** set to zero */
  zero(): this;
}

export interface DBIGStatic {
  /** Create new instance from data */
  new (data: number): DBIG;
}
