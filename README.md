# Orderly Docs

Documentation on Orderly Network.

Suggestions and edits welcome through Pull Requests / Issues.

## Update OpenAPI Documentation

Run the file `./update-openapi.sh`.

## Generate Technical Documentation

The file `mint.json` is auto generated!
It should never be edited manually. If you want to do changes to `mint.json`, you have to edit `mint-base.json` instead, which will be merged with the technical documentation.

- git clone the [SDK repository](https://gitlab.com/orderlynetwork/orderly-fe/orderly-web) so that the folder is right next to the `documentation` folder and checkout the branch you want to generate
- install dependencies via `yarn`
- generate tech docs via `yarn tech-docs`
