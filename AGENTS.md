# Global Tooling Rules

1. For any UI, UX, or visual design task, use `superdesign` first before writing implementation code unless the user explicitly says to skip design.
2. For existing apps, keep `.superdesign/design-system.md` current and build or refresh `.superdesign/init/` context files before major design work.
3. For research-heavy or fast-changing topics, prefer tool-backed verification with web search, browser automation, or MCPs instead of memory alone.
4. For complex thinking, prefer structured workflows: `search-first`, `deep-research`, `iterative-retrieval`, `blueprint`, `council`, and `verification-loop`.
5. For browser QA, prefer Playwright MCP or browser skills before making claims about UI behavior.
6. For 3D or interactive visualization, prefer Blender MCP when Blender is available, then use Three.js or React Three Fiber for web-facing scenes.
7. Never guess when a tool can verify the answer. Use tool calls, then summarize the verified result.
8. Keep designs implementation-aware: accessible, responsive, and grounded in the real component or token system.
9. After done with a task always clear all caches, rebuild, check everything for errors, fix everything, clean all code, and then upload, deploy, push, sync everything and restart, then test everything and do a full status check.

<!-- OP CPT BUSINESS OPS -->

# OP CPT Business Operating Desk

Use this repo as the persistent OP CPT operating brain. Before pricing, inventory, website, content, or acquisition work, read the relevant files in `memory/`, `pricing/`, `inventory/`, `website/`, and `source_ledger.md`.

Hard rules:

- Do not commit secrets or private customer/consignment data.
- This repo was verified public on 2026-06-10; treat sensitive data accordingly.
- For pricing, follow `pricing/pricing_protocol.md`.
- For major card decisions, use the OP CPT AI Council in `market_research/agent_council_context.md`.
- For website work, inspect `apps/op-cpt` and run typecheck/build before claiming safety.

## OP CPT Business Desk

For OP CPT / The Vault Room pricing, inventory, consignment, content, and website work:

- Use `pricing/pricing_protocol.md` before quoting prices.
- Never price from Collectr alone.
- Card Ladder is required for serious One Piece pricing when accessible.
- Save pricing evidence to `inventory/pricing_research_log.csv`.
- Use `inventory/master_inventory.csv` and `inventory/master_inventory.xlsx` as the operating inventory.
- Preserve raw exports in `inventory/raw/`.
- Keep secrets and payment/customer data out of commits.
- Public catalogue work lives under `apps/op-cpt` and `website/`.
