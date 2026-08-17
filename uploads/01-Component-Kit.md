# DA Brief 01 — Shared Component Kit (MMF Web)

**Series:** doc 1 of 6. Depends on `00-Foundations.md` (tokens, formatting, states, a11y).
**Scope:** the reusable desktop components every screen composes from. For each: **anatomy → props → variants → states → behavior/logic**. Build these once; screens (docs 02–06) only assemble them.
**Rule:** components are pure and token-driven. No screen invents colors, spacing, or number formatting — it all comes from here + doc 00.

Component index: 1) AppShell · 2) Sidebar · 3) Topbar · 4) Button/PillBtn · 5) Badge · 6) Input & Field · 7) SegmentedControl (Buy/Sell) · 8) StatCard · 9) DataTable · 10) MarketCard · 11) OrderTicket · 12) ConfirmModal · 13) Accordion (ДАНС) · 14) NewsCard · 15) Charts (Donut, Bar/Line, Sparkline) · 16) EmptyState · 17) Skeleton · 18) Toast · 19) Pagination · 20) Tabs.

---

## 1. AppShell
**Anatomy:** `Sidebar` (left, fixed) + `Topbar` (top of content) + `<main>` content area on `--wash`.
**Props:** `active` (nav key), `title` (page title for Topbar), `user`, `children`.
**Behavior:** content column max-width ~1408 centered with 24–32 gutters; main scrolls, sidebar/topbar fixed. Below 1280 the sidebar collapses to an icon rail (toggled by the topbar hamburger).
**Used by:** Trade, Dashboard (all authenticated screens). Login/Landing do **not** use AppShell.

## 2. Sidebar
**Anatomy:** logo (top) → optional account/section eyebrow → nav groups → each item = icon + label, with a chevron for expandable groups (e.g. Арилжаа).
**Props:** `items[]` (`{key, label, icon, children?}`), `active`, `collapsed`.
**Variants:** expanded (240–280px, icon+label) · collapsed (icon-only rail, label on hover tooltip).
**States:** item default / hover (subtle `--wash` fill) / **active (indigo pill: `--brand` text + tinted bg)** / expanded-parent.
**Behavior/logic:**
- Active item derived from current route; parent group auto-expands when a child is active.
- **Fix the "HYYP" eyebrow** — it's a mis-rendered group label; replace with a real section label or remove.
- Keyboard navigable; active has `aria-current="page"`.
**Nav model (current):** Миний самбар · Арилжаа ▸ (Хадгаламжийн сертификат, Итгэлцэл, Нэхэмжлэх, Арилжааны бичиг) · Хэтэвч · Мэдээ мэдээлэл.

## 3. Topbar
**Anatomy:** left = hamburger (collapse) + page title slot; right = settings icon + **user menu (avatar + name)**.
**Props:** `title`, `user {name, avatarUrl}`, `onToggleSidebar`.
**Behavior:** **show the user's name, not the raw email** (email lives inside the menu). Settings + user menu open dropdowns. Sticky on scroll.

## 4. Button / PillBtn
**Variants (by intent token):** `primary` (`--brand`) · `positive` (`--pos`, Buy/confirm-buy) · `negative` (`--neg`, Sell) · `secondary` (outline) · `ghost` (text).
**Sizes:** sm 32 / md 40 / lg 48 height. Radius 8–10. Min target 40 for primary actions.
**States:** default / hover (darken) / pressed / focus (ring) / loading (inline spinner, label dims, disabled) / **disabled (must accept a `reason` → tooltip/helper text; never silently grey)**.
**Props:** `intent`, `size`, `loading`, `disabled`, `reason`, `iconLeft/Right`.

## 5. Badge
**Purpose:** status & type labels, token-driven.
**Variants:** `active` (`--pos`) = "Идэвхтэй" · `new` (`--info`) = "Шинэ" · `pending` (`--warn`) · `sell` (`--neg`) = "Зарах" type · `buy` (`--pos`) = "Авах" type · `cancelled` (`--muted`).
**Anatomy:** pill, tinted bg + colored text, optional leading `Dot`. 12px, mono if it wraps a value.
**Rule:** one component drives every status/type chip across tables, cards, modals — kills the current inconsistency (orange "Идэвхитэй" vs green "Шинэ").

## 6. Input & Field
**Anatomy:** `Field` = label + control + helper/error slot. Controls: text, number, password (reveal toggle), select/dropdown, radio, checkbox.
**Props:** `label`, `value`, `onChange`, `state` (default/focus/error/disabled), `helper`, `suffix` (e.g. `ш`, `₮`, `%`), `mono` (numbers use JetBrains Mono).
**States:** default / focus (`--brand` ring) / **error (`--neg` border + message)** / disabled (with reason) / read-only (filled, e.g. Нэрлэсэн үнэ).
**Logic:** number inputs format on blur via `formatMNT`/`formatPct`; validation messages inline and tied via `aria-describedby`.

## 7. SegmentedControl — Buy/Sell
**Use:** Авах / Зарах toggle in OrderTicket and ConfirmModal.
**Behavior/logic:** two segments; **Авах selected → `--pos` accent**, **Зарах selected → `--neg` accent**. The active intent propagates to the ticket's CTA color and labels. This is the single source of buy/sell semantics — replaces today's all-indigo tabs.

## 8. StatCard
**Anatomy:** eyebrow label → big **mono** value → delta row (▲/▼ % via `formatDelta`) → optional `Sparkline`.
**Props:** `label`, `value`, `delta`, `series?`, `state`.
**States:** populated · **empty** (₮0 with "Мэдээлэл алга"/muted, no fake delta) · loading (skeleton).
**Used by:** Dashboard top row (Сүүлийн 24 цагийн өгөөж, Нийт багц, Нийт өгөөж).

## 9. DataTable
**The most important component.** Anatomy: sticky header row + body rows + footer (Pagination + page-size).
**Props:** `columns[]` (`{key, label, align, sortable, render}`), `rows[]`, `sort`, `onSort`, `onRowClick`, `selectedId`, `state`, `rowsPerPage`.
**Column rules:** numeric columns `align:right` + **JetBrains Mono**; text left; status/type via `Badge`. Headers show a clear sort arrow only on `sortable` columns; active sort emphasized.
**States:** loading (skeleton rows) · empty (`EmptyState` spanning body) · error (retry) · populated.
**Behavior/logic:**
- **Whole row is hoverable and clickable**; `onRowClick(row)` selects it (`selectedId` → highlighted) and drives the OrderTicket / opens detail. This is the key fix — selection by row, not by a disconnected dropdown.
- Sorting toggles asc/desc/none per column.
- ≥40px row height; pagination targets ≥40px.

## 10. MarketCard (primary-market product card)
**Anatomy:** bank logo + name (top) · **rate as hero** (large mono, e.g. `14.5%` with `/жил/`) · spec list (Нэрлэсэн үнэ, Хугацаа) as aligned label↔value rows · `Авах` primary button.
**Props:** `instrument {bank, logo, rate, nominal, term, ...}`, `onBuy`, `selected`.
**States:** default / hover (lift) / selected (indigo outline) / sold-out (disabled + reason).
**Logic:** clicking the card (or Авах) selects the instrument and loads the OrderTicket/modal; rate is always the dominant visual.

## 11. OrderTicket (right rail on Trade)
**Anatomy:** `SegmentedControl` Авах/Зарах → **selected-instrument summary** (filled when a row/card is chosen) → fields (Нэрлэсэн үнэ read-only, Тоо ширхэг, Хувь%/Үнэ₮ radio + amount) → live cost/yield preview → primary CTA.
**Props:** `mode` (buy/sell), `instrument`, `values`, `onChange`, `onSubmit`.
**States:** **idle/empty** (no instrument → fields disabled with helper "Эхлээд сертификат сонгоно уу") · ready · validating · submitting.
**Logic:**
- Populated by `DataTable.onRowClick` / `MarketCard` selection (dropdown is a fallback selector).
- CTA color follows mode (`--pos`/`--neg`); enabled only when instrument + valid quantity present, else disabled **with reason**.
- Submitting opens `ConfirmModal` (doc 03).

## 12. ConfirmModal (the single order dialog)
Full spec in doc 03. Kit-level contract: centered modal + scrim, focus-trapped, `Esc`/✕ closes, header (instrument code) + grouped detail sections + quantity + security step + intent-colored CTA. **Replaces both current modal variants.**

## 13. Accordion (ДАНС accounts)
**Anatomy:** list of expandable rows (Хадгаламжийн сертификат, Итгэлцэл, Нэхэмжлэх, Арилжааны бичиг) each with a count chip `(n)` and chevron; expands to detail/links.
**States:** collapsed/expanded; empty count muted. Single or multi-open (pick one and keep consistent).

## 14. NewsCard
**Anatomy:** title (2-line clamp) → snippet (2-line clamp) → **relative date** (`formatRelative`, absolute on hover). Optional thumbnail.
**Variants:** list row (Dashboard right column) · grid card (Landing). Hover lifts; whole card is the link.

## 15. Charts
Shared axis/grid/tooltip style; **semantic palette only**; mono value labels.
- **Donut (portfolio, Миний багц):** labeled segments + legend whose swatches map exactly to segments; mono total in center (e.g. `200,000 Багц`). Replace orange/teal with semantic tokens.
- **Bar/Line (Эргэн төлөгдөх хуваарь):** has an **empty state** (not bare gridlines) when no data.
- **Sparkline:** tiny trend inside StatCard, colored by `formatDelta` sign.

## 16. EmptyState
**Anatomy:** mark/illustration + one human line + primary action button.
**Props:** `title`, `body`, `action`. Reused by tables, charts, lists. Each screen passes its own copy.

## 17. Skeleton
Gray shimmer blocks matching final layout — row, card, chart, and stat variants. Used for all loading states.

## 18. Toast
Transient confirmation/error (top-right). Variants success (`--pos`), error (`--neg`), info. `aria-live`. Used after order placement, copy, etc.

## 19. Pagination
Prev/next + page numbers + page-size select ("10 / хуудас"). Targets ≥40px (current arrows too small). Disabled ends show reason via title.

## 20. Tabs
Underline or pill tabs (e.g. Миний захиалгууд / Идэвхтэй / Цуцлагдсан). Active = `--brand`; keyboard arrow navigation; panels swap without layout jump.

---

## Definition of done (component kit)
- Every component above exists as a token-driven exported atom, with documented props and **all listed states** (esp. loading/empty/error and disabled-with-reason).
- Buy/Sell semantics live **only** in `SegmentedControl` + `Button` intents + `Badge`; no ad-hoc colors.
- `DataTable` supports row hover/click/selection, sortable headers, and the three non-populated states.
- All numeric rendering routes through doc-00 formatters; all text is Manrope, all numbers JetBrains Mono.
- Focus rings, ≥40px targets, and `aria` wiring present on interactive components.

**Next doc:** `02-Trade-Screen.md` — assembling these into the core Хадгаламжийн сертификат screen with its flows, validation, and calculation logic.
