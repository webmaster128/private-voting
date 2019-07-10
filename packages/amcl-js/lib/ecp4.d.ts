import { BIG } from "./big";
import { FP4 } from "./fp4";

export interface ECP4 {
  readonly x: FP4;
  readonly y: FP4;
  readonly z: FP4;

  /** Test this=O? */
  is_infinity(): boolean;
  /** copy this=P */
  copy(P: ECP4): void;
  /** set this=O */
  inf(): void;

  /** Test P == Q */
  equals(Q: ECP4): boolean;
  /** set this=-this */
  neg(): void;

  /** set this=(x,y) */
  setxy(x: FP4, y: FP4): void;
  /** set this=(x,.) */
  setx(x: FP4): void;

  /** this+=Q */
  add(Q: ECP4): void;
  /** this-=Q */
  sub(Q: ECP4): void;
  /**
   * Returns this*e
   *
   * Note: In contrast to FP.mul or BIG.imul, this does not do an in-place multiplication.
   */
  mul(e: BIG): ECP4;
}

export interface ECP4Static {
  /** Copy constructor */
  new (other: ECP4): ECP4;
  /** Construct a new point, set to the point at infinity */
  new (): ECP4;
}
