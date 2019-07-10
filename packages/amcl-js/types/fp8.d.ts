import { FP4 } from "./fp4";

export interface FP8 {
  readonly a: FP4;
  readonly b: FP4;

  /** reduce all components of this mod Modulus */
  reduce(): void;
  /** normalise all components of this mod Modulus */
  norm(): void;
  /** test this==0 ? */
  iszilch(): boolean;
  /** test this==1 ? */
  isunity(): boolean;
  /** extract real part a */
  geta(): FP4;
  /** extract imaginary part b */
  getb(): FP4;
  /** test this=x? */
  equals(x: FP8): boolean;
  /** copy this=x */
  copy(x: FP8): void;
  /** this=0 */
  zero(): void;
  /** this=1 */
  one(): void;
  /** this+=x */
  add(x: FP8): void;
  /** this-=x */
  sub(x: FP8): void;
}

export interface FP8Static {
  /** Copy constructor */
  new (other: FP8): FP8;
  /** Create new instance from (a, b) */
  new (a: FP4, b: FP4): FP8;
  /** Create new instance from (a, 0) */
  new (a: number): FP8;
  /** Create zero FP8, analogue to `new FP8(new FP4(), new FP4())` */
  new (): FP8;
}
