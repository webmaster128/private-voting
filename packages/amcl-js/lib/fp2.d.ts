import { BIG } from "./big";
import { FP } from "./fp";

/** FP2 elements are of the form a+ib, where i is sqrt(-1) */
export interface FP2 {
  readonly a: FP;
  readonly b: FP;

  /** reduce components mod Modulus */
  reduce(): void;
  /** normalise components of w */
  norm(): void;
  /** test this=0 ? */
  iszilch(): boolean;
  /** test this=1 ? */
  isunity(): boolean;
  /** conditional copy of g to this depending on d */
  cmove(g: FP2, d: boolean): void;
  /** test this=x */
  equals(x: FP2): boolean;
  /** extract a */
  getA(): FP;
  /** extract b */
  getB(): FP;
  /** Set from pair of FPs */
  set(c: FP, d: FP): void;
  /** Set a, sets b to zero */
  seta(c: FP): void;
  /** set from two BIGs */
  bset(c: BIG, d: BIG): void;
  /** set from one ctx.BIG, sets b to zero */
  bseta(c: BIG): void;
  /** copy this=x */
  copy(x: FP2): void;
  /** set this=0 */
  zero(): void;
  /** Set this=1 */
  one(): void;
  /** negate this */
  neg(): void;
  /** conjugate this */
  conj(): void;
  /** this+=a */
  add(x: FP2): void;
  /** this-=x */
  sub(x: FP2): void;
  rsub(x: FP2): void;
  /** this*=s, where s is FP */
  pmul(s: FP): void;
  /** this*=c, where c is int */
  imul(c: number): void;
  /** this*=this */
  sqr(): void;
  /** this*=y. Now using Lazy reduction - inputs must be normed */
  mul(y: FP2): void;
  /**
   * sqrt(a+ib) = sqrt(a+sqrt(a*a-n*b*b)/2)+ib/(2*sqrt(a+sqrt(a*a-n*b*b)/2))
   * returns true if this is QR
   */
  sqrt(): boolean;
  /** convert this to hex string */
  toString(): string;
  /** this=1/this */
  inverse(): void;
  /** this/=2 */
  div2(): void;
  /** this*=sqrt(-1) */
  times_i(): void;
  /**
   * w*=(1+sqrt(-1))
   * where X*2-(1+sqrt(-1)) is irreducible for FP4, assumes p=3 mod 8
   */
  mul_ip(): void;
  div_ip2(): void;
  /** w/=(1+sqrt(-1)) */
  div_ip(): void;
  /** this=this^e */
  pow(e: BIG): void;
}

export interface FP2Static {
  /** Copy constructor */
  new (other: FP2): FP2;
  /** Create new instance from (a, b) */
  new (a: number | FP, b: number | FP): FP2;
  /** Create new instance from (a, 0) */
  new (a: number): FP2;
  /** Create zero FP2, analogue to `new FP2(new FP(), new FP())` */
  new (): FP2;
}
