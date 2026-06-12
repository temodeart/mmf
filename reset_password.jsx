// ============================================================
// Money Market Fund — Password reset flow
// Entered from Login → "Нууц үг мартсан?"
// Reuses tokens (C), Frame, BackBar, FooterCTA, OtpRow,
// OtpHeaderRow, PwField, SuccessScreen from earlier files.
// All copy in Mongolian Cyrillic. 390×844, white-first fintech.
// ============================================================

const { useState: useStateRP } = React;

// ---- Shared title block for the reset flow ----
const ResetIntro = ({ glyph, title, sub }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16, background: C.indigoSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {glyph}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 18, letterSpacing: '-0.02em', lineHeight: 1.12 }}>
      {title}
    </div>
    <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 320 }}>
      {sub}
    </div>
  </div>
);

const LockGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="3" stroke={C.indigo} strokeWidth="2"/>
    <path d="M8 10.5V8a4 4 0 018 0v2.5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="15.5" r="1.6" fill={C.indigo}/>
  </svg>
);

const ShieldGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" stroke={C.indigo} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const KeyGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="9" r="4.5" stroke={C.indigo} strokeWidth="2"/>
    <path d="M11 12l8 8M16 17l2-2M18 19l2-2" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================================
// R1 — RESET · Enter phone (no code sent yet)
// ============================================================
const ResetEnterPhone = () => (
  <Frame label="R1 — Reset · Phone">
    <BackBar title=""/>
    <div style={{ flex: 1, overflow: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
      <ResetIntro
        glyph={LockGlyph}
        title="Нууц үг сэргээх"
        sub="Бүртгэлтэй утасны дугаараа оруулна уу. Бид баталгаажуулах код илгээх болно."
      />

      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Утасны дугаар</div>
        <div style={{
          height: 52, borderRadius: 14, background: '#fff',
          border: `1.5px solid ${C.indigo}`, boxShadow: `0 0 0 4px ${C.indigoSoft}`,
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, paddingRight: 10, borderRight: `1px solid ${C.line}`, fontVariantNumeric: 'tabular-nums' }}>+976</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>9552 2981</span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <span>Зөвхөн бүртгэлтэй дугаар луу 6 оронтой код илгээгдэнэ.</span>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
    </div>
    <FooterCTA>
      Код илгээх
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </FooterCTA>
  </Frame>
);

// ============================================================
// R2 — RESET · Verify code
// ============================================================
const ResetVerifyCode = () => (
  <Frame label="R2 — Reset · Code">
    <BackBar title=""/>
    <div style={{ flex: 1, overflow: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
      <ResetIntro
        glyph={ShieldGlyph}
        title="Кодоо оруулна уу"
        sub={<><span style={{ color: C.ink, fontWeight: 700 }}>+976 9552 2981</span> дугаар луу илгээсэн 6 оронтой баталгаажуулах кодыг оруулна уу.</>}
      />

      <div style={{ marginTop: 28 }}>
        <OtpHeaderRow timer="00:38"/>
        <OtpRow filled={['3', '9', '1', '']}/>
        <div style={{ marginTop: 14, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
          Код хүлээж аваагүй бол <span style={{ color: C.muted2 }}>00:38</span>-ийн дараа дахин илгээх боломжтой.
        </div>
      </div>

      <div style={{
        marginTop: 18, padding: '14px 16px', borderRadius: 14,
        background: '#fff', border: `1px solid ${C.line2}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Дугаар буруу байна уу?</span>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: C.indigo, fontWeight: 700 }}>Өөрчлөх</span>
      </div>

      <div style={{ flex: 1 }}/>
    </div>
    <FooterCTA>Үргэлжлүүлэх</FooterCTA>
  </Frame>
);

// ============================================================
// R3 — RESET · New password
// ============================================================
const ResetNewPassword = () => {
  const [pw, setPw] = useStateRP('');
  const [pw2, setPw2] = useStateRP('');
  const [show, setShow] = useStateRP(false);
  const [show2, setShow2] = useStateRP(false);
  const rules = [
    { label: '8+ тэмдэгт', ok: pw.length >= 8 },
    { label: '1 том үсэг', ok: /[A-ZА-ЯӨҮ]/.test(pw) },
    { label: '1 тоо', ok: /\d/.test(pw) },
    { label: '1 тусгай тэмдэгт', ok: /[^A-Za-zА-Яа-яӨҮөү0-9]/.test(pw) },
  ];
  const allOk = rules.every(r => r.ok);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = allOk && pw2.length > 0 && pw === pw2;
  return (
    <Frame label="R3 — Reset · New password">
      <BackBar title=""/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
        <ResetIntro
          glyph={KeyGlyph}
          title="Шинэ нууц үг үүсгэх"
          sub="Хуучин нууц үгнээс ялгаатай, шинэ нууц үгээ оруулна уу."
        />

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PwField label="Шинэ нууц үг" value={pw} onChange={setPw} show={show} onToggle={() => setShow(s => !s)} placeholder="Шинэ нууц үгээ оруулна уу"/>
          <PwField label="Нууц үг давтах" value={pw2} onChange={setPw2} show={show2} onToggle={() => setShow2(s => !s)} error={mismatch} placeholder="Шинэ нууц үгээ давтан оруулна уу"/>
        </div>

        {mismatch && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: C.red }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={C.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
            Нууц үг таарахгүй байна
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {rules.map((r, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 999,
              background: r.ok ? C.greenSoft : '#F4F6FA', color: r.ok ? C.green : C.muted,
              fontSize: 12, fontWeight: 700, transition: 'all .15s',
            }}>
              {r.ok
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ width: 11, height: 11, borderRadius: 999, border: `2px solid ${C.muted2}` }}/>}
              {r.label}
            </div>
          ))}
        </div>
      </div>
      <FooterCTA>
        <span style={{ opacity: valid ? 1 : .6 }}>Нууц үг шинэчлэх</span>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// R4 — RESET · Success
// ============================================================
const ResetSuccess = () => (
  <SuccessScreen
    label="R4 — Reset · Success"
    tone={C.green}
    title="Нууц үг шинэчлэгдлээ"
    subtitle="Таны нууц үг амжилттай шинэчлэгдлээ. Шинэ нууц үгээрээ дансандаа нэвтэрнэ үү."
    rows={[
      { l: 'Бүртгэл', v: '+976 9552 2981' },
      { l: 'Шинэчилсэн', v: '2026.06.08 · 09:41' },
    ]}
    primaryCta="Нэвтрэх"
    secondaryCta="Тусламж авах"
  />
);

Object.assign(window, { ResetEnterPhone, ResetVerifyCode, ResetNewPassword, ResetSuccess });
