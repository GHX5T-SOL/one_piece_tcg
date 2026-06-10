from __future__ import annotations

import csv
import datetime as dt
import json
import os
import re
import shutil
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
TODAY = dt.date.today().isoformat()

MASTER_COLUMNS = [
    "item_id",
    "source_row_id",
    "ownership_status",
    "inventory_status",
    "card_name",
    "card_number",
    "set_code",
    "set_name",
    "product_name",
    "rarity",
    "variant",
    "finish",
    "language",
    "condition",
    "grade_company",
    "grade",
    "cert_number",
    "quantity",
    "sealed_or_single",
    "raw_or_slab",
    "cost_basis_zar",
    "cost_status",
    "collectr_market_zar",
    "research_market_usd",
    "research_market_zar",
    "quick_sale_zar",
    "fair_market_zar",
    "patient_local_ask_zar",
    "event_ask_zar",
    "online_ask_usd",
    "online_ask_zar",
    "stretch_ask_zar",
    "walkaway_minimum_zar",
    "expected_net_local_zar",
    "expected_net_ebay_zar",
    "expected_net_cardtrader_zar",
    "expected_net_cardmarket_zar",
    "expected_net_tcgplayer_zar",
    "grading_candidate_score",
    "psa10_estimate_usd",
    "bgs10_estimate_usd",
    "cgc10_estimate_usd",
    "availability_score",
    "liquidity_score",
    "trend_score",
    "confidence_rating",
    "last_researched_at",
    "source_links",
    "notes",
]


def write_text(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def write_csv(rel: str, headers: list[str], rows: list[dict[str, str]] | None = None) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        for row in rows or []:
            writer.writerow({header: row.get(header, "") for header in headers})


def find_export_csv() -> Path | None:
    candidates = [ROOT / "export.csv", ROOT.parent / "export.csv"]
    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def normalize_header(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


def normalize_inventory(export_path: Path | None) -> tuple[list[dict[str, str]], dict[str, str]]:
    if not export_path:
        return [], {
            "status": "missing",
            "note": "No export.csv was found in the cloned repo or parent TCG workspace during bootstrap.",
        }

    raw_target = ROOT / "inventory" / "raw" / "export.csv"
    raw_target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(export_path, raw_target)

    with export_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        raw_rows = list(reader)
        raw_headers = reader.fieldnames or []

    rows: list[dict[str, str]] = []
    qty_total = 0
    zero_cost = 0
    recorded_cost = 0
    market_total = 0.0
    cost_total = 0.0

    for idx, raw in enumerate(raw_rows, start=1):
        normalized = {normalize_header(k): (v or "").strip() for k, v in raw.items()}
        quantity = normalized.get("quantity") or normalized.get("qty") or "1"
        try:
            qty_int = int(float(quantity))
        except ValueError:
            qty_int = 1
        qty_total += qty_int

        cost_value = normalized.get("my_buy_price") or normalized.get("cost") or normalized.get("cost_basis") or ""
        try:
            cost_float = float(re.sub(r"[^0-9.\\-]", "", cost_value)) if cost_value else 0.0
        except ValueError:
            cost_float = 0.0
        if cost_float == 0:
            zero_cost += 1
            cost_status = "unknown_or_box_pull"
        else:
            recorded_cost += 1
            cost_status = "recorded"
        cost_total += cost_float * qty_int

        market_value = normalized.get("market_value") or normalized.get("collectr_market") or normalized.get("total_market_value") or ""
        try:
            market_float = float(re.sub(r"[^0-9.\\-]", "", market_value)) if market_value else 0.0
        except ValueError:
            market_float = 0.0
        market_total += market_float * qty_int

        card_number = normalized.get("card_number_serial") or normalized.get("card_number") or normalized.get("number") or ""
        card_name = normalized.get("card_name") or normalized.get("name") or normalized.get("product_name") or ""
        product_name = normalized.get("product_name") or card_name
        status = normalized.get("status") or "owned"
        condition = normalized.get("condition") or "pending_inspection"
        grade = normalized.get("grade") or ""
        grade_company = normalized.get("grade_company") or normalized.get("grading_company") or ""
        sealed_or_single = "sealed" if any(word in product_name.lower() for word in ["box", "deck", "pack", "collection", "set"]) else "single"
        raw_or_slab = "slab" if grade or grade_company else ("sealed" if sealed_or_single == "sealed" else "raw")

        row = {column: "" for column in MASTER_COLUMNS}
        row.update(
            {
                "item_id": f"op-cpt-{idx:05d}",
                "source_row_id": str(idx),
                "ownership_status": "in_hand",
                "inventory_status": "owned" if not status else status,
                "card_name": card_name,
                "card_number": card_number,
                "set_code": normalized.get("set_code") or "",
                "set_name": normalized.get("set") or normalized.get("set_name") or "",
                "product_name": product_name,
                "rarity": normalized.get("rarity") or "",
                "variant": normalized.get("variant") or normalized.get("alt_art") or "",
                "finish": normalized.get("finish") or "",
                "language": normalized.get("language") or "",
                "condition": condition,
                "grade_company": grade_company,
                "grade": grade,
                "cert_number": normalized.get("cert_number") or "",
                "quantity": str(qty_int),
                "sealed_or_single": sealed_or_single,
                "raw_or_slab": raw_or_slab,
                "cost_basis_zar": f"{cost_float:.2f}" if cost_float else "",
                "cost_status": cost_status,
                "collectr_market_zar": f"{market_float:.2f}" if market_float else "",
                "confidence_rating": "pending_research",
                "last_researched_at": "",
                "source_links": "",
                "notes": "Imported from export.csv; researched prices pending.",
            }
        )
        rows.append(row)

    return rows, {
        "status": "imported",
        "source_path": str(export_path),
        "raw_headers": ", ".join(raw_headers),
        "total_rows": str(len(raw_rows)),
        "total_quantity": str(qty_total),
        "zero_cost_rows": str(zero_cost),
        "recorded_cost_rows": str(recorded_cost),
        "collectr_market_zar_baseline": f"{market_total:.2f}",
        "recorded_cost_basis_zar": f"{cost_total:.2f}",
    }


def write_minimal_xlsx(rel: str, sheets: dict[str, tuple[list[str], list[dict[str, str]]]]) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)

    def col_name(index: int) -> str:
        name = ""
        while index:
            index, rem = divmod(index - 1, 26)
            name = chr(65 + rem) + name
        return name

    def sheet_xml(headers: list[str], rows: list[dict[str, str]]) -> str:
        all_rows = [dict(zip(headers, headers))] + rows
        xml_rows = []
        for r_idx, row in enumerate(all_rows, start=1):
            cells = []
            for c_idx, header in enumerate(headers, start=1):
                value = row.get(header, "")
                ref = f"{col_name(c_idx)}{r_idx}"
                cells.append(f'<c r="{ref}" t="inlineStr"><is><t>{escape(str(value))}</t></is></c>')
            xml_rows.append(f'<row r="{r_idx}">{"".join(cells)}</row>')
        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            f'<sheetData>{"".join(xml_rows)}</sheetData></worksheet>'
        )

    sheet_items = list(sheets.items())
    workbook_sheets = "".join(
        f'<sheet name="{escape(name[:31])}" sheetId="{idx}" r:id="rId{idx}"/>'
        for idx, (name, _) in enumerate(sheet_items, start=1)
    )
    workbook_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheets>{workbook_sheets}</sheets></workbook>"
    )
    rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        "</Relationships>"
    )
    workbook_rels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>']
    workbook_rels.append('<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">')
    for idx in range(1, len(sheet_items) + 1):
        workbook_rels.append(
            f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{idx}.xml"/>'
        )
    workbook_rels.append("</Relationships>")
    content_types = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>']
    content_types.append('<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">')
    content_types.append('<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>')
    content_types.append('<Default Extension="xml" ContentType="application/xml"/>')
    content_types.append('<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>')
    for idx in range(1, len(sheet_items) + 1):
        content_types.append(
            f'<Override PartName="/xl/worksheets/sheet{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        )
    content_types.append("</Types>")

    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", "".join(content_types))
        zf.writestr("_rels/.rels", rels_xml)
        zf.writestr("xl/workbook.xml", workbook_xml)
        zf.writestr("xl/_rels/workbook.xml.rels", "".join(workbook_rels))
        for idx, (_, (headers, rows)) in enumerate(sheet_items, start=1):
            zf.writestr(f"xl/worksheets/sheet{idx}.xml", sheet_xml(headers, rows))


def main() -> None:
    dirs = [
        "market_research",
        "pricing",
        "inventory/raw",
        "website",
        "content",
        "memory",
        "scripts",
    ]
    for directory in dirs:
        (ROOT / directory).mkdir(parents=True, exist_ok=True)
    (ROOT / "inventory" / "raw" / ".gitkeep").write_text("", encoding="utf-8")

    export_path = find_export_csv()
    inventory_rows, inventory_stats = normalize_inventory(export_path)
    write_csv("inventory/master_inventory.csv", MASTER_COLUMNS, inventory_rows)
    write_minimal_xlsx("inventory/master_inventory.xlsx", {"master_inventory": (MASTER_COLUMNS, inventory_rows)})

    pricing_log_headers = [
        "researched_at",
        "item_id",
        "card_name",
        "card_number",
        "platform",
        "source_url",
        "currency",
        "price",
        "condition",
        "language",
        "variant",
        "signal_type",
        "included_in_comp_stack",
        "exclusion_reason",
        "notes",
    ]
    write_csv("inventory/pricing_research_log.csv", pricing_log_headers)
    write_csv("inventory/sales_log.csv", ["sold_at", "item_id", "buyer_channel", "gross_zar", "fees_zar", "net_zar", "payment_status", "delivery_status", "notes"])
    write_csv("inventory/purchase_log.csv", ["purchased_at", "item_id", "source", "gross_cost_zar", "shipping_zar", "fees_zar", "landed_cost_zar", "status", "notes"])
    write_csv("inventory/consignment_intake.csv", ["intake_at", "consignment_id", "owner_alias", "item_description", "card_number", "agreed_split", "researched_market_zar", "consignment_base_zar", "status", "private_notes"])
    write_csv("inventory/watchlist.csv", ["created_at", "target", "card_number", "language", "variant", "target_buy_zar", "max_bid_zar", "priority", "reason", "source_links"])

    source_rows = [
        ("Official One Piece Card Game", "https://en.onepiece-cardgame.com/", "official", "Identity, rules, products, card text", "May not expose marketplace values", "5"),
        ("Official products", "https://en.onepiece-cardgame.com/products/", "official", "English product cadence and sealed product identity", "Dynamic pages require recheck", "5"),
        ("Official card list", "https://en.onepiece-cardgame.com/cardlist/", "official", "Exact card identity, set code, rarity, text", "Search filters must match language/version", "5"),
        ("Official restrictions", "https://en.onepiece-cardgame.com/rules/restriction/", "official", "Ban/restriction status", "Meta implications need separate tournament data", "5"),
        ("Limitless One Piece", "https://onepiece.limitlesstcg.com/", "competitive", "Tournament results, decklists, leader prevalence", "Competitive data does not equal collector demand", "4"),
        ("OnePiece.gg", "https://onepiece.gg/", "competitive/content", "Meta summaries, deck guides, news", "Editorial and may lag official updates", "3"),
        ("Egman Events", "https://egmanevents.com/", "competitive", "Event archives and tournament signal", "Coverage varies by region/event", "3"),
        ("TCGplayer", "https://www.tcgplayer.com/", "market", "US retail market, listing depth, sales velocity", "Access and sales history can be limited; verify variants", "4"),
        ("CardTrader", "https://www.cardtrader.com/", "market", "International availability and cross-border listing floors", "Fees/shipping change true landed cost", "4"),
        ("Cardmarket", "https://www.cardmarket.com/en/OnePiece", "market", "EU floor and availability", "Access may be blocked; EU market not equal Cape Town", "4"),
        ("PriceCharting", "https://www.pricecharting.com/", "market", "Historical raw/graded sale snapshots", "SKU matching can be wrong", "3"),
        ("eBay", "https://www.ebay.com/", "market", "Active and sold listings, rare-card scarcity", "Scams, title stuffing, best-offer opacity", "4"),
        ("PSA", "https://www.psacard.com/", "grading", "PSA population and APR checks", "Cloudflare/access limits; pop changes over time", "4"),
        ("BGS", "https://www.beckett.com/grading", "grading", "BGS grading and population context", "Black Label pop checks need exact card", "4"),
        ("CGC Cards", "https://www.cgccards.com/", "grading", "CGC grading and cert context", "Market acceptance varies by buyer", "4"),
        ("Alt", "https://www.alt.xyz/", "market/grading", "Graded portfolio and premium collectible sentiment", "Not complete for all One Piece cards", "3"),
        ("Collectr", "https://app.getcollectr.com/", "portfolio/noisy market", "Quick portfolio baseline and SKU discovery", "Often misleading; never final sell price", "2"),
        ("OP CPT live site", "https://op-cpt.vercel.app/", "owned website", "Current public/member-beta website", "Production behavior must be tested before changes", "5"),
        ("OP CPT GitHub repo", "https://github.com/GHX5T-SOL/one_piece_tcg", "owned repo", "Source of truth and backup", "Public repo: do not commit private data", "5"),
        ("Consignment Drive folder", "private-url-kept-outside-git", "private source", "Consignment scan/photo intake", "Private HEIC files; do not commit folder URLs, images, owner data, or metadata in this public repo", "3"),
        ("Collectr showcase/profile", "private-url-kept-outside-git", "portfolio/noisy market", "Portfolio baseline and SKU discovery when user provides access", "Use as baseline only; verify against raw data and comps", "2"),
    ]
    source_table = "\n".join(
        f"| {TODAY} | {name} | {url} | {kind} | {good_for} | {limits} | {score} | |"
        for name, url, kind, good_for, limits, score in source_rows
    )

    write_text(
        "README_OP_CPT.md",
        f"""
# OP CPT Business Workspace

This repo-backed workspace is the operating brain for OP CPT: a Cape Town One Piece TCG buying, selling, pricing, inventory, grading, consignment, trade-day, event, content, and website business.

## Current State

- GitHub repo: https://github.com/GHX5T-SOL/one_piece_tcg
- Live website: https://op-cpt.vercel.app
- Website app: `apps/op-cpt`
- Business docs: root docs plus `market_research/`, `pricing/`, `inventory/`, `website/`, `content/`, and `memory/`
- Inventory export: {inventory_stats.get("status", "unknown")}
- Repo visibility checked on {TODAY}: public. Keep sensitive inventory, owner, cert, banking, address, and private scan data out of commits.

## Operating Rule

The CSV/export and owner-supplied scans are source data. Public market tools support identification and pricing, but OP CPT decisions require exact identity, filtered comps, local Cape Town logic, and reputation-safe presentation.

## Start Here

1. Read `mission.md`, `operating_principles.md`, and `memory/business_context.md`.
2. For pricing, follow `pricing/pricing_protocol.md`.
3. For inventory, update `inventory/master_inventory.csv` and logs.
4. For website work, read `website/website_context.md` first.
5. Log material source use in `source_ledger.md`.
6. Log material decisions in `decision_log.md`.
""",
    )

    write_text(
        "mission.md",
        """
# Mission

OP CPT is a Cape Town-based One Piece TCG business that helps collectors and players buy, sell, price, grade, consign, and showcase One Piece cards and sealed products with local trust and research-backed confidence.

The business should become a trusted Cape Town hub for rare One Piece cards, premium promos, slabs, sealed products, trade days, tournaments, and eventually an enquiry-led public catalogue.

OP CPT is not trying to be the cheapest seller. It should price with evidence, scarcity, condition, local availability, grading upside, and reputation in mind.
""",
    )

    write_text(
        "goals.md",
        """
# Goals

## Immediate

- Maintain a clean, source-backed inventory.
- Build a pricing protocol that starts high but remains defensible.
- Separate in-hand inventory, consignment, inbound items, watchlist items, and public listings.
- Prepare the website for enquiry-only catalogue listings without exposing private cost basis or consignment owner data.

## Commercial

- Sell through Cape Town local deals, WhatsApp, Instagram, trade shows, OP CPT-hosted trade days, OP CPT-hosted tournaments, online listings, and the future OP CPT website.
- Use patient local asks for rare items while allowing quick-sale floors when cash velocity matters.
- Treat grading candidates as upside-bearing raw cards, not guaranteed grades.

## Community

- Build OP CPT as a trusted One Piece TCG hub for Cape Town collectors and players.
- Publish useful market education, fake-listing warnings, grading-candidate content, and event/trade-day announcements.
""",
    )

    write_text(
        "operating_principles.md",
        """
# Operating Principles

- CSV/source data is the inventory truth until manually corrected.
- Do not invent missing card data, prices, grades, certs, owners, or conditions.
- Do not use Collectr as a final sell price.
- Start high, negotiate with room, and never sell OP CPT short.
- Protect reputation: never misrepresent condition, rarity, grade, variant, language, origin, or ownership status.
- If the repo is public or privacy is uncertain, do not commit private scans, high-resolution consignment images, owner details, cost-basis evidence, cert-sensitive images, API keys, banking/payment details, addresses, or customer data.
- Research exact identity before pricing.
- Filter bad comps aggressively.
- Cape Town in-hand availability can justify a premium over weak global floors.
- Log meaningful decisions and sources.
""",
    )

    write_text(
        "questions.md",
        f"""
# Questions

These are non-blocking and do not stop workspace setup.

- No `export.csv` was found during bootstrap. Please place the current Collectr/export CSV in the OP_CPT repo root or parent TCG workspace when ready.
- The GitHub repo is public. Should OP CPT create a separate private repo or encrypted storage location for raw inventory exports, consignment owner data, high-resolution scans, cert-sensitive slab images, and cost-basis records?
- Should the current Drive consignment HEIC files be mirrored to private storage outside Git, or only referenced from Drive?
- What ZAR/USD exchange-rate source should OP CPT treat as the default for pricing outputs?
- Which sales channel has priority first: local WhatsApp/Instagram, trade-day/event table, website enquiry catalogue, eBay, CardTrader, or Cardmarket?
- For consignment, confirm whether the default deal remains 80% of researched market value to owner / 20% OP CPT margin unless changed per item.
""",
    )

    write_text(
        "decision_log.md",
        f"""
# Decision Log

| Date | Decision | Reason | Follow-up |
|---|---|---|---|
| {TODAY} | Cloned `GHX5T-SOL/one_piece_tcg` into `OP_CPT` and created branch `op-cpt-workspace-bootstrap`. | User requested repo-backed OP CPT workspace and Git branch. | Commit and push bootstrap files if verification passes. |
| {TODAY} | Treat repo as public for data-safety decisions. | `gh repo view` returned `visibility=PUBLIC`. | Do not commit private scans, owner details, cost-basis evidence, or sensitive cert/private data. |
| {TODAY} | Did not import Drive consignment image contents. | Consignment photos are private-sensitive and the repo is public. | Log folder metadata/source only; use private storage later. |
| {TODAY} | No `export.csv` imported. | No local `export.csv` found in repo or parent workspace. | User to add export later; templates created meanwhile. |
| {TODAY} | Website work remains documentation-only. | Existing `apps/op-cpt` app is already present; prompt did not ask for destructive website changes. | Future changes should inspect app and run typecheck/build first. |
""",
    )

    write_text(
        "source_ledger.md",
        f"""
# Source Ledger

Source hierarchy:

- Tier 1: official identity and rules.
- Tier 2: strong market data after filtering.
- Tier 3: useful but noisy.
- Tier 4: weak, unverified, or requires heavy filtering.

| date_accessed | source_name | url | source_type | what_it_is_good_for | limitations | trust_score_1_to_5 | notes |
|---|---|---|---|---|---|---:|---|
{source_table}
""",
    )

    write_text(
        "inventory/inventory_schema.md",
        "# Inventory Schema\n\n`inventory/master_inventory.csv` and `.xlsx` use these columns:\n\n" + "\n".join(f"- `{column}`" for column in MASTER_COLUMNS),
    )

    stats_lines = "\n".join(f"- {key}: {value}" for key, value in inventory_stats.items())
    write_text(
        "inventory/inventory_policy.md",
        f"""
# Inventory Policy

## Bootstrap Import Status

{stats_lines}

## Standing Assumptions

- All rows in the current CSV are physically in hand once an export is imported.
- No CSV rows are inbound unless separately marked.
- No CSV rows are consignment unless separately added.
- No CSV rows are watch-only unless separately marked.
- Zero cost means cost-basis unknown, not free.
- Many zero-cost rows may be box pulls and can be corrected later.
- Existing CSV market price is treated as ZAR by default.
- Fresh researched comps must be stored in USD and ZAR.
- Sealed products are complete sealed products unless stated otherwise.
- Premium Card Collection -Best Selection Vol. 4-, Premium Card Collection -Live Action Edition-, Learn Together Deck Set, and similar sealed products stay in the sealed / never-break bucket unless a break-value analysis is explicitly requested.
- Consignment cards from Drive are separate from CSV inventory.
- Consignment baseline is 80% of researched market value to owner unless changed.

## Public Repo Safeguard

Because this GitHub repo is public, raw private inventory exports, high-resolution scans, cert-sensitive images, owner/customer data, private addresses, payment details, and cost-basis evidence should not be committed here without explicit approval.
""",
    )

    write_text(
        "pricing/pricing_protocol.md",
        """
# OP CPT Pricing Protocol

Use this every time a card photo, scan, card name, card number, slab, listing, bid opportunity, consignment item, or sell-price request is provided.

## 1. Exact Identification

Do not price from name alone. Identify card name, card number, set code, set name, product source, promo source, language, rarity, variant, finish, stamp, foil type, alternate-art status, event/prize status, winner/participant/finalist status, serial status, raw/slab status, condition, grade company, grade, and cert number where applicable.

Flag identity traps: wrong language, wrong variant, base versus alt art, participant versus winner, reprint versus original, promo versus set card, Japanese versus English, stock image versus real scan, Collectr SKU mismatch, PriceCharting SKU mismatch, title stuffing, and fake listings.

## 2. Market Research

Research relevant sources: TCGplayer, CardTrader, Cardmarket, PriceCharting, Alt.xyz, eBay active, eBay sold, PSA, BGS, CGC, MySlabs/auction houses where relevant, Limitless, official One Piece Card Game, Bandai product pages, OnePiece.gg, Nakama Decks, Egman Events, social/local signals, and Collectr as a weak baseline only.

Save source URLs, access date, platform, condition, language, price, and notes in `source_ledger.md` and `inventory/pricing_research_log.csv`.

## 3. Filter Bad Data

Exclude or discount fake/scam listings, wrong-language comps, wrong variants, damaged cards, weak sellers, title manipulation, stock photos, stale sales before major shifts, best-offer ambiguity, mislabelled slabs, raw cards represented as graded value, and wrong SKU mappings.

## 4. Build Clean Comp Stack

Capture TCGplayer market/low/recent sale/trend, PriceCharting raw and graded trend, eBay sold low/median/high, active supply, CardTrader floor, Cardmarket floor/trend, Alt analysis, PSA/BGS/CGC populations, credible copies available now, social hype, meta relevance, collector relevance, character demand, and future market potential.

## 5. Scarcity and Market-Making

If active supply is low or zero, do not blindly price at the last sale. Consider last clean sold, highest credible recent sold, active supply, number of credible sellers, population, character popularity, condition quality, local availability, grading upside, future growth, and urgency. No credible availability can justify a premium ask if evidence is defensible.

## 6. Grading Upside

For mint raw cards, estimate raw patient value, PSA 9, PSA 10, BGS 9.5, BGS 10, BGS Black Label, CGC 10, grading cost, shipping/insurance, turnaround, grade risk, opportunity cost, and expected value.

Formula: `grading_ev = (prob_10 * net_psa10_value) + (prob_9 * net_psa9_value) + (prob_lower * net_lower_value) - grading_costs - shipping_insurance - time_risk_discount`.

Never call a raw card PSA 10. Use "raw near mint / mint, strong grading candidate."

## 7. Cape Town Premium

Local in-hand buyers avoid international shipping, customs, fake risk, condition uncertainty, waiting time, and inspection risk. Trusted local sale, cash/EFT convenience, and trade-day excitement can justify pricing above weak global floors.

## 8. Price Outputs

Always produce: quick_sale_floor, fair_market_sellable_price, patient_local_ask, event_show_ask, online_gross_ask, stretch_market_maker_ask, walkaway_minimum, expected_net_by_channel, grade_or_sell_verdict, and confidence_rating in USD and ZAR.

## 9. Default Posture

Start high, negotiate down, and avoid desperate pricing unless quick-sale strategy is explicit.
""",
    )

    write_text(
        "pricing/card_pricing_template.md",
        """
# Pricing Recommendation - [Card Name / Number]

## Exact Identification
- Name:
- Number:
- Set/Product:
- Language:
- Rarity/Variant:
- Condition:
- Raw/Slab:
- Confidence:

## Market Evidence
| Source | Signal | Notes |
|---|---:|---|
| TCGplayer | | |
| PriceCharting | | |
| eBay sold | | |
| eBay active | | |
| CardTrader | | |
| Cardmarket | | |
| Alt.xyz | | |
| PSA/BGS/CGC pop | | |
| Social/local | | |

## Clean Comp Interpretation
- Bad data filtered:
- Realistic raw market:
- Availability:
- Scarcity:
- Trend:
- Buyer psychology:

## Grading Upside
- PSA 10 potential:
- BGS 10 potential:
- CGC 10 potential:
- Grade now vs sell raw:

## OP CPT Price Ladder
| Price Type | USD | ZAR | Purpose |
|---|---:|---:|---|
| Quick-sale floor | | | |
| Fair market | | | |
| Patient local ask | | | |
| Event/show ask | | | |
| Online gross ask | | | |
| Stretch ask | | | |
| Walk-away minimum | | | |

## Final Recommendation
List at:
Accept serious offers from:
Do not go below:
Verdict:
Confidence:

## Saved Test Example

Monkey.D.Luffy P-033, P rarity / promo, English, Event Pack Vol. 2 style promo, raw ungraded, described by owner as perfect mint and a strong PSA 10 GEM MINT candidate. When pricing later, research current data and do not rely on cached numbers.
""",
    )

    write_text(
        "pricing/acquisition_bid_framework.md",
        """
# Acquisition Bid Framework

When evaluating a buy or bid, calculate identity confidence, true sellable market value, patient ask, expected net, fees, shipping, grading upside, liquidity, downside risk, capital lockup, maximum bid, ideal bid, walk-away bid, expected ROI, and estimated time to sale.

Formula:

`max_bid = expected_net_sell_price - desired_profit - risk_buffer - fees - shipping - grading_costs_if_any`

For consignment:

`consignment_base = researched_market_value * 0.80`

Do not use Collectr market blindly. Use researched sellable market value after filtering.
""",
    )

    write_text(
        "pricing/consignment_pricing_framework.md",
        """
# Consignment Pricing Framework

Default baseline: owner receives 80% of researched market value unless a different deal is agreed.

Workflow:

1. Intake item and owner alias privately.
2. Identify exact card/product.
3. Photograph/scan front, back, and defects.
4. Research clean comps.
5. Set fair market, patient ask, event ask, quick-sale floor, and walk-away.
6. Confirm split, reserve, and payout timing.
7. Track listing, offers, sale, fees, payout, and unsold return.

Because this repo is public, owner identity and private payout details do not belong here.
""",
    )

    write_text(
        "pricing/acquisition_bid_framework.md",
        """
# Acquisition and Bidding Framework

When asked whether to buy or bid:

- Confirm exact identity and variant.
- Estimate true sellable market value.
- Build expected net by channel.
- Subtract fees, shipping, grading costs, desired profit, and risk buffer.
- Consider liquidity, downside, capital lockup, and time to sale.

Formula:

`max_bid = expected_net_sell_price - desired_profit - risk_buffer - fees - shipping - grading_costs_if_any`

Outputs:

- ideal_bid
- max_bid
- walk_away_bid
- expected_roi
- time_to_sale_estimate
- grade_or_flip_verdict
""",
    )

    write_text(
        "pricing/grading_ev_framework.md",
        """
# Grading EV Framework

Grade when condition, scarcity, character demand, and grade-pop spread justify costs and time. Sell raw when liquidity, grade risk, or cash velocity beats expected slab upside.

Evaluate:

- centering
- corners
- edges
- surface
- print quality
- foil quality
- back condition
- overall grade confidence

Compare PSA, BGS, and CGC. PSA often has the broadest liquidity; BGS 10 / Black Label can command trophy premiums when population is low; CGC 10 / Pristine can be strong but buyer acceptance varies.

Treat raw OP CPT cards as carefully handled and potential grading candidates, not guaranteed 10s.
""",
    )

    write_text(
        "pricing/negotiation_framework.md",
        """
# Negotiation Framework

Price ladder:

- stretch ask: ambitious market-maker price for rare, low-supply, high-upside cards
- patient ask: main listing price, high but defensible
- event ask: trade-day/show sticker price with room
- fair market: comp-supported sellable price
- quick-sale floor: likely to move quickly
- walk-away minimum: lowest acceptable price unless strategy changes

Strategy:

- Start high.
- Do not apologize for rare-card pricing.
- Anchor on condition, scarcity, grading upside, local availability, and trust.
- Negotiate slowly.
- Prefer bundle deals when they increase total ticket size.
- Never panic-sell rare promos.
- Explain suspicious low listings through fake risk, customs, shipping, and condition uncertainty.
- Offer in-person inspection for high-end raw cards.
- Say "strong grading candidate", never "guaranteed PSA 10".
""",
    )

    write_text(
        "pricing/channel_fee_model.md",
        """
# Channel Fee Model

Track fees by channel before making price decisions.

| Channel | Gross Price | Platform Fee | Payment Fee | Shipping/Packaging | FX/Customs | Expected Net | Notes |
|---|---:|---:|---:|---:|---:|---:|---|
| Local cash/EFT | | | | | | | Lowest fee, strongest trust if in person. |
| WhatsApp/Instagram | | | | | | | Needs proof photos and reputation-safe wording. |
| Trade day/event | | | | | | | Strong discovery and bundle potential. |
| Website enquiry | | | | | | | Manual close; public/private field separation needed. |
| eBay | | | | | | | Global reach but scams, fees, shipping, chargebacks. |
| CardTrader | | | | | | | International liquidity; check CardTrader Zero economics. |
| Cardmarket | | | | | | | EU floor useful but not directly local. |
| TCGplayer | | | | | | | US signal; selling access may be constrained. |
""",
    )

    write_text(
        "market_research/platform_pricing_guide.md",
        """
# Platform Pricing Guide

## TCGplayer

Use for US retail market, market price, sales velocity, listing depth, near-mint English singles, and sealed signals. Verify exact variant and seller quality. Low listing does not always equal credible sellable value.

## CardTrader

Use for international supply and cross-border liquidity. CardTrader Zero / Ready economics can matter. Fees, shipping, language, condition, and availability must be filtered.

## Cardmarket

Use for EU floor, availability count, and trend signals. EU prices are not Cape Town landed prices; shipping, customs, and language filters matter.

## PriceCharting

Use for historical raw versus graded snapshots. Verify SKU because variants and languages can be mixed.

## eBay

Use for active global listings, sold listings, market highs, and rare-card scarcity. Filter fake listings, title stuffing, best-offer ambiguity, low-feedback sellers, stock photos, shill risk, shipping, and imports.

## Alt.xyz

Use for graded portfolio perspective and premium collectible sentiment. Verify with raw sales and population reports.

## Collectr

Use only as a rough inventory baseline and quick portfolio view. Collectr can map to wrong variants and be badly mispriced. Never use as final sell price.
""",
    )

    write_text(
        "market_research/one_piece_market_overview.md",
        """
# One Piece TCG Market Overview

OP CPT should treat One Piece TCG as both a competitive card game and a collector market. Player demand moves staples, leaders, and meta-relevant singles; collector demand moves manga rares, serial cards, trophy cards, promos, main characters, popular arcs, and high-grade slabs.

Macro drivers to watch:

- Bandai product cadence and reprint behavior.
- English versus Japanese liquidity differences.
- North America, Europe, Japan, and South Africa availability gaps.
- Singles versus sealed product rotation.
- Promo and prize-card scarcity.
- Manga rare, SP, treasure rare, and serial-card chase demand.
- Tournament meta and ban/restriction updates.
- Anime/manga hype cycles and character arcs.
- Local scarcity and buyer trust in Cape Town.

Standing view: Collectr is useful for portfolio baselines, but serious pricing needs filtered comps from official identity sources, TCGplayer, eBay sold, CardTrader, Cardmarket, PriceCharting, grading population data, and local availability.
""",
    )

    set_rows = [
        ("OP01", "Romance Dawn", "Launch foundation; early Nami/Zoro/Luffy/Romance Dawn cards remain collector-relevant."),
        ("OP02", "Paramount War", "Marineford/Ace/Whitebeard demand; key competitive and collector overlap."),
        ("OP03", "Pillars of Strength", "Strong character spread; verify parallel and wanted variants."),
        ("OP04", "Kingdoms of Intrigue", "Dressrosa/Alabasta collector lanes; Doflamingo and Vivi signals matter."),
        ("OP05", "Awakening of the New Era", "Major anniversary/chase set; manga and Gear 5 era demand."),
        ("OP06", "Wings of the Captain", "Zoro/Sanji/Reiju and playable-card demand; check reprint pressure."),
        ("OP07", "500 Years in the Future", "Bonney/Hancock/Future Island demand; strong OP CPT catalogue relevance."),
        ("OP08", "Two Legends", "Rayleigh/Chopper/Carrot and older-character collector lanes."),
        ("OP09", "Emperors in the New World", "Emperor/Roger/Luffy demand; strong chase-card watch."),
        ("OP10", "Royal Blood", "Donquixote/royal theme; verify meta leaders and SPs."),
        ("OP11", "A Fist of Divine Speed", "Luffy and high-energy current-cycle demand; verify TR/SP variants."),
        ("OP12", "Legacy of the Master", "Current/near-current official card-list set; recheck official products before listing."),
        ("OP13", "Carrying on His Will", "Sabo/Ace/Luffy family thesis; current product/market data must be refreshed before pricing."),
        ("OP14+", "Announced/current watch", "Do not rely on cached names. Verify from official products/card list before decisions."),
    ]
    write_text(
        "market_research/set_by_set_guide.md",
        "# Set-by-Set Guide\n\n" + "\n".join(f"## {code} - {name}\n\n{note}\n" for code, name, note in set_rows),
    )

    write_text(
        "market_research/promo_and_prize_card_guide.md",
        """
# Promo and Prize Card Guide

Promo identity is a major OP CPT risk area. Always distinguish P cards, event pack promos, store tournament cards, championship cards, winner cards, participant cards, finalist cards, Treasure Cup cards, regional cards, serial-numbered cards, Super Pre-Release cards, Pre-Release cards, Premium Card Collection cards, and sealed promo products.

Do not treat participant and winner cards as interchangeable. Do not treat reprints as originals. Always verify stamp, language, foil, product source, and card number.

Rare promos can justify market-maker asks when active supply is thin, but the ask must be backed by availability checks, past sales, character demand, and grading upside.
""",
    )

    write_text(
        "market_research/sealed_product_strategy.md",
        """
# Sealed Product Strategy

Default: keep sealed products sealed unless OP CPT explicitly requests break-value versus sealed-hold analysis.

Sealed product analysis must consider:

- official product identity
- print/reprint risk
- chase-card demand
- local availability
- shipping damage risk
- sealed authenticity
- opportunity cost
- event/trade-day display value
- bundle potential

Products explicitly treated as sealed complete products until changed: Premium Card Collection -Best Selection Vol. 4-, Premium Card Collection -Live Action Edition-, Learn Together Deck Set, and similar sealed entries.
""",
    )

    write_text(
        "market_research/grading_and_population_guide.md",
        """
# Grading and Population Guide

For One Piece, grading value depends on exact card identity, language, variant, condition, grade company, grade, and population. PSA tends to have broad liquidity; BGS 10 and Black Label can be trophy labels; CGC 10/Pristine can work but buyer acceptance varies by market.

Use PSA/BGS/CGC population reports when accessible. If unavailable, log access limitation and do not fabricate population numbers.

Photograph grading candidates front/back under diffuse light, include corners, edges, surface, and foil angles. Store in sleeves/toploaders/team bags and avoid handling.
""",
    )

    write_text(
        "market_research/meta_and_banlist_watch.md",
        """
# Meta and Banlist Watch

Standing sources:

- Official restrictions: https://en.onepiece-cardgame.com/rules/restriction/
- Limitless One Piece: https://onepiece.limitlesstcg.com/
- OnePiece.gg: https://onepiece.gg/
- Egman Events: https://egmanevents.com/

Track English and Japanese/Eastern metas separately. East-to-West lag can create early buying opportunities, but ban/restriction risk must be considered for playable cards.

Pricing implication: meta leaders and staples can spike quickly but may retrace after bans, reprints, or format shifts. Collector cards are less dependent on playability.
""",
    )

    write_text(
        "market_research/fake_and_scam_filtering.md",
        """
# Fake and Scam Filtering

Red flags:

- wrong card number or language in title
- base art listed as alt art
- participant listed as winner
- reprint listed as original
- stock photo only
- no back photo for expensive raw cards
- suspiciously low seller feedback
- too-good-to-be-true high-end manga rare
- slab label mismatch
- cert number not matching card/grade when checked
- hidden damage, glare, or cropped corners
- best-offer sold listing with unknown accepted price

OP CPT public listings should use own scans/photos where legally safe and avoid official art as a replacement for actual condition evidence.
""",
    )

    write_text(
        "market_research/cape_town_market_notes.md",
        """
# Cape Town Market Notes

Cape Town buyers can rationally pay a premium for trusted local in-hand cards because they avoid international shipping, customs, long delivery times, fake risk, condition uncertainty, and currency friction.

Local strengths:

- in-person inspection
- instant EFT/cash convenience
- trusted seller relationship
- trade-day excitement
- bundle negotiation
- local scarcity for promos, slabs, and chase cards

Local caution: do not overprice common, easily imported cards so far above global alternatives that buyer trust is damaged.
""",
    )

    write_text(
        "market_research/agent_council_context.md",
        """
# OP CPT AI Council

Use these roles for major pricing, buying, website, and inventory decisions. Produce concise deliberation summaries with evidence and assumptions, not hidden chain-of-thought.

1. Captain / Business Operator - coordinates work against mission.
2. Card Identifier - exact card, version, language, rarity, promo source, identity traps.
3. Market Comp Analyst - TCGplayer, CardTrader, Cardmarket, PriceCharting, eBay, Alt, niche sources.
4. Fraud and Bad Data Filter - scams, fakes, wrong variants, weak sellers, unreliable comps.
5. Grading Analyst - PSA/BGS/CGC population and grading upside.
6. Scarcity and Market-Making Analyst - active availability, low-pop, rare asks.
7. Cape Town Local Market Analyst - local buyer psychology and scarcity.
8. Portfolio CFO - cost basis, expected net, ROI, velocity, reinvestment.
9. Acquisition and Bidding Analyst - maximum bid and downside.
10. Website Architect - repo, catalogue roadmap, Supabase/Vercel, public/private data.
11. Content and Brand Strategist - Instagram, WhatsApp, event, website content.
12. Risk / Legal / Reputation Analyst - privacy, IP, misrepresentation, trust.
""",
    )

    write_text(
        "website/website_context.md",
        """
# Website Context

Live site: https://op-cpt.vercel.app

Repo inspection shows an existing OP CPT member-beta Next app at `apps/op-cpt`.

Observed structure:

- Next 16 app router
- React 19
- Supabase client/server helpers
- routes for collection, cards, market, trades, rankings, events, news, group buys, admin, auth
- API routes for card search/recognition, Collectr import, price sync, events, trades, rankings
- Supabase migration at `apps/op-cpt/supabase/migrations/0001_op_cpt_initial_schema.sql`

Live site check on bootstrap returned HTTP 200 and title `OP CPT | Cape Town One Piece TCG Community`.

No destructive website changes were made during workspace bootstrap.
""",
    )

    write_text(
        "website/public_catalogue_roadmap.md",
        """
# Public Catalogue Roadmap

First commercial version should be enquiry-only, not checkout.

Recommended public listing fields:

- card name
- card number
- set
- rarity
- language
- condition
- price in ZAR
- optional USD reference
- status: available / reserved / sold
- public notes
- front image from OP CPT-owned scan/photo
- WhatsApp/Instagram enquiry button

Private fields must stay private: cost basis, seller/source, consignment owner, minimum price, private cert fields, margin, negotiation history, and private notes.
""",
    )

    write_text(
        "website/data_integration_plan.md",
        """
# Data Integration Plan

1. Keep `inventory/master_inventory.csv` as offline operating source until Supabase admin workflows are ready.
2. Create a public-safe export for the website containing only approved public fields.
3. Store scans in private storage first, then publish resized/watermarked versions.
4. Sync public catalogue rows to Supabase `cards` / `inventory_items` when reviewed.
5. Keep pricing decisions and comps private unless explicitly turned into public educational content.
""",
    )

    write_text(
        "website/supabase_schema_plan.md",
        """
# Supabase Schema Plan

Existing app migration already includes profiles, cards, collections, collection_items, card_assets, price_sources, price_snapshots, watchlist_items, trades, events, rankings, group_buys, news_posts, asset_manifest, audit_logs, and moderation_reports.

Future commercial inventory tables:

- cards
- inventory_items
- inventory_scans
- price_comps
- pricing_decisions
- sales
- purchases
- consignments
- consignment_owners
- grading_submissions
- events
- trade_day_listings
- content_posts
- watchlist_items

Public fields: card name, card number, set, rarity, language, condition, price, status, public notes, front image.

Private fields: cost basis, seller/source, consignment owner, minimum price, cert number if private, profit margin, private notes, negotiation history.
""",
    )

    write_text(
        "website/vercel_deployment_notes.md",
        """
# Vercel Deployment Notes

Current live site is reachable at https://op-cpt.vercel.app.

Before website changes:

```powershell
npm --prefix apps/op-cpt run typecheck
npm --prefix apps/op-cpt run build
```

Do not expose service-role Supabase keys to the browser. Keep private env vars in Vercel or local `.env`, not Git.
""",
    )

    write_text(
        "content/instagram_strategy.md",
        """
# Instagram Strategy

Brand: trusted Cape Town One Piece TCG hub, premium collector-first sourcing, transparent research-backed pricing, rare promos, grading candidates, trade days, and tournaments.

Pillars:

- new arrivals
- rare card spotlight
- market watch
- grading candidate spotlight
- behind-the-scenes scanning
- trade-day announcements
- tournament announcements
- price education
- fake listing warnings
- collector stories
- sealed product watch
- consignment highlights

Use own scans/photos and OP CPT original branding. Do not use copyrighted official assets publicly unless legally safe.
""",
    )

    write_text(
        "content/content_calendar.md",
        """
# Content Calendar

| Week | Monday | Wednesday | Friday | Weekend |
|---|---|---|---|---|
| 1 | New arrival spotlight | Market watch | Fake listing warning | Trade-day teaser |
| 2 | Grading candidate | Card spotlight | Sealed watch | Community poll |
| 3 | Consignment highlight | Price education | Rare promo story | Event/tournament post |
| 4 | Portfolio update | Buyer guide | New stock drop | Recap carousel |
""",
    )

    write_text(
        "content/post_templates.md",
        """
# Post Templates

## Instagram Post

Hook:
Card:
Why collectors care:
Condition / language:
Price posture:
CTA:

## Reel Script

1. Show real scan/photo.
2. Call out exact card number and variant.
3. Explain one market signal.
4. Invite local inspection or enquiry.

## WhatsApp Sales Post

Card:
Number:
Language:
Condition:
Ask:
Why it matters:
Photos available:
Collection / delivery:

## Website Listing Copy

[Card Name] [Number] - [Language] [Condition]. Available from OP CPT in Cape Town. Enquire for photos, inspection, and current availability.
""",
    )

    write_text(
        "content/card_spotlight_template.md",
        """
# Card Spotlight Template

Card:
Card number:
Set/product:
Language:
Variant:
Why it matters:
Collector angle:
Player/meta angle:
Condition notes:
Local availability angle:
CTA:
""",
    )

    write_text(
        "content/trade_day_content.md",
        """
# Trade-Day Content

## Flyer Copy

OP CPT Trade Day - Cape Town One Piece TCG

Bring your binders, slabs, sealed products, and wishlists. Buy, sell, trade, compare comps, and meet local One Piece collectors.

## Announcement Notes

- Include date, time, venue, safety rules, and what to bring.
- Mention no fake cards, no misrepresented condition, and respectful negotiation.
- Encourage in-person inspection for high-value cards.
""",
    )

    write_text(
        "memory/memory_index.md",
        """
# Memory Index

- `business_context.md`: identity, channels, pricing posture.
- `inventory_context.md`: inventory assumptions and import status.
- `pricing_context.md`: pricing protocol summary and test example.
- `market_context.md`: market research summary.
- `website_context.md`: app/repo/website context.
- `agent_council_context.md`: operating roles.
""",
    )

    write_text(
        "memory/business_context.md",
        """
# Business Context

Business name: OP CPT.

Business type: Cape Town One Piece TCG buying, selling, pricing, inventory, grading, consignment, trade-day, event, content, and website business.

Channels: Cape Town local deals, WhatsApp, Instagram, local trade shows, OP CPT trade days, OP CPT tournaments, online sales, future website catalogue, and later eBay/CardTrader/Cardmarket when useful.

Website direction: evolve https://op-cpt.vercel.app into a public sales catalogue. First commercial version should likely be enquiry-only, not direct checkout.
""",
    )

    write_text(
        "memory/inventory_context.md",
        f"""
# Inventory Context

Bootstrap import status:

{stats_lines}

Standing rules:

- Current CSV rows are in hand once imported.
- No inbound, consignment, or watch-only rows unless separately marked.
- Zero cost means unknown or box pull, not free.
- Collectr market values are baseline only.
- Sealed products stay sealed unless break analysis is requested.
- Consignment Drive files are separate from CSV inventory.
""",
    )

    write_text(
        "memory/pricing_context.md",
        """
# Pricing Context

OP CPT starts high, leaves negotiation room, protects reputation, and prices from exact identity plus filtered comps.

Collectr is a weak baseline only. Cape Town local availability can justify premiums when buyers avoid international shipping, customs, fake risk, condition uncertainty, and delay.

Saved test example: Monkey.D.Luffy P-033, P rarity / promo, English, Event Pack Vol. 2 style promo, raw ungraded, described by owner as perfect mint and a strong PSA 10 GEM MINT candidate. Later pricing must research current data and not rely on cached values.
""",
    )

    write_text(
        "memory/market_context.md",
        """
# Market Context

One Piece TCG combines game demand and collector demand. Meta shifts move playable singles; collector psychology moves manga rares, serials, promos, prize cards, main characters, low-pop slabs, and sealed products.

Primary sources: official One Piece Card Game, TCGplayer, CardTrader, Cardmarket, PriceCharting, eBay sold/active, PSA/BGS/CGC, Limitless, OnePiece.gg, Egman Events, local Cape Town signals.
""",
    )

    write_text(
        "memory/website_context.md",
        """
# Website Context

OP CPT website is live at https://op-cpt.vercel.app and repo app is `apps/op-cpt`.

Current app: Next 16, React 19, Supabase helpers, collection/market/trade/event/news/admin routes, and existing Supabase migration.

Public catalogue should separate public listing data from private business data.
""",
    )

    write_text(
        "memory/agent_council_context.md",
        """
# Agent Council Context

Use the 12-role OP CPT council from `market_research/agent_council_context.md` for major pricing, bidding, inventory, website, and content decisions.
""",
    )

    write_text(
        "scripts/README.md",
        """
# Scripts

Workspace bootstrap:

```powershell
python scripts/bootstrap_op_cpt_workspace.py
```

Existing repo QA:

```powershell
npm run validate:data
npm run pii:scan
npm run build:wrapper
npm --prefix apps/op-cpt run typecheck
npm --prefix apps/op-cpt run build
```
""",
    )

    existing_agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8") if (ROOT / "AGENTS.md").exists() else ""
    marker = "<!-- OP CPT BUSINESS OPS -->"
    if marker not in existing_agents:
        (ROOT / "AGENTS.md").write_text(
            existing_agents.rstrip()
            + f"""

{marker}

# OP CPT Business Operating Desk

Use this repo as the persistent OP CPT operating brain. Before pricing, inventory, website, content, or acquisition work, read the relevant files in `memory/`, `pricing/`, `inventory/`, `website/`, and `source_ledger.md`.

Hard rules:

- Do not commit secrets or private customer/consignment data.
- This repo was verified public on {TODAY}; treat sensitive data accordingly.
- For pricing, follow `pricing/pricing_protocol.md`.
- For major card decisions, use the OP CPT AI Council in `market_research/agent_council_context.md`.
- For website work, inspect `apps/op-cpt` and run typecheck/build before claiming safety.
"""
            + "\n",
            encoding="utf-8",
        )

    print(json.dumps({"export_status": inventory_stats, "files_bootstrapped": True}, indent=2))


if __name__ == "__main__":
    main()
