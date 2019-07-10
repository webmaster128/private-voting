import { ECP } from "./ecp";
import { ECP8 } from "./ecp8";
import { FP48 } from "./fp48";

export interface PAIR256Static {
  /** Optimal R-ate pairing */
  ate(P: ECP8, Q: ECP): FP48;
  /** Optimal R-ate double pairing e(P,Q)*e(R,S) */
  ate2(P: ECP8, Q: ECP, R: ECP8, S: ECP): FP48;
  /** final exponentiation - keep separate for multi-pairings and to avoid thrashing stack */
  fexp(m: FP48): FP48;
}
