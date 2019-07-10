import { ECP } from "./ecp";
import { ECP2 } from "./ecp2";
import { FP } from "./fp";
import { FP12 } from "./fp12";

export interface PAIRStatic {
  /** Line function */
  line(A: ECP, B: ECP, Qx: FP, Qy: FP): FP12;
  /** Prepare for multi-pairing */
  initmp(): FP12[];
  /** Basic Miller loop */
  miller(r: FP12[]): FP12;
  /** Accumulate another set of line functions for n-pairing */
  another(r: FP12[], P: ECP2, Q: ECP): void;
  /** Optimal R-ate pairing */
  ate(P: ECP2, Q: ECP): FP12;
  /** Optimal R-ate double pairing e(P,Q)*e(R,S) */
  ate2(P: ECP2, Q: ECP, R: ECP2, S: ECP): FP12;
  /** final exponentiation - keep separate for multi-pairings and to avoid thrashing stack */
  fexp(m: FP12): FP12;
}
