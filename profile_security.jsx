// ============================================================
// Money Market Fund — Profile · security & support screens
// Fills the four dead ProfileMain rows found in the flow audit:
//   ПИН код солих · Нууц үг солих · Хэл · Тусламж
// Reuses C, Frame, BackBar, FooterCTA, PinDots, Keypad, PwField,
// MenuGroup, Toggle, pIcon from screens.jsx / onboarding_v2.jsx / profile.jsx.
// Loaded after profile.jsx.
// ============================================================

const { useState: useStatePS } = React;

/* ── shared bits ─────────────────────────────────────────── */
const PsIntro = ({ glyph, title, sub }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{ width: 52, height: 52, borderRadius: 16, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>{glyph}</div>
    <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', marginTop: 16, lineHeight: 1.25 }}>{title}</div>
    <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.55 }}>{sub}</div>
  </div>
);

const PsPinGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="3" stroke={C.indigo} strokeWidth="2"/>
    <path d="M8 10.5V7.5a4 4 0 018 0v3" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="15.5" r="1.4" fill={C.indigo}/>
  </svg>
);
const PsKeyGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="8.5" cy="9" r="4.5" stroke={C.indigo} strokeWidth="2"/>
    <path d="M11.5 12l7 7M16 17l2-2 2 2" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PsGlobeGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2"/>
    <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" stroke={C.indigo} strokeWidth="2"/>
  </svg>
);
const PsHelpGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2"/>
    <path d="M9.5 9.2a2.6 2.6 0 113.6 2.4c-.85.4-1.1 1-1.1 1.9M12 17h.01" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PsDone = ({ title, sub, rows, cta, onCta }) => (
  <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'0 24px 24px' }}>
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div style={{ width: 78, height: 78, borderRadius: 26, background:`linear-gradient(135deg, ${C.green}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 16px 36px -14px rgba(14,159,110,.6)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 20, letterSpacing:'-0.02em' }}>{title}</div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 9, lineHeight: 1.55, maxWidth: 280 }}>{sub}</div>
      {rows && (
        <div style={{ width:'100%', marginTop: 22, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {rows.map(([l,v],i) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', gap:12, padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <span style={{ fontSize:12.5, color:C.muted, fontWeight:600 }}>{l}</span>
              <span style={{ fontSize:12.5, color:C.ink, fontWeight:700 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    <button onClick={onCta} style={{ width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight:700, fontSize: 15, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>{cta}</button>
  </div>
);

/* ══════════════════════════════════════════════════════════
   ПИН код солих — current → new → confirm → done
   Demo rule: current PIN is 1234; anything else shows the error state.
   ══════════════════════════════════════════════════════════ */
const PinChange = ({ onNav }) => {
  const [stage, setStage] = useStatePS('current');   // current | create | confirm | done
  const [cur, setCur] = useStatePS('');
  const [pin, setPin] = useStatePS('');
  const [rep, setRep] = useStatePS('');
  const [error, setError] = useStatePS('');
  const [tries, setTries] = useStatePS(0);

  const active = stage === 'current' ? cur : stage === 'create' ? pin : rep;
  const locked = tries >= 3;

  const onKey = (n) => {
    if (stage === 'done' || locked || active.length >= 4) return;
    const next = active + n;
    if (stage === 'current') {
      setError(''); setCur(next);
      if (next.length === 4) setTimeout(() => {
        if (next === '1234') { setStage('create'); setCur(''); setTries(0); }
        else {
          const t = tries + 1;
          setTries(t); setCur('');
          setError(t >= 3 ? 'Хэт олон удаа буруу оруулсан. Дэмжлэгийн багтай холбогдоно уу.' : `ПИН код буруу. ${3 - t} оролдлого үлдлээ.`);
        }
      }, 180);
    } else if (stage === 'create') {
      setError(''); setPin(next);
      if (next.length === 4) setTimeout(() => {
        if (next === '1234') { setPin(''); setError('Шинэ ПИН код хуучнаас ялгаатай байх шаардлагатай.'); }
        else if (/^(\d)\1{3}$/.test(next) || next === '1111' || next === '0000') { setPin(''); setError('Дөрвөн ижил тоо ПИН код болгож болохгүй.'); }
        else setStage('confirm');
      }, 180);
    } else {
      setError(''); setRep(next);
      if (next.length === 4) setTimeout(() => {
        if (next === pin) setStage('done');
        else { setRep(''); setError('ПИН код таарахгүй байна. Дахин оруулна уу.'); }
      }, 180);
    }
  };
  const onDel = () => {
    if (stage === 'current') setCur(v => v.slice(0,-1));
    else if (stage === 'create') setPin(v => v.slice(0,-1));
    else setRep(v => v.slice(0,-1));
  };

  const copy = {
    current: { t:'Одоогийн ПИН кодоо оруулна уу', s:'Шинэ ПИН код тохируулахын тулд эхлээд одоогийн кодоо баталгаажуулна уу.' },
    create:  { t:'Шинэ ПИН код үүсгэх', s:'Гүйлгээ баталгаажуулахад ашиглах 4 оронтой шинэ код сонгоно уу.' },
    confirm: { t:'Шинэ ПИН кодоо давтана уу', s:'Сонгосон кодоо дахин оруулснаар тохиргоо хадгалагдана.' },
  };

  return (
    <Frame label="Profile · PIN change">
      <BackBar title="ПИН код солих"/>
      {stage === 'done' ? (
        <PsDone
          title="ПИН код шинэчлэгдлээ"
          sub="Дараагийн гүйлгээнээс шинэ ПИН кодоо ашиглана. Бүх төхөөрөмж дээр нэн даруй хүчинтэй."
          rows={[['Шинэчилсэн', '2026.07.29 · 14:12'], ['Хүчинтэй', 'Бүх төхөөрөмжид']]}
          cta="Профайл руу" onCta={() => onNav && onNav('profile')}/>
      ) : (
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'0 24px 18px', overflow:'auto' }}>
          <PsIntro glyph={PsPinGlyph} title={copy[stage].t} sub={copy[stage].s}/>
          <div style={{ display:'flex', gap:6, marginTop:18 }}>
            {['current','create','confirm'].map(s => (
              <span key={s} style={{ flex:1, height:4, borderRadius:999, background: (s==='current') || (s==='create'&&stage!=='current') || (s==='confirm'&&stage==='confirm') ? C.indigo : C.line }}/>
            ))}
          </div>
          <div style={{ marginTop: 30, display:'flex', flexDirection:'column', alignItems:'center', gap: 14 }}>
            <PinDots count={active.length} error={!!error}/>
            <div style={{ minHeight: 34, fontSize: 12.5, fontWeight: 700, color: error ? C.red : C.muted, textAlign:'center', maxWidth: 280, lineHeight:1.45 }}>
              {error || (stage === 'current' ? 'Демо: 1234' : 'Хэн нэгэн харж байгаа эсэхийг шалгаарай')}
            </div>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 12, opacity: locked ? .4 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
            <Keypad onKey={onKey} onDel={onDel}/>
          </div>
          {locked && (
            <button onClick={() => onNav && onNav('help')} style={{ marginTop: 14, width:'100%', height: 50, borderRadius: 14, background:'#fff', border:`1.5px solid ${C.line}`, color: C.ink, fontWeight:700, fontSize: 14, cursor:'pointer', fontFamily:'inherit' }}>Дэмжлэгтэй холбогдох</button>
          )}
        </div>
      )}
    </Frame>
  );
};

/* ══════════════════════════════════════════════════════════
   Нууц үг солих — current + new + repeat → done
   ══════════════════════════════════════════════════════════ */
const PasswordChange = ({ onNav }) => {
  const [stage, setStage] = useStatePS('form');
  const [cur, setCur] = useStatePS('');
  const [pw, setPw] = useStatePS('');
  const [pw2, setPw2] = useStatePS('');
  const [s0, setS0] = useStatePS(false);
  const [s1, setS1] = useStatePS(false);
  const [s2, setS2] = useStatePS(false);
  const [curErr, setCurErr] = useStatePS('');

  const rules = [
    { label: '8+ тэмдэгт', ok: pw.length >= 8 },
    { label: '1 том үсэг', ok: /[A-ZА-ЯӨҮ]/.test(pw) },
    { label: '1 тоо', ok: /\d/.test(pw) },
    { label: '1 тусгай тэмдэгт', ok: /[^A-Za-zА-Яа-яӨҮөү0-9]/.test(pw) },
    { label: 'Хуучнаас ялгаатай', ok: pw.length > 0 && pw !== cur },
  ];
  const allOk = rules.every(r => r.ok);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = allOk && pw2.length > 0 && pw === pw2 && cur.length >= 4;

  const submit = () => {
    if (!valid) return;
    if (cur !== 'Password1!') { setCurErr('Одоогийн нууц үг буруу байна. Демо: Password1!'); return; }
    setCurErr(''); setStage('done');
  };

  if (stage === 'done') return (
    <Frame label="Profile · password changed">
      <BackBar title="Нууц үг солих"/>
      <PsDone
        title="Нууц үг шинэчлэгдлээ"
        sub="Бусад төхөөрөмж дээрх нэвтрэлт хаагдлаа. Шинэ нууц үгээрээ дахин нэвтэрнэ үү."
        rows={[['Шинэчилсэн', '2026.07.29 · 14:12'], ['Бусад төхөөрөмж', 'Гарсан']]}
        cta="Профайл руу" onCta={() => onNav && onNav('profile')}/>
    </Frame>
  );

  return (
    <Frame label="Profile · password change">
      <BackBar title="Нууц үг солих"/>
      <div style={{ flex:1, overflow:'auto', padding:'0 24px 24px' }}>
        <PsIntro glyph={PsKeyGlyph} title="Нууц үг солих" sub="Аюулгүй байдлын үүднээс шинэ нууц үг нь хуучнаас ялгаатай байх шаардлагатай."/>
        <div style={{ marginTop: 24, display:'flex', flexDirection:'column', gap: 16 }}>
          <PwField label="Одоогийн нууц үг" value={cur} onChange={v => { setCur(v); setCurErr(''); }} show={s0} onToggle={() => setS0(s => !s)} error={!!curErr} placeholder="Одоогийн нууц үгээ оруулна уу"/>
          {curErr && (
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:C.red, marginTop:-8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={C.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
              {curErr}
            </div>
          )}
          <PwField label="Шинэ нууц үг" value={pw} onChange={setPw} show={s1} onToggle={() => setS1(s => !s)} placeholder="Шинэ нууц үгээ оруулна уу"/>
          <PwField label="Нууц үг давтах" value={pw2} onChange={setPw2} show={s2} onToggle={() => setS2(s => !s)} error={mismatch} placeholder="Шинэ нууц үгээ давтан оруулна уу"/>
        </div>
        {mismatch && (
          <div style={{ marginTop: 10, display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:C.red }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={C.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
            Нууц үг таарахгүй байна
          </div>
        )}
        <div style={{ marginTop: 18, display:'flex', flexWrap:'wrap', gap: 8 }}>
          {rules.map((r, i) => (
            <div key={i} style={{ display:'inline-flex', alignItems:'center', gap: 7, padding:'8px 12px', borderRadius: 999, background: r.ok ? C.greenSoft : '#F4F6FA', color: r.ok ? C.green : C.muted, fontSize: 12, fontWeight: 700, transition:'all .15s' }}>
              {r.ok
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ width: 11, height: 11, borderRadius: 999, border: `2px solid ${C.muted2}` }}/>}
              {r.label}
            </div>
          ))}
        </div>
      </div>
      <FooterCTA onClick={submit}>
        <span style={{ opacity: valid ? 1 : .55 }}>Нууц үг шинэчлэх</span>
      </FooterCTA>
    </Frame>
  );
};

/* ══════════════════════════════════════════════════════════
   Хэл — interface language, persisted so the choice survives reload
   ══════════════════════════════════════════════════════════ */
const PS_LANGS = [
  { k:'mn', l:'Монгол', n:'Mongolian', ready:true },
  { k:'en', l:'English', n:'Англи хэл', ready:false },
];
const LangScreen = ({ onNav }) => {
  const [lang, setLang] = useStatePS(() => { try { return localStorage.getItem('mmf_lang') || 'mn'; } catch(e) { return 'mn'; } });
  const pick = (k) => { setLang(k); try { localStorage.setItem('mmf_lang', k); } catch(e) {} };
  return (
    <Frame label="Profile · language">
      <BackBar title="Хэл"/>
      <div style={{ flex:1, overflow:'auto', padding:'0 24px 24px' }}>
        <PsIntro glyph={PsGlobeGlyph} title="Интерфэйсийн хэл" sub="Апп-ын цэс, товч, мэдэгдлийн хэлийг сонгоно уу."/>
        <div style={{ marginTop: 22, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {PS_LANGS.map((L, i) => {
            const on = lang === L.k;
            return (
              <button key={L.k} onClick={() => pick(L.k)} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding:'15px 14px', background:'transparent', border:'none', borderTop: i ? `1px solid ${C.line2}` : 'none', cursor:'pointer', fontFamily:'inherit' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{L.l}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{L.ready ? L.n : L.n + ' · орчуулга удахгүй'}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${on ? C.indigo : C.line}`, background: on ? C.indigo : '#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
        {lang === 'en' && (
          <div style={{ marginTop: 14, display:'flex', gap: 9, alignItems:'flex-start', padding:'13px 14px', borderRadius: 14, background: C.indigoSoft }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>Англи орчуулга бэлтгэгдэж байна. Бэлэн болтол апп монголоор харагдана.</div>
          </div>
        )}
      </div>
      <FooterCTA onClick={() => onNav && onNav('profile')}>Хадгалах</FooterCTA>
    </Frame>
  );
};

/* ══════════════════════════════════════════════════════════
   Тусламж — support channels + FAQ
   ══════════════════════════════════════════════════════════ */
const PS_CHANNELS = [
  { k:'phone', l:'Утсаар холбогдох', v:'+976 7000 1234', sub:'Даваа–Баасан 09:00–18:00' },
  { k:'mail',  l:'И-мэйл',           v:'support@mmf.mn', sub:'1 ажлын өдөрт хариу' },
  { k:'chat',  l:'Чат дэмжлэг',      v:'Апп дотор',      sub:'Ажлын цагаар шуурхай' },
];
const PS_FAQ = [
  ['Хугацаанаас өмнө мөнгөө авч болох уу?', 'Болно. Хэтэвч → Миний бүтээгдэхүүн дээрээс тухайн бүтээгдэхүүнээ сонгоод "Хоёрдогч зах зээлд зарах" захиалга үүсгэнэ. Худалдан авагч гарсан үед мөнгө хэтэвчинд шилжинэ.'],
  ['Өгөөж хэзээ, хэрхэн тооцогдох вэ?', 'Хугацааны эцэст үндсэн дүн болон хүү (10% татварыг хассан) хэтэвчинд автоматаар шилжинэ. Дундуур нь ямар нэг үйлдэл шаардахгүй.'],
  ['Зарлага хэр хугацаанд шилжих вэ?', 'Ажлын цагаар 15 минут дотор, ажлын бус цагт дараагийн ажлын өдөр банкны дансанд тусна.'],
  ['ПИН кодоо мартвал?', 'Профайл → ПИН код солих хэсгээр одоогийн кодоо баталгаажуулаад шинээр тохируулна. Кодоо бүрэн мартсан бол дэмжлэгийн багтай холбогдоно уу.'],
  ['Зээлийн хүсэлт яагаад татгалзагдав?', 'ЗМС-ийн шалгалт, хөрөнгийн үнэлгээ, эсвэл нэг өдөрт нэг хүсэлт гэсэн хязгаараас хамаарна. Татгалзсан шалтгааныг мэдэгдлээр хүргэнэ.'],
];
const HelpScreen = ({ onNav }) => {
  const [openQ, setOpenQ] = useStatePS(null);
  const chIcon = (k) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {k === 'phone' ? <path d="M5 3h3l2 5-2.5 1.5a12 12 0 006 6L15 13l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2A2 2 0 015 3z"/>
       : k === 'mail' ? <><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></>
       : <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z"/>}
    </svg>
  );
  return (
    <Frame label="Profile · help">
      <BackBar title="Тусламж"/>
      <div style={{ flex:1, overflow:'auto', padding:'0 24px 28px' }}>
        <PsIntro glyph={PsHelpGlyph} title="Тусламж, холбоо барих" sub="Асуултаа шийдэх хамгийн хурдан арга — доорх сувгуудаас сонгоно уу."/>

        <div style={{ marginTop: 22, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {PS_CHANNELS.map((c, i) => (
            <div key={c.k} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{chIcon(c.k)}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{c.l}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{c.v} · {c.sub}</div>
              </div>
              {c.k === 'chat'
                ? <span style={{ flexShrink:0, fontSize: 11, fontWeight: 800, color: C.muted, background:'#F4F6FA', padding:'5px 9px', borderRadius: 999 }}>Удахгүй</span>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'22px 4px 8px' }}>Түгээмэл асуулт</div>
        <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {PS_FAQ.map(([q, a], i) => (
            <div key={i} style={{ borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <button onClick={() => setOpenQ(openQ === i ? null : i)} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'flex-start', gap: 10, padding:'13px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ flex:1, fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.4 }}>{q}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 3, transform: openQ === i ? 'rotate(180deg)' : 'none', transition:'transform .16s' }}><path d="M6 9l6 6 6-6" stroke={C.muted2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {openQ === i && <div style={{ padding:'0 14px 14px', fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>{a}</div>}
            </div>
          ))}
        </div>

        <button onClick={() => onNav && onNav('terms')} style={{ marginTop: 18, width:'100%', height: 50, borderRadius: 14, background:'#fff', border:`1.5px solid ${C.line}`, color: C.ink, fontWeight: 700, fontSize: 14, cursor:'pointer', fontFamily:'inherit' }}>Үйлчилгээний нөхцөл харах</button>
      </div>
    </Frame>
  );
};

Object.assign(window, { PinChange, PasswordChange, LangScreen, HelpScreen });
