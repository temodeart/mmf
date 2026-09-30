# Money Market Fund — Changelog

## Screen names + batch downloads

- **Files are named by screen title**, not by page file. Web:
  `MMF Web - 04 Нүүр - Бүрэн.png`: page number, page title, then the active
  preview state, open modal / drawer title, or step heading (Registration,
  Education article…). Mobile prototype: `MMF Mobile - 048 Худалдан авах -
  Анхдагч зах.svg` (flow number + section + screen, since names like
  "ПИН код" repeat across flows). Canvas pages use each screen's label.
- **Batch ZIP of every screen**, PNG or SVG:
  - Mobile prototype dock menu → *Бүх 131 дэлгэц*. Walks the whole flow and
    returns to the screen you were on.
  - Mobile canvas pages → any screen's download menu → *Энэ хуудасны бүх
    дэлгэц*.
  - Portal → **Дэлгэцүүдийг зургаар** → Гар утасны апп / Веб апп (the 15 flow
    pages, full-page) / Landing (3 pages), each as PNG or SVG. Pages load in a
    preview frame inside the progress dialog. Cancel stops at any point.
  - Repeated names get " (2)"; any screen that fails is listed in
    `_татагдаагүй.txt` inside the ZIP instead of failing the batch.
- Captures now finish CSS entrance animations before shooting.

## Downloads — screens as PNG / SVG, packages as ZIP

Client request: take screens and source out of the review portal.

### Per-screen download (PNG / SVG)
- **Mobile prototype** — download button in the bottom dock, next to the
  prev / next controls. Exports the current phone screen at true 390 × 844
  (the viewer's fit-to-window scale is removed for the capture).
- **Mobile canvases** (Mobile App, Registration / Auto Invest prototypes, Home
  explorations) — a small download icon beside every screen label, via the
  shared `Frame` in `screens.jsx`.
- **Web app pages and landing pages** — floating **Татах** button,
  bottom-right. Captures the whole page. Scroll reveals are settled and
  count-up numbers show their final value first.
- PNG is pixel-exact (2x, reduced for very long pages to stay under browser
  canvas limits), fonts embedded. SVG is true vector (`<text>`, `<rect>`,
  `<path>`), so it opens editable in Figma / Illustrator. Blur and
  backdrop-blur can't be expressed there: frosted glass gets a thicker tint and
  soft glows drop out. Use the PNG as the pixel reference.
- Review chrome (flow-list pill, state switchers, tweaks panel, the download
  UI itself) is hidden while capturing.
- `screen-export.js` holds all of this. html-to-image and dom-to-svg load from
  jsDelivr on first use.

### Portal → Татаж авах (ZIP)
- Four packages: **Бүх төсөл**, **Зөвхөн Landing**, **Зөвхөн гар утасны
  апп**, **Зөвхөн веб апп**. Zipped in the browser (JSZip), one folder per
  zip with paths intact, plus a README.txt on how to run it locally.
- File lists come from `downloads/manifest.json`, built by
  `node tools/build-packages.mjs`. Product packages are crawled from their
  pages (src/href, CSS url/@import, asset strings in JS/JSX), and each was
  checked to run standalone with no missing files. **Re-run the script after
  adding or renaming files.**

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
