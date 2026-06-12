// ============================================================
// Money Market Fund — FULL APP connected prototype
// Reuses the registration flow (RP_FLOW from registration_proto.jsx)
// for auth, then wires the app shell (tabs) + trading / wallet / loan
// flows. One real screen at a time; CTAs + bottom tabs are live.
// ============================================================

const { useState: useStateAP, useEffect: useEffectAP, useRef: useRefAP } = React;
const ap_norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const AP_TABS = ['нүүр', 'арилжаа', 'зээл', 'хэтэвч', 'мэдээ'];

// ----- App shell (tabs) + flows. Auth comes from RP_FLOW. -----
// kind: 'hub' (tab screen, only explicit nav rules + live bottom tabs)
//        'flow' (CTA / empty-tap advances to `next`; branch via `nav`)
//        'linear' (auth; explicit `nav` rules + `tap`/overlay)
const AP_APP = [
  { id:'home',   sect:'Апп', name:'Нүүр хуудас', kind:'hub', render:(go)=><Home activeTab="home" onNav={go} loanState="check-eligibility"/>,
    nav:[['Зээлийн хүсэлт','loanEntry'], ['Орлого','addAmount'], ['Зарлага','wdAmount']] },
  { id:'trade',  sect:'Апп', name:'Арилжаа', kind:'hub', render:(go)=><Trading activeTab="trade" onNav={go}/>,
    nav:[['Авах','primaryDetail']] },
  { id:'loan',   sect:'Апп', name:'Зээл', kind:'hub', render:(go)=><Loan activeTab="loan" onNav={go}/>,
    nav:[['Зээлийн хүсэлт','loanEntry']] },
  { id:'wallet', sect:'Апп', name:'Хэтэвч', kind:'hub', render:(go)=><Wallet activeTab="wallet" onNav={go}/>,
    nav:[['Орлого','addAmount'], ['Зарлага','wdAmount']] },
  { id:'news',   sect:'Апп', name:'Мэдээ', kind:'hub', render:(go)=><News activeTab="news" onNav={go}/> },

  // Trading · primary buy
  { id:'primaryDetail',     sect:'Худалдан авах', name:'Бүтээгдэхүүн',  kind:'flow', el:<PrimaryDetail/>,      next:'primaryBuySetup' },
  { id:'primaryBuySetup',   sect:'Худалдан авах', name:'Захиалга',      kind:'flow', el:<PrimaryBuySetup/>,    next:'primaryBuyReview' },
  { id:'primaryBuyReview',  sect:'Худалдан авах', name:'Баталгаажуулах', kind:'flow', el:<PrimaryBuyReview/>,  next:'primaryBuySuccess' },
  { id:'primaryBuySuccess', sect:'Худалдан авах', name:'Амжилттай',     kind:'flow', el:<PrimaryBuySuccess/>,  next:'home' },

  // Trading · secondary buy
  { id:'secondaryDetail',     sect:'Хоёрдогч зах', name:'Зарах санал',   kind:'flow', el:<SecondaryDetail/>,     next:'secondaryBuySetup' },
  { id:'secondaryBuySetup',   sect:'Хоёрдогч зах', name:'Захиалга',      kind:'flow', el:<SecondaryBuySetup/>,   next:'secondaryBuyReview' },
  { id:'secondaryBuyReview',  sect:'Хоёрдогч зах', name:'Баталгаажуулах', kind:'flow', el:<SecondaryBuyReview/>, next:'secondaryBuySuccess' },
  { id:'secondaryBuySuccess', sect:'Хоёрдогч зах', name:'Амжилттай',     kind:'flow', el:<SecondaryBuySuccess/>, next:'trade' },

  // Trading · sell
  { id:'ownedDetail', sect:'Зарах', name:'Багцын бүтээгдэхүүн', kind:'flow', el:<OwnedDetail/>, next:'sellSetup' },
  { id:'sellSetup',   sect:'Зарах', name:'Зарах тохиргоо',      kind:'flow', el:<SellSetup/>,   next:'sellReview' },
  { id:'sellReview',  sect:'Зарах', name:'Баталгаажуулах',      kind:'flow', el:<SellReview/>,  next:'sellSuccess' },
  { id:'sellSuccess', sect:'Зарах', name:'Амжилттай',           kind:'flow', el:<SellSuccess/>, next:'wallet' },

  // Wallet · add money
  { id:'addAmount',  sect:'Цэнэглэх', name:'Дүн ба арга', kind:'flow', el:<AddMoneyAmount/>,  nav:[['Үргэлжлүүлэх','addQpay']] },
  { id:'addQpay',    sect:'Цэнэглэх', name:'QPay',        kind:'flow', el:<AddMoneyQPay/>,    next:'addSuccess' },
  { id:'addBank',    sect:'Цэнэглэх', name:'Шилжүүлэг',   kind:'flow', el:<AddMoneyBank/>,    next:'addSuccess' },
  { id:'addSuccess', sect:'Цэнэглэх', name:'Амжилттай',   kind:'flow', el:<AddMoneySuccess/>, next:'wallet' },

  // Wallet · withdraw
  { id:'wdAmount',       sect:'Зарлага', name:'Дүн',            kind:'flow', el:<WithdrawAmount/>,       next:'wdReview' },
  { id:'wdReview',       sect:'Зарлага', name:'Баталгаажуулах', kind:'flow', el:<WithdrawReview/>,       next:'wdSuccess' },
  { id:'wdSuccess',      sect:'Зарлага', name:'Амжилттай',      kind:'flow', el:<WithdrawSuccess/>,      next:'wallet' },
  { id:'wdInsufficient', sect:'Зарлага', name:'Үлдэгдэл хүрэлцэхгүй', kind:'flow', el:<WithdrawInsufficient/>, nav:[['цэнэглэх','addAmount'], ['засах','wdAmount']] },

  // Loan flow
  { id:'loanEntry',     sect:'Зээл', name:'Зээлийн хүсэлт',      kind:'flow', el:<LoanCheckEntry/>, next:'loanQpay' },
  { id:'loanQpay',      sect:'Зээл', name:'Төлбөр',             kind:'flow', el:<QPayPayment/>,     next:'loanConfirmed' },
  { id:'loanConfirmed', sect:'Зээл', name:'Төлбөр баталгаажлаа', kind:'flow', el:<PayConfirmed/>,   next:'loanChecking' },
  { id:'loanChecking',  sect:'Зээл', name:'Хянаж байна',        kind:'flow', el:<ZmsChecking/>,     next:'loanAccepted' },
  { id:'loanAccepted',  sect:'Зээл', name:'Зөвшөөрөгдлөө',      kind:'flow', el:<LoanAccepted/>,    next:'loanSubmitted' },
  { id:'loanPartial',   sect:'Зээл', name:'Хэсэгчлэн зөвшөөрөв', kind:'flow', el:<LoanPartial/>,    next:'loanSubmitted' },
  { id:'loanSubmitted', sect:'Зээл', name:'Зээл олгогдлоо',     kind:'flow', el:<LoanSubmitted/>,   next:'home' },
  { id:'loanDeclined',  sect:'Зээл', name:'Татгалзагдлаа',      kind:'flow', el:<LoanDeclined/>,    next:'home' },
];

// Auth flow from registration_proto (drop its standalone Home; ours is the hub)
const AP_AUTH = (window.RP_FLOW || []).filter(f => f.id !== 'home');
const AP_FLOW = [...AP_AUTH, ...AP_APP];
const AP_INDEX = {};
AP_FLOW.forEach((f, k) => { AP_INDEX[f.id] = k; });

const AP_KEY = 'mmf_app_proto_id';

const APIconBtn = ({ dir, disabled, onClick }) => (
  <button onClick={disabled ? undefined : onClick} aria-label={dir === 'prev' ? 'Буцах' : 'Дараах'} style={{
    width: 46, height: 46, borderRadius: 14, flexShrink: 0, border: 'none', cursor: disabled ? 'default' : 'pointer',
    background: disabled ? '#EEF0F6' : '#0B1020', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1,
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: dir === 'prev' ? 'scaleX(-1)' : 'none' }}>
      <path d="M9 6l6 6-6 6" stroke={disabled ? '#9099B5' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

function AppProtoApp() {
  const startIdx = (() => { const id = localStorage.getItem(AP_KEY); return (id && id in AP_INDEX) ? AP_INDEX[id] : 0; })();
  const [hist, setHist] = useStateAP([startIdx]);
  const [menu, setMenu] = useStateAP(false);
  const hostRef = useRefAP(null);
  const i = hist[hist.length - 1];
  const cur = AP_FLOW[i];

  useEffectAP(() => { localStorage.setItem(AP_KEY, AP_FLOW[i].id); }, [i]);

  const navTo = (n) => { const t = Math.max(0, Math.min(AP_FLOW.length - 1, n)); setHist(h => (h[h.length - 1] === t ? h : [...h, t])); setMenu(false); };
  const back = () => { setHist(h => (h.length > 1 ? h.slice(0, -1) : h)); setMenu(false); };
  const next = () => navTo(i + 1);
  const route = (to) => { if (to === '__back') back(); else if (to === '__next') next(); else if (to in AP_INDEX) navTo(AP_INDEX[to]); };
  const goTab = (t) => { if (t in AP_INDEX) navTo(AP_INDEX[t]); };
  const advance = (scr) => { if (scr.next) route(scr.next); else if (scr.tap) route(scr.tap); };

  useEffectAP(() => {
    const onKey = (e) => { if (e.key === 'ArrowRight') next(); else if (e.key === 'ArrowLeft') back(); else if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hist]);

  useEffectAP(() => {
    const fit = () => { const el = hostRef.current; if (!el) return; const s = Math.min((window.innerHeight - 150) / 844, (window.innerWidth - 48) / 390, 1); el.style.transform = `scale(${s})`; el.style.width = (390 * s) + 'px'; el.style.height = (844 * s) + 'px'; };
    fit(); window.addEventListener('resize', fit); const id = setInterval(fit, 400);
    return () => { window.removeEventListener('resize', fit); clearInterval(id); };
  }, []);

  const onHostClick = (e) => {
    if (e.target.closest('input, textarea, select, canvas, a')) return;
    const scr = AP_FLOW[i];
    const btn = e.target.closest('button');
    const text = ap_norm(btn ? btn.textContent : e.target.textContent);

    // 1. explicit nav rules
    for (const [m, to] of (scr.nav || [])) { if (text && text.includes(ap_norm(m))) { route(to); return; } }
    // 2. header / footer back
    if (btn && (btn.querySelector('path[d="M15 6l-6 6 6 6"]') || (text && text.includes('буцах')))) { back(); return; }
    // 3. overlay close (X)
    if (btn && btn.querySelector('path[d="M6 6l12 12M18 6l-12 12"]')) { back(); return; }
    // 4. skip
    if (text && text.includes('алгасах')) { advance(scr); return; }

    if (scr.kind === 'flow') {
      if (btn) {
        // stay controls: icon-only, steppers/keypad (≤2 chars), and bottom-tab labels
        if (text === '' || text.length <= 2 || AP_TABS.includes(text)) return;
        advance(scr); return;          // a CTA button
      }
      advance(scr); return;            // empty-area tap
    }
    // hub: no generic advance (tabs handled by the component's own onNav)
    // linear (auth): honor overlay / waiting-screen tap
    if (btn) return;
    if (scr.overlay) { back(); return; }
    if (scr.tap && scr.tap in AP_INDEX) navTo(AP_INDEX[scr.tap]);
  };

  const screenEl = cur.render ? cur.render(goTab) : cur.el;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* top label */}
      <div style={{ position: 'fixed', top: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(11,16,32,0.06)', boxShadow: '0 8px 24px -16px rgba(15,20,55,.4)' }}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/><path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/></svg>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0B1020', letterSpacing: '-0.01em' }}>Money Market Fund · Прототип</span>
        </div>
      </div>

      {/* scaled phone */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0 }}>
        <div ref={hostRef} className="rp-host" style={{ transformOrigin: 'top left' }} onClick={onHostClick}>
          <div key={cur.id} className="rp-screen">{screenEl}</div>
        </div>
      </div>

      {/* dock */}
      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 30, display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 20, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(11,16,32,0.06)', boxShadow: '0 18px 50px -18px rgba(15,20,55,.5)' }}>
        <APIconBtn dir="prev" disabled={hist.length <= 1} onClick={back}/>
        <button onClick={() => setMenu(m => !m)} style={{ minWidth: 210, height: 46, padding: '0 16px', borderRadius: 13, cursor: 'pointer', background: '#fff', border: '1px solid #E7E9F2', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 1 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9099B5' }}>{cur.sect}</span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0B1020', letterSpacing: '-0.01em' }}>{cur.name}</span>
        </button>
        <APIconBtn dir="next" disabled={i === AP_FLOW.length - 1} onClick={next}/>
      </div>

      {/* quick-jump menu */}
      {menu && (
        <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 35, background: 'rgba(5,11,31,0.32)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', width: 330, maxHeight: '66vh', overflowY: 'auto', background: '#fff', borderRadius: 20, border: '1px solid #E7E9F2', boxShadow: '0 30px 70px -24px rgba(15,20,55,.55)', padding: 8 }}>
            {AP_FLOW.map((s, idx) => {
              const first = idx === 0 || AP_FLOW[idx - 1].sect !== s.sect;
              return (
                <React.Fragment key={s.id}>
                  {first && <div style={{ padding: '12px 12px 6px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9099B5' }}>{s.sect}</div>}
                  <button onClick={() => navTo(idx)} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 11, cursor: 'pointer', border: 'none', background: idx === i ? '#EEF0FE' : 'transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 600, color: idx === i ? '#4F46E5' : '#9099B5', width: 26 }}>{String(idx + 1).padStart(2, '0')}</span>
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

Object.assign(window, { AppProtoApp });
