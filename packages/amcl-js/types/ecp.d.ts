import { BIG } from "./big";
import { FP } from "./fp";

/** Elliptic Curve Point */
export interface ECP {
  readonly x: FP;
  readonly y: FP;
  readonly z: FP;

  is_infinity(): boolean;
  /** Conditional swap of this and other dependant on d */
  cswap(other: ECP, d: boolean): void;
  /** Conditional move of other to this dependant on d */
  cmove(other: ECP, d: boolean): void;
  /** Test this == other */
  equals(other: ECP): boolean;
  /** Copy this = other */
  copy(other: ECP): void;
  /** this=-this */
  neg(): void;
  /** set this=O */
  inf(): void;
  /** Set this=(x,y)  */
  setxy(x: BIG, y: BIG): void;
  /** Set this=x, y is derived from sign s */
  setxi(x: BIG, s: 0 | 1): void;
  /** Set this=x, y calculated from curve equation */
  setx(x: BIG): void;
  /** Set this to affine, from (x,y,z) to (x,y) */
  affine(): void;
  /** extract x as ctx.BIG */
  getX(): BIG;
  /** extract y as ctx.BIG */
  getY(): BIG;
  /** get sign of Y */
  getS(): 0 | 1;
  /** extract x as ctx.FP */
  getx(): FP;
  /** extract y as ctx.FP */
  gety(): FP;
  /** extract z as ctx.FP */
  getz(): FP;
  /** convert to byte array */
  toBytes(buffer: ArrayLike<number>, compress: boolean): void;
  /** convert to hex string */
  toString(): string;
  /** this+=this */
  dbl(): void;
  /** this+=Q */
  add(Q: ECP): void;
  /** Differential Add for Montgomery curves. this+=Q where W is this-Q and is affine. */
  dadd(Q: ECP, W: ECP): void;
  /** this-=Q */
  sub(Q: ECP): void;
  /** constant time multiply by small integer of length bts - use ladder */
  pinmul(e: number, bts: number): ECP;
  /** multiply this by the curves cofactor */
  cfp(): void;
  /**
   * Returns this*e (SPA immune, using Ladder)
   *
   * Note: In contrast to FP.mul or BIG.imul, this does not do an in-place multiplication.
   */
  mul(e: BIG): ECP;
  /**
   * Returns this * e + Q * f
   *
   * Note: In contrast to FP.mul or BIG.imul, this does not do an in-place multiplication.
   */
  mul2(e: BIG, Q: ECP, f: BIG): ECP;
}

export declare enum PairingFriendly {
  NOT = 0,
  BN = 1,
  BLS = 2,
  D_TYPE = 3,
  M_TYPE = 4,
}

export interface ECPStatic {
  readonly WEIERSTRASS: 0;
  readonly EDWARDS: 1;
  readonly MONTGOMERY: 2;

  readonly NOT: PairingFriendly.NOT;
  readonly BN: PairingFriendly.BN;
  readonly BLS: PairingFriendly.BLS;
  readonly D_TYPE: PairingFriendly.D_TYPE;
  readonly M_TYPE: PairingFriendly.M_TYPE;

  readonly POSITIVEX: number;
  readonly NEGATIVEX: number;

  readonly CURVETYPE: number;
  readonly CURVE_PAIRING_TYPE: PairingFriendly;
  readonly SEXTIC_TWIST: any;
  readonly SIGN_OF_X: any;
  readonly ATE_BITS: any;

  readonly HASH_TYPE: any;
  readonly AESKEY: any;

  /** Copy constructor */
  new (other: ECP): ECP;
  /** Construct a new point, set to the point at infinity */
  new (): ECP;
}
