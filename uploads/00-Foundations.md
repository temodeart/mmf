# DA Brief 00 — Foundations & Global System (MMF Web)

**Series:** MMF web redesign, doc 0 of 6. Read this first; every screen doc references it.
**Scope of this doc:** the global rules that hold across the whole desktop web app — design principles, tokens, type, color (incl. semantics), spacing/elevation, formatting *logic* for numbers/currency/dates, copy/localization, accessibility, global states, responsive behavior, motion, and repo/output conventions.
**Not in this doc:** individual components (doc 01) or screens (docs 02–06).

---

## 0. Context & intent

MMF (Мони Маркет Фанд ХХК) is a regulated (СЗХ) money-market trading platform. This is the **desktop web** surface (`mmf.moneymarket.mn`). The **mobile app design system is locked**; the web must adopt the same *visual language* while staying a desktop-native product (persistent sidebar, multi-column, dense data tables, hover/focus). Do not mobile-ize the web.

**Design principles (apply when in doubt):**
1. **Numbers are the product.** Money, rates, quantities and dates must be instantly scannable, aligned, and unambiguous. Mono font, tabular figures, right-aligned in tables.
2. **One meaning per color.** Every color carries a fixed semantic. No decorative color drift.
3. **Surfaces create hierarchy.** Wash background + white cards + restrained elevation, not borders-on-white.
4. **Every data surface has 4 states.** Loading, empty, error, populated — always designed, never assumed.
5. **Desktop affordances.** Hover, focus rings, row selection, keyboard support are first-class.

---

## 1. Design tokens

Reuse the locked mobile `colors_and_type.css`. **Only add** the web tokens below; never hardcode values in screens.

### 1.1 Color — base (locked, from mobile)
| Token | Value | Use |
|-------|-------|-----|
| `--brand` | `#4F46E5` (indigo) | primary actions, active nav, links, focus ring |
| `--brand-ink` | darker indigo | hover/pressed of brand |
| `--wash` | `#F4F6FA` | app/page background |
| `--surface` | `#FFFFFF` | cards, tables, modals |
| `--line` | `#E5E8F0` | borders, dividers, table rules |
| `--ink` | `#1A1D29` | primary text, big values |
| `--muted` | `#6B7280` | labels, secondary text (verify AA on white) |

### 1.2 Color — semantic (NEW — define once, never improvise)
| Token | Meaning | Applied to |
|-------|---------|-----------|
| `--pos` | positive / **Buy** / gain / active | Buy tab & button, gain figures, "Идэвхтэй" badge, donut "өгөөж" |
| `--pos-bg` | tint of `--pos` | badge/zone fills |
| `--neg` | negative / **Sell** / loss | Sell tab & button, loss figures, "Зарах" type-badge |
| `--neg-bg` | tint of `--neg` | badge fills |
| `--warn` | pending / in-review | "Хүлээгдэж буй" badges, caution |
| `--info` | neutral informational | "Шинэ" badge, info chips |

> **Retire** the ad-hoc orange and teal currently used on the dashboard donut and badges. Charts use only the semantic palette.

### 1.3 Type
- **Manrope** — all UI, labels, headings, body.
- **JetBrains Mono** — all numerics: money, %, rates, tickers, quantities, dates, IDs. Always `font-variant-numeric: tabular-nums`.

**Scale (px / weight / line-height):**
| Role | Size | Weight | LH |
|------|------|--------|----|
| Display (hero) | 32 | 700 | 1.2 |
| H1 (page title) | 24 | 700 | 1.25 |
| H2 (section) | 20 | 600 | 1.3 |
| H3 (card title) | 16 | 600 | 1.4 |
| Body | 14 | 400/500 | 1.5 |
| Caption / eyebrow | 12 | 500/600 | 1.4 |
| Data (table/value) | 14–16 | 500 mono | 1.4 |

**Min body/data text = 14px.** No 11–12px data text (current table is too small).

### 1.4 Spacing & shape
- Spacing scale (px): **4 / 8 / 12 / 16 / 24 / 32 / 48**. Nothing off-scale.
- Card padding: 24. Section gap: 24–32. Inline label↔value gap: 8–12.
- Radius: cards/modals 12–16; inputs/buttons/pills 8–10; badges full/pill.
- Elevation: cards `0 1px 2px rgba(20,29,41,.06)`; modal/overlay a deeper shadow + scrim `rgba(20,29,41,.5)`.

### 1.5 Iconography
- One icon set (line, ~1.5px stroke), 20px in nav/buttons, 16px inline. Consistent metaphors across sidebar. No emoji anywhere.

---

## 2. Formatting logic (apply identically everywhere)

### 2.1 Currency
- Symbol **`₮`** only. Drop "MNT"/"MNT".
- Thousands separators (comma). Decimals only when meaningful (whole ₮ amounts show no `.00`).
- Mono, right-aligned in tables/value rows.
- `formatMNT(n)` → `"₮" + n.toLocaleString('en-US', {maximumFractionDigits: 2})`. Examples: `100000` → `₮100,000`; `113050.5` → `₮113,050.50`.

### 2.2 Rates & percentages
- `14.5` → `14.5%`. Period qualifier kept short: `14.5% /жил/`. Mono.

### 2.3 Signed values (gain/loss)
- Positive → `+` prefix, `--pos`. Negative → `−` prefix (true minus), `--neg`. Zero → neutral `--ink`, no sign.
- `formatDelta(n)` returns `{text, color}`.

### 2.4 Dates & time
- Display dates `YYYY-MM-DD` (mono) for precise financial dates (maturity etc.).
- News/activity timestamps → **relative** ("3 хоногийн өмнө") with absolute on hover/title. Never show raw `2025-04-08 15:56:18` in the UI.
- Durations: `272 хоног`, `12 сар`.

### 2.5 Tickers / instrument codes
- Mono, uppercase, kept intact (e.g. `CAPIT 1450 CD 240227`). Never wrap mid-code; truncate with tooltip if needed.

---

## 3. Copy & localization
- **Mongolian Cyrillic only.** Sentence case for body and most labels; ALL-CAPS reserved for small eyebrows/section tags.
- Fix known typos globally: "Идэвхитэй" → **"Идэвхтэй"**; "богнино" → **"богино"**.
- **Never** use a raw email as a heading. Topbar shows **user name + avatar**; email is secondary/in menu.
- Microcopy must explain, not just label: disabled states, empty states, and errors each get a human sentence (see §4–5).

---

## 4. Accessibility (WCAG 2.1 AA — required on every screen)
- **Contrast:** body/data text ≥ 4.5:1; large text & UI glyphs ≥ 3:1. Verify `--muted` on `--surface` and all badge text on tinted fills.
- **Focus:** visible 2px `--brand` focus ring (with offset) on every interactive element; logical tab order.
- **Targets:** clickable areas ≥ 40×40px (fix tiny pagination/row actions).
- **Disabled controls** never silent — always paired with helper text/tooltip stating the unmet condition.
- **Keyboard:** tables navigable; modal traps focus, `Esc` closes, focus returns to trigger.
- **Semantics:** real headings, labeled inputs, `aria-live` for async results (order placed, errors).

---

## 5. Global states (design all four for any data surface)
1. **Loading** — skeleton rows/cards matching final layout (no spinners-only).
2. **Empty** — `EmptyState`: mark + one human line + primary action (e.g. "Эхний захиалгаа хийх"). Each screen defines its own copy.
3. **Error** — short cause + **Дахин ачаалах** retry; never a blank panel.
4. **Populated** — the real content.

Form/transaction states also define: **validation error** (inline, field-level), **submitting** (button spinner + disabled), **success** (confirmation/toast), **server reject** (reason shown).

---

## 6. Responsive behavior (desktop-first, fluid)
- Target widths: ≥1440 (primary), 1280, 1024 (laptop). Mobile is the separate app — web only needs to stay usable down to ~1024.
- Sidebar: fixed 240–280px; **collapsible to icon rail** below 1280 (current hamburger stays).
- Main grid reflows: 3-up card rows → 2-up → 1-up; the Trade right rail can dock under the table below 1280.
- Tables: never crush — allow horizontal scroll within the table card with the first column pinned.

---

## 7. Motion
- Subtle and fast: 120–200ms ease for hover, selection, modal in/out, accordion. No bouncy/long animations. Respect `prefers-reduced-motion`.

---

## 8. Output & repo conventions (for DA)
- Deliver **JSX/HTML + token CSS**, same structure as the existing repo (`screens.jsx`, `colors_and_type.css`). Reuse exported atoms — `Frame`, `C` (tokens), `PillBtn`, `BackBar`, `Badge`, `LogoMark`, `Dot`, `DanLogo` — extend rather than duplicate.
- Add new web atoms in the same exported style so screens stay declarative.
- One screen per file/section. Keep components pure and token-driven (no inline magic numbers/colors).

---

## 9. Definition of done (foundations)
- `colors_and_type.css` extended with the web base + semantic + spacing/elevation tokens above.
- `formatMNT`, `formatPct`, `formatDelta`, `formatDate`, `formatRelative` helpers exist and are the **only** way numbers/dates render.
- Manrope + JetBrains Mono wired; tabular figures on.
- A11y primitives (focus ring, target sizing) baked into base atoms.
- The four global states have reusable skeleton + `EmptyState` + error patterns ready for screens to import.

---

**Next doc:** `01-Component-Kit.md` — the shared desktop components (props, variants, states, behavior) that every screen composes from.
