import { BIG, BIGSource } from "./big";

/** Finite Field arithmetic; AMCL mod p functions */
export interface FP {
  /** Internal data store */
  readonly f: BIG;
  readonly XES: number;

  /** set this=0 */
  zero(): void;
  /** copy from ROM */
  rcopy(y: ArrayLike<number>): void;
  /** copy from another ctx.BIG */
  bcopy(y: BIG): void;
  /** copy from another FP */
  copy(y: FP): void;
  /** conditional swap of this and b depending on d */
  cswap(b: FP, d: boolean): void;
  /** conditional copy of b to this depending on d */
  cmove(b: FP, d: boolean): void;
  /** convert to Montgomery n-residue form */
  nres(): void;
  /** convert back to regular form */
  redc(): BIG;
  /** convert this to string */
  toString(): string;
  /** test this=0 */
  iszilch(): boolean;
  /** reduce this mod Modulus */
  reduce(): void;
  /** set this=1 */
  one(): void;
  /** normalise this */
  norm(): number;
  /** this*=b mod Modulus */
  mul(b: FP): this;
  /** this*=c mod Modulus where c is an int */
  imul(c: number): this;
  /** this*=this mod Modulus */
  sqr(): this;
  /** this+=b */
  add(b: FP): this;
  /** this=-this mod Modulus */
  neg(): this;
  /** this-=b */
  sub(b: FP): this;
  /** reverse subtract this=b-this */
  rsub(b: FP): this;
  /** this=1/this mod Modulus */
  inverse(): this;
  /** return true iff this==a */
  equals(a: FP): boolean;
  /** return this^e mod Modulus */
  pow(e: BIGSource): FP;
  /** return jacobi symbol (this/Modulus) */
  jacobi(): -1 | 0 | 1;
  /** return sqrt(this) mod Modulus */
  sqrt(): FP;
}

export interface FPStatic {
  // Constants that represent enum values
  readonly NOT_SPECIAL: 0;
  readonly PSEUDO_MERSENNE: 1;
  readonly GENERALISED_MERSENNE: 2;
  readonly MONTGOMERY_FRIENDLY: 3;

  // Sparse types
  readonly ZERO: 0;
  readonly ONE: 1;
  readonly SPARSER: 2;
  readonly SPARSE: 3;
  readonly DENSE: 4;

  // Context-dependent constants
  readonly MODBITS: number;
  readonly MOD8: number;
  readonly MODTYPE: 0 | 1 | 2 | 3;

  /** Copy constructor */
  new (other: FP | BIGSource): FP;
  /** Create zero FP, analogue to `new FP(new BIG())` */
  new (): FP;
}
