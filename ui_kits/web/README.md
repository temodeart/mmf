# Web app UI kit — Money Market Fund

Desktop web surface (mmf.moneymarket.mn) — persistent sidebar, multi-column
layouts, dense data tables, hover/focus affordances. Same visual language as the
mobile app, but desktop-native (do **not** mobile-ize the web).

## Views
- index.html — **Миний самбар / Dashboard**. StatCards, portfolio donut,
  holdings table, news rail. Composes the root component kit
  (comp_atoms.jsx + comp_kit.jsx, linked at ../../).
- trade.html — **Арилжаа / Primary market**. Sidebar + instrument table +
  OrderTicket right rail; the core trading flow. Self-contained.

## Built from
- web-app/*.html (production screens) and the DA briefs uploads/00-Foundations.md
  … uploads/06-Landing.md.
- Components: see /components/** (Sidebar, Topbar, DataTable, StatCard,
  OrderTicket, InstrumentCard, Modal, …).

## Rules
- Numbers are the product: mono, tabular, right-aligned in tables.
- One meaning per color; every data surface designs all four states
  (loading / empty / error / populated).
- Topbar shows the user's **name**, never the raw email.
