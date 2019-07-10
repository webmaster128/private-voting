import { BIG } from "./big";
import { byte } from "./byte";
import { FP2 } from "./fp2";

export interface ECP2 {
  readonly x: FP2;
  readonly y: FP2;
  readonly z: FP2;

  /** Test this=O? */
  is_infinity(): boolean;
  /** copy this=P */
  copy(P: ECP2): void;
  /** set this=O */
  inf(): void;
  /** conditional move of Q to P dependant on d */
  cmove(Q: ECP2, d: boolean): void;
  /** Constant time select from pre-computed table */
  select(W: readonly ECP2[], b: number): void;
  /** Test P == Q */
  equals(Q: ECP2): boolean;
  /** set this=-this */
  neg(): void;
  /** convert this to affine, from (x,y,z) to (x,y) */
  affine(): void;
  /** extract affine x */
  getX(): FP2;
  /** extract affine y */
  getY(): FP2;
  /** extract projective x */
  getx(): FP2;
  /** extract projective y */
  gety(): FP2;
  /** extract projective z */
  getz(): FP2;
  /** convert this to byte array */
  toBytes(buffer: ArrayLike<byte>): void;
  /** convert this to hex string */
  toString(): string;
  /** set this=(x,y) */
  setxy(x: FP2, y: FP2): void;
  /** set this=(x,.) */
  setx(x: FP2): void;
  /** set this*=q, where q is Modulus, using Frobenius */
  frob(X: FP2): void;
  /** this+=this */
  dbl(): 1;
  /** this+=Q - return 0 for add, 1 for double, -1 for O */
  /** this+=Q */
  add(Q: ECP2): 0;
  /** this-=Q */
  sub(Q: ECP2): ECP2;
  /**
   * Returns this*e
   *
   * Note: In contrast to FP.mul or BIG.imul, this does not do an in-place multiplication.
   */
  mul(e: BIG): ECP2;
}

export interface ECP2Static {
  /** Copy constructor */
  new (other: ECP2): ECP2;
  /** Construct a new point, set to the point at infinity */
  new (): ECP2;
}
