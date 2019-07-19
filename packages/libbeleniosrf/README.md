# libBeleniosRF

An implementation of the BeleniosRF voting scheme

## Guided tour

1. Check out David's talk about BeleniosRF:
   [CCS 2016 - BeleniosRF: A Non-Interactive Receipt-Free Electronic Voting Scheme](https://www.youtube.com/watch?v=Fzj29WTVWb8)
2. Check out [the BeleniosRF paper](https://eprint.iacr.org/2015/629)
3. Check out Thomas Clarke's work
   [Implementation of the Belenios Receipt-Free+ Online Voting Protocol](http://www.dgalindo.es/mscprojects/thomas.pdf)
   to get some more context (Note: this work as well as Belenios Receipt-Free+
   is unfinished). It is way less compressed than the paper and will help you
   understand the paper.
4. Read the BeleniosRF paper again (a couple of times)
5. Shoot an email to the authors giving them some credit for their great work
6. Check out `src/integration.spec.ts` that shows the whole flow of the voting
   process
7. Understand Groth Sahai proofs
8. Review all the code to ensure I did nothing wrong when implementing this
9. Build an amazing application on top of libBeleniosRF and let's collaborate on
   improving the library

## License

This package is part of the private-voting repository, licensed under the Apache
License 2.0 (see
[NOTICE](https://github.com/webmaster128/private-voting/blob/master/NOTICE) and
[LICENSE](https://github.com/webmaster128/private-voting/blob/master/LICENSE)).
