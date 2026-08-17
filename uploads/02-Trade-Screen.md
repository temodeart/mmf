# DA Brief 02 — Trade → Хадгаламжийн сертификат (core screen)

**Series:** doc 2 of 6. Depends on `00-Foundations.md` + `01-Component-Kit.md`.
**Screen:** `mmf.moneymarket.mn/trade-cd` — the primary revenue workflow: discover certificates, place buy/sell orders.
**Scope:** layout, every component, the two markets, full buy & sell flows, validation, **exact calculation logic**, all states, data model, and edge cases.

> This is the screen with the most UX debt today: the order panel is disconnected from the table (you select via a dropdown, not by clicking a row), the rate isn't the hero, "Зарах" reads as a red action, and there are two different purchase modals. This doc fixes all of it.

---

## 1. Goal & jobs-to-be-done
A logged-in user comes here to: (1) **see what's available and at what rate**, (2) **compare** certificates quickly, (3) **place a buy or sell order** with full cost/yield clarity and confirmation. Success = the user can go from "which one?" to a confirmed order in a few clicks, never confused about cost, tax, or net return.

---

## 2. Layout (desktop grid)
`AppShell` (Sidebar + Topbar, title "Арилжаа → Хадгаламжийн сертификат"). Content on `--wash`, three regions:

```
┌──────────┬───────────────────────────────────────┬───────────────┐
│ Sidebar  │  MAIN COLUMN                           │  RIGHT RAIL   │
│ (nav)    │  ── Анхдагч (Primary)  [intro line]    │  OrderTicket  │
│          │     [MarketCard] [MarketCard] [Market] │  (sticky)     │
│          │  ── Хоёрдогч (Secondary) [intro line]  │               │
│          │     [search]            [Авах|Зарах]   │               │
│          │     [DataTable .......................]│               │
│          │     [Pagination]                       │               │
└──────────┴───────────────────────────────────────┴───────────────┘
```
- Right rail is **sticky** while the table scrolls. Below 1280 it docks **under** the table.
- Section order: Primary first (featured, low cognitive load), Secondary below (power/comparison).

---

## 3. The two markets — make the difference obvious
Today users can't tell Анхдагч from Хоёрдогч. Add a **one-line explainer** under each section header:
- **Анхдагч (Primary):** "Банк, ББСБ-аас шинээр гаргасан сертификатыг нэрлэсэн үнээр худалдаж авна." (buy newly-issued certificates at nominal — fixed price.)
- **Хоёрдогч (Secondary):** "Бусад хэрэглэгчдийн санал болгож буй сертификатыг хооронд нь худалдаж авах, зарах." (peer-to-peer resale — price varies.)

A small `ⓘ` tooltip can carry the longer explanation.

---

## 4. Primary market — `MarketCard` row
Row of `MarketCard`s (3-up ≥1280, 2-up, 1-up). Each:
- Bank logo + name (e.g. Капитрон Банк ХК).
- **Rate is the hero:** `14.5%` large mono + `/жил/`.
- Spec list: Нэрлэсэн үнэ `₮100,000`, Хугацаа `12 сар`.
- Primary `Авах` button.
**Behavior:** clicking the card or Авах **selects that instrument and loads the OrderTicket in Buy mode** (and may open `ConfirmModal` directly from Авах — see §7). Selected card gets an indigo outline.
**Variants/edge:** multiple terms per bank → show as selectable term chips (12/6/3 сар) updating the rate; sold-out issue → card disabled with reason "Дууссан".

---

## 5. Secondary market — `DataTable`
**Toolbar above table:** search (Хайх) + a Авах/Зарах `SegmentedControl` that **filters** the table to buy-side or sell-side offers.
**Columns** (numeric = mono, right-aligned, sortable where marked ↕):
| Col | Content | Notes |
|-----|---------|-------|
| ТИКЕР | `CAPIT 1450 CD 240227` | mono, primary cell |
| ТӨРӨЛ | **Badge** (Авах=`--pos` / Зарах=`--neg`) | NOT a red text link |
| ТОО ШИРХЭГ ↕ | `7` | qty available |
| ХУДАЛДАХ ҮНЭ ↕ | `₮100,000` | offer price |
| НЭГЖ ҮНЭ ↕ | `₮100,000` | per-unit |
| ТӨЛӨГДӨХ ХҮРТЭЛХ ХОНОГ ↕ | `272` хоног | days to maturity |
| ЗАХИАЛГЫН ХҮЧИНТЭЙ ХУГАЦАА ↕ | "Нөхцөл биелтэл хүчинтэй" / date | order validity |
| ТӨЛӨВ | **Badge** Идэвхтэй/Шинэ/Хүлээгдэж буй | unified |

**Behavior/logic:**
- **Click a row → selects it (highlight) and loads the OrderTicket** with that instrument + side; double-click or an explicit "Дэлгэрэнгүй" opens `ConfirmModal`.
- Sort toggles asc/desc/none.
- Pagination + "10 / хуудас" page-size.
**States:** loading skeleton rows · empty ("Одоогоор санал болгож буй захиалга алга" + optionally "Анхдагч зах руу очих") · error + Дахин ачаалах.

---

## 6. OrderTicket (right rail) — selection-driven
**Idle (nothing selected):** fields disabled, helper "Эхлээд сертификат сонгоно уу". (Fixes today's silent grey button.)
**Ready (row/card selected):**
- `SegmentedControl` **Авах / Зарах** (intent drives accent + CTA color).
- Selected-instrument summary (ticker, bank, rate, term, maturity).
- `Нэрлэсэн үнэ` — read-only, filled from instrument.
- `Тоо ширхэг` — integer input, suffix `ш`.
- `Хувь (%) / Үнэ (₮)` radio → reveals the matching amount input (for secondary pricing).
- **Live preview** (mono, using §8 logic): Бодогдох хүү, Татвар, Төлөгдөх дүн, Бодит өгөөж — updates as quantity changes.
- CTA `Авах`/`Зарах`, intent-colored, enabled only when valid (§9).
**Submit →** opens `ConfirmModal` (doc 03) pre-filled.

---

## 7. Buy flow (primary path)
1. User selects a certificate (MarketCard Авах **or** secondary row).
2. OrderTicket loads in Авах mode (or modal opens directly from a card's Авах).
3. User sets `Тоо ширхэг`; live preview updates.
4. Click `Авах` → `ConfirmModal` with full breakdown (doc 03).
5. User enters OTP + password → `Худалдан авах`.
6. On success: success Toast "Захиалга амжилттай", modal closes, table/portfolio refresh, new order appears (Шинэ/Идэвхтэй). On reject: inline error with reason, stay in modal.

**Sell flow** mirrors this with Зарах mode/`--neg` accent; user sells from holdings (quantity capped at owned units), confirm modal shows proceeds instead of cost.

---

## 8. Calculation logic (EXACT — verified against the live modal)
Per **one unit**, with `nominal` (Нэрлэсэн үнэ), `rate` (annual, e.g. 0.145), `termYears = termMonths/12`, `taxRate = 0.10` (Mongolian interest-income tax), `qty`:

```
grossInterest (Бодогдох хүү)   = nominal * rate * termYears
tax (Татвар)                   = grossInterest * taxRate
buyPrice (Худалдан авах үнэ)    = nominal
netPayout (Төлөгдөх дүн)        = nominal + grossInterest - tax
effYield (Бодит өгөөж)          = (grossInterest - tax) / nominal
// multiply money figures by qty for the order total
```
**Worked example (matches the current UI exactly):** nominal `₮100,000`, rate `14.5%`, term `12 сар`, qty `1` →
grossInterest `₮14,500` · tax `₮1,450` · buyPrice `₮100,000` · netPayout `₮113,050` · effYield `13.05%`. ✓

Notes: effective yield < nominal because of the 10% tax; if interest is paid only at maturity ("Хугацааны эцэст"), no compounding. If DA later supports periodic interest (Хүү төлөх давтамж ≠ эцэст), document the compounding variant separately — default is at-maturity.

---

## 9. Validation rules
- `Тоо ширхэг`: required, integer ≥ 1, ≤ available qty (buy) or ≤ owned qty (sell). Error: "Боломжит тоо хэмжээнээс хэтэрсэн".
- Secondary price input (if Үнэ/Хувь chosen): > 0, within allowed band; else inline error.
- Funds check (buy): order total ≤ Баланс мөнгөн үлдэгдэл; if not → CTA disabled with reason "Үлдэгдэл хүрэлцэхгүй" + link to Хэтэвч/top-up.
- All validation inline at field level; CTA reflects aggregate validity.

---

## 10. Data model (what each surface needs)
```
Instrument { ticker, bank, bankLogo, market: 'primary'|'secondary',
             nominal, rate, termMonths, maturityDate, payoutFreq,
             availableQty, offerPrice, unitPrice, daysToMaturity,
             orderValidity, status }
Holding    { instrumentRef, ownedQty, avgCost }
Wallet     { balance }           // Баланс мөнгөн үлдэгдэл
OrderDraft { instrumentRef, side: 'buy'|'sell', qty, priceMode, priceValue }
```

---

## 11. Edge cases
- No instruments in a market → that section shows EmptyState (don't hide the header).
- Instrument sells out / order expires while viewing → disable action, toast "Энэ захиалга дууссан/хүчингүй болсон", refresh.
- Insufficient balance → §9 funds check.
- Quantity > availability → clamp + inline error.
- Session/auth expiry mid-flow → route to Login, preserve draft if feasible.
- Long ticker/bank names → truncate with tooltip, never break the grid.
- Network error on submit → keep modal open, show retry, do not double-submit (disable button while pending).

---

## 12. Definition of done (Trade screen)
- Primary/secondary distinction explained inline; rate is the dominant element on MarketCards.
- Selecting a row/card drives the OrderTicket; **no orphan dropdown-only selection**; no silent disabled CTA.
- Secondary table: mono right-aligned numbers, ТӨРӨЛ & ТӨЛӨВ as semantic Badges, sortable, all 4 states.
- Buy & sell flows produce a single `ConfirmModal`; calculations match §8 exactly.
- Validation (§9), edge cases (§11), and a11y/focus/keyboard from doc 00 all present.

**Next doc:** `03-Order-Modal.md` — the unified confirmation dialog this screen hands off to.
