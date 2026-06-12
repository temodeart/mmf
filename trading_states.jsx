// ============================================================
// EDGE CASE / STATE SCREENS for the trading flows
// Built on the StateScreen template from flow_kit.jsx
// ============================================================

// 1 — Insufficient wallet balance (purchase flows)
const StateInsufficient = () => (
  <StateScreen
    label="E1 — Insufficient balance"
    tone={C.red}
    glyph={Glyphs.wallet}
    title="Үлдэгдэл хүрэлцэхгүй байна"
    desc="Худалдан авалт хийхэд таны мөнгөн хөрөнгийн үлдэгдэл хүрэлцэхгүй байна."
    rows={[
      { l:'Шаардлагатай дүн', v:'103,360.83 ₮' },
      { l:'Одоогийн үлдэгдэл', v:'635.89 ₮' },
      { l:'Дутагдаж буй дүн', v:'102,724.94 ₮', big: true, tone: C.red },
    ]}
    primaryCta="Мөнгө нэмэх"
    secondaryCta="Буцах"
  />
);

// 2 — Product sold out / no available quantity
const StateSoldOut = () => (
  <StateScreen
    label="E2 — Sold out"
    tone={C.muted}
    glyph={Glyphs.ban}
    title="Боломжит ширхэг дууссан байна"
    desc="Энэ бүтээгдэхүүнийг одоогоор худалдан авах боломжгүй байна."
    primaryCta="Арилжаа руу буцах"
  />
);

// 3 — Secondary listing no longer available
const StateUnavailable = () => (
  <StateScreen
    label="E3 — Listing unavailable"
    tone={C.amber}
    glyph={Glyphs.warn}
    title="Санал идэвхгүй болсон байна"
    desc="Энэ хоёрдогч зах зээлийн санал өөр хэрэглэгчээр биелэгдсэн эсвэл цуцлагдсан байна."
    primaryCta="Шинэчлэх"
    secondaryCta="Арилжаа руу буцах"
  />
);

// 4 — Price / availability changed before confirmation
const StatePriceChanged = () => (
  <StateScreen
    label="E4 — Info changed"
    tone={C.blue}
    glyph={Glyphs.refresh}
    title="Мэдээлэл шинэчлэгдсэн байна"
    desc="Зах зээлийн саналын үнэ эсвэл боломжит ширхэг өөрчлөгдсөн байна. Шинэ мэдээлэлтэй танилцана уу."
    rows={[
      { l:'Өмнөх үнэ', v:'100,000 ₮', tone: C.muted },
      { l:'Шинэ үнэ', v:'101,200 ₮', big: true, tone: C.blue },
      { l:'Боломжит ширхэг', v:'7 → 4 ширхэг' },
    ]}
    primaryTone={C.blue}
    primaryCta="Шинэ мэдээлэл харах"
    secondaryCta="Цуцлах"
  />
);

// 5 — OTP expired / wrong
const StateOtpError = () => (
  <StateScreen
    label="E5 — OTP error"
    tone={C.red}
    glyph={Glyphs.warn}
    title="OTP код буруу эсвэл хугацаа дууссан байна"
    desc="Баталгаажуулах кодыг буруу оруулсан эсвэл хүчинтэй хугацаа дууссан байна. Шинэ код авч дахин оролдоно уу."
    primaryCta="Дахин OTP авах"
    secondaryCta="Буцах"
  />
);

// 6 — Network / payment / server error
const StateNetworkError = () => (
  <StateScreen
    label="E6 — Network error"
    tone={C.red}
    glyph={Glyphs.retry}
    title="Үйлдэл амжилтгүй боллоо"
    desc="Түр хугацааны алдаа гарлаа. Та дахин оролдоно уу."
    primaryCta="Дахин оролдох"
    secondaryCta="Буцах"
  />
);
