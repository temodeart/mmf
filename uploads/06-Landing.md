# DA Brief 06 — Landing / Marketing page

**Series:** doc 6 of 6 (final). Depends on `00-Foundations.md` + `01-Component-Kit.md` (Button, NewsCard, EmptyState patterns).
**Screen:** the public, unauthenticated marketing page. Today it reads unfinished — gray placeholder blocks, a large logo floating mid-page, a tiny dashboard hero image, weak hierarchy, and a missing primary CTA.
**Scope:** section-by-section structure, content, CTAs, components, responsive behavior, SEO/perf basics, states, a11y. (Landing does **not** use AppShell.)

---

## 1. Goal
Convert a first-time visitor into a registered user by clearly answering: *what is this, is it trustworthy (regulated), and how do I start?* Primary action = **Бүртгүүлэх**; secondary = **Нэвтрэх**.

---

## 2. Page structure (top → bottom)
```
1. Top nav (logo + Нэвтрэх / Бүртгүүлэх)
2. Hero (headline + subline + CTA pair + product visual)
3. Trust / regulation band (СЗХ + security)
4. How it works (3 steps)
5. Feature trio (Хэрэглэгч · Цаг хугацаа · Мэдээллийн аюулгүй байдал)
6. Products (Хадгаламжийн сертификат, Итгэлцэл, …)
7. Мэдээ мэдээлэл (news grid)
8. Final CTA band
9. Footer
```

---

## 3. Top nav
- `LogoMark` left; right = `Нэвтрэх` (ghost) + `Бүртгүүлэх` (primary `--brand`).
- Sticky, white on `--surface` with hairline bottom border on scroll. Mobile-web: condense to logo + a menu.

---

## 4. Hero
- **Dominant headline** (Display 32+, Manrope): "Монголын анхны мөнгөний захын платформ." (keep the current message; make it the visual anchor).
- **Subline** (1–2 lines): "Богино хугацаатай мөнгөн хөрөнгөө үр ашигтай удирдаарай."
- **CTA pair:** `Бүртгүүлэх` (primary) + `Нэвтрэх` (secondary) — currently missing, this is the key fix.
- **Product visual:** a clean, real mockup of the dashboard/trade screen (not the tiny placeholder image, not the floating logo). Use the redesigned screens from docs 02/04 as the hero image.
- Layout: text left, visual right (stack on narrow). On `--wash` or a soft brand gradient edge.

---

## 5. Trust / regulation band
For a regulated fintech, trust must be prominent and high on the page:
- "СЗХ-ны зохицуулалттай" (regulated by the Financial Regulatory Commission), "Олон улсын мэдээллийн аюулгүй байдлын стандарт", partner banks/ББСБ logos if available.
- A slim horizontal band with icons + short labels; restrained, credible, not salesy.

---

## 6. How it works — 3 steps
Numbered steps with icons: **Бүртгүүлэх → Данс цэнэглэх → Арилжаа хийх**. One short line each. Helps newcomers understand the product is simple (matches the brand promise "хамгийн хялбар").

---

## 7. Feature trio
Three **equal cards** with line icons (fix the current uneven gray blocks):
- **Хэрэглэгч** — "Хамгийн хялбараар богино хугацааны мөнгөний хэрэгцээгээ хангана." (fix typo богнино→богино)
- **Цаг хугацаа** — "Хамгийн түргэн хугацаанд."
- **Мэдээллийн аюулгүй байдал** — "Олон улсын стандартыг хангаж ажилладаг."
Equal height, spacing scale, brand palette.

---

## 8. Products section
Brief cards for the instrument families the platform offers (Хадгаламжийн сертификат, Итгэлцэл, Нэхэмжлэх, Арилжааны бичиг): name + one-line description + "Дэлгэрэнгүй" link. Sets expectations before signup.

---

## 9. News — `NewsCard` grid
Reuse `NewsCard` (doc 01) in a 3-up grid: title clamp + snippet clamp + **relative date** (fix raw datetimes) + thumbnail. "Бүгдийг үзэх" link. Empty: "Одоогоор мэдээ алга".

---

## 10. Final CTA band + Footer
- **CTA band:** strong line + `Бүртгүүлэх` primary, on a brand-gradient block.
- **Footer:** logo, nav columns (Бүтээгдэхүүн, Компани, Үйлчилгээний нөхцөл, Холбоо барих), `© 2026 Money Market Fund`, entity name (Мони Маркет Фанд ХХК), social/contact. Consistent grid.

---

## 11. Responsive
- Desktop-first; reflow hero text/visual to stacked, trios 3→1, news 3→1 on narrow widths. Sticky nav condenses. (The mobile *app* is separate; this is the responsive web marketing page.)

---

## 12. SEO / performance basics
- Real semantic headings (one `h1` = hero), descriptive alt text on visuals, meta title/description in Mongolian, fast-loading optimized hero image, no layout shift (reserve image space). Lighthouse-friendly.

---

## 13. States
- Default populated.
- **News loading/empty** → skeleton / "Одоогоор мэдээ алга".
- Logged-in visitor hitting Landing → still accessible, but top nav swaps `Нэвтрэх/Бүртгүүлэх` for `Хяналтын самбар` (go to Dashboard).

---

## 14. Accessibility
- One `h1`, logical heading order, keyboard-navigable nav + CTAs, focus rings, AA contrast on gradient bands and buttons, alt text, reduced-motion respected.

---

## 15. Definition of done (Landing)
- Real hero with dominant headline + **CTA pair** + real product visual (no floating logo / placeholder blocks).
- Prominent trust/regulation band; 3-step how-it-works; equal feature trio (typo fixed); products section.
- News grid with relative dates; strong final CTA; complete footer with entity name.
- Responsive, semantic/SEO-clean, AA-accessible; everything on docs 00–01 tokens.

---

## Series complete
This closes the 6-doc DA brief set:
- `00-Foundations.md` — tokens, formatting logic, states, a11y, conventions
- `01-Component-Kit.md` — 20 shared components
- `02-Trade-Screen.md` — core workflow + exact calc logic
- `03-Order-Modal.md` — unified confirm dialog
- `04-Dashboard.md` — portfolio home
- `05-Login.md` — auth entry
- `06-Landing.md` — acquisition page

**Suggested DA execution order:** 00 → 01 → 02 → 03 → 04 → 05 → 06, one doc per pass (Sonnet-friendly).
