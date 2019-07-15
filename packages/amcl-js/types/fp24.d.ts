import { BIGSource } from "./big";
import { byte } from "./byte";
import { FP8 } from "./fp8";

export interface FP24 {
  readonly a: FP8;
  readonly b: FP8;
  readonly c: FP8;
  readonly stype: number;

  /** test x==0 ? */
  iszilch(): boolean;
  /** test x==1 ? */
  isunity(): boolean;

  /** Get sparse type */
  gettype(): number;
  /** extract a */
  geta(): FP8;
  /** extract b */
  getb(): FP8;
  /** extract c */
  getc(): FP8;
  /** return true if x==y, else false */
  equals(x: FP24): boolean;
  /** copy this=x */
  copy(x: FP24): void;
  /** set this=1 */
  one(): void;
  /** set this=0 */
  zero(): boolean;

  /** FP24 full multiplication this=this*y */
  mul(y: FP24): void;

  /** this=1/this */
  inverse(): void;

  /** Returns this^e */
  pow(e: BIGSource): FP24;
}

export interface FP24Static {
  fromBytes(data: ArrayLike<byte>): FP24;

  /** Copy constructor */
  new (other: FP24): FP24;
  /** Create new instance from (a, b, c) */
  new (a: FP8, b: FP8, c: FP8): FP24;
  /** Create new instance from (a, 0, 0) */
  new (a: number | FP8): FP24;
  /** Create zero FP24, analogue to `new ctx.FP24(new ctx.FP8(), new ctx.FP8(), new ctx.FP8())` */
  new (): FP24;
}
