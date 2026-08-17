# Mobile app UI kit — Money Market Fund

The primary product surface: an iOS app for buying, selling and tracking
short-term instruments (Хадгаламжийн сертификат, Итгэлцэл, Нэхэмжлэх,
Арилжааны бичиг) plus partner-ББСБ loan products.

## Views
- index.html — the **full interactive click-through prototype**: splash →
  registration/KYC → home → trade → wallet → loan → news → profile. Screens are
  the root JSX files, referenced at ../../ (screens.jsx, primary_flow.jsx,
  sell_flow.jsx, wallet_flows.jsx, loan_*.jsx, onboarding_v2.jsx, bank_verify.jsx, …).

## Gallery
The static 18-screen gallery lives at "mobile-app/Money Market Fund - Mobile App.html".

## Rules
- White-first surfaces; navy→indigo hero cards; floating frosted-glass tab bar.
- Bottom tab bar: Нүүр / Арилжаа / Зээл / Хэтэвч / Мэдээ.
- Mongolian Cyrillic UI labels; formal Та; no emoji; no exclamation marks.
- Every instrument-detail surface carries the СЗХ risk Disclaimer.
