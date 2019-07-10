export interface AES {
  init(mode: number, nk: 16 | 24 | 32, key: ArrayLike<number>, iv: ArrayLike<number> | null): void;
  ecb_encrypt(buffer: ArrayLike<number>): void;
  ecb_decrypt(buffer: ArrayLike<number>): void;
}

export interface AESStatic {
  // AES constants
  readonly ECB: 0;
  readonly CBC: 1;
  readonly CFB1: 2;
  readonly CFB2: 3;
  readonly CFB4: 5;
  readonly OFB1: 14;
  readonly OFB2: 15;
  readonly OFB4: 17;
  readonly OFB8: 21;
  readonly OFB16: 29;
  readonly CTR1: 30;
  readonly CTR2: 31;
  readonly CTR4: 33;
  readonly CTR8: 37;
  readonly CTR16: 45;

  new (): AES;
}
