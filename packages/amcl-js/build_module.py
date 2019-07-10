#!/usr/bin/env python3

import glob
import os
import subprocess
import tempfile

repo_source = "https://github.com/miracl/amcl.git"

sources = [
    "version3/js/aes.js",
    "version3/js/big.js",
    "version3/js/bls.js",
    "version3/js/bls192.js",
    "version3/js/bls256.js",
    "version3/js/ctx.js",
    "version3/js/ecdh.js",
    "version3/js/ecp.js",
    "version3/js/ecp2.js",
    "version3/js/ecp4.js",
    "version3/js/ecp8.js",
    "version3/js/ff.js",
    "version3/js/fp.js",
    "version3/js/fp12.js",
    "version3/js/fp16.js",
    "version3/js/fp2.js",
    "version3/js/fp24.js",
    "version3/js/fp4.js",
    "version3/js/fp48.js",
    "version3/js/fp8.js",
    "version3/js/gcm.js",
    "version3/js/hash256.js",
    "version3/js/hash384.js",
    "version3/js/hash512.js",
    "version3/js/mpin.js",
    "version3/js/mpin192.js",
    "version3/js/mpin256.js",
    "version3/js/nhs.js",
    "version3/js/pair.js",
    "version3/js/pair192.js",
    "version3/js/pair256.js",
    "version3/js/rand.js",
    "version3/js/rom_curve.js",
    "version3/js/rom_field.js",
    "version3/js/rsa.js",
    "version3/js/sha3.js",
    "version3/js/uint64.js",
]

with tempfile.TemporaryDirectory() as tmpdir:
    print('Working in', tmpdir)
    checkout_folder = "amcl_checkout"
    checkout_path = os.path.join(tmpdir, checkout_folder)
    subprocess.check_output(["git", "-C", tmpdir, "clone", "--depth=1", repo_source, checkout_folder])

    patches = sorted(glob.glob("lib/patches/*.patch"))
    for patch in patches:
        subprocess.check_output(["git", "-C", checkout_path, "apply", os.path.realpath(patch)])

    for path in [os.path.join(checkout_path, rel) for rel in sources]:
        base = os.path.basename(path)
        outpath = "lib/amcl3/{}".format(base)
        with open(path) as infile, open(outpath, "w") as outfile:
            # Copy infile to outfile. Currently no updates needed but this is the place to do them
            for line in infile:
                outfile.write(line)
