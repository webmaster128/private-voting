# Notes on the BeleniosRF paper

This document contains meta notes on
[the BeleniosRF paper](https://eprint.iacr.org/2015/629) to be availably
publicly.

## Notes on content of the paper

1. Typo: In the definition of `H(x)` in section 3.3, the parameter called `vk`
   is supposed to be `x`. [1]
2. Typo: In the assignment of `C'_r` (Figure 2: Our SRC scheme; Random+),
   `C_2(r')` is supposed to be `C'_2(r')`. [1]

## Noted on the implementation of BeleniosRF

1. BN254 is a good choice for a paring-friendly elliptic curve as it provides a
   reasonable trade-off between security and efficiency. [1]

## Sources

[1] https://github.com/webmaster128/private-voting/issues/1
