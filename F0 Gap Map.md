# F0 — Flow-Parity Gap Map

Mobile flow sources read: `screens.jsx` (Home/Trading/Wallet/Loan/News/PrimaryMarket),
`primary_flow.jsx`, `secondary_flow.jsx`, `sell_flow.jsx`, `trading_states.jsx`,
`wallet_flows.jsx`, `notifications.jsx`, `profile.jsx`, `registration_proto.jsx`,
`app_proto.jsx` (full IA wiring). Web sources read: everything in `web-app/*.html`
plus the desktop component files they load (`comp_kit.jsx`, `trade_page.jsx` +
`trade_f03.jsx`, `order_modal.jsx`, `wallet_desktop.jsx`, `loan_request_flow.jsx` +
`loan_payoff_flow.jsx`, `reg_step*.jsx`).

Note: `order_modal.jsx` turned out to be a **web-only** artifact (Pass 03 desktop
order-confirm modal), not a mobile source — it's used below as the current web
equivalent for mobile's primary/secondary/sell buy flows, not as a mobile flow.

Verdict key: **REPLACE** = swap web's current build for the mobile flow's IA/logic,
desktop-adapted · **PARITY** = already matches mobile in substance (adaptation is
appropriate, not mobile-ized) · **ABSENT** = no web equivalent exists, must build ·
**KEEP** = mobile has no equivalent concept; legacy web behavior stands.

## Root IA / navigation

| Mobile | Web equivalent | Verdict | Desktop-adaptation note |
|---|---|---|---|
| Bottom tabs: Нүүр · Арилжаа · Зээл · Хэтэвч · Мэдээ (`app_proto.jsx` AP_APP hubs) | Sidebar: Миний самбар · Арилжаа · Хэтэвч · Зээл · Мэдээ мэдээлэл (`comp_kit.jsx` `_NAV`) | PARITY | Rail replaces tab bar — correct desktop pattern. Profile has no sidebar slot; lives in the topbar avatar menu instead of a tab, which is fine for desktop but currently that menu's 3 items (profile/settings/logout icons) aren't wired to the actual Profile page — confirm the icon-only dropdown links to `07 Profile.html`. |
| Home is the app's landing screen | Dashboard (`04 Dashboard.html`) is the landing screen | see below | — |

## Home (Нүүр) → Dashboard

| Mobile (`screens.jsx` `Home`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| "Миний багц" gradient hero: total value, day yield, empty-state variant | `04 Dashboard.html` hero row of 3 `WebStatCard`s (Нийт байршуулалт / Дундаж өгөөж / Идэвхтэй инструмент) | **REPLACE** | Swap the stat-card strip for mobile's single hero card (big ₮ figure + day-yield chip); keep the 3 stats as a smaller secondary row beneath it, widened to the desktop canvas. |
| Орлого / Зарлага quick-action pair directly on Home | Not present on Dashboard (only exists inside Wallet) | **REPLACE** | Add the same top-up/withdraw quick actions to the Dashboard hero, matching mobile's IA (money movement reachable from the landing screen, not just Wallet). |
| Dynamic loan card (5 states: coming-soon / check-eligibility / request-pending / request-result / active) surfaced on Home | Not present on Dashboard; loan status only lives on `10 Loan.html` | **REPLACE** | Port the state-machine loan card onto the Dashboard; `loan_request_flow.jsx`/`loan_payoff_flow.jsx` already contain the underlying desktop states — reuse, don't rebuild. |
| Product grid: 4 categories (Сертификат/Итгэлцэл/Нэхэмжлэх/Арилжааны бичиг) as visual entry cards into Trade | Dashboard has no product-category entry grid (Trade's own categories live in the sidebar subnav instead) | **REPLACE** | Add the 4-card category grid to Dashboard as the trade entry point, consistent with mobile's merchandising-first Home. |
| Portfolio allocation snapshot (`HomeAllocCard`) | `PortfolioChart` (line chart of 6-month value) + `AccordionRow` holdings list | PARITY (different visualization, both legitimate) | Keep the desktop line chart — richer than mobile's alloc card and appropriate for a bigger canvas. No action required beyond confirming both surface at F-08 zero-state correctly (web already does, per `OnboardingCard`). |
| News teaser list (2 items) + Education carousel (3 cards: video/article) | `NewsCard` list only; no education/learn carousel | **ABSENT**, build (or confirm out of scope) | Confirm whether "Суралцах" education content is in scope for web at all before building — flag to user rather than assume. |
| `Орлого`/`Зарлага` action icon style (up-in/down-out arrows per CHANGELOG) | N/A on Dashboard | REPLACE (covered above) | — |

## Trading — primary market (buy)

| Mobile (`primary_flow.jsx`, `PrimaryMarket` in `screens.jsx`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| 5-screen linear flow: detail → buy setup (qty) → review+consent → PIN → success | `trade_page.jsx` + `trade_f03.jsx` (`PrimaryCard` grid) + `order_modal.jsx` `ConfirmOrderModal` (review → auth(OTP/password) → submitting → success, single modal) | **PARITY** | Collapsing 5 phone screens into one review→auth→success modal is the correct desktop adaptation (doctrine: desktop-adapted, never mobile-ized) — keep it. Confirm the modal's copy/consent line matches mobile's exact consent string per product (primary vs secondary have different consent copy in mobile; verify `ConfirmOrderModal` varies this, not generic). |
| Category chips (Бүгд/Сертификат/Итгэлцэл/Нэхэмжлэх/Арилжааны бичиг) filtering one list | Sidebar sub-nav splits categories into separate routes (`/trade/cd`, `/trade/trust`, etc.) | PARITY | Acceptable desktop pattern (persistent nav vs. in-page chips); no fix needed. |

## Trading — secondary market (buy) & sell (list for sale)

| Mobile (`secondary_flow.jsx`, `sell_flow.jsx`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Secondary buy: listing detail → setup → review+OTP → PIN → success | `SecondaryTable` row → `OrderTicket` (side=buy) → `ConfirmOrderModal` | PARITY | Same modal-collapse pattern as primary; fine. |
| **Sell** (list an *owned* holding for sale): `OwnedDetail` (from an owned position) → `ContractViewer` → `SellSetup` (qty, price mode %/absolute, expiry condition) → `SellReview` → `SellPin` → `SellSuccess` | `OrderTicket` has a Авах/Зарах side toggle on the Trade page, feeding the same `ConfirmOrderModal` | **PARTIAL — REPLACE entry point** | Mechanically the web ticket's "Зарах" side can submit a sell, but nothing in `HoldingsTable` (Wallet) links a specific owned position into that ticket — mobile's sell flow starts *from the holding* (with its own qty/price/expiry-condition setup screen and a contract viewer step). Wire a "Зарах" row action on `HoldingsTable` that deep-links into the Trade ticket pre-filled with that instrument, and confirm the ticket supports mobile's price-mode (%discount vs absolute price) and expiry-condition fields — current ticket doesn't appear to expose those. |
| Contract viewer (`ContractViewer`, PDF-style document, reused for owned + profile contracts) | No equivalent found in web-app | **ABSENT**, build | Needed both for the sell flow's "Гэрээ харах" step and for Profile's "Миний гэрээнүүд" (see Profile section). |

## Trading — error/edge states

| Mobile (`trading_states.jsx`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| E1 Insufficient balance, E2 Sold out, E3 Listing unavailable, E4 Price/info changed, E5 OTP error, E6 Network error | `EmptyPrimary` (sold-out, F-05) exists; `ConfirmOrderModal` has its own error/locked step; explicit "listing no longer available" and "price changed before confirm" states not confirmed present | **PARTIAL — ABSENT**, verify/build | Sold-out and OTP-error paths look covered; stale-listing and price-changed races were not found wired into `ConfirmOrderModal` — confirm with eng whether the web ticket re-validates before submit, and add the state if not. |

## Wallet

| Mobile (`screens.jsx` `Wallet`, `wallet_flows.jsx`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Single unified wallet: cash hero + monthly flow bar chart + "Нийт хөрөнгө" allocation donut + **one** holdings list (all 4 instrument types together, filterable by type chips) + secondary-market "Зарагдаж байгаа" (on-sale) section + transaction history | `06 Wallet.html`: cash hero + **account tabs** (Хэтэвч / Итгэлцэл данс / Нэхэмжлэх данс / Арилжааны бичиг данс), each tab showing its own summary strip + holdings table + order ledger; "Хэтэвч" tab shows only linked bank + tx history | **REPLACE (major)** | See flag below — mobile has no sub-account concept at all. This is the single biggest structural divergence in the whole audit. |
| Add money (Орлого): amount+method → QPay **or** bank-transfer-with-pending-states (sending/found/not-found) → success | `TopUpModal` (`wallet_desktop.jsx`): method → qpay/bank → pending → success | PARITY | Good desktop port, states match. |
| Withdraw (Зарлага): amount+destination → review+PIN → success, plus insufficient-balance edge screen | `WithdrawModal`: amount → PIN → success, with over-limit inline error | PARITY | Insufficient-balance is handled as inline validation rather than a separate screen — acceptable desktop simplification. |
| On-sale listings section with multi-select "Сонгох" → bulk cancel-listing flow | Not found in `06 Wallet.html` or `wallet_desktop.jsx` | **ABSENT**, build | No way on web to see/manage your own active sell listings outside the per-account order ledger (which shows past orders, not live listings). |
| Soon-to-mature alert strip (green banner: "X — удахгүй өгөөж") | Not found | **ABSENT**, build (minor) | Low-effort addition once holdings model is unified. |

### Flagged: sub-account tabs have no mobile equivalent
Confirmed by reading `wallet_flows.jsx`, `screens.jsx` `Wallet`, and `app_proto.jsx`'s
wallet routes end to end: **mobile has no concept of "Итгэлцэл данс" / "Нэхэмжлэх данс" /
"Арилжааны бичиг данс" as separate accounts.** Mobile treats the wallet as one cash
balance plus one mixed holdings list, distinguished only by a `type` filter chip
(Бүгд/Сертификат/Итгэлцэл/Нэхэмжлэх/Арилжааны бичиг) — not by routing to different
tabs with different ledgers. Per doctrine (mobile flow is source of truth), the web's
account-tabs IA should be **replaced** by one unified holdings list with type filter
chips + one combined order ledger, matching mobile. This is a deliberate call-out
before rebuilding, since it removes an entire tab layer.

### Flagged: where holdings live in the mobile IA
Holdings are **not** a first-class tab of their own — they surface in two places only:
1. **Home** — a compact allocation summary (`HomeAllocCard`) folded into the portfolio hero, no per-position rows.
2. **Wallet** — the actual per-position list ("Миний бүтээгдэхүүн"), mixed-type, filterable, sitting below cash + allocation donut and above the on-sale/transactions sections.

There is no separate "Portfolio" or "Holdings" screen/tab in mobile. Web's Dashboard
(`AccordionRow` holdings list) and Wallet (account-tab tables) currently duplicate
holdings display in two structurally different ways — once this consolidates to
mobile's model, Dashboard should show the same lightweight allocation summary Home
does, and Wallet should own the actual per-position list.

## Loan

| Mobile (`app_proto.jsx` loan routes, `screens.jsx` `Loan`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Request: entry → QPay (ЗМС fee) → confirmed → checking (ZMS) → accepted/partial → PIN confirm → submitted/declined, + same-day-blocked edge | `loan_request_flow.jsx` `LoanRequestFlow`: amount → blocked → qpay → pay-status → zms-checking → decision → pin → disbursed | **PARITY** | Full state coverage already ported to desktop card/modal pattern. No action. |
| Payoff (Зээл хаах): review → wallet-or-topup → PIN → success | `loan_payoff_flow.jsx` `PayoffFlow`: review → topup(shortfall) → pin → success | PARITY | Matches, including the wallet-shortfall → top-up redirect from the CHANGELOG. |
| Partial payment (Хувааж төлөх): free amount entry, dynamic "closes the loan" notice | `loan_payoff_flow.jsx` `PartialPayFlow` | PARITY | Matches. |
| Loan list with subtle "Бүгдийг хаах" bulk-close | `10 Loan.html` `LoanHome` shows multiple loan cards; bulk-close action not confirmed in the read excerpt | **VERIFY** | Likely present given shared component reuse — spot-check `LoanHome` for the bulk-close row before assuming parity. |

## Registration / Auth

| Mobile (`registration_proto.jsx` `RP_FLOW`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Splash → onboarding(4) → phone/email/password/PIN/**biometric** → ДАН consent → MONPEP check(+failed) → terms → master contract → signing (e-sign canvas or G-Sign request/wait) → bank verify (+ IBAN lookup sheet) → KYC complete → Home | `09 Registration.html`: Step1 phone+OTP → Step2 email+OTP → Step3 password → Step4 PIN → Step5 KYC(ДАН+MONPEP) → Step6 terms → Step7 master contract → Step8 signing(e-sign/G-Sign) → Step9 bank verify | **PARITY** | Explicitly and correctly adapted: biometric enrollment is intentionally dropped (no browser equivalent) per the file's own design note. This is the model example of "desktop-adapted, never mobile-ized" — no rebuild needed. |
| Password reset: phone → code → new password → success | `11 Reset Password.html`: identifier → OTP → password → success | PARITY | Matches (web generalizes "phone" to "phone or email" identifier — a reasonable desktop broadening). |
| Login: phone+password+biometric-toggle | `05 Login.html`: email+password, OTP step, no biometric toggle (correctly, browser has none) | PARITY | Web uses email as primary identifier vs. mobile's phone — confirm this is an intentional product decision, not a drift; flag to user if unclear. |

## Notifications

| Mobile (`notifications.jsx`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Full `NotificationList` (filter chips: Бүгд/Гүйлгээ/Зээл/Арилжаа/Систем; empty/all-read/filterEmpty states) + `NotificationDetail` (+ critical variant) | `WebTopbar` bell icon shows only an unread-count dot; no dropdown, list, or detail page anywhere in `web-app/*` | **ABSENT**, build | Entire surface is missing on web — currently just a decorative badge. This is a full net-new build, not a re-skin. |

## Profile

| Mobile (`profile.jsx` `ProfileMain` menu) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Хувийн мэдээлэл (read-only KYC) | `PersonalInfoTab` | PARITY | — |
| ПИН код солих / Нууц үг солих | `SecurityTab` (PIN reset via `PinResetFlow`) / `PasswordTab` | PARITY | — |
| Хэл (language toggle) | Present on `05 Login.html` (`LangToggle`) but not in web Profile | **REPLACE (relocate)** | Move/duplicate the language control into Profile settings to match mobile's IA; confirm Login is the right *additional* place for it, not a substitute. |
| Мэдэгдлийн тохиргоо (per-category notification toggles) | Not found in `07 Profile.html` | **ABSENT**, build | — |
| Үндсэн гэрээ (view master contract) | Not found | **ABSENT**, build | Needs the same contract-viewer component flagged under Trading/Sell. |
| Миний гэрээнүүд (contract list → viewer) | Not found | **ABSENT**, build | Same viewer dependency. |
| Хөрөнгө оруулалтын / Зээлийн тодорхойлолт (statement requests + success) | Not found | **ABSENT**, build | — |
| Үйлчилгээний нөхцөл (terms, scrollable) | Not found in Profile (terms only appears inline during registration Step 6) | **ABSENT**, build | Mobile keeps a permanent Profile entry point to terms post-registration; web currently only shows it once, mid-signup. |
| Тусламж / Апп хувилбар / Гарах (help, version, logout) | Not found | **ABSENT**, build | Logout in particular is a notable gap — confirm current web has *any* sign-out affordance (none seen in the topbar dropdown's 3 icons — they render icon-only with no labels confirmed). |

## News

| Mobile (`screens.jsx` `News`/`NewsDetail`, `EduDetail`) | Web equivalent | Verdict | Note |
|---|---|---|---|
| Featured card + list, tap-through to detail; education articles reuse the same detail template | `08 News.html`: `NewsIndex` (category filter, pagination) → `ArticlePage` (with related articles) | **PARITY** | Web's version is actually more developed (pagination, related articles) than mobile's — keep as-is; this is a legitimate case of desktop exceeding mobile, not a gap. |

## Legacy / exploratory files (not part of the numbered IA)

- `web-app/Page 13 - Dashboard (New Style).html` and `Page 14 - Trade (Primary Market).html` are self-styled one-offs (own `:root` tokens, not `comp_kit.jsx`) that duplicate `04 Dashboard.html` / `02 Trade Screen.html`. They don't map to a mobile flow directly — flag to user whether to archive/delete before the rebuild so they don't get mistaken for current screens.
- `web-app/AppShell (annotated).html` is documentation of already-applied audit fixes (F-01, F-02, F-23, F-24 callouts on the shared shell), not a product screen — useful as a record of what's already fixed, not something to re-map.
- `web-app/02 Trade Screen (F-03).html` is a component-board/spec page (multiple states side by side) rather than the live screen (`02 Trade Screen.html` is the live one) — keep both but don't confuse them when scoping the rebuild.

## Open questions for the user before rebuilding
1. Sub-account tabs (Итгэлцэл/Нэхэмжлэх/Арилжааны бичиг данс) — confirm we're OK collapsing these into mobile's single filtered holdings list, since it's a real IA removal, not just a re-skin.
2. Education/Суралцах carousel on Home — in scope for web at all?
3. Notification center and full Profile menu (contracts, certs, terms, help, logout) are ground-up builds, not re-skins — sizing/priority check before starting.
4. Web Login uses email as the primary identifier where mobile uses phone — confirm that's intentional product divergence, not something F0 should also fix.
