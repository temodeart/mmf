# Money Market Fund — Design System

A white-first, regulated-fintech design system for **Money Market Fund / Мони Маркет Фанд ХХК** — Mongolia's money market trading and investment platform where users can buy, sell, track, and manage short-term financial instruments (Хадгаламжийн сертификат, Итгэлцэл, Нэхэмжлэх, Арилжааны бичиг) and access loan products from partner ББСБ institutions.

This system was derived from the **mobile app design** (`Money Market Fund - Mobile App.html` + `screens.jsx`) plus the existing **web product** screenshots and **brand foundations PDF** (DSFoundation.pdf) supplied by the client.

---

## Product context

- **Brand:** Money Market Fund / Мони Маркет Фанд ХХК
- **Surfaces:** Web app (existing, in production) · Mobile app (this system's primary target) · Marketing materials
- **Audience:** Regulated retail investors in Mongolia
- **Language:** Mongolian Cyrillic (primary) · English (secondary, brand & technical)
- **Regulator:** СЗХ (Mongolian Financial Regulatory Commission)
- **Sources used to build this system:**
  - `Money Market Fund - Mobile App.html` + `screens.jsx` (18 hi-fi screens)
  - `uploads/audit_report.html` (existing web-app structure)
  - `uploads/DSFoundation.pdf` (brand foundations)
  - `uploads/Logo_Black.svg`, `uploads/Logo_White.svg` (official marks)
  - `uploads/Screenshot 2026-05-22 *.png` (existing web product screens)
  - Loan onboarding research PDF

---

## Index

| File | What's in it |
|---|---|
| `README.md` | This file. Brand context, content fundamentals, visual foundations, iconography |
| `colors_and_type.css` | All CSS custom properties (colors, type scales, spacing, radii, shadows) plus semantic element rules |
| `SKILL.md` | Agent-skill entrypoint for prompts like "design something on Money Market Fund brand" |
| `assets/logo-black.svg`, `assets/logo-white.svg` | Official logo files |
| `assets/logo-mark.svg` | Logo glyph only (no wordmark) — for compact uses |
| `preview/*.html` | Design-system preview cards (Type, Colors, Spacing, Components, Brand) |
| `ui_kits/mobile/*` | Mobile UI kit — re-usable React/JSX components + sample screens |

---

## Content fundamentals

### Voice & tone
- **Trustworthy, plain-spoken, regulator-friendly.** This is a financial product. Never overpromise.
- **Mongolian Cyrillic only for UI labels.** No mixed-language sentences. English is allowed for brand chrome (the wordmark, "Money never sleeps."), technical tickers (`CAPIT 1450 CD 240227`), and currency codes (`MNT`).
- **You-form, polite.** Use `Та` (formal "you") — `Сайн байна уу, [Нэр]`, never `сайн уу`.
- **No emoji in product UI.** Emoji do not appear in the brand. Use shaped pills, dot+text badges, and SVG iconography instead. (Emoji *do* appear sparingly in the brand-foundation cards used for marketing demonstration, but not in the app itself.)
- **No exclamation marks** in financial copy. Tone is calm, not promotional.

### Allowed vocabulary (do say)
| Mongolian | English meaning | Notes |
|---|---|---|
| Авах / Зарах | Buy / Sell | Always paired with colored dot (blue/red) |
| Захиалга баталгаажуулах | Confirm order | Primary CTA on order screens |
| Үр шим / Хүү | Yield / Interest | "Үр шим" for trust products; "Хүү" for deposits/loans |
| Нэрлэсэн үнэ | Nominal price | |
| Боломжит дүн | Available amount | |
| Нөхцөл биелтэл хүчинтэй | Valid until conditions met | Order validity copy |
| Эргэн төлөгдөх | Repayment | |
| Дансны үлдэгдэл | Account balance | |
| Хэвийн / Идэвхтэй / Шинэ | Normal / Active / New | Status badge labels |

### Forbidden phrasing (don't say)
- ❌ "Баталгаатай ашиг" (guaranteed profit)
- ❌ "Эрсдэлгүй" (risk-free)
- ❌ "Тогтмол өгөөж" unless shown as product data
- ❌ Generic English UI: Trade, Portfolio, Dashboard, Settings → use **Нүүр / Арилжаа / Хэтэвч / Мэдээ / Зээл**

### Required disclaimers
Every instrument-detail surface MUST include:

> Өгөөж нь зах зээлийн нөхцөл болон бүтээгдэхүүний нөхцөлөөс хамааран өөрчлөгдөж болно.

Render in amber surface (`--surface-warning` `#FFFBF2` with `#FFE9C4` border) with a triangle/circle warning glyph.

### Numbers & currency
- Use `₮` symbol before the number with a space: `₮ 48,250,000`. Commas as thousands separator.
- Percentages: `19.5%` (no space), `19.5 % /жил` (spaced when followed by a unit phrase).
- Always set `font-variant-numeric: tabular-nums` on financial figures so columns align.
- Tickers and account numbers are UPPERCASE / numeric: `MSTRT 2400 IT 171126`, `№ 200001281`.

---

## Visual foundations

### Color philosophy
**White-first.** Surfaces are white. The page wash is `#F4F6FA`. Color is used to signal **(1) brand**, **(2) status**, and **(3) hierarchy** — never decoration.

- **Indigo `#4F46E5`** is the primary action color (CTAs, focus rings, active tab states).
- **Blue `#2D6BFF`** is the brand-accent for charts, links inside hero cards, secondary buttons in dark contexts. It is also the bottom-right wedge of the logo.
- **Orange `#FF6B2C`** is the logo's top-left wedge. In the app it appears **only** in: (a) the logo, (b) the multi-step progress bar (sign-up), (c) sparingly as a notification dot. Never as a fill for cards or CTAs.
- **Navy `#050B1F`** is reserved for **accent surfaces** — the portfolio hero, the wallet balance hero, the splash radial gradient. Body text on white uses the warmer ink `#0B1020`.
- **Status colors** always pair a **colored dot + text label** (`green = new / approved`, `amber = active / warning`, `red = sell / error`, `blue = buy / info`). Never color-only.

### Type
- **Family:** `Manrope` for all UI (full Cyrillic glyph coverage, modern fintech feel). `JetBrains Mono` for technical labels (tickers, account IDs, scrollbar hints).
- **Weights:** 400 / 500 / 600 / 700 / 800. We use 800 for display, 700 for body strong + buttons, 600 for muted labels.
- **Letter-spacing:** `-0.02em` on display (40px+), `-0.01em` on titles (16–28px), `0` on body, `+0.06–0.18em` on eyebrows.
- **Numerics:** all financial numbers use `font-variant-numeric: tabular-nums`.

### Spacing scale
`4 / 8 / 12 / 16 / 24 / 32 / 48px` — the only allowed gap/padding values. Mobile horizontal margin is **24px**. Card padding is **16–20px**. Bottom tab bar is **80px tall** including safe area.

### Radii
`6 / 8 / 10 / 12 / 14 / 16 / 18 / 22` and `999` (pill). Cards land at 16–22. Buttons at 14 (or 999 for pill). Small chips/badges at 8–12. Input fields at 14.

### Shadows
- **`shadow-frame`** — the device-bezel shadow: `0 30px 60px -25px rgba(15,20,55,.18), 0 8px 20px -10px rgba(15,20,55,.08)`
- **`shadow-card`** — `0 2px 6px -2px rgba(15,20,55,.04)` — used very sparingly; most cards use a 1px border instead
- **`shadow-cta`** — `0 8px 22px -8px rgba(79,70,229,.5)` — indigo glow under primary CTAs only
- **`shadow-floating`** — `0 10px 30px -10px rgba(15,20,55,.25)` — floating chips on visuals
- **No inner shadows.** No glassmorphism on light surfaces — only on dark hero cards (`background: rgba(255,255,255,.06); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.1)`).

### Borders
Cards on white background use a **1px line** rather than shadow: `--line: #E7E9F2` for dividers/borders, `--line-2: #EFF1F8` for very-subtle internal separators. Focused inputs get an indigo border + a 4px indigo-soft outer ring.

### Surfaces & hero cards
Three hero-card recipes recur across the system:

1. **Navy → Indigo gradient hero** (`linear-gradient(135deg, #050B1F 0%, #4F46E5 130%)`) with an orange radial orb in the bottom-right corner. Used for: portfolio balance, instrument detail, active loan summary, news featured card.
2. **Soft pastel onboarding visual** (`linear-gradient(160deg, #EEF0FE 0%, #E7EEFF 60%, #F4F6FA 100%)`) — full-bleed inside the device frame with floating chips on top.
3. **Coming-soon promo card** (`linear-gradient(140deg, #FFFFFF 0%, #F4F1FF 60%, #EEF0FE 100%)`) with subtle indigo + orange orbs, used for "Тун удахгүй" announcements.

### Backgrounds
- Page background: pure `#F4F6FA` (a slight cool tint of white).
- Artboard background (this design system's preview pages): same wash + two soft radial gradients (top-left indigo, bottom-right orange) at ~5% opacity, to hint at the brand without competing with content.
- No textures. No noise/grain. No hand-drawn illustrations. No photography — all imagery is geometric / vectoral, drawn from brand primitives.

### Motion
- **Transitions are short:** `0.15s` for state changes (toggle, hover), `0.2–0.3s` for layout/expand, `0.35s` for progress bars.
- **Easing:** default browser ease for most things; `cubic-bezier(.2,.8,.2,1)` for the sign-up progress bar so it feels confident.
- **No bounce, no spring.** This is a financial product.
- **No autoplay animation** on hero charts — the user has scrolled to it; rendering is enough.
- Active tab indicator slides under the icon (background pill fades in, not a sliding bar).

### Interaction states
- **Hover** on buttons/cards: no color change on mobile (touch); on web, primary CTAs darken by ~6% and gain a `0 10px 22px` shadow.
- **Pressed:** opacity drops to `0.92`, no scale.
- **Focused inputs:** border becomes indigo, plus a 4px `#EEF0FE` outer ring. The label color stays muted.
- **Disabled:** opacity `0.5`, no further changes (preserves layout).

### Component conventions
- **Cards** = white surface, 16–22 radius, 1px `--line-2` border, 16–20px padding. Headers inside cards are 13–14 / 700 / `-0.01em`.
- **Buttons** — Primary: indigo fill, white text, 52px tall, 14 radius, `shadow-cta`. Secondary/ghost: white fill, 1.5px `--line` border, ink text. Pill: 999 radius, used for the splash "Бүртгүүлэх" and signup completion.
- **Badges** — colored dot + label inside a soft-tinted pill (`{tone}-soft` background, `{tone}` text). Never color-only.
- **Inputs** — 52px tall, 14 radius, `#FAFBFE` resting background, `#fff` when focused, 1.5px border.
- **Bottom tab bar** — white, 80px tall, 5 items: Нүүр / Арилжаа / Зээл / Хэтэвч / Мэдээ. Active item: indigo glyph inside a `--indigo-soft` pill, indigo label.
- **Step progress** (sign-up): orange gradient bar `linear-gradient(90deg, #FF6B2C, #FF8B4F)` over `#F0F2F8` track, with an "Алхам N/total" left + percentage pill right.

---

## Iconography

- **All icons are inline SVG, 2px stroke, rounded line-caps and joins, 24px viewBox** — drawn in-component to match the brand's geometric/calm vibe. We do not use an icon font.
- The CSS sets `stroke-linecap: round; stroke-linejoin: round` by default.
- **Stroke weight:** 2px at 24px viewBox. Step up to 2.5px for very small (16px) icons to keep weight visually consistent.
- **Filled state for selection:** when an icon represents an "active" thing (selected tab, focused account), the inside is filled with `--indigo-soft` while the stroke stays `--indigo`.
- **No emoji** in the product. The brand's tone is too serious for emoji and they don't render consistently across Mongolian-locale Android keyboards.
- **No third-party icon set.** Avoid loading Lucide / Heroicons — we hand-draw the small set we need to control stroke weight, corner radius, and Cyrillic-friendly proportions.

### Logo usage
- Light backgrounds → `assets/logo-black.svg` (orange + blue mark, black wordmark)
- Dark backgrounds → `assets/logo-white.svg` (orange + blue mark, white wordmark)
- Logo-mark only (32–44px contexts like top of forms) → `assets/logo-mark.svg`
- **Never** stretch, recolor, add effects, or place on a low-contrast background.
- Logo-mark colors are sacred: orange `#FE5E00` top-left wedge, blue `#1677FF` bottom-right wedge. (Note these are *slightly different* from the brand-action blue `#2D6BFF` and the accent orange `#FF6B2C` — the logo predates and is preserved as-is.)

---

## Caveats

- **`Manrope` is loaded from Google Fonts** in the demo. If the brand guidelines specify a different family, swap the `--font-ui` CSS var. Manrope was chosen for Cyrillic coverage + modern fintech feel; no font files were supplied.
- **DSFoundation.pdf was not exhaustively parsed** — visual rules were derived from the mobile-app design + supplied screenshots. If the PDF contains conflicting tokens, the PDF wins; please flag discrepancies.
- **Issuer/partner logos are letter-mark placeholders.** Replace with real ББСБ logos when supplied.
- **No dark mode** — every screen is white-first per the original brief.
