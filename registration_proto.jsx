// ============================================================
// Registration / Login — connected clickable prototype
// Renders the ACTUAL screens from the main app, unchanged, one at
// a time, and wires each screen's real CTA buttons to the right
// next screen (incl. the e-sign / g-sign branch). Ends on Home.
// Toggles, keypad, inputs, signature pad all stay interactive.
// ============================================================

const { useState: useStateRP2, useEffect: useEffectRP2, useRef: useRefRP2 } = React;

// ---- Ordered flow. `el` is the real component, rendered as-is. ----
// `nav`: [substringOfClickedButtonText, targetScreenId] — first match wins.
// `tap`: target id for screens with no forward button (waiting / sheets).
const RP_FLOW = [
  { id:'splash',       sect:'Эхлэл',     name:'Splash',                el:<Splash/>,
    nav:[['Бүртгүүлэх','onb1'], ['Нэвтрэх','login']] },

  { id:'login',        sect:'Нэвтрэх',   name:'Нэвтрэх / Бүртгүүлэх',  el:<Login/>,
    nav:[['Нууц үг мартсан','reset1'], ['Шинэ хэрэглэгч','onb1'], ['Бүртгүүлэх','onb1'], ['Нэвтрэх','home']] },

  { id:'onb1', sect:'Танилцуулга', name:'Онбординг 1', el:<Onb1/>, nav:[['Алгасах','phone'], ['Үргэлжлүүлэх','onb2']] },
  { id:'onb2', sect:'Танилцуулга', name:'Онбординг 2', el:<Onb2/>, nav:[['Алгасах','phone'], ['Үргэлжлүүлэх','onb3']] },
  { id:'onb3', sect:'Танилцуулга', name:'Онбординг 3', el:<Onb3/>, nav:[['Алгасах','phone'], ['Үргэлжлүүлэх','onb4']] },
  { id:'onb4', sect:'Танилцуулга', name:'Онбординг 4', el:<Onb4/>, nav:[['Алгасах','phone'], ['Эхлэх','phone'], ['Үргэлжлүүлэх','phone']] },

  { id:'phone',     sect:'Бүртгэл', name:'Утас баталгаажуулах',   el:<PhoneVerify/>,    nav:[['Үргэлжлүүлэх','email']] },
  { id:'email',     sect:'Бүртгэл', name:'И-мэйл баталгаажуулах', el:<EmailVerify/>,    nav:[['Үргэлжлүүлэх','password']] },
  { id:'password',  sect:'Бүртгэл', name:'Нууц үг үүсгэх',        el:<CreatePassword/>, nav:[['Үргэлжлүүлэх','pin']] },
  { id:'pin',       sect:'Бүртгэл', name:'Гүйлгээний PIN',        el:<CreatePin/>,      nav:[['Үргэлжлүүлэх','biometric']] },
  { id:'biometric', sect:'Бүртгэл', name:'Биометр тохиргоо',      el:<BiometricSetup/>, nav:[['Идэвхжүүлэх','kyc'], ['Алгасах','kyc']] },

  { id:'kyc',          sect:'KYC', name:'ДАН зөвшөөрөл', el:<KycConsent/>,   nav:[['баталгаажуулах','monpep']] },
  { id:'monpep',       sect:'KYC', name:'MONPEP шалгалт',      el:<MonpepCheck/>,  nav:[['Шалгалт хийхийг','terms']], tap:'terms' },
  { id:'monpepFailed', sect:'KYC', name:'MONPEP — амжилтгүй',  el:<MonpepFailed/>, tap:'monpep' },

  { id:'terms',    sect:'Гэрээ', name:'Үйлчилгээний нөхцөл', el:<TermsOfUse/>,     nav:[['Зөвшөөрөх','contract']] },
  { id:'contract', sect:'Гэрээ', name:'Мастер гэрээ',        el:<MasterContract/>, nav:[['Гэрээ байгуулах','signing']] },
  { id:'signing',  sect:'Гэрээ', name:'Гарын үсгийн арга',   el:<SigningMethod/>,
    nav:[['Цахимаар зурах','esignCanvas'], ['хэрхэн ашиглах','gsignTutorial'], ['G-Sign ашиглах','gsignRequest']] },

  { id:'esignCanvas',  sect:'Цахим гарын үсэг', name:'Гарын үсэг зурах', el:<ESignCanvas/>,
    nav:[['Гарын үсэг баталгаажуулах','esignSuccess']] },
  { id:'esignSuccess', sect:'Цахим гарын үсэг', name:'Амжилттай',        el:<ESignSuccess/>,
    nav:[['Данс баталгаажуулах','bankVerify'], ['G-Sign-ээр','gsignRequest']] },

  { id:'gsignRequest',  sect:'G-Sign', name:'G-Sign хүсэлт',       el:<GSignRequest/>,
    nav:[['хүсэлт илгээх','gsignWaiting'], ['хэрхэн ашиглах','gsignTutorial']] },
  { id:'gsignWaiting',  sect:'G-Sign', name:'G-Sign хүлээж байна', el:<GSignWaiting/>,  tap:'gsignSuccess' },
  { id:'gsignSuccess',  sect:'G-Sign', name:'G-Sign амжилттай',    el:<GSignSuccess/>,
    nav:[['Данс баталгаажуулах','bankVerify']] },
  { id:'gsignTutorial', sect:'G-Sign', name:'G-Sign заавар',       el:<GSignTutorial/>, overlay:true, nav:[['Ойлголоо','__back']] },

  { id:'bankVerify',   sect:'Данс', name:'Данс баталгаажуулах', el:<BankVerify/>,       nav:[['Данс шалгах','bankChecking']] },
  { id:'ibanSheet',    sect:'Данс', name:'IBAN лавлах · хайх',  el:<IbanLookupSheet/>,  overlay:true, nav:[['Хуулах','__back']] },
  { id:'ibanResult',   sect:'Данс', name:'IBAN лавлах · үр дүн', el:<IbanLookupResult/>, overlay:true, nav:[['Хуулах','__back']] },
  { id:'bankChecking', sect:'Данс', name:'Данс шалгаж байна',   el:<BankChecking/>,     tap:'bankVerified' },
  { id:'bankVerified', sect:'Данс', name:'Данс баталгаажлаа',   el:<BankVerified/>,     nav:[['Үргэлжлүүлэх','kycComplete']] },
  { id:'kycComplete',  sect:'Данс', name:'KYC бүрэн дууссан',   el:<KycComplete/>,      nav:[['Нүүр хуудас','home']] },

  { id:'home', sect:'Нүүр', name:'Нүүр хуудас', el:<Home activeTab="home" onNav={()=>{}} signMethod="gsign"/> },

  { id:'reset1', sect:'Нууц үг сэргээх', name:'Утас оруулах',  el:<ResetEnterPhone/>,  nav:[['Код илгээх','reset2']] },
  { id:'reset2', sect:'Нууц үг сэргээх', name:'Кодоо оруулах', el:<ResetVerifyCode/>,  nav:[['Үргэлжлүүлэх','reset3'], ['Өөрчлөх','reset1']] },
  { id:'reset3', sect:'Нууц үг сэргээх', name:'Шинэ нууц үг',  el:<ResetNewPassword/>, nav:[['Нууц үг шинэчлэх','reset4']] },
  { id:'reset4', sect:'Нууц үг сэргээх', name:'Амжилттай',     el:<ResetSuccess/>,     nav:[['Нэвтрэх','login'], ['Тусламж','login']] },
];

const RP_INDEX = {};
RP_FLOW.forEach((f, k) => { RP_INDEX[f.id] = k; });

const RP_KEY = 'mmf_reg_proto_id';
const rp_norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

const IconBtn = ({ dir, disabled, onClick }) => (
  <button onClick={disabled ? undefined : onClick} aria-label={dir === 'prev' ? 'Өмнөх' : 'Дараах'} style={{
    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
    border: 'none', cursor: disabled ? 'default' : 'pointer',
    background: disabled ? '#EEF0F6' : '#0B1020', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: dir === 'prev' ? 'scaleX(-1)' : 'none' }}>
      <path d="M9 6l6 6-6 6" stroke={disabled ? '#9099B5' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

function RegProtoApp() {
  const startIdx = (() => {
    const id = localStorage.getItem(RP_KEY);
    return (id && id in RP_INDEX) ? RP_INDEX[id] : 0;
  })();
  // history stack — so back / Буцах return to the actual previous screen
  const [hist, setHist] = useStateRP2([startIdx]);
  const [menu, setMenu] = useStateRP2(false);
  const hostRef = useRefRP2(null);
  const i = hist[hist.length - 1];

  useEffectRP2(() => { localStorage.setItem(RP_KEY, RP_FLOW[i].id); }, [i]);

  const navTo = (n) => {
    const t = Math.max(0, Math.min(RP_FLOW.length - 1, n));
    setHist(h => (h[h.length - 1] === t ? h : [...h, t]));
    setMenu(false);
  };
  const back = () => { setHist(h => (h.length > 1 ? h.slice(0, -1) : h)); setMenu(false); };
  const goIndex = (n) => navTo(n);
  const next = () => navTo(i + 1);

  // route a nav target id (or special token) from a click rule
  const route = (to) => {
    if (to === '__back') back();
    else if (to === '__next') next();
    else if (to in RP_INDEX) navTo(RP_INDEX[to]);
  };

  // keyboard nav — → forward, ← back through history
  useEffectRP2(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
      else if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hist]);

  // fit the 390×844 phone into the available space (above the dock)
  useEffectRP2(() => {
    const fit = () => {
      const el = hostRef.current;
      if (!el) return;
      const s = Math.min((window.innerHeight - 150) / 844, (window.innerWidth - 48) / 390, 1);
      el.style.transform = `scale(${s})`;
      el.style.width = (390 * s) + 'px';
      el.style.height = (844 * s) + 'px';
    };
    fit();
    window.addEventListener('resize', fit);
    const id = setInterval(fit, 400);
    return () => { window.removeEventListener('resize', fit); clearInterval(id); };
  }, []);

  // route clicks on the screen's real controls to the right destination
  const onHostClick = (e) => {
    // genuine interactive controls (and external links) keep their own behavior
    if (e.target.closest('input, textarea, select, canvas, a')) return;

    const screen = RP_FLOW[i];
    const btn = e.target.closest('button');
    const text = rp_norm(btn ? btn.textContent : e.target.textContent);

    // 1. this screen's explicit nav rules (CTA labels, branch buttons, overlay closes)
    for (const [m, to] of (screen.nav || [])) {
      if (text && text.includes(rp_norm(m))) { route(to); return; }
    }
    // 2. header / footer BACK — chevron glyph or "Буцах" text
    if (btn && (btn.querySelector('path[d="M15 6l-6 6 6 6"]') || (text && text.includes('буцах')))) { back(); return; }
    // 3. overlay CLOSE — an X glyph
    if (btn && btn.querySelector('path[d="M6 6l12 12M18 6l-12 12"]')) { back(); return; }
    // 4. SKIP — "Алгасах" advances past the step
    if (text && text.includes('алгасах')) { next(); return; }
    // 5. a button that matched nothing = toggle / keypad / picker → let it work
    if (btn) return;
    // 6. tap on backdrop / empty area
    if (screen.overlay) { back(); return; }
    if (screen.tap && screen.tap in RP_INDEX) navTo(RP_INDEX[screen.tap]);
  };

  const cur = RP_FLOW[i];
  const atHome = cur.id === 'home';

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* top label */}
      <div style={{ position: 'fixed', top: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 30 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(11,16,32,0.06)', boxShadow: '0 8px 24px -16px rgba(15,20,55,.4)',
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/>
            <path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/>
          </svg>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0B1020', letterSpacing: '-0.01em' }}>Бүртгэл &amp; нэвтрэлт · Прототип</span>
        </div>
      </div>

      {/* scaled phone */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0 }}>
        <div ref={hostRef} className="rp-host" style={{ transformOrigin: 'top left' }} onClick={onHostClick}>
          <div key={cur.id} className="rp-screen">{cur.el}</div>
        </div>
      </div>

      {/* bottom dock */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 30,
        display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 20,
        background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(11,16,32,0.06)', boxShadow: '0 18px 50px -18px rgba(15,20,55,.5)',
      }}>
        <IconBtn dir="prev" disabled={hist.length <= 1} onClick={back}/>

        <button onClick={() => setMenu(m => !m)} style={{
          minWidth: 220, height: 46, padding: '0 16px', borderRadius: 13, cursor: 'pointer',
          background: '#fff', border: '1px solid #E7E9F2',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 1,
        }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9099B5' }}>{cur.sect}</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0B1020', letterSpacing: '-0.01em' }}>{cur.name}</span>
        </button>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: '#6B7191', padding: '0 4px', minWidth: 48, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
          {String(i + 1).padStart(2, '0')} / {RP_FLOW.length}
        </div>

        <IconBtn dir="next" disabled={i === RP_FLOW.length - 1} onClick={next}/>
      </div>

      {/* tap-to-continue hint (CTA buttons in-screen advance the flow) */}
      {!atHome && (
        <div style={{ position: 'fixed', bottom: 78, left: '50%', transform: 'translateX(-50%)', zIndex: 25, pointerEvents: 'none' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9099B5', letterSpacing: '-0.005em' }}>
            Дэлгэц дээрх товчийг дарж урагшилна уу · ← → товчоор шилжинэ
          </div>
        </div>
      )}

      {/* quick-jump menu */}
      {menu && (
        <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 35, background: 'rgba(5,11,31,0.32)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            width: 320, maxHeight: '64vh', overflowY: 'auto',
            background: '#fff', borderRadius: 20, border: '1px solid #E7E9F2',
            boxShadow: '0 30px 70px -24px rgba(15,20,55,.55)', padding: 8,
          }}>
            {RP_FLOW.map((s, idx) => {
              const first = idx === 0 || RP_FLOW[idx - 1].sect !== s.sect;
              return (
                <React.Fragment key={s.id}>
                  {first && <div style={{ padding: '12px 12px 6px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9099B5' }}>{s.sect}</div>}
                  <button onClick={() => goIndex(idx)} style={{
                    width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 11, cursor: 'pointer',
                    border: 'none', background: idx === i ? '#EEF0FE' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 600, color: idx === i ? '#4F46E5' : '#9099B5', width: 22 }}>{String(idx + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: 13.5, fontWeight: idx === i ? 700 : 600, color: idx === i ? '#4F46E5' : '#2A3052' }}>{s.name}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { RegProtoApp });
