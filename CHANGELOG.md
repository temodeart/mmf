# Money Market Fund — Changelog

## Flow audit pass — loose controls & missing steps

A full sweep of every web-app screen and mobile-app screen, probing each
clickable for a real handler and walking each flow end to end. Ten gaps found
and closed.

### Web app
- **Wallet → allocation legend** rows looked clickable but only hovered. They
  now deep-link into Миний бүтээгдэхүүн filtered to that product type
  (`?type=cd|trust|inv|cp`); the section footer link was pointing at a stale
  Dashboard anchor and now goes to the products page.
- **Миний бүтээгдэхүүн — on-sale dead end.** A holding listed for sale had no
  action at all (card showed only a detail link, the table showed "—"), so a
  listing could be created but never cancelled. On-sale state is now derived
  from the shared `MMFListings` store — the same one the Trade page reads —
  and every on-sale holding has **Зарлага цуцлах** with a confirm dialog.
  Listing a product now also flips its badge immediately instead of silently
  doing nothing.
- Card **Дэлгэрэнгүй** linked to the generic transaction history; relabelled
  **Гүйлгээний түүх** so the label matches where it goes.
- **Зээл → Бүгдийг хаах** advertised the combined total (₮3,325,000) but opened
  a payoff for the first loan only (₮1,815,000). Bulk close is now a real
  aggregate subject: summed principal, interest and payoff, its own review /
  PIN / success copy, and it returns to the loan list rather than one loan's
  detail.
- **Профайл → Тохиргоо**: Тусламж and Апп хувилбар rendered as pressable
  buttons that did nothing. Value-only rows are now static, and Тусламж opens a
  real help panel (phone / email / chat channels + FAQ accordion).
- **Картын kebab → Мэдээлэл шинэчлэх** had an empty handler. It now opens a
  renew dialog (new expiry + CVV) that re-dates the card and returns it to the
  active state — the action the expiring-card warning has always pointed at.
- **Автомат хөрөнгө оруулалт → Солих** (change card) sent the user to Профайл;
  cards live in Хэтэвч. Now links to `06 Wallet.html#cards`.
- **Бүртгэл step rail** let you jump from step 1 straight to step 9, skipping
  every verification. Unreached steps are now disabled.

### Mobile app
- **Профайл** had four rows with chevrons and no destination. Built and wired
  all four (`profile_security.jsx`):
  **ПИН код солих** (current → new → confirm → success, with wrong-code
  attempts, lockout, weak-code and mismatch guards), **Нууц үг солих**
  (current + new + repeat, rule checklist, wrong-current error),
  **Хэл** (persisted MN/EN choice), **Тусламж** (support channels + FAQ).
  Registered in the prototype navigator and the screen gallery (P10–P13).
- `MenuRow` no longer renders a button (or a chevron) when it has no action.

---

## Export 2 — since the previous bundle

All changes affect both the gallery (`Money Market Fund - Mobile App.html`)
and the interactive prototype (`Money Market Fund - Prototype.html`), which
share the same screen source (`screens.jsx`, `loan_payoff.jsx`, etc.).

### Wallet — pure empty state
- The `Хэтэвч · empty` variant (gallery screen **28A**) is now a true empty
  state: ₮0 balance, **no** monthly income/outcome bar chart, **no** Нийт
  хөрөнгө card, **no** holdings, **no** on-sale listings, **no** transaction
  history.
- Replaced with a zero-balance cash card (withdraw disabled) plus an
  empty-state card: "Таны багц хоосон байна" with **Хэтэвч цэнэглэх** and
  **Бүтээгдэхүүн үзэх** calls to action.

### Footer navigation
- **Арилжаа (Trade) icon** changed to an in/out exchange arrow (up-in /
  down-out) — better fits trading.
- **Redesigned as a floating liquid-glass bar**: rounded, translucent,
  blurred (`backdrop-filter`), with a soft drop shadow and inner highlight —
  replacing the old solid white bar across every screen.
- **Made truly see-through**: the bar is lifted out of the layout flow and
  floats over the content; screens received bottom clearance so content
  scrolls *behind* the bar and shows through the frosted-glass blur (no solid
  backdrop underneath).

---

## Export 1 — earlier bundle (for reference)

- Loan detail: split the single CTA into **Хувааж төлөх** + **Зээл хаах**.
- Loan detail hero redesigned for the partly-paid state (pending-to-close as
  the primary figure; original loan shown subtly; repayment progress).
- Loan list: subtle **Бүгдийг хаах** bulk-close action.
- Loan payoff flow: wallet-only funding; insufficient balance shows the
  shortfall and switches the CTA to **Цэнэглээд төлөх** (top up → auto-close).
- New **Хувааж төлөх** (partial payment) flow: free amount entry, dynamic
  "closing the loan" notice at full amount, wallet balance + shortfall.
- Loan request screen: selectable **7 / 14 / 30 day** term with live interest
  and amount-due-at-maturity.
- Loan detail: moved the paid amount into the **Олголтын түүх** history;
  removed the bank-account line from the payoff funding source.
