// ============================================================
// AUTO-INVEST — integration into the main app prototype
// Shared plan store (survives navigation + reload) + the screens
// app_proto routes to + the entry points embedded in Арилжаа/Хэтэвч.
// Depends on globals exported by auto_invest.jsx.
// ============================================================
const AIP_KEY = 'mmf_auto_plan_v1';

// Legacy plans (multi-type, sub-minimum amounts, retired minY/fallback/market
// keys) are normalised on every read AND every write.
const aiNormalize = (c) => {
  const types = Array.isArray(c.types) && c.types.length ? [c.types[0]] : ['Сертификат'];
  const out = { ...c, types };
  delete out.minY; delete out.fallback; delete out.market; delete out.variant; delete out.priority;
  const terms = AI_TERMS[types[0]] || [12];
  out.term = terms.includes(out.term) ? out.term : terms[terms.length-1];
  out.maxTerm = out.term;
  out.units = Math.max(1, Number(out.units) || 1);
  out.amount = out.units * aiUnitPrice(out);
  return out;
};

const AI_STORE = (() => {
  let s = { cfg: { ...AI_DEFAULT }, active: false, paused: false, cancelled: false };
  // A brand-new user (registration flow, ?sess=fresh) owns no plan — drop any
  // plan a previous review session left behind instead of restoring it.
  const aiFresh = (() => { try { return new URLSearchParams(location.search).get('sess') === 'fresh'; } catch (e) { return false; } })();
  if (aiFresh) { try { localStorage.removeItem(AIP_KEY); } catch (e) {} }
  else { try { const j = JSON.parse(localStorage.getItem(AIP_KEY)); if (j && j.cfg) s = { ...s, ...j, cfg: { ...AI_DEFAULT, ...j.cfg } }; } catch (e) {} }
  s.cfg = aiNormalize(s.cfg);
  const subs = new Set();
  const emit = () => { try { localStorage.setItem(AIP_KEY, JSON.stringify(s)); } catch (e) {} subs.forEach(f => f(n => n + 1)); };
  return {
    get state() { return s; },
    get cfg() { return s.cfg; },
    get live() { return s.active && !s.cancelled; },
    setCfg: (p) => { s = { ...s, cfg: aiNormalize({ ...s.cfg, ...p }) }; emit(); },
    put: (p) => { s = { ...s, ...p }; emit(); },
    sub: (f) => { subs.add(f); return () => subs.delete(f); },
  };
})();
const useAiPlan = () => { const [, t] = React.useState(0); React.useEffect(() => AI_STORE.sub(t), []); return AI_STORE; };
const aiPlanLive = () => AI_STORE.live;

// ---------- routed screens (one per app_proto entry) ----------
const AIAppIntro    = ({ onNav }) => <AIIntro onNext={()=>onNav('autoCriteria')}/>;
const AIAppCriteria = ({ onNav }) => { const s = useAiPlan(); return <AICriteria cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoTerm')} onCancel={()=>onNav('trade')}/>; };
const AIAppTerm     = ({ onNav }) => { const s = useAiPlan(); return <AITerm cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoUnits')} onCancel={()=>onNav('trade')}/>; };
const AIAppUnits    = ({ onNav }) => { const s = useAiPlan(); return <AIUnits cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoInterval')} onCancel={()=>onNav('trade')}/>; };
const AIAppInterval = ({ onNav }) => { const s = useAiPlan(); return <AIInterval cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoPayday')} onCancel={()=>onNav('trade')}/>; };
const AIAppPayday   = ({ onNav }) => { const s = useAiPlan(); return <AIPayDay cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoEnd')} onCancel={()=>onNav('trade')}/>; };
const AIAppEnd      = ({ onNav }) => { const s = useAiPlan(); return <AIEnd cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoProjection')} onCancel={()=>onNav('trade')}/>; };
const AIAppProjection = ({ onNav }) => { const s = useAiPlan(); return <AIProjection cfg={s.cfg} onNext={()=>onNav('autoPriority')} onCancel={()=>onNav('trade')}/>; };
const AIAppPriority = ({ onNav }) => { const s = useAiPlan(); return <AIPriority cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoPayment')} onCancel={()=>onNav('trade')}/>; };
const AIAppAmount   = ({ onNav }) => { const s = useAiPlan(); return <AIAmount cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoPayment')} onCancel={()=>onNav('trade')}/>; };
const AIAppPayment  = ({ onNav }) => { const s = useAiPlan(); return <AIPayment cfg={s.cfg} set={s.setCfg} onNav={onNav} onNext={()=>onNav('autoName')} onCancel={()=>onNav('trade')}/>; };
const AIAppName     = ({ onNav }) => { const s = useAiPlan(); return <AIName cfg={s.cfg} set={s.setCfg} onNext={()=>onNav('autoReview')} onCancel={()=>onNav('trade')}/>; };
const AIAppReview   = ({ onNav }) => { const s = useAiPlan(); return <AIReviewV2 cfg={s.cfg} onNext={()=>onNav('autoPin')}/>; };
const AIAppPin      = ({ onNav }) => { const s = useAiPlan(); return <AIPin cfg={s.cfg} onNext={()=>onNav('autoSuccess')}/>; };
const AIAppSuccess  = ({ onNav }) => {
  const s = useAiPlan();
  React.useEffect(() => { s.put({ active:true, paused:false, cancelled:false }); }, []);
  return <AISuccess cfg={s.cfg} onNext={()=>onNav('autoPlans')} onGoto={()=>onNav('trade')}/>;
};
const AIAppPlans = ({ onNav }) => {
  const s = useAiPlan();
  return <AIPlans cfg={s.cfg} set={s.setCfg} onNav={onNav} state={s.state} setState={s.put} onNext={()=>onNav('autoIntro')}/>;
};

let AI_SEL = 'p1';
// p1 is the plan the user just created — mirror the live cfg (name, product, units) onto it
const aiAppPlans = (cfg) => AI_PLANS.map(p => {
  if (p.id !== 'p1') return p;
  const pool = aiPool(cfg);
  const saved = (cfg.order || []).filter(t => pool.some(x => x.ticker === t));
  const ranked = [...saved, ...pool.map(x => x.ticker).filter(t => !saved.includes(t))]
    .filter(t => !cfg.picked || !cfg.picked.length || cfg.picked.includes(t))
    .map(t => pool.find(x => x.ticker === t));
  const last = ranked[0] || pool[0] || p.last;
  return {
    ...p,
    name: (cfg.name && cfg.name.trim()) || window.ai2AutoName(cfg),
    type: aiType(cfg), term: cfg.term, units: cfg.units,
    amount: cfg.units * aiUnitPrice(cfg), freq: cfg.freq,
    day: cfg.freq === 'Сар бүр' ? String(cfg.payDay) : '—',
    dayLabel: window.ai2DayLabel(cfg),
    next: aiNextDate(cfg),
    last,
  };
});
// Back is handled by the prototype host (chevron → history pop), so no onBack here.
const AIAppPlansMulti = ({ onNav }) => { const s = useAiPlan(); return <AIPlansList plans={aiAppPlans(s.cfg)} onOpen={(id)=>{ AI_SEL = id; onNav('autoPlanDetail'); }} onNav={onNav} onNew={()=>onNav('autoCriteria')}/>; };
const AIAppPlanDetail = ({ onNav }) => { const s = useAiPlan(); return <AIPlanDetail plans={aiAppPlans(s.cfg)} id={AI_SEL} onNav={onNav} onEdit={()=>onNav('autoPlans')}/>; };

// ---------- entry point inside Арилжаа ----------
const AutoInvestEntry = ({ onNav }) => {
  const s = useAiPlan();
  if (window.MMF_V1) return null;
  const go = (id) => onNav && onNav(id);
  if (!s.live) return (
    <button onClick={()=>go('autoIntro')} style={{ width:'100%', textAlign:'left', border:'none', borderRadius:20, padding:18, marginBottom:20, cursor:'pointer', position:'relative', overflow:'hidden', background:`linear-gradient(120deg, ${C.navy} 0%, ${C.indigo} 100%)`, color:'#fff' }}>
      <div style={{ position:'absolute', right:-30, top:-30, opacity:.2 }}><LogoMark size={120}/></div>
      <div style={{ position:'relative' }}>
        <span style={{ fontSize:10, fontWeight:800, background:C.orange, padding:'4px 9px', borderRadius:999, letterSpacing:'0.04em' }}>ШИНЭ</span>
        <div style={{ fontSize:17, fontWeight:800, marginTop:10, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</div>
        <div style={{ fontSize:12, opacity:.75, marginTop:5, lineHeight:1.5, maxWidth:270 }}>Тогтмол хугацаанд, тогтмол дүнгээр — зах зээлийг ажиглах шаардлагагүй.</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:12, background:'#fff', color:C.ink, fontWeight:700, fontSize:12.5, padding:'9px 14px', borderRadius:11 }}>
          Төлөвлөгөө үүсгэх
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </button>
  );
  const p = s.state.paused;
  return (
    <button onClick={()=>go('autoPlans')} style={{ width:'100%', textAlign:'left', background:'#fff', borderRadius:20, border:`1px solid ${C.line2}`, padding:16, marginBottom:20, cursor:'pointer', display:'flex', alignItems:'center', gap:13 }}>
      <AiPlanIcon/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ fontSize:13.5, fontWeight:800, color:C.ink }}>Автомат хөрөнгө оруулалт</span>
          <span style={{ width:6, height:6, borderRadius:999, background: p ? C.amber : C.green }}></span>
        </div>
        <div style={{ fontSize:11.5, color:C.muted, marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {p ? 'Түр зогссон · ₮ ' + aiFmt(s.cfg.amount) + ' · ' + s.cfg.freq : '₮ ' + aiFmt(s.cfg.amount) + ' · ' + s.cfg.freq + ' · дараагийн ' + aiNextDate(s.cfg)}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
};

// ---------- section inside Хэтэвч (under the cash card) ----------
const AutoInvestWalletSection = ({ onNav }) => {
  const s = useAiPlan();
  if (window.MMF_V1) return null;
  const go = (id) => onNav && onNav(id);
  const first = aiBest(s.cfg);
  const p = s.state.paused;
  if (!s.live) return (
    <button onClick={()=>go('autoIntro')} style={{ width:'100%', textAlign:'left', marginTop:14, background:'#fff', borderRadius:18, border:`1px solid ${C.line2}`, padding:'14px 16px', display:'flex', alignItems:'center', gap:13, cursor:'pointer' }}>
      <AiPlanIcon size={40} r={12}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:700, color:C.ink }}>Автомат хөрөнгө оруулалт</div>
        <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>Тогтмол дүнгээр өөрөө худалдан авах</div>
      </div>
      <span style={{ fontSize:12, fontWeight:700, color:C.indigo, flexShrink:0 }}>Тохируулах</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
  return (
    <React.Fragment>
      <div style={{ marginTop:18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:14, fontWeight:800, color:C.ink, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</div>
        <span onClick={()=>go('autoPlans')} style={{ fontSize:12, color:C.indigo, fontWeight:700, cursor:'pointer' }}>Удирдах →</span>
      </div>
      <button onClick={()=>go('autoPlans')} style={{ width:'100%', textAlign:'left', marginTop:10, background:'#fff', borderRadius:18, border:`1px solid ${C.line2}`, padding:16, cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <AiPlanIcon size={38} r={12}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:800, color:C.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(s.cfg.amount)} · {s.cfg.freq}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.cfg.types.join(', ')} · {aiStrategyLabel(s.cfg)}</div>
          </div>
          <span style={{ fontSize:10.5, fontWeight:800, color: p ? C.amber : C.green, background: p ? C.amberSoft : C.greenSoft, padding:'4px 10px', borderRadius:999, flexShrink:0 }}>{p ? 'Түр зогссон' : 'Идэвхтэй'}</span>
        </div>
        <div style={{ marginTop:12, padding:'10px 12px', borderRadius:11, background:'#FAFBFE', border:`1px solid ${C.line2}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11.5, color:C.muted, fontWeight:600 }}>Дараагийн хасалт</span>
          <span style={{ fontSize:12, fontWeight:800, color: p ? C.muted2 : C.ink, whiteSpace:'nowrap' }}>{p ? 'Зогссон' : aiNextDate(s.cfg) + ' · ₮ ' + aiFmt(s.cfg.amount)}</span>
        </div>
        {first && !p && <div style={{ fontSize:11, color:C.muted, marginTop:9, lineHeight:1.5 }}>Сүүлийн худалдан авалт: <b style={{ color:C.ink }}>{first.ticker}</b> · {first.y}%</div>}
      </button>
    </React.Fragment>
  );
};

Object.assign(window, {
  AI_STORE, useAiPlan, aiPlanLive, aiNormalize,
  AIAppIntro, AIAppCriteria, AIAppAmount, AIAppPayment, AIAppReview, AIAppPin, AIAppSuccess, AIAppPlans,
  AIAppTerm, AIAppUnits, AIAppInterval, AIAppPayday, AIAppEnd, AIAppProjection, AIAppPriority,
  AIAppPlansMulti, AIAppPlanDetail,
  AutoInvestEntry, AutoInvestWalletSection,
});
