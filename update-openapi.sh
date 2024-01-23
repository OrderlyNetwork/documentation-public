#!/bin/bash

set -e

rm -rf ./build-on-evm/evm-api/restful-api
npx @mintlify/scraping@latest openapi-file ./evm.openapi.yaml -o ./build-on-evm/evm-api/restful-api
mv ./build-on-evm/evm-api/restful-api/restful_public ./build-on-evm/evm-api/restful-api/public
mv ./build-on-evm/evm-api/restful-api/restful_private ./build-on-evm/evm-api/restful-api/private

for filename in ./build-on-evm/evm-api/restful-api/**/*; do
    if [[ -f $filename ]]; then
        sed -i 's/openapi: /openapi: evm.openapi /g' $filename
    fi
done

rm -rf ./build-on-near/near-api/restful-api
npx @mintlify/scraping@latest openapi-file ./near.openapi.yaml -o ./build-on-near/near-api/restful-api
mv ./build-on-near/near-api/restful-api/restful_public ./build-on-near/near-api/restful-api/public
mv ./build-on-near/near-api/restful-api/restful_private ./build-on-near/near-api/restful-api/private

for filename in ./build-on-near/near-api/restful-api/**/*; do
    if [[ -f $filename ]]; then
        sed -i 's/openapi: /openapi: near.openapi /g' $filename
    fi
done
