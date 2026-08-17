# DA Brief 03 — Order Confirmation Modal (ConfirmModal)

**Series:** doc 3 of 6. Depends on `00-Foundations.md`, `01-Component-Kit.md`, `02-Trade-Screen.md` (calculation logic §8, validation §9).
**Scope:** the single buy/sell confirmation dialog — anatomy, every field, security/OTP flow, calculation display, validation, all states, and edge cases.

> **The core fix:** today there are **two different modals** for the same action — a detailed one with full breakdown + OTP + password (Page 8), and a quantity-only one (Page 25). This doc collapses them into **one** dialog with progressive disclosure: simple by default, full breakdown on demand, security step before commit.

---

## 1. Goal
Give the user total clarity on **what they're committing to** — instrument, quantity, cost (buy) or proceeds (sell), tax, and net yield — then authenticate and submit safely, with no ambiguity and no double-submits.

---

## 2. When it opens / how it's invoked
- From **MarketCard `Авах`** (primary) → opens in **Buy** mode, qty default 1.
- From **OrderTicket `Авах`/`Зарах`** → opens in the ticket's mode, pre-filled with the draft (`instrumentRef`, `side`, `qty`, price mode).
- From a **secondary row** detail action → opens in that row's side.
The modal always receives a complete `OrderDraft` (doc 02 §10) and the resolved `Instrument`.

---

## 3. Anatomy (single layout, intent-themed)
```
┌─────────────────────────────────────────────┐
│  CAPIT 1450 CD                          [✕]  │  ← header: ticker (mono) + side chip
├─────────────────────────────────────────────┤
│  НӨХЦӨЛ (terms)                              │  ← Section 1 (always visible)
│   Нэрлэсэн үнэ            ₮100,000            │
│   Нарласан хүү /жилийн/   14.50%             │
│   Хүү төлөх давтамж       Хугацааны эцэст    │
│   Хугацаа                 12 сар             │
│   Төлөгдөх огноо          2027-05-28         │
├─────────────────────────────────────────────┤
│  Тоо ширхэг              [   1   ] ш          │  ← qty input (editable)
├─────────────────────────────────────────────┤
│  ▸ Дэлгэрэнгүй тооцоо  (expand)               │  ← Section 2 (collapsed by default)
│     Бодогдох хүү          ₮14,500            │
│     Татвар (10%)          ₮1,450             │
│     Худалдан авах үнэ      ₮100,000           │
│     Хугацааны эцэст төлөгдөх дүн  ₮113,050    │
│     Бодит өгөөж           13.05%   (green)    │
│     Баланс мөнгөн үлдэгдэл ₮200,000 (green)   │
├─────────────────────────────────────────────┤
│  БАТАЛГААЖУУЛАЛТ (security)                   │  ← Section 3
│   [ Нэг удаагийн нууц үг ]   [ OTP илгээх ]   │
│   [ Нууц үг            👁 ]                    │
├─────────────────────────────────────────────┤
│         [  Худалдан авах  ]                   │  ← CTA, intent-colored, full width
└─────────────────────────────────────────────┘
```
- Header **side chip**: Авах = `--pos`, Зарах = `--neg`. CTA matches (`Худалдан авах` / `Зарах`).
- All values **mono, right-aligned**; labels muted left. Section eyebrows are small caps.
- Modal: centered, scrim `rgba(20,29,41,.5)`, radius 16, focus-trapped, `Esc`/✕ closes.

---

## 4. Sections in detail

### 4.1 НӨХЦӨЛ — terms (always visible)
Read-only facts from the instrument: Нэрлэсэн үнэ, Нарласан хүү /жилийн/, Хүү төлөх давтамж, Хугацаа, Төлөгдөх огноо. These never change with quantity.

### 4.2 Тоо ширхэг — quantity (editable here too)
- Integer ≥ 1; editing recomputes Section 2 live (doc 02 §8, multiplied by qty).
- Buy: ≤ availableQty. Sell: ≤ ownedQty. Inline error on violation.
- This makes the quantity-only flow unnecessary — the same modal handles "just pick a qty" by leaving Section 2 collapsed.

### 4.3 Дэлгэрэнгүй тооцоо — cost/yield breakdown (collapsed by default, one tap to expand)
Computed values (qty-scaled), mono:
- Бодогдох хүү (gross interest), Татвар (10%), Худалдан авах үнэ / for sell: Борлуулах дүн (proceeds), Төлөгдөх дүн (net at maturity), **Бодит өгөөж** (effective yield, `--pos`), Баланс мөнгөн үлдэгдэл (`--pos`).
- Keep the green emphasis on yield + balance — it's good signal; just systematized via tokens.
- **Sell variant:** replace cost rows with proceeds rows (Зарах үнэ, Шимтгэл if any, Гарт орох дүн); show resulting balance.

### 4.4 БАТАЛГААЖУУЛАЛТ — security
- **OTP:** input + `OTP илгээх` button → sends code, button switches to a countdown ("Дахин илгээх 0:59"), disabled until expiry. Show where it was sent ("Таны бүртгэлтэй дугаарт илгээлээ").
- **Password:** masked input with reveal toggle.
- Both required before CTA enables. Wrong OTP/password → inline error, do not close.

---

## 5. CTA & submit logic
- CTA label/color = side. **Disabled** until: valid qty + funds OK (buy) + OTP entered + password entered — each unmet condition surfaced as helper/inline text (never silent).
- On click → **submitting** state: button spinner + label "Илгээж байна…", whole modal inputs locked, **guard against double-submit**.
- **Success:** close modal, success Toast "Захиалга амжилттай үүслээ", trigger Trade table + portfolio + wallet refresh; new order shows as Шинэ/Идэвхтэй.
- **Reject:** stay open, inline error banner with server reason (e.g. "Үлдэгдэл хүрэлцэхгүй", "Захиалга хүчингүй болсон"), inputs unlocked, OTP may need re-send.

---

## 6. States
| State | Behavior |
|-------|----------|
| Open / ready | terms shown, qty editable, breakdown collapsed, security empty, CTA disabled (reason shown) |
| Computing | breakdown values recalc instantly on qty change (no spinner needed) |
| OTP sent | countdown active, resend disabled until 0:00 |
| Validation error | inline at the offending field; CTA stays disabled |
| Submitting | inputs locked, CTA spinner, no double-submit |
| Success | toast + close + refresh |
| Server reject | error banner + reason, stay open |
| Expired instrument (detected on open/submit) | block action, message "Энэ сертификат дууссан/хүчингүй", offer close/refresh |

---

## 7. Edge cases
- **Instrument changes/expires between OrderTicket and modal** → re-validate on open; if stale, show expired message instead of the form.
- **OTP expiry** → invalidate code, prompt resend.
- **Insufficient balance discovered at submit** (balance changed) → reject path §5 + link to Хэтэвч top-up.
- **Qty edited to 0/empty** → CTA disabled, inline "Тоо ширхэг оруулна уу".
- **Sell more than owned** → clamp + error.
- **Network drop during submit** → keep state, retry, idempotency so the order isn't placed twice.
- **Reduced motion** → expand/collapse without animation.
- **Keyboard:** focus lands on qty (or first actionable), tab order top→bottom, `Enter` submits only when valid, `Esc` closes with confirm if mid-entry.

---

## 8. Copy (Mongolian, sentence/section case)
- Header chip: Авах / Зарах. CTA: Худалдан авах / Зарах.
- Expander: "Дэлгэрэнгүй тооцоо". Security eyebrow: "Баталгаажуулалт".
- OTP helper: "Нэг удаагийн нууц үгийг бүртгэлтэй дугаарт илгээнэ." Resend: "Дахин илгээх (m:ss)".
- Success: "Захиалга амжилттай үүслээ." Reject example: "Үлдэгдэл хүрэлцэхгүй байна."

---

## 9. Definition of done (order modal)
- **One** modal replaces both current variants; quantity-only need is met by collapsed breakdown.
- Buy & sell variants share layout; values match doc 02 §8 math, qty-scaled.
- Security step (OTP send/countdown + password) gates a disabled→enabled CTA with visible reasons.
- All states in §6, edge cases in §7, focus-trap + keyboard + reduced-motion handled.
- Success/reject wire back to Trade screen refresh; no double-submit.

**Next doc:** `04-Dashboard.md` — the post-login portfolio home.
