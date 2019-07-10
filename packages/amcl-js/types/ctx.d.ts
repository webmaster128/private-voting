import { AESStatic } from "./aes";
import { BIGStatic, DBIGStatic } from "./big";
import { ECPStatic } from "./ecp";
import { ECP2Static } from "./ecp2";
import { ECP4Static } from "./ecp4";
import { ECP8Static } from "./ecp8";
import { FPStatic } from "./fp";
import { FP2Static } from "./fp2";
import { FP4Static } from "./fp4";
import { FP8Static } from "./fp8";
import { FP12Static } from "./fp12";
import { FP16Static } from "./fp16";
import { FP24Static } from "./fp24";
import { FP48Static } from "./fp48";
import { MPINStatic } from "./mpin";
import { PAIRStatic } from "./pair";
import { PAIR192Static } from "./pair192";
import { PAIR256Static } from "./pair256";
import { RANDStatic } from "./rand";
import { ROM_CURVEStatic } from "./rom_curve";
import { ROM_FIELDStatic } from "./rom_field";
import { UInt64Static } from "./uint64";

export interface CTX {
  readonly AES: AESStatic;
  readonly RAND: RANDStatic;
  readonly UInt64: UInt64Static;
}

export interface CTXWithBig extends CTX {
  readonly BIG: BIGStatic;
  readonly DBIG: DBIGStatic;
}

export interface CTXWithCurve extends CTXWithBig {
  readonly ROM_CURVE: ROM_CURVEStatic;
  readonly ROM_FIELD: ROM_FIELDStatic;
  readonly FP: FPStatic;
  readonly ECP: ECPStatic;
  readonly ECDH: any;
}

/**
 * @PF: Pairing Friendly type 1 or 2
 *
 * See `if (ctx.config["@PF"] == 1 || ctx.config["@PF"] == 2)` in ctx.js
 */
export interface CTXWithCurvePF12 extends CTXWithCurve {
  readonly FP2: FP2Static;
  readonly FP4: FP4Static;
  readonly FP12: FP12Static;
  readonly ECP2: ECP2Static;
  readonly PAIR: PAIRStatic;
  readonly MPIN: MPINStatic;
  readonly BLS: any; // Not yet supported. Feel free to add support via PR
}

/**
 * @PF: Pairing Friendly type 3
 *
 * See `if (ctx.config["@PF"] == 3)` in ctx.js
 */
export interface CTXWithCurvePF3 extends CTXWithCurve {
  readonly FP2: FP2Static;
  readonly FP4: FP4Static;
  readonly FP8: FP8Static;
  readonly FP24: FP24Static;
  readonly ECP4: ECP4Static;
  readonly PAIR192: PAIR192Static;
  readonly MPIN192: any; // Not yet supported. Feel free to add support via PR
  readonly BLS192: any; // Not yet supported. Feel free to add support via PR
}

/**
 * @PF: Pairing Friendly type 4
 *
 * See `if (ctx.config["@PF"] == 4)` in ctx.js
 */
export interface CTXWithCurvePF4 extends CTXWithCurve {
  readonly FP2: FP2Static;
  readonly FP4: FP4Static;
  readonly FP8: FP8Static;
  readonly FP16: FP16Static;
  readonly FP48: FP48Static;
  readonly ECP8: ECP8Static;
  readonly PAIR256: PAIR256Static;
  readonly MPIN256: any; // Not yet supported. Feel free to add support via PR
  readonly BLS256: any; // Not yet supported. Feel free to add support via PR
}

export interface CTXWithRsa extends CTXWithBig {
  readonly FF: any; // Not yet supported. Feel free to add support via PR
  readonly RSA: any; // Not yet supported. Feel free to add support via PR
  readonly rsa_public_key: any; // Not yet supported. Feel free to add support via PR
  readonly rsa_private_key: any; // Not yet supported. Feel free to add support via PR
}

export type CurveId =
  | "ED25519"
  | "C25519"
  | "SECP256K1"
  | "NIST256"
  | "NIST384"
  | "BRAINPOOL"
  | "ANSSI"
  | "HIFIVE"
  | "GOLDILOCKS"
  | "C41417"
  | "NIST521"
  | "NUMS256W"
  | "NUMS256E"
  | "NUMS384W"
  | "NUMS384E"
  | "NUMS512W"
  | "NUMS512E";

/** Pairing friendly type 1 */
export type CurveIdPF1 = "FP256BN" | "FP512BN" | "BN254" | "BN254CX";
/** Pairing friendly type 2 */
export type CurveIdPF2 = "BLS383" | "BLS381" | "BLS461";
/** Pairing friendly type 3 */
export type CurveIdPF3 = "BLS24";
/** Pairing friendly type 4 */
export type CurveIdPF4 = "BLS48";

export interface CTXStatic {
  new (): CTX;
  new (id: CurveId): CTXWithCurve;
  new (id: CurveIdPF1 | CurveIdPF2): CTXWithCurvePF12;
  new (id: CurveIdPF3): CTXWithCurvePF3;
  new (id: CurveIdPF4): CTXWithCurvePF4;
  new (id: "RSA2048" | "RSA3072" | "RSA4096"): CTXWithRsa;
}

export declare const CTX: CTXStatic;
