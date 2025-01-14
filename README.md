# Orderly Docs

Documentation of Orderly.

Suggestions and edits are welcome through Pull Requests / Issues.

## Change SOP

### New chains

- add contract addresses: https://orderly.network/docs/build-on-omnichain/addresses
- add chain here: https://orderly.network/docs/introduction/trade-on-orderly/supported-chains

### New listings

- add market here: https://orderly.network/docs/introduction/trade-on-orderly/supported-markets
- add exchanges for new market: https://orderly.network/docs/introduction/trade-on-orderly/perpetual-futures/mark-price-index-price-and-last-price
- add funding for the pair: https://orderly.network/docs/introduction/trade-on-orderly/perpetual-futures/funding-rate
- add margin for the pair: https://orderly.network/docs/introduction/trade-on-orderly/perpetual-futures/margin-leverage-and-pnl

### New broker

- add broker under "/introduction/trade-on-orderly/brokers.mdx"

## API or nav changes that require mint.json edit need to run "Update script"

The update script will check for OpenAPI documentation and technical documentation
changes and always needs to be run, when a change to `mint.json` is required.
The file `mint.json` is auto generated!
It should never be edited manually. If you want to do changes to `mint.json`,
you have to edit `mint-base.json` instead, which will be merged with the technical
documentation.
The `mint.json` file will be checked in Github Actions whether it has been edited
manually.

In order to run the script, do the following:

- Install Nodejs, Yarn and PNPM
- Install dependencies via: `yarn`
- Run update script: `yarn update`

<Note>
    Pre-release changes will be pushed to staging branch. Staging will be merged to main once the release is complete and all changes are in production.
</Note>

## FAQ

### The update script changes OpenAPI files

It means someone modified the OpenAPI files manually.
Those files will also be auto generated with the update script by editing the `evm.openapi.yaml`
file.
If there are changes to the OpenAPI file, then it is recommended to run the update
script after adding all changes and then modifying the `mint-base.json` file to add
those new endpoints.
