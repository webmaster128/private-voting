import { ECP } from "./ecp";
import { ECP4 } from "./ecp4";
import { FP24 } from "./fp24";

export interface PAIR192Static {
  /** Optimal R-ate pairing */
  ate(P: ECP4, Q: ECP): FP24;
  /** Optimal R-ate double pairing e(P,Q)*e(R,S) */
  ate2(P: ECP4, Q: ECP, R: ECP4, S: ECP): FP24;
  /** final exponentiation - keep separate for multi-pairings and to avoid thrashing stack */
  fexp(m: FP24): FP24;
}
