import { BIG } from "./big";
import { FP8 } from "./fp8";

export interface ECP8 {
  readonly x: FP8;
  readonly y: FP8;
  readonly z: FP8;

  /** Test this=O? */
  is_infinity(): boolean;
  /** copy this=P */
  copy(P: ECP8): void;
  /** set this=O */
  inf(): void;

  /** Test P == Q */
  equals(Q: ECP8): boolean;
  /** set this=-this */
  neg(): void;

  /** set this=(x,y) */
  setxy(x: FP8, y: FP8): void;
  /** set this=(x,.) */
  setx(x: FP8): void;

  /** this+=Q */
  add(Q: ECP8): void;
  /** this-=Q */
  sub(Q: ECP8): void;
  /**
   * Returns this*e
   *
   * Note: In contrast to FP.mul or BIG.imul, this does not do an in-place multiplication.
   */
  mul(e: BIG): ECP8;
}

export interface ECP8Static {
  /** Copy constructor */
  new (other: ECP8): ECP8;
  /** Construct a new point, set to the point at infinity */
  new (): ECP8;
}
