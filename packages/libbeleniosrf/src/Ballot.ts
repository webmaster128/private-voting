import { EncryptedVote, GSProofs, Sigma } from "./VoteEncryptor";

export interface Ballot {
  readonly c: EncryptedVote & GSProofs;
  readonly sigma: Sigma;
}
