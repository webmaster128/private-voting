import { BIGSource } from "./big";
import { byte } from "./byte";
import { FP2 } from "./fp2";
import { FP4 } from "./fp4";

export interface FP12 {
  readonly a: FP4;
  readonly b: FP4;
  readonly c: FP4;
  readonly stype: number;

  /** reduce all components of this mod Modulus */
  reduce(): void;
  /** normalize all components of this mod Modulus */
  norm(): void;
  /** test x==0 ? */
  iszilch(): boolean;
  /** test x==1 ? */
  isunity(): boolean;
  /** conditional copy of g to this depending on d */
  cmove(g: FP12, d: boolean): void;
  /** Constant time select from pre-computed table */
  select(g: FP12[], b: number): void;
  settype(w: number): void;
  /** Get sparse type */
  gettype(): number;
  /** extract a */
  geta(): FP4;
  /** extract b */
  getb(): FP4;
  /** extract c */
  getc(): FP4;
  /** return true if x==y, else false */
  equals(x: FP12): boolean;
  /** copy this=x */
  copy(x: FP12): void;
  /** set this=1 */
  one(): void;
  /** set this=0 */
  zero(): void;
  /** Chung-Hasan SQR2 method from http://cacr.uwaterloo.ca/techreports/2006/cacr2006-24.pdf */
  sqr(): void;
  /** Full multiplication this=this*y */
  mul(y: FP12): void;
  /**
   * Multiplication this=this*y
   * catering for special case that arises from special form of ATE pairing line function
   * this and y are both sparser line functions - cost = 6m
   */
  smul(y: FP12): void;
  /** Full multiplication this=this*y. Supports sparse multiplicands. Usually this is denser than y */
  ssmul(y: FP12): void;
  /** this=1/this */
  inverse(): void;
  /** this=this^p, where p=Modulus, using Frobenius */
  frob(f: FP2): void;
  /** trace function */
  trace(): FP4;
  /** convert this to hex string */
  toString(): string;
  /** convert this to byte array */
  toBytes(buffer: ArrayLike<byte>): void;
  /** Returns this^e */
  pow(e: BIGSource): FP12;
}

export interface FP12Static {
  /** Copy constructor */
  new (other: FP12): FP12;
  /** Create new instance from (a, b, c) */
  new (a: FP4, b: FP4, c: FP4): FP12;
  /** Create new instance from (a, 0, 0) */
  new (a: number | FP4): FP12;
  /** Create zero FP12, analogue to `new ctx.FP12(new ctx.FP4(), new ctx.FP4(), new ctx.FP4())` */
  new (): FP12;
}
