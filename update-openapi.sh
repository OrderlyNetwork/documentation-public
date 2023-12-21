#!/bin/bash

set -e

rm -rf ./build-on-evm/evm-api/restful-api
npx @mintlify/scraping@latest openapi-file ./evm.openapi.yaml -o ./build-on-evm/evm-api/restful-api
mv ./build-on-evm/evm-api/restful-api/restful_public ./build-on-evm/evm-api/restful-api/public
mv ./build-on-evm/evm-api/restful-api/restful_private ./build-on-evm/evm-api/restful-api/private

rm -rf ./build-on-near/near-api/restful-api
npx @mintlify/scraping@latest openapi-file ./near.openapi.yaml -o ./build-on-near/near-api/restful-api
mv ./build-on-near/near-api/restful-api/restful_public ./build-on-near/near-api/restful-api/public
mv ./build-on-near/near-api/restful-api/restful_private ./build-on-near/near-api/restful-api/private
