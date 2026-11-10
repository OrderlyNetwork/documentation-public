# Binary Options Documentation Information Architecture

Date: 2026-10-15

Status: PM decisions confirmed (see "Decisions (PM, 2026-10-15)"). Where an item depends on an unconfirmed engineering answer (see "Open questions for engineering"), writers add a `TODO(eng)` comment and keep writing; they do not wait for confirmation and must not invent values.

## Goal

Add the BTC 5-minute Up/Down binary market (working name "Binary Options") to the public docs as a new product type.

- Traders get a short product explanation in the Introduction tab.
- Builders and market makers get an integration guide in the Build on Omnichain tab.
- REST changes go through `orderly.openapi.yaml`; WebSocket changes go into the hand-written `websocket-api` pages.
- Internal implementation details, unreleased parameter values, and pending legal material stay out of the public docs.

## Sources

| Source | Role |
| --- | --- |
| `binary-options/docs/product/binary-market-prd.html` | Single source of truth for product rules and the public API delta (§2.9 `#api`). |
| `binary-options/docs/product/binary-option-mm-integration.md` | Supporting source for market maker integration; it must not override the PRD. |
| `docs/plans/2026-07-27-perp-anything-docs-ia-design.md` | Structural precedent for this document. |

PRD anchors below refer to `binary-market-prd.html#<id>`. The PRD is marked DRAFT (last updated 2026-10-08) and fee values are being edited in parallel. Writers must re-read the cited PRD sections at writing time and must not copy numbers from this plan.

Fee values used in this plan (confirmed by PM for this plan):

- Default user fee (taker/maker): 300/0 bps; Builders can adjust it.
- Orderly base fee by tier (taker/maker bps):

| Tier | Taker/Maker (bps) |
| --- | --- |
| Public | 200/0 |
| Silver | 190/0 |
| Gold | 175/0 |
| Platinum | 150/0 |
| Diamond | 100/0 |

- Order freeze uses a Binary-specific buffer; its exact value is not final.

## Navigation

### Introduction tab

Add a nested `Binary options` group inside `Markets & trading`, directly after the `Perpetual futures basics` group and before `supported-markets`.

The group contains:

1. Overview
2. Rounds and Settlement
3. Trading Rules

### Build on Omnichain tab

Add a `Binary Options` group between `Perp Anything` and `Builders Marketplace`.

The group contains:

1. Introduction
2. Market Data
3. Order Management
4. Positions and Settlement

### Generated REST pages

New generated pages are added to existing API groups rather than to the `Binary Options` group, matching how other endpoints are organized.

| Endpoint | Proposed OpenAPI `summary` | Expected generated slug | docs.json group |
| --- | --- | --- | --- |
| `GET /v1/public/binary/info` | Get binary round info for all rounds | `restful-api/public/get-binary-round-info-for-all-rounds` | Market data API > Market info |
| `GET /v1/public/binary/info/{symbol}` | Get binary round info for one round | `restful-api/public/get-binary-round-info-for-one-round` | Market data API > Market info |
| `GET /v1/public/index_price` | Get index price history | `restful-api/public/get-index-price-history` | Market data API > Market info |

- Slugs are derived from `summary` by the Mintlify scraper (verified pattern: "Get market info for all symbols" produces `get-market-info-for-all-symbols`).
- The final slugs must be read from the regenerated `build-on-omnichain/restful-api/` after `npm run update`, not assumed.

The Builder guide pages should link to these generated pages instead of restating full request and response schemas.

## Canonical routes

| Page | Canonical route |
| --- | --- |
| Overview (user) | `/introduction/trade-on-orderly/binary-options/overview` |
| Rounds and Settlement (user) | `/introduction/trade-on-orderly/binary-options/rounds-and-settlement` |
| Trading Rules (user) | `/introduction/trade-on-orderly/binary-options/trading-rules` |
| Introduction (builder) | `/build-on-omnichain/binary-options/introduction` |
| Market Data | `/build-on-omnichain/binary-options/market-data` |
| Order Management | `/build-on-omnichain/binary-options/order-management` |
| Positions and Settlement | `/build-on-omnichain/binary-options/positions-and-settlement` |

Slugs use the public name and URL slug fixed by Decision 1 (`Binary Options`, `binary-options`).

## Redirects

None. All routes are new and no existing page is moved or renamed.

## Content responsibilities

Rule for all pages: one owner per topic. Other pages link to the owner instead of repeating the rule.

### Overview (user)

- Purpose: explain what a 5-minute Up/Down round is to a trader.
- Covers: buying a probability, \$1 payout per winning share, \$0 for losing shares (`#one-liner`).
- Covers: UP and DOWN as two sides of one trade, DOWN price as 1 minus the UP price (`#one-liner`, `#pricing`).
- Covers: displayed prices are executable prices, so the two sides add up to more than \$1 (`#pricing`).
- Covers: no leverage, no liquidation, no funding (`#nongoals`, `#trade-params` row 8).
- Covers: availability depends on the Builder, with a link to the Builder's terms (`#broker`).
- Does not cover: settlement price rules, order parameters, or fee formulas.

### Rounds and Settlement (user)

- Purpose: own the round timeline and how the result is decided.
- Covers: round states from open for trading to ended, including trading before the strike is recorded (`#lifecycle`).
- Covers: the order cutoff before expiry, judged by server receive time (`#lifecycle`, `#trade-rules` row 6).
- Covers: S0, S1, the half-open window `[t0, t1)`, and the three outcome branches: S1 above S0 is UP, S1 below S0 is DOWN, and S1 equal to S0 is a tie (`#settlement`, `#glossary`).
- Covers: settlement price 1 or 0, no settlement fee, funds return to the cross balance after settlement (`#settlement`, `#margin` row 3).
- Covers: result published versus funds credited are separate moments (`#lifecycle` step 3 and 4).
- Covers: if price data is delayed, the round stays in "settling" and no substitute result is created (`#settlement` missing-price row).
- Does not cover: the manual backfill procedure or review process (internal, see Public boundary).

### Trading Rules (user)

- Purpose: own what a trader can do inside a round.
- Covers: price range 0.01 to 0.99 in 0.01 steps, share size limits, 5 USDC minimum notional (`#trade-params`).
- Covers: the minimum notional is checked on the UP price, so buying DOWN has an uneven minimum (`#trade-params`).
- Covers: Limit and Market entry, where Market is an IOC order with a price protection limit (`#trade-rules` rows 1 and 2).
- Covers: exiting before expiry by an opposite trade at the current executable price (`#cashout`).
- Covers: isolated margin only, full collateral at order time plus a fee buffer (`#margin` rows 1 and 2).
- Links to: `trading-fees#binary-options-fees` for fees, Rounds and Settlement for expiry.
- Does not cover: the official UI layout, copy text, or design mockups in PRD §3 (these are for Builder frontends, not docs).

### Introduction (builder)

- Purpose: give Builders and market makers the integration model in one page.
- Covers: one permanent symbol per round, always taken from Binary info and never constructed by hand (`#api` common principles).
- Covers: one UP order book; BUY means UP, SELL means DOWN; positive position is UP, negative is DOWN (`#orderbook`, `#api-4`).
- Covers: what is new (two resources) versus reused (existing order, position, and WS APIs) (`#api` summary table).
- Covers: the Builder product switch is off by default and must be enabled explicitly; it is a Builder frontend display setting, with no corresponding platform API (`#broker`).
- Covers: current network availability (mainnet only, per Decision 2).
- Covers: a reading path to the other pages in the group.

### Market Data

- Purpose: own round discovery and market data.
- Covers: Binary info list and detail, snapshot size and refresh, status values, null fields before the result, `result_committed_at` as the only "result published" signal (`#api-1`).
- Covers: the frontend phase table (early trading, observing, waiting for result, result published, personal settlement complete) (`#api-1`).
- Covers: result polling cadence after expiry (`#api-6` "result polling").
- Covers: `/v1/public/info` no longer returns Binary symbols (`#api-1`).
- Covers: order book DOWN fields in REST and WS (`#api-2`, `#api-6`).
- Covers: underlying kline and index via `PERP_BTC_USDC` and `SPOT_BTC_USDC@indexprice`; Binary's own index is not pushed on public WS (`#api-2`, `#api-6`).
- Covers: index price range query limits (`#api-1` "index price time range").
- Covers: zero funding responses are kept for compatibility (`#api-2`).
- Covers: multi-round quotes through `bbos`, with DOWN computed client-side (`#api-1` "home page quotes").
- Covers: `index_price` is not the BBO midpoint (`#api-2`).
- Covers: Index price, Mark price, and trade price are never S0 or S1 (`#api-2`).
- Covers: `GET /v1/tv/history` returns `no_data` for Binary symbols (`#api-2`).
- Covers: `history_charts`, `price_changes` (REST), and the WS `price-changes` topic do not list Binary symbols (`#api-2`).

### Order Management

- Purpose: own order placement, editing, and cancellation for Binary symbols.
- Covers: DOWN conversion done by the client (buy DOWN at p equals SELL UP at 1 minus p) (`#orderbook`, `#api-3`).
- Covers: accepted order types (LIMIT, IOC with protection price, POST_ONLY) and rejected ones (`#trade-rules` row 1, `#api-3`).
- Covers: `margin_mode` must be sent as `ISOLATED` (`#api-3`).
- Covers: price and quantity validation without rounding, minimum notional on UP price for both sides (`#api-3`).
- Covers: amount-to-shares rounding and splitting orders above `base_max` as Builder frontend responsibilities (`#trade-rules` rows 3, 4).
- Covers: the MAX button amount already includes the SDK-provided fee buffer `b`; Builders read `b` from the Orderly SDK constant and never hard-code or publish its value (`#trade-rules` row 9, Decision 8).
- Covers: the cutoff rule and `ROUND_CLOSED`, never auto-resubmitting to the next round (`#api-3` t1 rule).
- Covers: cancel-all skipping expired rounds (`#api-3` "cancel all").
- Covers: `product_type` filter on `GET /v1/orders` (`#api-3`).
- Covers: leverage changes and margin transfers are rejected for Binary (`#api-4` "leverage and margin transfer").
- Covers: the market-close `reduce_only` flag; algo orders (`POST /v1/algo/order`) are rejected for Binary symbols, also stated in that endpoint's YAML `description` (`#api-3`).
- Covers: `post_only_adjust` is only valid together with `POST_ONLY` (`#api-3`).
- Covers: exiting a position before expiry always sends `reduce_only=true` (`#cashout`).

### Positions and Settlement

- Purpose: own positions, fees in API terms, and settlement records.
- Covers: signed `position_qty`, isolated margin fields, `product_type` filters on trades, positions, and position history (`#api-4`).
- Covers: new `position_history` fields `outcome`, `settlement_price_per_share`, `settled_at`, and why `settled_at` is the personal completion signal (`#api-4`).
- Covers: expiry fills at price 0 or 1, with valid zero amounts in execution reports (`#api-6` executionreport).
- Covers: fee calculation per fill from `binary_maker_fee_rate` and `binary_taker_fee_rate`, rounding up per fill, no averaging (`#api-5`, `#api-4` trades).
- Covers: missing or invalid fee fields must not be treated as zero fee (`#api-5`, `#api-6` account).
- Covers: order freeze formula by side, plus a Binary-specific buffer (`#margin` row 2).
- Links to: `trading-fees#binary-options-fees` for the fee formula and base fee tiers.

## Existing page changes

| File | Change | Owner package |
| --- | --- | --- |
| `docs.json` | Add the two nav groups, add generated REST pages to Market info. | WP6 |
| `home.mdx` | Add a "Binary Options" card to the "Expand your market offering" CardGroup. | WP6 |
| `introduction/trade-on-orderly/trade-on-orderly.mdx` | Mention Binary Options in "What can you trade?" with a link to the user Overview. | WP6 |
| `introduction/trade-on-orderly/supported-markets.mdx` | Add a `## Binary Options` section after `## RWA` with one row: BTC 5-minute Up/Down, underlying index `PERP_BTC_USDC`, payout 1 USDC per share, settled in USDC. Do not document the symbol naming format; link to Binary info. | WP6 |
| `introduction/trade-on-orderly/trading-basics/trading-fees.mdx` | Add a `## Binary options fees` section (PRD `#rake`, `#api-5`): formula, effective rate curve, worked examples, Orderly base split, maker base 0, no settlement fee. Cover Decision 4 in full: floor 0 bps with no negative rebates; taker fee has an upper cap that is never published; default user fee 300/0 bps; Binary taker base fee per tier (Public 200, Silver 190, Gold 175, Platinum 150, Diamond 100 bps, maker base 0); if the user fee cannot cover the tier base fee, Orderly keeps the whole fee and the Builder gets 0; Binary volume counts toward Builder 30-day volume tiers together with PERP. Add one row "Binary taker base coefficient" to each tier Tab, with a note that this number is the coefficient in the `p x (1 - p)` formula, not a flat bps rate, so it must not be read next to the PERP 3.00 bps row as directly comparable. Update the sentence "same Orderly base fees regardless of crypto or RWA" to say Binary uses its own base schedule. Heading level for the Binary section (`##` vs `###`) is left to the writer to match the page's existing structure; note the choice in the PR description. | WP2 |
| `build-on-omnichain/user-flows/custom-fees.mdx` | Add a Binary section: Builders set Binary maker and taker rates through the existing default and per-user mechanism. If the Builder's effective user fee cannot cover the tier base fee, Orderly keeps the whole fee and the Builder gets 0 (Decision 4). API field names follow the engineering PRD section 7.1 (Decision 4; see also Open questions for engineering #4). | WP2 |
| `introduction/trade-on-orderly/trading-basics/glossary.mdx` | Add round, strike (S0), expiry price (S1), outcome, settlement price, UP, DOWN, share. | WP1 |
| `introduction/faqs.mdx` | Add one Accordion "What are binary options on Orderly?" linking to the user Overview; add one line to "How are trading fees calculated/charged?" linking to the Binary fee section. | WP6 |
| `build-on-omnichain/integration-faqs.mdx` | Add one entry pointing to the builder Introduction. | WP6 |
| `build-on-omnichain/user-flows/isolated-margin.mdx` | Add a Note: Binary symbols are isolated only, leverage and margin adjustment are rejected, link to Order Management. | WP3 |
| `build-on-omnichain/error-codes.mdx` | Add `ROUND_CLOSED`, `BINARY_ORDER_TYPE_NOT_SUPPORTED`, `BINARY_MARGIN_MODE_NOT_SUPPORTED` now, each with a `{/* TODO(eng): ... */}` comment next to the unconfirmed numeric code and HTTP status (Engineering question 1); do not block on confirmation. | WP4 |
| `llms.config.json` | Add to `canonicalPages`: user Overview, builder Introduction, Market Data, Order Management, Positions and Settlement. Also add a `Binary Options` entry to `compactSections`, matching the `Perp Anything` precedent; `generate-llms.ts:118` only reads `compactSections`, not `canonicalPages`, when building the compact llms.txt output. | WP6 |
| `llms.txt`, `llms-full.txt` | Regenerate with `npm run update:llms`; never hand-edit. | WP6 |

Not changed: `order-types.mdx`, `perpetual-futures/*`, `custom-fees` tier logic, `get-builder-fee-tier-information` (PRD §2.9 does not change it; see Decision 4).

## API reference changes

### orderly.openapi.yaml (REST)

`build-on-omnichain/restful-api/` is regenerated from this file by `npm run update`. CI (`allowed-file-changes.yml`) fails if generated pages are edited by hand.

New paths:

| Path | What to add | PRD |
| --- | --- | --- |
| `GET /v1/public/binary/info` | Public, no query params. `data.rows` with `symbol`, `product_type`, `status` (ACTIVE, DELISTING, RECYCLING, DELISTED), `activated_at`, `observation_start_at`, `expire_at`, `index_price_symbol`, `quote_min/max/tick`, `base_min/max/tick`, `min_notional`, `fee_model`, `s0`, `s1`, `outcome`, `settlement_price_per_share`, `result_committed_at`, `rule_version`, and the funding and IMF parameter fields. Nullable fields marked `nullable: true`. Description covers 300-round snapshot, per-minute refresh, no pagination. | `#api-1` |
| `GET /v1/public/binary/info/{symbol}` | Same fields plus `price_evidence` (object or null) and `manual_correction` (always null). `RESOURCE_NOT_FOUND` when the round is outside the snapshot. | `#api-1` |
| `GET /v1/public/index_price` | Public; `symbol`, `start_t`, `end_t`, optional `limit` (default and max 1000). Rate limit 10 per second per IP; last 24 hours; window 1 second to 10 minutes; 1-second granularity; no pagination. | `#api-1` |

Changed paths:

| Path | What to change | PRD |
| --- | --- | --- |
| `GET /v1/public/info`, `GET /v1/public/info/{symbol}` | Description: Binary symbols are not returned. Behavior of `info/{symbol}` with a Binary symbol is not stated in the PRD (Engineering question 2). | `#api-1` |
| `GET /v1/orderbook/{symbol}` | Add optional `down_asks` and `down_bids` arrays, present only for Binary symbols. | `#api-2` |
| `POST /v1/order`, `POST /v1/batch-order`, `PUT /v1/order` | Description: Binary validation (ISOLATED required, LIMIT, IOC with price, POST_ONLY only, price range without rounding, minimum notional on UP price, cutoff). No new request fields. | `#api-3` |
| `DELETE /v1/order`, `DELETE /v1/client/order`, `DELETE /v1/batch-order`, `DELETE /v1/client/batch-order`, `DELETE /v1/orders` | Description: `ROUND_CLOSED` after cutoff; cancel-all without symbol skips expired rounds. | `#api-3` |
| `GET /v1/orders`, `GET /v1/trades`, `GET /v1/positions`, `GET /v1/position_history` | Add optional query `product_type`, enum `PERP`, `BINARY`, uppercase only. | `#api-3`, `#api-4` |
| `GET /v1/position_history` | Add nullable `outcome`, `settlement_price_per_share`, `settled_at` to the row schema. | `#api-4` |
| `GET /v1/trades` | Description: Binary `fee` formula and per-fill rounding. | `#api-4` |
| `GET /v1/client/info` (`ClientInfoResponse`) | Add `binary_maker_fee_rate` and `binary_taker_fee_rate` (bps). | `#api-5` |
| `POST /v1/client/leverages` (generated page `update-leverage-setting`) | Description: setting leverage for a Binary symbol is rejected, including 1x; batch updates skip Binary symbols. `/v1/client/leverage` is GET only in the current YAML. | `#api-4` |
| `POST /v1/position_margin` | Description: rejected for Binary with `INVALID_PARAMS`. | `#api-4` |
| `GET /v1/public/futures/{symbol}`, `GET /v1/public/funding_rates`, `GET /v1/public/funding_rate/{symbol}`, `GET /v1/public/funding_rate_history` | Optional description note: Binary symbols return zero funding. No schema change. | `#api-2` |
| `GET /v1/kline` | Optional description note: a Binary symbol returns empty rows; use `PERP_BTC_USDC`. | `#api-2` |
| `GET /v1/tv/history` | Description: a Binary symbol returns `no_data`. | `#api-2` |
| `GET /v1/history_charts`, `GET /v1/price_changes` | Description: Binary symbols are not listed. No schema change. | `#api-2` |
| `POST /v1/algo/order` | Description: algo orders are rejected for Binary symbols. | `#api-3` |
| `POST /v1/broker/fee_rate/set`, `POST /v1/broker/fee_rate/set_default`, `/v1/broker/fee_rate/default` | Add Binary maker/taker fee fields; exact field names not final, follow the engineering PRD section 7.1 when confirmed (Decision 4, Engineering question 4). Owner: WP4. | `#api-5`, Decision 4 |

Unchanged per PRD: `GET /v1/position/{symbol}`, `GET /v1/account_info`, `GET /v1/client/holding`, `GET /v1/ip_info`, `GET /v1/public/market_trades`, and all admin endpoints (filters are not extended to admin). `/v1/orderly_one/broker` and `/v1/operation/broker` are internal Operation Dashboard endpoints, not present in the public `orderly.openapi.yaml`, and are not changed by this plan.

Not specified by the PRD (see Decision 4: follow the engineering PRD section 7.1 for which of these carry Binary fields): whether `UserFeeRatesResponse`, `GetDefaultBrokerFeesResponse`, `GetBrokerInfoResponse`, and `base_binary_*` fields follow the same pattern as the `POST /v1/broker/fee_rate/*` paths above. The RWA precedent added `rwa_*` fields to all of these, and the PRD says Builders adjust Binary rates "the same as RWA".

### websocket-api (hand-written)

| Page | Change | PRD |
| --- | --- | --- |
| `websocket-api/public/orderbook.mdx` | Add `down_asks`, `down_bids` for Binary symbols. | `#api-6` |
| `websocket-api/public/order-book-update.mdx` | Same as orderbook. | `#api-6` |
| `websocket-api/public/bbo.mdx` | Add `down_bid`, `down_ask` for Binary symbols. | `#api-6` |
| `websocket-api/public/bbos.mdx` | Note: no DOWN fields; clients compute 1 minus price. | `#api-1` |
| `websocket-api/public/trade.mdx` | Note: Binary trades use UP book semantics. | `#api-6` |
| `websocket-api/public/index-price.mdx` | Note: Binary round index is not pushed; use `SPOT_BTC_USDC@indexprice` for the underlying. | `#api-6` |
| `websocket-api/public/index-prices.mdx` | Note: Binary rows are excluded. | `#api-6` |
| `websocket-api/public/mark-price.mdx` | Note: Binary mark equals the round index during trading and ends at 0 or 1. | `#api-6` |
| `websocket-api/public/price-changes.mdx` | Note: Binary symbols are not listed. | `#api-2` |
| `websocket-api/private/account.mdx` | Add `binaryMakerFeeRate`, `binaryTakerFeeRate` to `accountDetail`; omission means unknown, not zero. | `#api-6` |
| `websocket-api/private/position-push.mdx` | Note: positive `position_qty` is UP, negative is DOWN; always ISOLATED. | `#api-6` |
| `websocket-api/private/execution-report.mdx` | Note: expiry fills can have price 0 or 1 and zero amount. | `#api-6` |
| `websocket-api/public/request-orderbook.mdx` | Add a `{/* TODO(eng): whether the request snapshot includes DOWN fields */}` comment; do not state DOWN fields until confirmed (Engineering question 3). | `#api-6` |

Not changed: `balance.mdx`.

## Compatibility boundaries

- Do not invent endpoints; the only new REST resources are Binary info and index price range.
- Preserve exact identifiers: `product_type`, `BINARY`, `PERP`, `BINARY_PROBABILITY`, `binary-v1`, `down_asks`, `down_bids`, `down_bid`, `down_ask`, `binary_maker_fee_rate`, `binaryMakerFeeRate`, and the error names.
- Keep the UP book semantics wording: `side`, `price`, and `executed_price` are always UP.
- Never document a symbol naming pattern; examples must say the symbol comes from Binary info.
- All examples and WS topic names use the placeholder `<binary_symbol>`; never print `BTC5M` or any other concrete Binary symbol string.
- Do not state that the existing PERP fee tier numbers apply to Binary.

## Public boundary

Content in the PRD that must not appear in public docs:

| PRD content | Location | Reason |
| --- | --- | --- |
| Engineering notes: Apollo keys, DB tables and columns, SQL, service names, `SymbolParser`, i18n keys, TASK numbers, tech design references | `#api-1` to `#api-5` "engineering notes" blocks, `#margin` row 4 | Backend implementation. |
| Accepted route risks (shared margin formula and jobs, rounding dust) | `#margin` row 5 | Internal risk acceptance. |
| Control Plane, listing and engine readiness internals, maintenance window length | `#lifecycle` | Internal operations. |
| Rolling buffer size N and the "about 50 minutes" early trading window | `#lifecycle` | PRD says the lead time is approximate and not an external commitment. |
| Manual price backfill with two-person review, internal audit log contents | `#lifecycle`, `#settlement`, `#mvp` | Internal operations; public text only says the round stays in settling. |
| Exact order cutoff buffer value "5 seconds" / "5000 ms" | `#glossary`, `#lifecycle`, `#trade-rules` row 6, `#api-3` | Not public; say only that new orders stop shortly before expiry (Decision 5). |
| Exact freeze buffer value. Note: the PERP internal buffer name `isoOrderFrozenBuffer` is a separate, existing PERP constant; the Binary fee buffer `b` does not reuse it and must not be described as the same buffer. | `#margin` row 2 | Value not final; publish only that the freeze includes a fee buffer and that Builders use the SDK-provided `b` (Decision 6, Decision 8). |
| Taker fee upper cap values: "not lower than 300 bps", "cap illustrated as 300 bps" | `#rake`, `#margin` row 2 | Cap value not public (Decision 4). |
| Restricted country list and its evidence levels | `#geo-list` | Not public (Decision 3). |
| "Backend does not enforce region gating; direct Order API calls are not blocked" | `#geo-blocked` last bullet | Known risk statement; not public (Decision 3). |
| Region restrictions and country list: not public (Decision 3) | `#geo-blocked`, `#geo-list`, `#api-5` | Region Restrictions page and `GET /v1/product_restricted_areas` removed from public docs. |
| Market maker rebate mention | `#api-4` trades | Commercial terms not in scope. |
| UI design references (competitor reference, prototype branch, mockups, copy strings) | `#ux` | Official UI material, not protocol docs. |
| Acceptance tests and verification methods | `#mvp`, `#api-7` | Internal QA. |
| Testnet setup and known limitations, inconsistent error formats (entire MM guide §0 and §9) | MM guide §0, §9 | Not public; mainnet only, no testnet label or URLs (Decision 2). Never cite any MM guide testnet section. |

Items that are public and were confirmed by PM are listed below.

## Decisions (PM, 2026-10-15)

1. Public name is "Binary Options"; URL slug `binary-options`.
2. Publish with mainnet launch. Write for mainnet launch rules; no Testnet label, no testnet URLs.
3. Region restrictions are not documented publicly at all: drop the Region Restrictions page and do not document `GET /v1/product_restricted_areas` or any country list.
4. Fees:
   - Default user fee is taker 300 bps and maker 0 bps; Builders can adjust it.
   - Binary maker and taker fees have a floor of 0; negative fees (rebates) are not allowed.
   - Binary taker fees have an upper cap; values above the cap are rejected. Do not publish the cap value.
   - Publish the Binary taker base fee per tier: Public 200, Silver 190, Gold 175, Platinum 150, Diamond 100 bps; maker base 0.
   - Base fee follows the same p x (1 - p) curve; if the user fee cannot cover the base fee, Orderly takes the whole fee and the Builder gets 0.
   - Binary volume counts toward Builder 30-day volume tiers together with PERP.
   - Builder fee APIs: follow engineering question 4 (see "Open questions for engineering" below) for which existing fee APIs carry Binary maker/taker fields.
5. Do not publish the order cutoff seconds; say only that new orders stop shortly before expiry.
6. Freeze buffer: publish only that the order freeze includes a fee buffer; do not publish its value.
7. No public Testnet Guide page.
8. The fee buffer `b` used for the MAX button and the required-freeze display is provided to Builders as a constant in the Orderly SDK. Public docs say MAX and required freeze already include a fee buffer and that Builders should use the SDK-provided value; never print the value.
9. Binary maker and taker fee rates share the same upper cap; do not publish the cap value.
10. Binary trading volume counts toward the Builder's 30-day volume tier threshold as shares filled x price (notional), together with perpetual futures volume.

## Open questions for engineering

Write these as `{/* TODO(eng): ... */}` MDX comments in MDX pages, or as `# TODO(eng): ...` YAML comments in `orderly.openapi.yaml`, and keep going. Never put the TODO text inside a `description` field. Do not invent values.

1. Numeric error code and HTTP status for `ROUND_CLOSED`, `BINARY_ORDER_TYPE_NOT_SUPPORTED`, and `BINARY_MARGIN_MODE_NOT_SUPPORTED`.
2. Response of `GET /v1/public/info/{symbol}` for a Binary symbol.
3. Whether the WS orderbook request snapshot includes DOWN fields.
4. Binary maker/taker field names on `POST /v1/broker/fee_rate/set`, `/v1/broker/fee_rate/set_default`, `/v1/broker/fee_rate/default`, and whether `UserFeeRatesResponse`, `GetDefaultBrokerFeesResponse`, `GetBrokerInfoResponse`, and `base_binary_*` fields follow the same pattern.

## Generated content and links

- Run `npm run update` only after editing `orderly.openapi.yaml`; commit the regenerated `build-on-omnichain/restful-api/` together with the YAML.
- `npm run update` requires network access: it runs `git clone` of the `js-sdk` repo and uses `pnpm`; run it where both are available.
- `npm run update` also regenerates `sdks/tech-doc/` from the js-sdk repo; discard unrelated `sdks/tech-doc/` changes.
- Run `npm run update:llms` after `llms.config.json` and all pages are final.
- Internal links use canonical routes only.
- CI compares the generated REST pages against the paths listed in `.github/workflows/allowed-file-changes.yml`; keep generated output limited to those paths.

## Validation

Run from the repo root. All commands exist in `package.json`, CI workflows, or the repo root scripts.

| Check | Command | Source |
| --- | --- | --- |
| Generated REST pages match OpenAPI | `npm run update` then `git diff --exit-code -- build-on-omnichain/restful-api` | `.github/workflows/allowed-file-changes.yml` |
| AI index and canonical page frontmatter | `npm run check:ai-docs` | `.github/workflows/docs-check.yml` |
| Broken internal links | `npx mintlify@4.2.257 broken-links` | `.github/workflows/broken-links.yml` |
| MDX compiles | `npx tsx check-mdx-compilation.ts` | Local script, not in CI |
| Link scan (secondary) | `npx tsx check-links.ts` | Local script, not in CI |
| Markdown lint | `npm run lint` | `package.json` |
| Formatting | `npm run format:check` | `package.json` |
| Visual check | `npm run dev`, open every new page and the changed fee and market pages | `package.json` |

Content checks:

- New routes appear in navigation in the approved order.
- Every number in a page matches the PRD at writing time; no number in the Public boundary table appears.
- No page documents the symbol naming format.
- Each topic has one owner page; other pages link to it.
- `git status` shows only the files assigned to the work packages.

## Work packages

Packages WP1, WP2, WP4, and WP5 can run in parallel because they touch disjoint files. WP3 also starts in parallel but must wait for WP4's slug list file before it writes any REST-reference links. WP6 runs last because it needs final routes and generated slugs.

| Package | Files | Depends on |
| --- | --- | --- |
| WP1 User pages | `introduction/trade-on-orderly/binary-options/overview.mdx`, `rounds-and-settlement.mdx`, `trading-rules.mdx`, `introduction/trade-on-orderly/trading-basics/glossary.mdx` | Decisions 1, 5, 6 |
| WP2 Fees | `introduction/trade-on-orderly/trading-basics/trading-fees.mdx`, `build-on-omnichain/user-flows/custom-fees.mdx` | Decision 4 |
| WP3 Builder guides | `build-on-omnichain/binary-options/introduction.mdx`, `market-data.mdx`, `order-management.mdx`, `positions-and-settlement.mdx`, `build-on-omnichain/user-flows/isolated-margin.mdx` | Decisions 1, 2, 3, 7; final slugs from WP4's slug list file |
| WP4 REST reference | `orderly.openapi.yaml`, regenerated `build-on-omnichain/restful-api/**`, `build-on-omnichain/error-codes.mdx`; also produces a plain slug list file (e.g. `build-on-omnichain/restful-api/_binary-slugs.md`) with the final generated slugs, for WP3 and WP6 to read | Engineering questions 1, 2 |
| WP5 WebSocket reference | The 12 `build-on-omnichain/websocket-api/**` pages listed above (including `request-orderbook.mdx`) | Engineering question 3 for `request-orderbook.mdx` only |
| WP6 Integration | `docs.json`, `home.mdx`, `trade-on-orderly.mdx`, `supported-markets.mdx`, `introduction/faqs.mdx`, `build-on-omnichain/integration-faqs.mdx`, `llms.config.json`, regenerated `llms.txt` and `llms-full.txt`; runs the full Validation table | WP1 to WP5 |

Writer rules for every package:

- Use only the PRD sections cited for that page; if a rule is missing, stop and report it instead of filling the gap.
- Link to the generated REST pages by their final slug. WP3 reads the final slugs from WP4's slug list file once WP4 completes and writes the real slugs directly; it never uses placeholder links. WP6 does not edit WP3's builder-guide pages.
- Frontmatter must include `title` and `description`.
- Escape dollar signs as `\$` for LaTeX compatibility.
