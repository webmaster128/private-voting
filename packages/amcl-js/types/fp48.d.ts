import { BIGSource } from "./big";
import { byte } from "./byte";
import { FP16 } from "./fp16";

export interface FP48 {
  readonly a: FP16;
  readonly b: FP16;
  readonly c: FP16;
  readonly stype: number;

  /** test x==0 ? */
  iszilch(): boolean;
  /** test x==1 ? */
  isunity(): boolean;

  /** Get sparse type */
  gettype(): number;
  /** extract a */
  geta(): FP16;
  /** extract b */
  getb(): FP16;
  /** extract c */
  getc(): FP16;
  /** return 1 if x==y, else 0 */
  equals(x: FP48): boolean;
  /** copy this=x */
  copy(x: FP48): void;
  /** set this=1 */
  one(): void;
  /** set this=0 */
  zero(): void;

  /** FP48 full multiplication this=this*y */
  mul(y: FP48): void;

  /** this=1/this */
  inverse(): void;

  /** Returns this^e */
  pow(e: BIGSource): FP48;
}

export interface FP48Static {
  fromBytes(data: ArrayLike<byte>): FP48;

  /** Copy constructor */
  new (other: FP48): FP48;
  /** Create new instance from (a, b, c) */
  new (a: FP16, b: FP16, c: FP16): FP48;
  /** Create new instance from (a, 0, 0) */
  new (a: number | FP16): FP48;
  /** Create zero FP48, analogue to `new ctx.FP48(new ctx.FP16(), new ctx.FP16(), new ctx.FP16())` */
  new (): FP48;
}
