---
name: money-market-fund-design
description: Use this skill to generate well-branded interfaces and assets for Money Market Fund / Мони Маркет Фанд ХХК — Mongolia's regulated (СЗХ) money-market trading & investment platform. Contains design guidelines, tokens (colors, type, spacing, radii, shadows), fonts, logo assets, a web component kit, and web + mobile UI kits for production work or throwaway prototypes/mocks.
user-invocable: true
---

# Money Market Fund — design skill

Read `README.md` first — it holds the brand context, content fundamentals
(voice, Mongolian-Cyrillic copy rules, allowed/forbidden vocabulary, currency &
number formatting), visual foundations, and iconography. Then explore:

- `styles.css` — link this ONE file to inherit every token, font-face and base
  rule. (`tokens/*.css` are the split sources; `colors_and_type.css` is the
  legacy single-file mirror used by the existing previews.)
- `foundations.js` — the only sanctioned number/date formatters (`formatMNT`,
  `formatPct`, `formatDelta`, `formatDate`, `formatRelative`).
- `components/**` — the web component kit (Button, Badge, TextInput, StatCard,
  DataTable, Pagination, SegmentedControl, InstrumentCard, OrderTicket, Sidebar,
  Topbar, Modal, EmptyState, ErrorState, Skeleton, Disclaimer, …). Each has a
  `.d.ts` props contract and a `.prompt.md`.
- `ui_kits/web/` and `ui_kits/mobile/` — full product recreations to copy from.
- `guidelines/*.card.html` — foundation specimens.
- `assets/` — logos (`logo-black.svg`, `logo-white.svg`, `logo-mark.svg`).

## How to use
- **Visual artifacts** (slides, mocks, throwaway prototypes): copy the assets you
  need and the relevant CSS/JSX out, and produce static HTML the user can open.
  Link `styles.css`, load `foundations.js`, and route every number through its
  formatters.
- **Production code**: read the rules here and reuse the components + tokens to
  become an expert in the brand.

## Non-negotiables
- White-first surfaces; color signals brand / status / hierarchy only — one
  meaning per color. Buy=`--pos` (green), Sell=`--neg` (red).
- Mongolian Cyrillic UI labels, formal `Та`, no emoji, no exclamation marks in
  financial copy. Never say "guaranteed" / "risk-free" returns.
- Numbers: `₮` + space + comma-thousands, mono (JetBrains Mono), tabular figures.
- Every instrument-detail surface shows the СЗХ risk `Disclaimer`.
- Never redraw or recolor the logo; use the supplied SVGs.

If invoked without guidance, ask what the user wants to build (surface, audience,
scope, variations), then act as an expert MMF designer and output HTML artifacts
or production code as needed.
