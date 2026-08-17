// ============================================================
// Money Market Fund — FULL APP connected prototype
// Reuses the registration flow (RP_FLOW from registration_proto.jsx)
// for auth, then wires the app shell (tabs) + trading / wallet / loan
// flows. One real screen at a time; CTAs + bottom tabs are live.
// ============================================================

const { useState: useStateAP, useEffect: useEffectAP, useRef: useRefAP } = React;
const ap_norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const AP_TABS = ['нүүр', 'арилжаа', 'зээл', 'хэтэвч', 'мэдээ'];
// Wallet top-up is reachable from the loan-payoff flow; when it is, funding the
// wallet closes the loan, so return to Нүүр (no active loan) rather than Хэтэвч.
const AP_AFTER_TOPUP = (c) => (c.seen.includes('payoffConfirm') || c.seen.includes('partialPay')) ? 'home' : 'wallet';

// ----- App shell (tabs) + flows. Auth comes from RP_FLOW. -----
// kind: 'hub' (tab screen, only explicit nav rules + live bottom tabs)
//        'flow' (CTA / empty-tap advances to `next`; branch via `nav`)
//        'linear' (auth; explicit `nav` rules + `tap`/overlay)
const AP_KEY = 'mmf_app_proto_id';
// Deep-link from the review portal: ?start=<screenId>&sess=fresh|returning
const AP_Q = new URLSearchParams(location.search);
const AP_START = AP_Q.get('start');
const AP_SESS0 = AP_Q.get('sess') === 'fresh' ? 'fresh' : 'returning';
// V1 is the earlier scope: no Зээл, no Автомат хөрөнгө оруулалт anywhere.
const AP_V1 = AP_Q.get('v') === '1';
window.MMF_V1 = AP_V1;

const AP_APP = [
  { id:'home',   sect:'Апп', name:'Нүүр хуудас', kind:'hub', render:(go, sess, loan)=><Home activeTab="home" onNav={go} loanState={AP_V1 ? 'hidden' : loan === 'active' ? 'active' : 'check-eligibility'} portfolio={sess === 'fresh' ? 'empty' : 'filled'}/>,
    nav:[['Зээлийн хүсэлт','loanEntry'], ['Орлого','addAmount'], ['Зарлага','wdAmount']] },
  { id:'trade',  sect:'Апп', name:'Арилжаа', kind:'hub', render:(go)=><Trading activeTab="trade" onNav={go}/>,
    nav:[['Авах','primaryDetail']] },
  { id:'loan',   sect:'Апп', name:'Зээл', kind:'hub', render:(go)=><Loan activeTab="loan" onNav={go} multi/>,
    nav:[['Зээлийн хүсэлт','loanEntry']] },
  { id:'wallet', sect:'Апп', name:'Хэтэвч', kind:'hub', render:(go, sess)=><Wallet activeTab="wallet" onNav={go} view={sess === 'fresh' ? 'empty' : 'default'}/>,
    nav:[['Орлого','addAmount'], ['Зарлага','wdAmount'], ['Миний картууд','myCards']] },
  { id:'news',   sect:'Апп', name:'Мэдээ', kind:'hub', render:(go)=><News activeTab="news" onNav={go}/> },
  { id:'newsDetail', sect:'Апп', name:'Мэдээ дэлгэрэнгүй', kind:'hub', render:(go)=><NewsDetail onNav={go}/>, nav:[['бүтээгдэхүүн','trade']] },
  { id:'eduDetail', sect:'Апп', name:'Суралцах нийтлэл', kind:'hub', render:(go)=><EduDetail onNav={go}/>, nav:[['бүтээгдэхүүн','trade']] },

  // Trading · primary buy
  { id:'primaryMarket',     sect:'Худалдан авах', name:'Анхдагч зах',  kind:'hub',  render:(go)=><PrimaryMarket onNav={go}/>, nav:[['Авах','primaryDetail']] },
  { id:'primaryDetail',     sect:'Худалдан авах', name:'Бүтээгдэхүүн',  kind:'flow', el:<PrimaryDetail/>,      next:'primaryBuySetup' },
  { id:'primaryBuySetup',   sect:'Худалдан авах', name:'Захиалга',      kind:'flow', el:<PrimaryBuySetup/>,    next:'primaryBuyReview' },
  { id:'primaryBuyReview',  sect:'Худалдан авах', name:'Баталгаажуулах', kind:'flow', el:<PrimaryBuyReview/>,  next:'primaryBuyPin' },
  { id:'primaryBuyPin',     sect:'Худалдан авах', name:'ПИН код',        kind:'flow', el:<PrimaryBuyPin/>,     next:'primaryBuySuccess' },
  { id:'primaryBuySuccess', sect:'Худалдан авах', name:'Амжилттай',     kind:'flow', el:<PrimaryBuySuccess/>,  next:'home' },

  // Trading · secondary buy
  { id:'secondaryDetail',     sect:'Хоёрдогч зах', name:'Зарах санал',   kind:'flow', el:<SecondaryDetail/>,     next:'secondaryBuySetup' },
  { id:'secondaryBuySetup',   sect:'Хоёрдогч зах', name:'Захиалга',      kind:'flow', el:<SecondaryBuySetup/>,   next:'secondaryBuyReview' },
  { id:'secondaryBuyReview',  sect:'Хоёрдогч зах', name:'Баталгаажуулах', kind:'flow', el:<SecondaryBuyReview/>, next:'secondaryBuyPin' },
  { id:'secondaryBuyPin',     sect:'Хоёрдогч зах', name:'ПИН код',        kind:'flow', el:<SecondaryBuyPin/>,    next:'secondaryBuySuccess' },
  { id:'secondaryBuySuccess', sect:'Хоёрдогч зах', name:'Амжилттай',     kind:'flow', el:<SecondaryBuySuccess/>, next:'trade' },

  // Trading · sell
  { id:'ownedDetail', sect:'Зарах', name:'Багцын бүтээгдэхүүн', kind:'flow', el:<OwnedDetail/>, next:'sellSetup', nav:[['Гэрээ харах','ownedContract']] },
  { id:'ownedContract', sect:'Зарах', name:'Гэрээ', kind:'flow', el:<ContractViewer/>, next:'ownedDetail' },
  { id:'sellSetup',   sect:'Зарах', name:'Зарах тохиргоо',      kind:'flow', el:<SellSetup/>,   next:'sellReview' },
  { id:'sellReview',  sect:'Зарах', name:'Баталгаажуулах',      kind:'flow', el:<SellReview/>,  next:'sellPin' },
  { id:'sellPin',     sect:'Зарах', name:'ПИН код',             kind:'flow', el:<SellPin/>,     next:'sellSuccess' },
  { id:'sellSuccess', sect:'Зарах', name:'Амжилттай',           kind:'flow', el:<SellSuccess/>, next:'wallet' },

  // Wallet · add money
  { id:'addAmount',  sect:'Цэнэглэх', name:'Дүн ба арга', kind:'flow', el:<AddMoneyAmount/>,  nav:[['Үргэлжлүүлэх', () => (document.querySelector('[data-pay-method]') || {}).dataset?.payMethod === 'bank' ? 'addBank' : 'addQpay']] },
  { id:'addQpay',    sect:'Цэнэглэх', name:'QPay',        kind:'flow', el:<AddMoneyQPay/>,    next:'addSuccess' },
  { id:'addBank',        sect:'Цэнэглэх', name:'Шилжүүлэг мэдээлэл',    kind:'flow', el:<AddMoneyBank/>,         next:'addBankPending' },
  { id:'addBankPending', sect:'Цэнэглэх', name:'Шалгаж байна',           kind:'flow', el:<AddMoneyBankPending/>,  nav:[['Хэтэвч рүү буцах','wallet'],['Дахин шалгах','addBankSuccess'],['Олдсонгүй','addBankNotFound']] },
  { id:'addBankSuccess', sect:'Цэнэглэх', name:'Дансаар амжилттай',      kind:'flow', el:<AddMoneyBankSuccess/>,  next:'wallet', nav:[['Гүйлгээ харах','txHistory'], ['Хэтэвч рүү буцах', AP_AFTER_TOPUP]] },
  { id:'addBankNotFound',sect:'Цэнэглэх', name:'Гүйлгээ олдсонгүй',     kind:'flow', el:<AddMoneyBankNotFound/>, next:'addBankPending', nav:[['Хэтэвч рүү буцах','wallet']] },
  // Topping up mid-payoff closes the loan, so the success CTA lands on the
  // no-active-loan home instead of the wallet.
  { id:'addSuccess', sect:'Цэнэглэх', name:'Амжилттай',   kind:'flow', el:<AddMoneySuccess/>, next:'wallet', nav:[['Гүйлгээ харах','txHistory'], ['Хэтэвч рүү буцах', AP_AFTER_TOPUP]] },

  // Wallet · withdraw
  { id:'wdAmount',       sect:'Зарлага', name:'Дүн',            kind:'flow', el:<WithdrawAmount/>,       next:'wdReview' },
  { id:'wdReview',       sect:'Зарлага', name:'Баталгаажуулах', kind:'flow', el:<WithdrawReview/>,       next:'wdPin' },
  { id:'wdPin',          sect:'Зарлага', name:'ПИН код',        kind:'flow', el:<WithdrawPin/>,          next:'wdSuccess' },
  { id:'wdSuccess',      sect:'Зарлага', name:'Амжилттай',      kind:'flow', el:<WithdrawSuccess/>,      next:'wallet' },
  { id:'wdInsufficient', sect:'Зарлага', name:'Үлдэгдэл хүрэлцэхгүй', kind:'flow', el:<WithdrawInsufficient/>, nav:[['цэнэглэх','addAmount'], ['засах','wdAmount']] },
  { id:'txHistory',      sect:'Хэтэвч', name:'Гүйлгээний түүх',  kind:'hub', el:<TransactionHistory/> },
  { id:'txDetail',       sect:'Хэтэвч', name:'Гүйлгээний дэлгэрэнгүй', kind:'hub', el:<TxDetail tx={TX_TOPUP}/> },
  { id:'txDetailFailed', sect:'Хэтэвч', name:'Гүйлгээ цуцлагдсан', kind:'hub', el:<TxDetail tx={TX_FAILED}/>, nav:[['Дахин оролдох','wdAmount']] },

  // Loan flow
  { id:'loanEntry',     sect:'Зээл', name:'Зээлийн хүсэлт',      kind:'flow', el:<LoanCheckEntry/>, next:'loanQpay' },
  { id:'loanBlocked',   sect:'Зээл', name:'Өнөөдөр зээл авсан',   kind:'flow', el:<LoanBlocked/>,    next:'home' },
  { id:'loanQpay',      sect:'Зээл', name:'Төлбөр',             kind:'flow', el:<QPayPayment/>,     next:'loanConfirmed' },
  { id:'loanConfirmed', sect:'Зээл', name:'Төлбөр баталгаажлаа', kind:'flow', el:<PayConfirmed/>,   next:'loanChecking' },
  { id:'loanChecking',  sect:'Зээл', name:'Хянаж байна',        kind:'flow', el:<ZmsChecking/>,     next:'loanAccepted' },
  { id:'loanAccepted',  sect:'Зээл', name:'Зөвшөөрөгдлөө',      kind:'flow', render:(go)=><LoanAccepted onNav={go}/>, next:'loanPinConfirm' },
  { id:'loanPartial',   sect:'Зээл', name:'Хэсэгчлэн зөвшөөрөв', kind:'flow', render:(go)=><LoanPartial onNav={go}/>, next:'loanPinConfirm' },
  { id:'loanPinConfirm',sect:'Зээл', name:'ПИН баталгаажуулалт', kind:'flow', el:<LoanPinConfirm/>, next:'loanSubmitted' },
  { id:'loanSubmitted', sect:'Зээл', name:'Зээл олгогдлоо',     kind:'flow', el:<LoanSubmitted/>,   next:'home', nav:[['Дансаа харах','wallet'], ['Нүүр хуудас','home']] },
  { id:'loanDeclined',  sect:'Зээл', name:'Татгалзагдлаа',      kind:'flow', el:<LoanDeclined/>,    next:'home', nav:[['Дэмжлэгтэй холбогдох','help']] },

  // Loan · payoff (early repayment from the active-loan screen)
  { id:'payoffConfirm', sect:'Зээл', name:'Зээл хаах', kind:'flow', el:<PayoffReview/>,  next:'addAmount', nav:[['Цэнэглээд төлөх','addAmount'], ['Хэтэвчээр төлөх','payoffPin']] },
  { id:'payoffPin',     sect:'Зээл', name:'ПИН код',        kind:'flow', el:<PayoffPin/>,     next:'payoffSuccess' },
  { id:'payoffSuccess', sect:'Зээл', name:'Төлөгдлөө',      kind:'flow', el:<PayoffSuccess/>, next:'home', nav:[['дэлгэрэнгүй','loan']] },

  // Loan · partial payment (Хувааж төлөх) — pay any amount; full amount closes the loan
  { id:'partialPay',        sect:'Зээл', name:'Хувааж төлөх', kind:'flow', el:<PartialPayAmount/>,  next:'partialPayPin', nav:[['Цэнэглээд төлөх','addAmount']] },
  { id:'partialPayPin',     sect:'Зээл', name:'ПИН код',      kind:'flow', el:<PartialPayPin/>,     next:'partialPaySuccess' },
  { id:'partialPaySuccess', sect:'Зээл', name:'Төлөгдлөө',    kind:'flow', el:<PartialPaySuccess/>, next:'loan', nav:[['дэлгэрэнгүй','loan'],['Нүүр','home']] },

  // Notifications
  { id:'notifications',    sect:'Мэдэгдэл', name:'Жагсаалт',    kind:'hub',  render:(go)=><NotificationList onNav={go}/> },
  { id:'notifDetail',      sect:'Мэдэгдэл', name:'Дэлгэрэнгүй', kind:'flow', el:<NotificationDetail/>, nav:[['Дэлгэрэнгүй үзэх','primaryMarket']] },
  { id:'notifDetailCrit',  sect:'Мэдэгдэл', name:'Систем',      kind:'flow', el:<NotificationDetailCrit/>, nav:[['Дахин оролдох','wdAmount']] },

  // Profile
  { id:'profile',         sect:'Профайл', name:'Профайл',          kind:'hub',  render:(go)=><ProfileMain onNav={go}/> },
  { id:'personalInfo',    sect:'Профайл', name:'Хувийн мэдээлэл',   kind:'hub',  el:<PersonalInfo/> },
  { id:'notifSettings',   sect:'Профайл', name:'Мэдэгдлийн тохиргоо', kind:'hub', el:<NotifSettings/> },
  { id:'pinChange',       sect:'Профайл', name:'ПИН код солих',      kind:'hub',  render:(go)=><PinChange onNav={go}/> },
  { id:'passwordChange',  sect:'Профайл', name:'Нууц үг солих',      kind:'hub',  render:(go)=><PasswordChange onNav={go}/> },
  { id:'language',        sect:'Профайл', name:'Хэл',                kind:'hub',  render:(go)=><LangScreen onNav={go}/> },
  { id:'help',            sect:'Профайл', name:'Тусламж',            kind:'hub',  render:(go)=><HelpScreen onNav={go}/> },
  { id:'myContracts',     sect:'Профайл', name:'Миний гэрээнүүд',   kind:'hub',  render:(go)=><MyContracts onNav={go}/> },
  { id:'profileContract', sect:'Профайл', name:'Гэрээ',             kind:'flow', el:<ContractViewer/> },
  { id:'certInvest',      sect:'Профайл', name:'Хөрөнгийн тодорхойлолт', kind:'flow', el:<CertRequest type="invest"/>, next:'certDone' },
  { id:'certLoan',        sect:'Профайл', name:'Зээлийн тодорхойлолт',   kind:'flow', el:<CertRequest type="loan"/>,   next:'certDone' },
  { id:'certDone',        sect:'Профайл', name:'Илгээгдлээ',        kind:'flow', el:<CertSuccess/>, next:'profile' },
  { id:'termsProfile',    sect:'Профайл', name:'Үйлчилгээний нөхцөл', kind:'hub', el:<TermsScreen/> },
  { id:'myCards',           sect:'Хэтэвч', name:'Миний картууд', kind:'hub', render:(go)=><MyCards onNav={go}/>, nav:[['Карт нэмэх','cardAddProfile']] },
  { id:'cardAddProfile',    sect:'Хэтэвч', name:'Карт нэмэх',    kind:'hub', el:<CardAdd context="profile"/>, nav:[['Холбох','cardLinkedProfile']] },
  { id:'cardLinkedProfile', sect:'Хэтэвч', name:'Карт холбогдлоо', kind:'hub', el:<CardLinked/>, nav:[['Үргэлжлүүлэх','myCards']] },

  // Auto-invest (Автомат хөрөнгө оруулалт) — entered from Арилжаа / Хэтэвч
  { id:'autoIntro',    sect:'Автомат', name:'Танилцуулга',           kind:'hub', render:(go)=><AIAppIntro onNav={go}/> },
  { id:'autoCriteria', sect:'Автомат', name:'1 · Бүтээгдэхүүний төрөл', kind:'hub', render:(go)=><AIAppCriteria onNav={go}/> },
  { id:'autoTerm',     sect:'Автомат', name:'2 · Бүтээгдэхүүний хугацаа', kind:'hub', render:(go)=><AIAppTerm onNav={go}/> },
  { id:'autoUnits',    sect:'Автомат', name:'3 · Нэгжийн тоо',        kind:'hub', render:(go)=><AIAppUnits onNav={go}/> },
  { id:'autoInterval', sect:'Автомат', name:'4 · Давтамж',              kind:'hub', render:(go)=><AIAppInterval onNav={go}/> },
  { id:'autoPayday',   sect:'Автомат', name:'5 · Төлөх өдөр',           kind:'hub', render:(go)=><AIAppPayday onNav={go}/> },
  { id:'autoEnd',      sect:'Автомат', name:'6 · Дуусах хугацаа',      kind:'hub', render:(go)=><AIAppEnd onNav={go}/> },
  { id:'autoProjection', sect:'Автомат', name:'Төсөөлөл',                kind:'hub', render:(go)=><AIAppProjection onNav={go}/> },
  { id:'autoPriority', sect:'Автомат', name:'7 · Эрэмбэ (drag & drop)', kind:'hub', render:(go)=><AIAppPriority onNav={go}/> },
  { id:'autoPayment',  sect:'Автомат', name:'8 · Төлбөрийн эх үүсвэр', kind:'hub', render:(go)=><AIAppPayment onNav={go}/> },
  { id:'autoName',     sect:'Автомат', name:'9 · Нэр өгөх',           kind:'hub', render:(go)=><AIAppName onNav={go}/> },
  { id:'autoReview',   sect:'Автомат', name:'Хянах',                 kind:'hub', render:(go)=><AIAppReview onNav={go}/> },
  { id:'autoPin',      sect:'Автомат', name:'ПИН код',               kind:'hub', render:(go)=><AIAppPin onNav={go}/> },
  { id:'autoSuccess',  sect:'Автомат', name:'Идэвхжлээ',             kind:'hub', render:(go)=><AIAppSuccess onNav={go}/> },
  { id:'autoPlans',    sect:'Автомат', name:'Миний төлөвлөгөө',      kind:'hub', render:(go)=><AIAppPlans onNav={go}/> },
  { id:'autoPlansMulti', sect:'Автомат', name:'Төлөвлөгөөнүүд (олон)', kind:'hub', render:(go)=><AIAppPlansMulti onNav={go}/> },
  { id:'autoPlanDetail', sect:'Автомат', name:'Төлөвлөгөөний дэлгэрэнгүй', kind:'hub', render:(go)=><AIAppPlanDetail onNav={go}/> },
];

// Auth flow from registration_proto (drop its standalone Home; ours is the hub)
const AP_AUTH = (window.RP_FLOW || []).filter(f => f.id !== 'home');
const AP_V1_DROP = { 'Зээл':1, 'Автомат':1 };
const AP_FLOW = [...AP_AUTH, ...AP_APP].filter(f => !AP_V1 || (!AP_V1_DROP[f.sect] && f.id !== 'loan' && f.id !== 'certLoan'));
const AP_INDEX = {};
AP_FLOW.forEach((f, k) => { AP_INDEX[f.id] = k; });


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
  const startIdx = (() => {
    if (AP_START && AP_START in AP_INDEX) return AP_INDEX[AP_START];
    const id = localStorage.getItem(AP_KEY); return (id && id in AP_INDEX) ? AP_INDEX[id] : 0;
  })();
  const [hist, setHist] = useStateAP([startIdx]);
  // 'fresh' = just registered (empty portfolio) · 'returning' = logged in (holdings)
  const [sess, setSess] = useStateAP(AP_SESS0);
  // 'active' once a loan has been disbursed in this run, back to 'none' when closed
  const [loan, setLoan] = useStateAP('none');
  const [menu, setMenu] = useStateAP(false);
  const hostRef = useRefAP(null);
  const i = hist[hist.length - 1];
  const cur = AP_FLOW[i];

  useEffectAP(() => { localStorage.setItem(AP_KEY, AP_FLOW[i].id); }, [i]);

  const navTo = (n) => { const t = Math.max(0, Math.min(AP_FLOW.length - 1, n)); setHist(h => (h[h.length - 1] === t ? h : [...h, t])); setMenu(false); };
  const back = () => { setHist(h => (h.length > 1 ? h.slice(0, -1) : h)); setMenu(false); };
  const next = () => navTo(i + 1);
  const route = (to) => {
    if (typeof to === 'function') to = to({ seen: hist.map(h => AP_FLOW[h].id), from: AP_FLOW[i].id });
    if (!to) return;
    if (to === '__back') { back(); return; }
    if (to === '__next') { next(); return; }
    if (!(to in AP_INDEX)) return;
    const from = AP_FLOW[i].id;
    // Loan disbursement / closure flips the home loan section, wherever you go next.
    if (from === 'loanSubmitted') setLoan('active');
    else if (from === 'payoffSuccess') setLoan('none');
    if (to === 'home') {
      if (from === 'kycComplete') { setSess('fresh'); setLoan('none'); }
      else if (from === 'login') setSess('returning');
      else if (from === 'addSuccess' || from === 'addBankSuccess') setLoan('none');
    }
    navTo(AP_INDEX[to]);
  };
  const AP_ALIAS = { trading: 'trade', terms: 'termsProfile' };
  const goTab = (t) => { const id = AP_ALIAS[t] || t; if (id in AP_INDEX) navTo(AP_INDEX[id]); };
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
    if (e.target.closest('input, textarea, select, canvas, a, [data-nodrag]')) return;
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

  const screenEl = cur.render ? cur.render(goTab, sess, loan) : cur.el;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* top label */}
      <div style={{ position: 'fixed', top: 18, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(11,16,32,0.06)', boxShadow: '0 8px 24px -16px rgba(15,20,55,.4)' }}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/><path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/></svg>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0B1020', letterSpacing: '-0.01em' }}>Money Market Fund · Прототип</span>
        </div>
      </div>

      {/* back to the review portal */}
      <a href={'../Mobile Flows.html?v=' + (AP_V1 ? '1' : '2')} style={{ position: 'fixed', top: 18, left: 18, zIndex: 31, display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px 0 10px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(11,16,32,0.06)', boxShadow: '0 8px 24px -16px rgba(15,20,55,.4)', textDecoration: 'none', color: '#2A3052', fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.01em' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#2A3052" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Урсгалууд
      </a>

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
