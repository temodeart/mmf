// ============================================================
// AUTO-INVEST v2 — flow steps requested by the client:
// төрөл → бүтээгдэхүүний хугацаа → нэгжийн тоо → давтамж →
// төлөх өдөр (календарь) → дуусах хугацаа (календарь) →
// төсөөлөл (график) → эрэмбэ (drag & drop) → эх үүсвэр → хянах
// Depends on globals from screens.jsx + auto_invest.jsx.
// ============================================================
const { useState: useS2, useEffect: useE2, useRef: useR2 } = React;

const AI2_MONTHS = ['1 сар','2 сар','3 сар','4 сар','5 сар','6 сар','7 сар','8 сар','9 сар','10 сар','11 сар','12 сар'];
const AI2_WD = ['Да','Мя','Лх','Пү','Ба','Бя','Ня'];
const AI2_WDFULL = ['Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Хагас сайн','Бүтэн сайн'];
const AI2_TODAY = new Date(2026, 7, 14); // prototype "today"
const ai2Iso = (d) => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const ai2Parse = (s) => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const ai2Human = (d) => d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0');
const ai2MonIdx = (d) => (d.getDay() + 6) % 7;
const ai2Years = (cfg) => {
  if (cfg.endMode === 'years') return cfg.endYears;
  if (cfg.endMode === 'date' && cfg.endDate) return Math.max(0.25, (ai2Parse(cfg.endDate) - AI2_TODAY) / (365.25*24*3600*1000));
  return 0;
};
const ai2EndLabel = (cfg) => cfg.endMode === 'unlimited' ? 'Хязгааргүй'
  : cfg.endMode === 'years' ? cfg.endYears + ' жил (' + ai2Human(new Date(AI2_TODAY.getFullYear()+cfg.endYears, AI2_TODAY.getMonth(), AI2_TODAY.getDate())) + ')'
  : cfg.endDate ? ai2Human(ai2Parse(cfg.endDate)) : 'Сонгоогүй';
const ai2DayLabel = (cfg) => cfg.freq === 'Сар бүр' ? 'Сарын ' + cfg.payDay + '-нд'
  : cfg.freq === '7 хоног бүр' ? AI2_WDFULL[cfg.payWd] + ' гараг'
  : 'Ажлын өдөр бүр';
// average primary-market yield of the pool that matches төрөл + хугацаа
const ai2Rate = (cfg) => { const p = aiPool(cfg); return p.length ? p.reduce((s,x)=>s+x.y,0)/p.length/100 : 0.16; };
// future value of a regular contribution stream, interest reinvested
const ai2FV = (a, n, years, r) => { const i = r/n, k = Math.round(n*years); return i === 0 ? a*k : a*((Math.pow(1+i,k)-1)/i); };

// ---------- calendar ----------
const AiCal = ({ y, m, onMonth, onSetMonth, isOn, isDim, onPick, foot }) => {
  const first = new Date(y, m, 1), days = new Date(y, m+1, 0).getDate(), pad = ai2MonIdx(first);
  const cells = [...Array(pad).fill(null), ...Array.from({length:days}, (_,k)=>k+1)];
  const [pick2, setPick2] = useS2(false);
  const [py, setPy] = useS2(y);
  useE2(() => { if (pick2) setPy(y); }, [pick2]);
  const minY = AI2_TODAY.getFullYear(), maxY = minY + 20;
  return (
    <div style={{ background:'#fff', borderRadius:18, border:`1px solid ${AI.line2}`, padding:'14px 14px 12px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {onMonth && <button onClick={()=>onMonth(-1)} aria-label="Өмнөх сар" style={{ width:30, height:30, borderRadius:9, background:'#F6F7FB', border:`1px solid ${AI.line2}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round"/></svg></button>}
        {onSetMonth ? (
          <button onClick={()=>setPick2(v=>!v)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'none', border:'none', cursor:'pointer', padding:'4px 0' }}>
            <span style={{ fontSize:13.5, fontWeight:800, color:AI.ink }}>{AI2_MONTHS[m]} {y}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ transform: pick2 ? 'rotate(180deg)' : 'none', transition:'transform .18s' }}><path d="M6 9l6 6 6-6" stroke={AI.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : <div style={{ flex:1, textAlign:'center', fontSize:13.5, fontWeight:800, color:AI.ink }}>{AI2_MONTHS[m]} {y}</div>}
        {onMonth && <button onClick={()=>onMonth(1)} aria-label="Дараа сар" style={{ width:30, height:30, borderRadius:9, background:'#F6F7FB', border:`1px solid ${AI.line2}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round"/></svg></button>}
      </div>
      {pick2 && (
        <div style={{ marginTop:12, borderTop:`1px solid ${AI.line2}`, paddingTop:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setPy(v=>Math.max(minY, v-1))} aria-label="Өмнөх жил" style={{ width:30, height:30, borderRadius:9, background:'#F6F7FB', border:`1px solid ${AI.line2}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round"/></svg></button>
            <div style={{ flex:1, display:'flex', gap:6, overflowX:'auto', justifyContent:'center' }}>
              {[py-1, py, py+1].filter(v => v >= minY && v <= maxY).map(v => (
                <button key={v} onClick={()=>setPy(v)} style={{ padding:'6px 14px', borderRadius:999, border:`1px solid ${v===py ? AI.indigo : AI.line2}`, background: v===py ? AI.soft : '#fff', color: v===py ? AI.indigo : AI.muted, fontSize:12.5, fontWeight:800, cursor:'pointer', fontVariantNumeric:'tabular-nums' }}>{v}</button>
              ))}
            </div>
            <button onClick={()=>setPy(v=>Math.min(maxY, v+1))} aria-label="Дараа жил" style={{ width:30, height:30, borderRadius:9, background:'#F6F7FB', border:`1px solid ${AI.line2}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round"/></svg></button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6, marginTop:10 }}>
            {AI2_MONTHS.map((mm, i) => {
              const past = py === minY && i < AI2_TODAY.getMonth();
              const sel = py === y && i === m;
              return <button key={mm} disabled={past} onClick={()=>{ onSetMonth(py, i); setPick2(false); }} style={{ height:36, borderRadius:10, border:`1px solid ${sel ? AI.indigo : AI.line2}`, background: sel ? AI.indigo : '#fff', color: sel ? '#fff' : past ? '#C8CDDD' : AI.ink, fontSize:12, fontWeight:700, cursor: past ? 'default' : 'pointer' }}>{mm}</button>;
            })}
          </div>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:2, marginTop:12 }}>
        {AI2_WD.map(w => <div key={w} style={{ textAlign:'center', fontSize:10, fontWeight:800, color:AI.muted2, paddingBottom:4 }}>{w}</div>)}
        {cells.map((d, k) => {
          if (!d) return <div key={'e'+k}></div>;
          const on = isOn(d), dim = isDim ? isDim(d) : false;
          return (
            <button key={d} onClick={dim ? undefined : ()=>onPick(d)} style={{ height:36, borderRadius:10, border:'none', cursor: dim ? 'default' : 'pointer', fontSize:12.5, fontWeight: on ? 800 : 600, fontVariantNumeric:'tabular-nums', background: on ? AI.indigo : 'transparent', color: on ? '#fff' : dim ? '#C8CDDD' : AI.ink }}>{d}</button>
          );
        })}
      </div>
      {foot && <div style={{ fontSize:11, color:AI.muted, marginTop:10, lineHeight:1.5, borderTop:`1px solid ${AI.line2}`, paddingTop:10 }}>{foot}</div>}
    </div>
  );
};

// ============================================================
// STEP 2 — бүтээгдэхүүний хугацаа
// ============================================================
const Ai2LoopIcon = ({ c }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0113.7-5.6M20 12a8 8 0 01-13.7 5.6" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M18 3v4h-4M6 21v-4h4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// Reinvest-at-maturity — same component pattern as the primary-market buy flow
const Ai2LoopCard = ({ on, onToggle, onInfo, term }) => (
  <div style={{ background:'#fff', borderRadius:18, border:`1px solid ${on ? AI.indigo : AI.line2}`, boxShadow: on ? `0 0 0 1px ${AI.indigo}, 0 6px 18px -10px rgba(49,52,140,.45)` : '0 1px 2px rgba(16,24,40,.04)', padding:16 }}>
    <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
      <div style={{ width:36, height:36, borderRadius:11, background: on ? AI.soft : '#F4F6FA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Ai2LoopIcon c={on ? AI.indigo : AI.muted}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>Хугацаа дуусахад дахин автоматаар авах</div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.55 }}>Үндсэн дүн ижил буюу төстэй бүтээгдэхүүнд дахин хөрөнгө оруулагдана. Хэтэвчинд сул хэвтэхгүй.</div>
      </div>
      <button onClick={onToggle} role="switch" aria-checked={on} aria-label="Дахин автоматаар авах" style={{ width:46, height:28, borderRadius:999, border:'none', cursor:'pointer', background: on ? AI.indigo : '#D9DCE7', position:'relative', flexShrink:0, transition:'background .2s' }}>
        <span style={{ position:'absolute', top:3, left:3, width:22, height:22, borderRadius:999, background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,.2)', transform: on ? 'translateX(18px)' : 'none', transition:'transform .2s', pointerEvents:'none' }}></span>
      </button>
    </div>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:12 }}>
      <span style={{ fontSize:11, color:AI.muted2, fontWeight:600, lineHeight:1.45 }}>{on ? term + ' сар тутам автоматаар шинэчилнэ' : 'Асаагаагүй бол төлөгдөх дүн хэтэвчид орно'}</span>
      <button onClick={onInfo} style={{ flexShrink:0, background:'none', border:'none', padding:0, cursor:'pointer', fontSize:11.5, fontWeight:700, color:AI.indigo, textDecoration:'underline', textUnderlineOffset:3 }}>Энэ юу вэ?</button>
    </div>
  </div>
);

const Ai2LoopSheet = ({ onClose }) => (
  <div style={{ position:'absolute', inset:0, zIndex:30, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(15,20,55,.42)' }}></div>
    <div style={{ position:'relative', background:'#fff', borderRadius:'26px 26px 0 0', padding:'10px 22px 20px', boxShadow:'0 -12px 40px rgba(15,20,55,.18)' }}>
      <div style={{ width:40, height:4, borderRadius:999, background:'#E1E4EE', margin:'0 auto 14px' }}></div>
      <div style={{ fontSize:16.5, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>Хугацаа дуусахад дахин авах гэж юу вэ?</div>
      <div style={{ fontSize:12.5, color:AI.muted, marginTop:6, lineHeight:1.6 }}>Бүтээгдэхүүний хугацаа дуусахад үндсэн дүн хэтэвчинд сул хэвтэхгүйгээр шууд дахин ажиллана.</div>
      <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:11 }}>
        {[['1','Хугацаа дуусна','Үндсэн дүн болон бодогдсон өгөөж хэтэвчинд орно.'],['2','Ижил бүтээгдэхүүн хайна','Тэр өдөр анхдагч зах зээлд байгаа ижил төрөл, ижил хугацаатай бүтээгдэхүүнийг эрэмбийн дарааллаар шалгана.'],['3','Дахин худалдан авна','Үндсэн дүнгээр шинэ бүтээгдэхүүн авна. Ижил нь байхгүй бол төстэй нөхцөлтэйг санал болгоно.'],['4','Өгөөж хэтэвчид','Бодогдсон өгөөж хэтэвчинд үлдэх бөгөөд та чөлөөтэй захиран зарцуулна.']].map(([n,t,d]) => (
          <div key={n} style={{ display:'flex', gap:11, alignItems:'flex-start' }}>
            <span style={{ width:22, height:22, borderRadius:8, background:AI.soft, color:AI.indigo, fontSize:11.5, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{n}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink }}>{t}</div>
              <div style={{ fontSize:11.5, color:AI.muted, marginTop:2, lineHeight:1.55 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:14, padding:'11px 13px', borderRadius:12, background:'#F4F6FA', fontSize:11.5, color:AI.muted, lineHeight:1.55 }}>Та үүнийг хэдийд ч унтраах боломжтой. Унтраасны дараа дуусах хугацаанд үндсэн дүн хэтэвчинд орж, дахин худалдан авалт хийгдэхгүй.</div>
      <button onClick={onClose} style={{ marginTop:16, width:'100%', height:48, borderRadius:14, border:'none', cursor:'pointer', background:AI.indigo, color:'#fff', fontSize:14, fontWeight:800 }}>Ойлголоо</button>
    </div>
  </div>
);

const AITerm = ({ onNext, onBack, onCancel, cfg, set }) => {
  const terms = AI_TERMS[aiType(cfg)];
  const [info, setInfo] = useS2(false);
  const loop = cfg.reinvest !== false;
  return (
    <Frame label="AI-4 — Бүтээгдэхүүний хугацаа">
      <AiBar title="Хугацаа" step={2} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>{aiType(cfg)}-ийн хугацаа</div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.5 }}>Энэ нь бүтээгдэхүүний хугацаа — автомат хөрөнгө оруулалтын хугацаа биш.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
          {terms.map(t => {
            const pool = aiPool({ ...cfg, term:t });
            const ys = pool.map(p => p.y);
            return <AiRadioCard key={t} active={cfg.term===t} onClick={()=>set({ term:t, maxTerm:t })} title={t + ' сар'}
              desc={pool.length + ' гаргагчийн бүтээгдэхүүн боломжтой'}
              meta={ys.length ? 'Өгөөж ' + Math.min(...ys).toFixed(1) + '–' + Math.max(...ys).toFixed(1) + '%' : ''}/>;
          })}
        </div>
        <div style={{ marginTop:16 }}>
          <Ai2LoopCard on={loop} term={cfg.term} onToggle={()=>set({ reinvest: !loop })} onInfo={()=>setInfo(true)}/>
        </div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
      {info && <Ai2LoopSheet onClose={()=>setInfo(false)}/>}
    </Frame>
  );
};

// ============================================================
// STEP 3 — нэгжийн тоо (fixed unit price on the primary market)
// ============================================================
const AIUnits = ({ onNext, onBack, onCancel, cfg, set }) => {
  const price = aiUnitPrice(cfg), total = cfg.units * price;
  const setU = (u) => set({ units: Math.max(1, Math.min(999, u)), amount: Math.max(1, Math.min(999, u)) * price });
  const per = aiPerYear(cfg.freq);
  return (
    <Frame label="AI-5 — Нэгжийн тоо">
      <AiBar title="Хэдэн ширхэг?" step={3} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ padding:'12px 14px', borderRadius:13, background:'#fff', border:`1px solid ${AI.line2}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
          <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Анхдагч захын ширхэгийн үнэ</span>
          <span style={{ fontSize:13, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(price)}</span>
        </div>

        <div style={{ marginTop:14, borderRadius:20, padding:'20px 18px', background:`linear-gradient(135deg, ${C.navy} 0%, ${AI.indigo} 130%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-40, bottom:-50, opacity:.14 }}><LogoMark size={150}/></div>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:11, opacity:.72, fontWeight:700, letterSpacing:'0.04em' }}>НЭГ УДААГИЙН ХУДАЛДАН АВАЛТ</div>
            <div style={{ fontSize:16.5, fontWeight:800, marginTop:6, letterSpacing:'-0.01em' }}>{aiType(cfg)} · {cfg.term} сар</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:14 }}>
              <button onClick={()=>setU(cfg.units-1)} aria-label="Хасах" style={{ width:46, height:46, borderRadius:14, background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.22)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
              <div style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:40, fontWeight:800, letterSpacing:'-0.03em', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{cfg.units}</div>
                <div style={{ fontSize:11.5, opacity:.7, fontWeight:700, marginTop:5 }}>ширхэг</div>
              </div>
              <button onClick={()=>setU(cfg.units+1)} aria-label="Нэмэх" style={{ width:46, height:46, borderRadius:14, background:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={AI.indigo} strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ marginTop:18, paddingTop:14, borderTop:'1px solid rgba(255,255,255,.16)', display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:10 }}>
              <span style={{ fontSize:12, opacity:.72, fontWeight:700 }}>Нийт</span>
              <span style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>₮ {aiFmt(total)}</span>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginTop:12 }}>
          {[1, 3, 5, 10].map(u => (
            <button key={u} onClick={()=>setU(u)} style={{ height:42, borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', background: cfg.units===u ? AI.ink : '#fff', color: cfg.units===u ? '#fff' : AI.ink, border:`1px solid ${cfg.units===u ? AI.ink : AI.line}` }}>{u} ширхэг</button>
          ))}
        </div>

        <div style={{ marginTop:16, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'4px 16px 12px' }}>
          <AiRow l="Ширхэгийн үнэ" v={'₮ ' + aiFmt(price)}/>
          <AiRow l="Ширхэгийн тоо" v={cfg.units + ' ширхэг'}/>
          <AiRow l="Нийт" v={'₮ ' + aiFmt(total)} strong/>
          <AiRow l={'Жилд (' + cfg.freq.toLowerCase() + ')'} v={'₮ ' + aiFmt(total * per)}/>
        </div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
    </Frame>
  );
};

// ============================================================
// STEP 4 — давтамж
// ============================================================
const AIInterval = ({ onNext, onBack, onCancel, cfg, set }) => {
  const total = cfg.units * aiUnitPrice(cfg);
  return (
    <Frame label="AI-6 — Давтамж">
      <AiBar title="Давтамж" step={4} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>Хэдий давтамжтай худалдан авах вэ?</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
          {[['Өдөр бүр','Ажлын өдөр бүр гүйцэтгэнэ'],['7 хоног бүр','Сонгосон гараг бүрт гүйцэтгэнэ'],['Сар бүр','Сонгосон өдөрт гүйцэтгэнэ']].map(([f, d]) => (
            <AiRadioCard key={f} active={cfg.freq===f} onClick={()=>set({ freq:f })} title={f} desc={d}
              meta={'≈ ₮ ' + aiFmt(total * aiPerYear(f)) + ' / жил'}/>
          ))}
        </div>
        <div style={{ marginTop:16 }}><AiNote tone="good">Нэг удаад <b>₮ {aiFmt(total)}</b> ({cfg.units} нэгж) · {cfg.freq.toLowerCase()}</AiNote></div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
    </Frame>
  );
};

// ============================================================
// STEP 5 — төлөх өдөр (calendar)
// ============================================================
const AIPayDay = ({ onNext, onBack, onCancel, cfg, set }) => {
  const y = AI2_TODAY.getFullYear(), m = AI2_TODAY.getMonth();
  const monthly = cfg.freq === 'Сар бүр', weekly = cfg.freq === '7 хоног бүр';
  const isOn = (d) => monthly ? d === cfg.payDay : weekly ? ai2MonIdx(new Date(y, m, d)) === cfg.payWd : ai2MonIdx(new Date(y, m, d)) < 5;
  const isDim = (d) => monthly ? d > 28 : !monthly && !weekly ? ai2MonIdx(new Date(y, m, d)) > 4 : false;
  const pick = (d) => monthly ? set({ payDay:d, day:String(d) }) : weekly ? set({ payWd: ai2MonIdx(new Date(y, m, d)) }) : null;
  return (
    <Frame label="AI-7 — Төлөх өдөр">
      <AiBar title="Төлөх өдөр" step={5} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>{monthly ? 'Сарын хэдэнд гүйцэтгэх вэ?' : weekly ? 'Долоо хоногийн аль гарагт?' : 'Гүйцэтгэх хуваарь'}</div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.5 }}>{monthly || weekly ? 'Календарьт сонгосон өдөр таны төлөвлөгөөнд давтагдана.' : 'Ажлын өдөр бүр автоматаар гүйцэтгэнэ — сонгох зүйл алга.'}</div>
        {monthly || weekly ? (
          <div style={{ marginTop:12 }}>
            <AiCal y={y} m={m} isOn={isOn} isDim={isDim} onPick={pick}
              foot={monthly ? '29–31 нь бүх сард давтагдахгүй тул сонгох боломжгүй.' : 'Тухайн гарагийн бүх өдөр тодруулсан байна.'}/>
          </div>
        ) : (
          <div style={{ marginTop:12, background:'#fff', borderRadius:18, border:`1px solid ${AI.line2}`, padding:16, display:'flex', alignItems:'flex-start', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:AI.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={AI.indigo} strokeWidth="2"/><path d="M12 7v5l3 2" stroke={AI.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>Ажлын өдөр бүр (Да–Ба)</div>
              <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.55 }}>Ажлын өдөр бүр ₮ {aiFmt(cfg.units * aiUnitPrice(cfg)) } хасагдана. Амралтын болон баярын өдөр алгасна.</div>
            </div>
          </div>
        )}
        <div style={{ marginTop:14, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'4px 16px 12px' }}>
          <AiRow l="Давтамж" v={cfg.freq}/>
          <AiRow l="Гүйцэтгэх" v={ai2DayLabel(cfg)}/>
          <AiRow l="Хасагдах дүн" v={'₮ ' + aiFmt(cfg.units * aiUnitPrice(cfg))} strong/>
        </div>
        <div style={{ marginTop:14 }}><AiNote>Тухайн өдөр хэтэвчинд хүрэлцэх дүн байхгүй бол гүйцэтгэл алгасагдаж, дараагийн хуваариар үргэлжилнэ.</AiNote></div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
    </Frame>
  );
};

// ============================================================
// STEP 6 — дуусах хугацаа (unlimited by default + calendar)
// ============================================================
const AIEnd = ({ onNext, onBack, onCancel, cfg, set }) => {
  const [cal, setCal] = useS2({ y: AI2_TODAY.getFullYear(), m: AI2_TODAY.getMonth() });
  const sel = cfg.endMode === 'date' && cfg.endDate ? ai2Parse(cfg.endDate) : null;
  const shift = (n) => setCal(c => { const d = new Date(c.y, c.m + n, 1); return { y:d.getFullYear(), m:d.getMonth() }; });
  return (
    <Frame label="AI-8 — Дуусах хугацаа">
      <AiBar title="Хэзээ дуусах вэ?" step={6} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <AiRadioCard active={cfg.endMode==='unlimited'} onClick={()=>set({ endMode:'unlimited' })}
          title="Хязгааргүй" desc="Та өөрөө зогсоох хүртэл төлөвлөгөө үргэлжилнэ. Хэдийд ч түр зогсоох, цуцлах боломжтой." meta="Санал болгох"/>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {[1, 3, 5].map(n => <AiChip key={n} label={n + ' жил'} active={cfg.endMode==='years' && cfg.endYears===n} onClick={()=>set({ endMode:'years', endYears:n })}/>)}
          <AiChip label="Тодорхой өдөр" active={cfg.endMode==='date'} onClick={()=>set({ endMode:'date', endDate: cfg.endDate || ai2Iso(new Date(AI2_TODAY.getFullYear()+2, AI2_TODAY.getMonth(), AI2_TODAY.getDate())) })}/>
        </div>
        {cfg.endMode === 'date' && (
          <div style={{ marginTop:12 }}>
            <AiCal y={cal.y} m={cal.m} onMonth={shift} onSetMonth={(yy, mm)=>setCal({ y:yy, m:mm })}
              isOn={(d)=>!!sel && sel.getFullYear()===cal.y && sel.getMonth()===cal.m && sel.getDate()===d}
              isDim={(d)=>new Date(cal.y, cal.m, d) <= AI2_TODAY}
              onPick={(d)=>set({ endDate: ai2Iso(new Date(cal.y, cal.m, d)) })}
              foot="Сонгосон өдрөөс хойш худалдан авалт хийгдэхгүй. Тухайн үед эзэмшиж байгаа бүтээгдэхүүн хугацаа дуусах хүртэл хүчинтэй."/>
          </div>
        )}
        <div style={{ marginTop:14, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'4px 16px 12px' }}>
          <AiRow l="Дуусах" v={ai2EndLabel(cfg)} strong/>
          <AiRow l="Гүйцэтгэл" v={ai2DayLabel(cfg)}/>
          {cfg.endMode !== 'unlimited' && <AiRow l="Нийт хөрөнгө оруулалт" v={'₮ ' + aiFmt(Math.round(cfg.units * aiUnitPrice(cfg) * aiPerYear(cfg.freq) * ai2Years(cfg)))}/>}
        </div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext} disabled={cfg.endMode==='date' && !cfg.endDate}/>
    </Frame>
  );
};

// ============================================================
// STEP 7 — төсөөлөл (projection chart)
// ============================================================
const AIProjection = ({ onNext, onBack, onCancel, cfg }) => {
  const a = cfg.units * aiUnitPrice(cfg), n = aiPerYear(cfg.freq), r = ai2Rate(cfg);
  const unlimited = cfg.endMode === 'unlimited';
  const span = unlimited ? 10 : Math.max(1, ai2Years(cfg));
  const W = 296, H = 148, pts = 48;
  const series = Array.from({ length: pts + 1 }, (_, k) => {
    const t = span * k / pts;
    return { t, v: ai2FV(a, n, t, r), c: a * Math.round(n * t) };
  });
  const max = series[pts].v || 1;
  const xy = (s) => [s.t / span * W, H - s.v / max * H];
  const xyC = (s) => [s.t / span * W, H - s.c / max * H];
  const path = (f) => series.map((s, k) => (k ? 'L' : 'M') + f(s).map(v => v.toFixed(1)).join(' ')).join('');
  const fin = series[pts];
  const marks = unlimited ? [1, 5, 10] : [span];
  return (
    <Frame label="AI-9 — Төсөөлөл">
      <AiBar title="Төсөөлөл" onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px' }}>
        <div style={{ background:'#fff', borderRadius:20, border:`1px solid ${AI.line2}`, padding:'18px 18px 14px' }}>
          <div style={{ fontSize:11.5, color:AI.muted, fontWeight:700 }}>{unlimited ? '10 жилийн дараа' : ai2EndLabel(cfg) + '-нд'}</div>
          <div style={{ fontSize:30, fontWeight:800, color:AI.ink, letterSpacing:'-0.02em', marginTop:5, fontVariantNumeric:'tabular-nums' }}>₮ {aiFmt(Math.round(fin.v))}</div>
          <div style={{ fontSize:12, color:AI.green, fontWeight:700, marginTop:5 }}>+ ₮ {aiFmt(Math.round(fin.v - fin.c))} өгөөж · {(r*100).toFixed(1)}% дундаж</div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ marginTop:16, overflow:'visible' }}>
            <defs>
              <linearGradient id="ai2g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AI.indigo} stopOpacity=".28"/>
                <stop offset="100%" stopColor={AI.indigo} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map(g => <line key={g} x1="0" y1={H*g} x2={W} y2={H*g} stroke={AI.line2} strokeWidth="1"/>)}
            <path d={path(xy) + `L${W} ${H}L0 ${H}Z`} fill="url(#ai2g)"/>
            <path d={path(xyC)} fill="none" stroke={AI.muted2} strokeWidth="1.6" strokeDasharray="4 4"/>
            <path d={path(xy)} fill="none" stroke={AI.indigo} strokeWidth="2.6" strokeLinecap="round"/>
            <circle cx={W} cy={H - fin.v/max*H} r="4.5" fill={AI.indigo} stroke="#fff" strokeWidth="2"/>
          </svg>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:10.5, color:AI.muted2, fontWeight:700 }}>
            <span>Одоо</span><span>{(span/2).toFixed(span < 2 ? 1 : 0)} жил</span><span>{span.toFixed(span < 2 ? 1 : 0)} жил</span>
          </div>
          <div style={{ display:'flex', gap:14, marginTop:12, paddingTop:12, borderTop:`1px solid ${AI.line2}` }}>
            {[['Багцын үнэ', AI.indigo, false], ['Хийсэн хөрөнгө оруулалт', AI.muted2, true]].map(([l, c, dash]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:14, height:0, borderTop:`2.4px ${dash ? 'dashed' : 'solid'} ${c}` }}></span>
                <span style={{ fontSize:10.5, color:AI.muted, fontWeight:700 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>{unlimited ? 'Хугацаагаар' : 'Төлөвлөгөөний дүн'}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
          {marks.map(t => {
            const v = ai2FV(a, n, t, r), c = a * Math.round(n * t);
            return (
              <div key={t} style={{ background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'13px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, flexShrink:0, fontSize:12.5, fontWeight:800, color:AI.indigo }}>{t < 2 ? t.toFixed(1) : Math.round(t)} жил</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14.5, fontWeight:800, color:AI.ink, fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>₮ {aiFmt(Math.round(v))}</div>
                  <div style={{ fontSize:11, color:AI.muted, marginTop:2, whiteSpace:'nowrap' }}>Оруулсан ₮ {aiFmt(Math.round(c))}</div>
                </div>
                <span style={{ fontSize:12, fontWeight:800, color:AI.green, flexShrink:0 }}>+{Math.round((v/c - 1)*100)}%</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:11, color:AI.muted, marginTop:12, lineHeight:1.55 }}>Тооцоолол нь одоогийн зах зээлийн дундаж өгөөж ({(r*100).toFixed(1)}%) хүчинтэй байж, өгөөжийг дахин хөрөнгө оруулсан тохиолдлыг харуулна. Ирээдүйн өгөөжийн баталгаа биш.</div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
    </Frame>
  );
};

// ============================================================
// STEP 8 — эрэмбэ: select + drag & drop priority list
// The engine tries #1 first; if it is unavailable it moves to #2 …
// ============================================================
const AI2_ROW = 66; // row height + gap, layout px
const AIPriority = ({ onNext, onBack, onCancel, cfg, set }) => {
  const pool = aiPool(cfg);
  const need = Math.min(5, pool.length);
  const init = () => {
    const byT = {}; pool.forEach(p => { byT[p.ticker] = p; });
    const ordered = (cfg.order || []).filter(t => byT[t]);
    const rest = pool.filter(p => !ordered.includes(p.ticker)).sort((a, b) => b.y - a.y).map(p => p.ticker);
    const all = [...ordered, ...rest];
    const picked = cfg.picked && cfg.picked.length ? cfg.picked : all.slice(0, Math.max(need, 5));
    return all.map(t => ({ t, on: picked.includes(t) }));
  };
  const [list, setList] = useS2(init);
  const [drag, setDrag] = useS2(null);
  const dref = useR2(null), boxRef = useR2(null);
  useE2(() => { set({ order: list.map(x => x.t), picked: list.filter(x => x.on).map(x => x.t) }); }, [list]);
  const byT = {}; pool.forEach(p => { byT[p.ticker] = p; });
  const chosen = list.filter(x => x.on);
  const scale = () => { const el = boxRef.current; return el ? (el.getBoundingClientRect().height / el.offsetHeight) || 1 : 1; };

  const down = (e, i) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dref.current = { i, y0: e.clientY, s: scale() };
    setDrag({ i, dy: 0 });
  };
  const move = (e) => {
    const d = dref.current; if (!d) return;
    let dy = (e.clientY - d.y0) / d.s;
    const target = Math.max(0, Math.min(list.length - 1, d.i + Math.round(dy / AI2_ROW)));
    if (target !== d.i) {
      setList(l => { const a = [...l]; const [it] = a.splice(d.i, 1); a.splice(target, 0, it); return a; });
      d.y0 += (target - d.i) * AI2_ROW * d.s; d.i = target; dy = (e.clientY - d.y0) / d.s;
    }
    setDrag({ i: d.i, dy });
  };
  const up = () => { dref.current = null; setDrag(null); };
  const toggle = (t) => setList(l => {
    const it = l.find(x => x.t === t), rest = l.filter(x => x.t !== t);
    if (it.on) return [...rest, { t, on:false }];                       // unselected drops to the bottom
    const k = rest.filter(x => x.on).length;                            // selected joins the end of the ranked group
    return [...rest.slice(0, k), { t, on:true }, ...rest.slice(k)];
  });

  return (
    <Frame label="AI-10 — Эрэмбэ">
      <AiBar title="Эрэмбэ тогтоох" step={7} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px' }}>
        <AiNote>Гүйцэтгэх өдөр бүр <b>1-рт</b> тавьсныг эхэлж авна. Тэр өдөр зарагдаагүй бол <b>2-рт</b>, дараа нь <b>3-рт</b> тавьсныг авна. Өөрөөр хэлбэл дээрээс нь доош дараалуулж шалгана.</AiNote>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:16 }}>
          <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>{aiType(cfg)} · {cfg.term} сар</div>
          <span style={{ fontSize:11.5, fontWeight:800, color: chosen.length >= need ? AI.green : AI.amber }}>Сонгосон {chosen.length}/{pool.length}</span>
        </div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.5 }}>Хамгийн багадаа {need} бүтээгдэхүүн эрэмбэлнэ. Барих дэлгэцийг чирж дараалал солино.</div>

        <div ref={boxRef} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8, touchAction:'none' }}>
          {list.map((it, i) => {
            const p = byT[it.t]; if (!p) return null;
            const rank = it.on ? list.slice(0, i + 1).filter(x => x.on).length : 0;
            const isDrag = drag && drag.i === i;
            return (
              <div key={it.t} style={{ height:58, background:'#fff', borderRadius:16, border:`1px solid ${isDrag ? AI.indigo : AI.line2}`, display:'flex', alignItems:'center', gap:11, padding:'0 12px 0 10px', opacity: it.on ? 1 : .62, transform: isDrag ? `translateY(${drag.dy}px) scale(1.02)` : 'none', boxShadow: isDrag ? '0 14px 30px -10px rgba(15,20,55,.35)' : 'none', zIndex: isDrag ? 5 : 1, position:'relative', transition: isDrag ? 'none' : 'transform .18s ease' }}>
                <span style={{ width:26, height:26, borderRadius:9, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12.5, fontWeight:800, fontVariantNumeric:'tabular-nums', background: it.on ? AI.indigo : '#F1F2F7', color: it.on ? '#fff' : AI.muted2, border: it.on ? 'none' : `1px dashed ${AI.line}` }}>{it.on ? rank : '–'}</span>
                <button onClick={()=>toggle(it.t)} style={{ flex:1, minWidth:0, display:'flex', alignItems:'center', gap:10, background:'none', border:'none', padding:0, cursor:'pointer', textAlign:'left', height:'100%' }}>
                  <span style={{ width:20, height:20, borderRadius:6, flexShrink:0, border:`2px solid ${it.on ? AI.indigo : '#CFD4E4'}`, background: it.on ? AI.indigo : '#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {it.on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  <span style={{ flex:1, minWidth:0 }}>
                    <span style={{ display:'block', fontSize:12.5, fontWeight:800, color:AI.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.issuer}</span>
                    <span style={{ display:'block', fontSize:10.5, color:AI.muted, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.ticker} · {p.kind}</span>
                  </span>
                  <span style={{ fontSize:13, fontWeight:800, color: it.on ? AI.green : AI.muted2, flexShrink:0, fontVariantNumeric:'tabular-nums' }}>{p.y.toFixed(1)}%</span>
                </button>
                <div onPointerDown={(e)=>down(e, i)} aria-label="Чирэх" style={{ width:30, height:'100%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor:'grab', touchAction:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 8h8M8 12h8M8 16h8" stroke={AI.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:14 }}><AiNote tone="warn">Харагдаж буй өгөөж нь өнөөдрийн зах зээлийн түвшин. Гаргагч бүр шинэ бүтээгдэхүүнээ өөр хүүтэй гаргаж болох тул ирээдүйн худалдан авалтын өгөөж өөрчлөгдөнө — тогтмол биш.</AiNote></div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext} disabled={chosen.length < need}
        sub={chosen.length < need ? 'Дахин ' + (need - chosen.length) + ' бүтээгдэхүүн сонгоно уу' : chosen.length + ' бүтээгдэхүүн эрэмбэлэгдлээ'}/>
    </Frame>
  );
};

// ============================================================
// STEP 9 — төлөвлөгөөний нэр
// ============================================================
const ai2AutoName = (cfg) => aiType(cfg) + ' · ' + cfg.term + ' сар';
const AIName = ({ onNext, onBack, onCancel, cfg, set }) => {
  const auto = ai2AutoName(cfg);
  const val = cfg.name === undefined ? auto : cfg.name;
  const ideas = [auto, 'Хуримтлал', 'Боловсролын сан', 'Аюулгүйн нөөц'];
  const [foc, setFoc] = useS2(false);
  return (
    <Frame label="AI-11 — Нэр өгөх">
      <AiBar title="Нэр өгөх" step={9} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>Энэ төлөвлөгөөг юу гэж нэрлэх вэ?</div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.5 }}>Хэд хэдэн төлөвлөгөөтэй үед ялгаж таниход хэрэг болно. Дараа ч өөрчилж болно.</div>
        <label htmlFor="ai-plan-name" style={{ display:'block', marginTop:18, fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color:AI.muted }}>Төлөвлөгөөний нэр</label>
        <div style={{ marginTop:8, position:'relative', display:'flex', alignItems:'center', height:54, background:'#fff', borderRadius:14, border:`1.5px solid ${foc ? AI.indigo : AI.line}`, boxShadow: foc ? `0 0 0 4px ${AI.soft}` : '0 1px 2px rgba(15,20,55,.04)', transition:'border-color .15s, box-shadow .15s' }}>
          <input id="ai-plan-name" value={val} maxLength={28} onChange={(e)=>set({ name: e.target.value })} placeholder={auto}
            onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
            style={{ flex:1, minWidth:0, height:'100%', border:'none', outline:'none', background:'transparent', padding:'0 6px 0 15px', fontSize:16, fontWeight:700, color:AI.ink, letterSpacing:'-0.01em', fontFamily:'inherit' }}/>
          {val.length > 0 && (
            <button onClick={()=>set({ name:'' })} aria-label="Цэвэрлэх" style={{ width:26, height:26, marginRight:6, flexShrink:0, borderRadius:999, border:'none', background:'#EEF0F6', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke={AI.muted} strokeWidth="2.6" strokeLinecap="round"/></svg>
            </button>
          )}
          <span style={{ paddingRight:14, fontSize:11.5, color: val.length >= 28 ? AI.amber : AI.muted2, fontWeight:700, fontVariantNumeric:'tabular-nums', flexShrink:0 }}>{val.length}/28</span>
        </div>
        <div style={{ marginTop:7, fontSize:11.5, color:AI.muted, fontWeight:600, lineHeight:1.5 }}>{val.trim() ? '\u00a0' : 'Хоосон бол автомат нэр хэрэглэнэ — „' + auto + '“'}</div>
        <div style={{ marginTop:16, fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color:AI.muted }}>Санал</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:9 }}>
          {ideas.map(n => <AiChip key={n} label={n} active={val===n} onClick={()=>set({ name:n })}/>)}
        </div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={()=>{ if (!val.trim()) set({ name: auto }); onNext(); }}/>
    </Frame>
  );
};

// ============================================================
// Review — v2 summary
// ============================================================
const AIReviewV2 = ({ onNext, onBack, cfg }) => {
  const pool = aiPool(cfg), byT = {}; pool.forEach(p => { byT[p.ticker] = p; });
  const picked = (cfg.picked || []).filter(t => byT[t]);
  const total = cfg.units * aiUnitPrice(cfg);
  return (
    <Frame label="AI-11 — Хянах">
      <AiBar title="Төлөвлөгөөгөө хянана уу" onBack={onBack}/>
      <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px' }}>
        <div style={{ background:'#fff', borderRadius:20, border:`1px solid ${AI.line2}`, padding:'16px 18px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <AiPlanIcon/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15.5, fontWeight:800, color:AI.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(cfg.name && cfg.name.trim()) || ai2AutoName(cfg)}</div>
              <div style={{ fontSize:11.5, color:AI.muted, marginTop:2 }}>₮ {aiFmt(total)} · {cfg.freq} · {cfg.units} нэгж</div>
            </div>
          </div>
          <div style={{ marginTop:10 }}>
            <AiRow l="Бүтээгдэхүүн" v={aiType(cfg) + ' · ' + cfg.term + ' сар'}/>
            <AiRow l="Нэгж" v={cfg.units + ' × ₮ ' + aiFmt(aiUnitPrice(cfg))}/>
            <AiRow l="Давтамж" v={cfg.freq}/>
            <AiRow l="Гүйцэтгэх" v={ai2DayLabel(cfg)}/>
            <AiRow l="Дуусах" v={ai2EndLabel(cfg)}/>
            <AiRow l="Хугацаа дуусахад" v={cfg.reinvest !== false ? 'Дахин автоматаар авна' : 'Хэтэвчинд орно'}/>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20 }}>
          <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>Худалдан авах эрэмбэ</div>
          <span style={{ fontSize:11.5, fontWeight:700, color:AI.muted }}>{picked.length} бүтээгдэхүүн</span>
        </div>
        <div style={{ marginTop:9, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, overflow:'hidden' }}>
          {picked.map((t, k) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderTop: k ? `1px solid ${AI.line2}` : 'none' }}>
              <span style={{ width:24, height:24, borderRadius:8, background:AI.soft, color:AI.indigo, fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{k+1}</span>
              <span style={{ flex:1, minWidth:0, fontSize:12.5, fontWeight:700, color:AI.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{byT[t].issuer}</span>
              <span style={{ fontSize:12.5, fontWeight:800, color:AI.green, flexShrink:0 }}>{byT[t].y.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14 }}><AiNote>Гүйцэтгэх өдөр эрэмбийн дарааллаар боломжтой бүтээгдэхүүнийг худалдан авна. Аль нь ч боломжгүй бол гүйцэтгэл алгасагдана.</AiNote></div>
      </div>
      <AiCta label="Зөвшөөрч баталгаажуулах" onClick={onNext} sub="Үргэлжлүүлснээр та автомат хөрөнгө оруулалтын нөхцөлийг зөвшөөрнө."/>
    </Frame>
  );
};

// v2 flow replaces the linear step list used by the isolated navigator
if (typeof AI_STEPS !== 'undefined') {
  const keep = (id) => AI_STEPS.find(s => s.id === id);
  const v2 = [
    keep('trade'), keep('intro'),
    { id:'type', name:'Бүтээгдэхүүний төрөл', El: AICriteria },
    { id:'term', name:'Бүтээгдэхүүний хугацаа', El: AITerm },
    { id:'units', name:'Нэгжийн тоо', El: AIUnits },
    { id:'interval', name:'Давтамж', El: AIInterval },
    { id:'payday', name:'Төлөх өдөр', El: AIPayDay },
    { id:'end', name:'Дуусах хугацаа', El: AIEnd },
    { id:'projection', name:'Төсөөлөл', El: AIProjection },
    { id:'priority', name:'Эрэмбэ', El: AIPriority },
    keep('payment'),
    { id:'name', name:'Нэр өгөх', El: AIName },
    { id:'review', name:'Хянах', El: AIReviewV2 },
    keep('pin'), keep('success'), keep('plans'), keep('wallet'),
  ].filter(Boolean);
  AI_STEPS.length = 0; v2.forEach(s => AI_STEPS.push(s));
}

Object.assign(window, {
  AITerm, AIUnits, AIInterval, AIPayDay, AIEnd, AIProjection, AIPriority, AIName, AIReviewV2, AiCal, ai2AutoName,
  ai2EndLabel, ai2DayLabel, ai2Years, ai2Rate, ai2FV, ai2Human, ai2Iso, AI2_TODAY,
});
