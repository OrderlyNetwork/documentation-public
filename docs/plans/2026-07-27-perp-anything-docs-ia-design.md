# Perp Anything Documentation Information Architecture

Date: 2026-07-27

## Goal

Make Perp Anything a first-class documentation area in the Build on Omnichain tab, replace the Custom Oracle product name with Builder Oracle, separate distinct operator workflows, and preserve every existing public URL through redirects.

## Navigation

Add a `Perp Anything` group between `Core integration flows` and `Builders Marketplace`.

The group contains:

1. Introduction
2. Market Operations
3. Builder Oracle
4. RWA Markets
5. Pre-TGE Listing

The Builder Oracle guide remains under the `build-on-omnichain/user-flows` filesystem and URL namespace even though it appears in the Perp Anything navigation group.

## Canonical routes

| Page              | Canonical route                                       |
| ----------------- | ----------------------------------------------------- |
| Introduction      | `/build-on-omnichain/perp-anything/introduction`      |
| Market Operations | `/build-on-omnichain/perp-anything/market-operations` |
| Builder Oracle    | `/build-on-omnichain/user-flows/builder-oracle`       |
| RWA Markets       | `/build-on-omnichain/perp-anything/rwa-markets`       |
| Pre-TGE Listing   | `/build-on-omnichain/perp-anything/pre-tge-listing`   |

## Redirects

| Existing route                                                        | Destination                                         |
| --------------------------------------------------------------------- | --------------------------------------------------- |
| `/introduction/trade-on-orderly/permissionless-listing`               | `/build-on-omnichain/perp-anything/introduction`    |
| `/introduction/trade-on-orderly/custom-oracle`                        | `/build-on-omnichain/user-flows/builder-oracle`     |
| `/introduction/trade-on-orderly/pre-tge-listing`                      | `/build-on-omnichain/perp-anything/pre-tge-listing` |
| `/build-on-omnichain/user-flows/permissionless-listing-custom-oracle` | `/build-on-omnichain/user-flows/builder-oracle`     |

## Content responsibilities

### Introduction

Explain the product position, Standard Listing comparison, Builder and Orderly responsibility boundary, isolated-risk model, and Community Listed trader experience. Keep operational numbers and procedures out of this page.

### Market Operations

Own Insurance Fund assignment and funding requirements, Market Maker setup, isolated-margin requirements, launch phases, market status transitions, monitoring, restrictions, delisting, and fee-share operations. Link to existing general Isolated Margin and Insurance Fund documentation instead of copying it.

### Builder Oracle

Replace the Custom Oracle product name. Cover Builder-pushed feeds, Bring Your Own Key sources, source selection and weights, visibility, operator responsibilities, integration steps, and examples. Merge the existing conceptual Custom Oracle content into the user-flow guide and remove duplicated source, visibility, and RWA explanations.

### RWA Markets

Own supported RWA coverage, `market_session`, holidays and early closes, Market Closed behavior, and off-market pricing considerations. RWA is a listed-market property, not an oracle property.

### Pre-TGE Listing

Keep the independent Pre-TGE workflow, synthetic price behavior, initial-price and precision rules, risk caps, TGE transition, and trader disclosure.

## Compatibility boundaries

- Preserve `permissionless_listing_fee_share` and other public API fields.
- Preserve protocol identifiers including `market_session`, `is_pretge`, `ORACLE_<broker_id>`, provider source IDs, and `indexpricefeed`.
- Preserve the trader-facing `Community Listed`, `Pre-launch`, and `Market Closed` labels.
- Do not invent or rename API endpoints while reorganizing the documentation.
- The existing listing and RWA endpoints referenced by the Builder Oracle guide are not present in `orderly.openapi.yaml`; retain their current wording during migration and report them as unverified rather than asserting OpenAPI coverage.

## Generated content and links

Update navigation, homepage cards, cross-links, and AI documentation configuration. Regenerate `llms.txt` and `llms-full.txt` from their source configuration rather than treating generated output as the source of truth.

## Validation

- New canonical routes appear in navigation in the approved order.
- All four old routes redirect to the approved destinations.
- Internal links use canonical routes.
- Old slugs remain only where required as redirect sources.
- Old Custom Oracle product wording is removed; generic oracle-feed wording remains where technically accurate.
- Required compatibility identifiers are unchanged.
- Documentation and AI-index checks pass.
- A broken-link scan reports no broken internal routes.
- The working-tree diff contains only the planned documentation, navigation, redirect, and generated-index changes.
