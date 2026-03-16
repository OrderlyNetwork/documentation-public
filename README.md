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

### New builder

- add builder under "/introduction/trade-on-orderly/builders.mdx"

## Site config and generated docs

`docs.json` is the active Mintlify site configuration and navigation source.
Edit `docs.json` directly for navigation and site structure changes.

`llms.config.json` is the source of truth for AI-facing curated sections and
canonical pages. `llms.txt` and `llms-full.txt` are generated artifacts and
should not be manually edited.

`yarn update` only exists to regenerate generated documentation content:

- `build-on-omnichain/restful-api/`
- `sdks/tech-doc/`

Do not manually edit generated files in those directories unless you are changing
the generator source as well.

In order to run the script, do the following:

- Install Node.js, Yarn, and PNPM
- Install dependencies via: `yarn`
- Run update script: `yarn update`
- Regenerate AI artifacts: `yarn update:llms`
- Verify AI docs artifacts and route validity: `yarn check:ai-docs`

### AI-friendly docs

The AI-facing docs setup exists to make the highest-signal builder pages easy for
LLMs, agents, and RAG pipelines to find and summarize without drifting into
maintenance-only repository details.

AI-friendly goals:

- Route models to a curated set of canonical pages for common builder tasks.
- Keep `llms.txt` and `llms-full.txt` aligned with live routes in `docs.json`.
- Make canonical authored pages self-describing with stable frontmatter.
- Keep internal-only and maintenance-only material out of default AI context.

Canonical page minimum contract:

- Canonical pages listed in `llms.config.json` must include `title` frontmatter.
- Canonical pages listed in `llms.config.json` must include `description` frontmatter.

Repo context policy:

- Runtime docs surface: `docs.json`, hand-authored docs, required assets, and the maintenance scripts that define the live site.
- Generated surface: `build-on-omnichain/restful-api/`, `sdks/tech-doc/`, `llms.txt`, and `llms-full.txt`; regenerate instead of hand-editing.
- Internal surface: `docs/superpowers/`, `.sisyphus/`, `NOTES.md`, and similar maintenance-only files; exclude them from default AI context.

<Note>
    Pre-release changes will be pushed to staging branch. Staging will be merged to main once the release is complete and all changes are in production.
</Note>

## FAQ

### The update script changes OpenAPI files

It means someone modified generated API documentation or the OpenAPI source changed.
Those files are regenerated from `orderly.openapi.yaml` and the SDK docs source.
If there are changes to the OpenAPI file, run the update script after updating the
source, then adjust `docs.json` only if navigation or visible site structure needs
to change.
