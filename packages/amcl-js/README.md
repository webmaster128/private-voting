A version of the
[The Apache Milagro Cryptographic Library](https://github.com/miracl/amcl)
version 3 packaged to be used as a commonjs module.

## Hacking

To get started working on this repo, run

```
yarn install
yarn test
```

In order to regenerate the module, checkout
[amcl](https://github.com/miracl/amcl) and this repo into the same parent folder
and run

```
yarn generate
```

## License

This package bundles a version of amcl in the `lib/` folder, licensed under the
Apache License 2.0, see
[NOTICE.txt](https://github.com/miracl/amcl/blob/master/NOTICE.txt) and
[LICENSE-2.0.TXT](https://github.com/miracl/amcl/blob/master/LICENSE-2.0.TXT).

This package is part of the private-voting repository, licensed under the Apache
License 2.0 (see
[NOTICE](https://github.com/webmaster128/private-voting/blob/master/NOTICE) and
[LICENSE](https://github.com/webmaster128/private-voting/blob/master/LICENSE)).
