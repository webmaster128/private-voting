import { BIGSource } from "./big";
import { FP8 } from "./fp8";

export interface FP16 {
  readonly a: FP8;
  readonly b: FP8;

  /** test x==0 ? */
  iszilch(): boolean;
  /** test x==1 ? */
  isunity(): boolean;

  /** extract a */
  geta(): FP8;
  /** extract b */
  getb(): FP8;
  /** return true if x==y, else false */
  equals(x: FP16): boolean;
  /** copy this=x */
  copy(x: FP16): void;
  /** set this=0 */
  zero(): boolean;
  /** set this=1 */
  one(): void;
  /* set from two FP8s */
  set(c: FP8, d: FP8): void;
  /* set to (a, 0) */
  seta(a: FP8): void;
  /* this=-this */
  neg(): void;
  /** this=conjugate(this) */
  conj(): void;
  /** this=-conjugate(this) */
  nconj(): void;
  /** this+=x */
  add(x: FP16): void;
  /** this-=x */
  sub(x: FP16): void;

  /** FP16 full multiplication this=this*y */
  mul(y: FP16): void;

  /** this=1/this */
  inverse(): void;

  /** Returns this^e */
  pow(e: BIGSource): FP16;
}

export interface FP16Static {
  /** Copy constructor */
  new (other: FP16): FP16;
  /** Create new instance from (a, b) */
  new (a: number | FP8, b: number | FP8): FP16;
  /** Create new instance from (a, 0) */
  new (a: number): FP16;
  /** Create zero FP16, analogue to `new ctx.FP16(new ctx.FP8(), new ctx.FP8())` */
  new (): FP16;
}
