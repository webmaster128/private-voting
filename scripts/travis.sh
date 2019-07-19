#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

yarn install
yarn build
yarn lint
CI=true yarn test --stream
