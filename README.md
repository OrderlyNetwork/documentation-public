# Orderly Docs

Documentation on Orderly Network.

Suggestions and edits welcome through Pull Requests / Issues.

## Update script

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

## FAQ

### The update script changes OpenAPI files

It means someone modified the OpenAPI files manually.
Those files will also be auto generated with the update script by editing the `evm.openapi.yaml`
file.
If there are changes to the OpenAPI file, then it is recommended to run the update
script after adding all changes and then modifying the `mint-base.json` file to add
those new endpoints.
