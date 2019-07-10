import { FP2 } from "./fp2";

export interface FP4 {
  readonly a: FP2;
  readonly b: FP2;

  /** reduce all components of this mod Modulus */
  reduce(): void;
  /** normalise all components of this mod Modulus */
  norm(): void;
  /** test this==0 ? */
  iszilch(): boolean;
  /** test this==1 ? */
  isunity(): boolean;
  /** conditional copy of g to this depending on d */
  cmove(g: FP4, d: boolean): void;
  /** test is w real? That is in a+ib test b is zero */
  isreal(): boolean;
  /** extract real part a */
  real(): FP2;
  /** extract real part a */
  geta(): FP2;
  /** extract imaginary part b */
  getb(): FP2;
  /** test this=x? */
  equals(x: FP4): boolean;
  /** copy this=x */
  copy(x: FP4): void;
  /** this=0 */
  zero(): void;
  /** this=1 */
  one(): void;
  /** set from two FP2s */
  set(c: FP2, d: FP2): void;
  /** this+=x */
  add(x: FP4): void;
  /** this-=x */
  sub(x: FP4): void;
}

export interface FP4Static {
  /** Copy constructor */
  new (other: FP4): FP4;
  /** Create new instance from (a, b) */
  new (a: FP2, b: FP2): FP4;
  /** Create new instance from (a, 0) */
  new (a: number): FP4;
  /** Create zero FP4, analogue to `new FP4(new FP2(), new FP2())` */
  new (): FP4;
}
