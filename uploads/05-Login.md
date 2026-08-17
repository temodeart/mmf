# DA Brief 05 — Login (Нэвтрэх)

**Series:** doc 5 of 6. Depends on `00-Foundations.md` + `01-Component-Kit.md` (Input/Field, Button, Toast).
**Screen:** the unauthenticated entry point. Split layout exists and is on-brand (indigo panel left, form right) but the form heading is the cold legal entity name, the form floats far-right with dead space, the left copy is one heavy paragraph, and error states are undefined.
**Scope:** layout, fields, auth flow, validation, all states, security, copy, a11y, edge cases. (Login does **not** use AppShell.)

---

## 1. Goal
A warm, trustworthy, fast sign-in for a regulated fintech. The user either logs in confidently or moves to register — with clear errors and recovery.

---

## 2. Layout
Two-pane, full height:
```
┌───────────────────────────┬───────────────────────────┐
│  BRAND PANEL (indigo)      │  FORM PANEL (white)        │
│  LogoMark                  │      ┌─────────────────┐   │
│  Value line (1 short)      │      │  Нэвтрэх (H1)   │   │
│  2–3 trust points          │      │  [Нэвтрэх нэр]  │   │
│                            │      │  [Нууц үг   👁] │   │
│                            │      │  ☑ Нэр сануулах │   │
│                            │      │      Нууц үг…?  │   │
│  Footer: © + entity name   │      │  [  Нэвтрэх  ]  │   │
│                            │      │  Бүртгүүлэх →   │   │
│                            │      └─────────────────┘   │
└───────────────────────────┴───────────────────────────┘
```
- **Form is a centered card**, vertically balanced — kill the far-right dead space.
- Left panel: `--brand` gradient (keep current feel), Manrope, white text.
- Below 1024: brand panel collapses to a slim top band; the form takes the screen.

---

## 3. Brand panel (left) — content
- `LogoMark` top.
- **One tight value line**, not a wall of text. e.g. "Богино хугацааны мөнгөн хөрөнгөө үр ашигтай удирд." (current headline "МӨНГӨ ХЭЗЭЭ Ч УНТДАГГҮЙ" is fine as a short hero — keep it short, sentence/brand case).
- **2–3 trust points** (replace the long paragraph), each a short line with a small icon:
  - "СЗХ-ны зохицуулалттай" (regulated).
  - "Олон улсын мэдээллийн аюулгүй байдлын стандарт" (security standard).
  - "Монголын анхны мөнгөний захын платформ" (first-mover).
- Footer: `© 2026 Money Market Fund` + entity name **here**, small — not as the form title.

---

## 4. Form panel (right) — fields
- **H1 "Нэвтрэх"** (warm) — *not* "МОНИ МАРКЕТ ФАНД ХХК".
- `Нэвтрэх нэр` — username/email input. Don't force ALL-CAPS display.
- `Нууц үг` — password input + reveal toggle.
- `☑ Нэр сануулах` (remember me) + `Нууц үг мартсан?` link (right-aligned, same row).
- Primary `Нэвтрэх` button (`--brand`, full width).
- Secondary line: "Та бүртгүүлээгүй байна уу? **Бүртгүүлэх**".

---

## 5. Auth flow
1. User enters credentials → `Нэвтрэх`.
2. Client validation (§6). If invalid → inline errors, no submit.
3. Submit → button **loading** ("Нэвтэрч байна…"), inputs locked, guard double-submit.
4. **Success →** route to Dashboard (Миний самбар); if "Нэр сануулах" checked, persist session/username.
5. **2FA (if enabled) →** advance to an OTP step (same card, OTP input + resend countdown, mirrors order-modal OTP pattern) before completing.
6. **Failure →** inline error banner with reason; keep username, clear password.

---

## 6. Validation & error states
- `Нэвтрэх нэр`: required; basic format check. Error: "Нэвтрэх нэрээ оруулна уу".
- `Нууц үг`: required. Error: "Нууц үгээ оруулна уу".
- **Invalid credentials** (server): banner "Нэвтрэх нэр эсвэл нууц үг буруу байна" — do not reveal which.
- **Locked/too many attempts:** message + recovery path (Нууц үг мартсан?), optional cooldown note.
- **Network error:** "Холболтын алдаа. Дахин оролдоно уу." + retry; never lose typed username.
- All errors inline + `aria-live`; error styling via `--neg`.

---

## 7. Security
- Password masked by default; reveal is explicit and re-masks on submit.
- Never echo password in errors/logs. No autofill of password into visible text.
- Rate-limit feedback handled gracefully (§6). OTP (if 2FA) follows the doc-03 OTP pattern (send + countdown + resend).

---

## 8. Copy (Mongolian)
- H1: "Нэвтрэх". Fields: "Нэвтрэх нэр", "Нууц үг". Options: "Нэр сануулах", "Нууц үг мартсан?".
- CTA: "Нэвтрэх". Register: "Та бүртгүүлээгүй байна уу? Бүртгүүлэх".
- Loading: "Нэвтэрч байна…". Generic error: "Нэвтрэх нэр эсвэл нууц үг буруу байна."

---

## 9. Accessibility
- Labeled inputs (visible labels, not placeholder-only), logical tab order (username → password → remember → submit).
- `Enter` submits from any field when valid.
- Focus ring on inputs/links/button; error messages tied via `aria-describedby`; reveal toggle has an accessible name.
- Contrast: white text on indigo panel must pass AA; link "Нууц үг мартсан?" meets contrast.

---

## 10. Edge cases
- Already authenticated → skip Login, go to Dashboard.
- Session expired elsewhere → land here with a gentle note "Дахин нэвтэрнэ үү".
- Password manager autofill → fields must accept and validate it.
- Long username/email → no overflow; truncate display, keep full value.
- Reduced motion → no animated transitions on the panel.

---

## 11. Definition of done (Login)
- Warm "Нэвтрэх" heading; entity name demoted to footer.
- Centered, balanced form card; left panel = short value line + 2–3 trust points (not a paragraph).
- Full validation + invalid-credential + network + locked states defined; password reveal; optional 2FA OTP step.
- Manrope, `--brand` gradient, tokens/formatters from docs 00–01; AA contrast + keyboard + focus.

**Next doc:** `06-Landing.md` (final).
