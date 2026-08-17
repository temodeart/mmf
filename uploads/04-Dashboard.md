# DA Brief 04 — Dashboard (Миний самбар)

**Series:** doc 4 of 6. Depends on `00-Foundations.md` + `01-Component-Kit.md`.
**Screen:** post-login home. Today it's a grid of flat, disconnected widgets with inconsistent chart colors, raw timestamps, and no empty states.
**Scope:** layout, every widget, the data each needs, computation/logic, all states (esp. the brand-new-user empty case), and edge cases.

> **Goal of the redesign:** turn this into an **at-a-glance portfolio-health view** — in 5 seconds the user knows what they hold, how it's performing, and what's coming due — with clear next actions when empty.

---

## 1. Layout (desktop grid)
`AppShell` (title "Миний самбар", with a timestamp eyebrow "2026-05-28, 03:04 PM" → use `formatRelative` + absolute on hover). Content on `--wash`:

```
┌──────────┬──────────────────────────────────────────┬───────────────┐
│ Sidebar  │  [StatCard][StatCard][StatCard]           │  ДАНС         │
│          │  Эргэн төлөгдөх хуваарь (Bar/Line)         │  (accordion)  │
│          │  Миний багц (Donut + legend)              │  Мэдээ        │
│          │  Миний захиалгууд (Tabs + DataTable)       │  мэдээлэл     │
└──────────┴──────────────────────────────────────────┴───────────────┘
```
- **Main column (≈2/3):** stat row → repayment chart → portfolio donut → orders table.
- **Right column (≈1/3):** ДАНС accounts accordion (top) + Мэдээ мэдээлэл news (below).
- Reflow: right column drops below main under 1280; stat row 3→2→1 up.

---

## 2. Stat row — three `StatCard`s
Each: eyebrow label → big **mono** value → **delta row** (▲/▼ % vs prior period, `formatDelta`) → **sparkline**.
| Card | Value | Delta basis | Sparkline |
|------|-------|-------------|-----------|
| Сүүлийн 24 цагийн өгөөж | yield last 24h (₮) | vs previous 24h | 24h series |
| Нийт багц | total portfolio (₮) | vs last period | balance trend |
| Нийт өгөөж | total yield to date (₮) | vs last period | cumulative yield |
**Logic:** delta = `(current − prior) / prior`; color & arrow from sign. **Empty (₮0, new user):** show `₮0` with a muted "Мэдээлэл хараахан алга" and **no fake delta/sparkline** — never a green +0%.

---

## 3. Эргэн төлөгдөх хуваарь — repayment schedule chart
Bar (or line) of upcoming maturities/repayments by month (x = `2026-05 … 2027-04`, y = amount).
- Shared chart style; bars in `--brand`/semantic; mono axis + value labels; tooltip shows month + ₮ amount + which certificates.
- **Empty state (no holdings):** replace bare gridlines with an `EmptyState` inside the card — "Эргэн төлөгдөх хуваарь алга. Сертификат худалдаж авснаар энд харагдана." + `Арилжаа руу очих` action. (Today it shows an empty grid — confusing.)

---

## 4. Миний багц — portfolio donut
Donut with **semantic palette only** (retire the orange/teal mismatch). Center = total **mono** (`200,000 Багц` or ₮ value — pick one unit and label it).
- Legend rows map **exactly** to segment colors, each with its ₮ value & %:
  - ХАДГАЛАМЖИЙН СЕРТИФИКАТ — `₮100,000`
  - ӨГӨӨЖ/АЛДАГДАЛ — `₮0` (signed, colored)
  - МӨНГӨН ХӨРӨНГӨ (cash) — `₮100,000`
- **Logic:** segment value = sum of holdings by category; ensure legend total = center value; ӨГӨӨЖ/АЛДАГДАЛ uses `--pos`/`--neg` by sign.
- **Empty:** muted ring + "Багц хоосон байна" + `Арилжаа руу очих`.

---

## 5. ДАНС — accounts accordion (right column)
`Accordion` of account types with count chips, each expandable to balances/links:
- Хадгаламжийн сертификат (n) · Итгэлцэл (n) · Нэхэмжлэх (n) · Арилжааны бичиг (n).
- Count `(0)` muted. Expanded row shows that account's holdings summary + a link into the relevant section.

---

## 6. Мэдээ мэдээлэл — news (right column)
List of `NewsCard`s: title (2-line clamp) + snippet (2-line clamp) + **relative date** (`formatRelative`; today shows raw `2025-04-08 15:56:18` → fix). Whole card links to the article. Section header + "Бүгдийг үзэх" link. Empty: "Одоогоор мэдээ алга".

---

## 7. Миний захиалгууд — orders table
`Tabs` (Миний захиалгууд / Идэвхтэй / Цуцлагдсан) over a `DataTable`:
- Columns: БАНК|БАНК БУС, ОГНОО ↕, ТӨРӨЛ (Badge), ТОО ШИРХЭГ ↕, НЭГЖ ҮНЭ ↕, ХҮҮ % ↕, ТӨЛӨВ (Badge). Numeric mono right-aligned.
- Row click → order detail (and, for active orders, a cancel action where allowed).
- **Empty (new user):** `EmptyState` "Захиалга байхгүй байна" + primary **"Эхний захиалгаа хийх"** → Trade screen. (Today the table is just empty headers.)
- Loading skeleton; error + retry.

---

## 8. Data model (dashboard needs)
```
DashboardSummary {
  yield24h, yield24hPrior,
  totalPortfolio, totalPortfolioPrior,
  totalYield, totalYieldPrior,
  repayment: [{ month, amount, certificates[] }],
  portfolio: { certificates, gainLoss, cash, total },
  accounts: [{ type, count, balance }],
  news: [{ id, title, snippet, publishedAt, url }],
  orders: [{ id, counterparty, date, side, qty, unitPrice, rate, status }]
}
```
All money via `formatMNT`, dates via `formatRelative`/`formatDate`, deltas via `formatDelta`.

---

## 9. States (whole screen)
- **First-time / empty account** (the common real case — current screenshots show ₮0): every widget shows its own empty state with a path to action; the dashboard should feel like an onboarding nudge, not a broken page. Consider a top "Эхлэхэд бэлэн үү?" banner with `Данс цэнэглэх` + `Арилжаа эхлүүлэх`.
- **Loading:** skeletons for stat cards, chart, donut, table.
- **Populated:** real data.
- **Partial error:** if one widget's data fails, that card shows error+retry; the rest still render (no full-page failure).

---

## 10. Edge cases
- Mixed empty/populated (e.g. holdings but no news) → per-widget empty states, independent.
- Negative ӨГӨӨЖ/АЛДАГДАЛ → `--neg`, `−` prefix, donut segment colored accordingly.
- Very large values → mono tabular keeps alignment; abbreviate in sparkline tooltips only if needed.
- Stale data → show last-updated time; manual refresh affordance.
- Timezone: render server time consistently; relative dates respect local now.

---

## 11. Definition of done (Dashboard)
- Stat cards carry value + delta + sparkline, with honest empty handling (no fake deltas).
- Repayment chart and donut use the semantic palette, labeled, with real empty states (no bare gridlines).
- News uses relative dates; raw datetimes gone.
- Orders table has tabs, row detail, and an actionable empty state ("Эхний захиалгаа хийх").
- Right column hierarchy clear (accounts vs news); per-widget loading/empty/error; partial-failure resilient.
- Everything on tokens/formatters from docs 00–01.

**Next doc:** `05-Login.md`.
