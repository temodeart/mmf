// wallet_desktop.jsx — MMF Web · Wallet money-movement (desktop port of wallet_flows.jsx)
// Exports: WalletPinInput, CopyRow, LinkedBankRow, TopUpModal, WithdrawModal,
//          HoldingsTable (R2 sticky-ticker pattern), TxTable (F-13/non-color cue)
// Load after comp_atoms.jsx + comp_kit.jsx + foundations.js.

const { useState: _uSW, useRef: _uRW } = React;
const _TW = window.T;
const mntW  = n => window.formatMNT(n);
const rateW = n => window.formatRate(n);
const dtW   = d => window.formatDateTime(d);
const dW    = d => window.formatDate(d);

/* ── WalletPinInput — compact 4-digit transaction PIN (order-modal parity) ── */
const WalletPinInput = ({ length = 4, onChange, error, disabled }) => {
  const [vals, setVals] = _uSW(Array(length).fill(''));
  const refs = _uRW([]);
  const set = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...vals]; next[i] = d; setVals(next);
    onChange && onChange(next.join(''));
    if (d && i < length - 1) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const key = (i, e) => { if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus(); };
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {vals.map((v, i) => (
        <input key={i} ref={el => refs.current[i] = el} value={v} disabled={disabled} inputMode="numeric" maxLength={1} aria-label={`PIN ${i + 1}`}
          onChange={e => set(i, e.target.value)} onKeyDown={e => key(i, e)}
          style={{ width: 54, height: 58, textAlign: 'center', border: `2px solid ${error ? _TW.neg : (v ? _TW.indigo : _TW.line)}`, borderRadius: 14, background: v ? _TW.surface : _TW.field, fontFamily: "'JetBrains Mono',monospace", fontSize: 23, fontWeight: 700, color: _TW.ink, outline: 'none' }} />
      ))}
    </div>
  );
};

/* ── CopyRow — display-only field + copy button + "Хуулагдлаа" toast state ── */
const CopyRow = ({ label, value, highlight, copied, onCopy, first }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '13px 14px 13px 16px', borderTop: first ? 'none' : `1px solid ${_TW.line2}`, background: highlight ? 'rgba(255,233,196,.28)' : 'transparent' }}>
    <span style={{ fontSize: 12.5, color: _TW.muted, fontWeight: 600, flexShrink: 0, minWidth: 128 }}>{label}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
      <span className="num truncate" style={{ fontSize: 13, fontWeight: 700, color: highlight ? '#5E4413' : _TW.ink, textAlign: 'right', letterSpacing: highlight ? '0.02em' : 0 }}>{value}</span>
      <button onClick={onCopy} style={{ flexShrink: 0, border: 'none', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', background: copied ? _TW.posSoft : _TW.indigoSoft, color: copied ? _TW.pos : _TW.indigo, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
        {copied
          ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={_TW.pos} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Хуулагдлаа</>
          : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke={_TW.indigo} strokeWidth="2" /><path d="M5 15V5a2 2 0 012-2h10" stroke={_TW.indigo} strokeWidth="2" strokeLinecap="round" /></svg>Хуулах</>}
      </button>
    </span>
  </div>
);

/* ── LinkedBankRow (F-21) — bank account + "Данс солих →" opens a small support sheet ── */
const LinkedBankRow = ({ bank }) => {
  const [open, setOpen] = _uSW(false);
  const { WebModal, WebButton } = window;
  return (
    <>
      <div style={{ background: _TW.surface, borderRadius: 16, border: `1px solid ${_TW.line2}`, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: bank.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{bank.ab}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="truncate" title={bank.name} style={{ fontSize: 13.5, fontWeight: 700, color: _TW.ink }}>{bank.name}</div>
          <div className="num truncate" style={{ fontSize: 12, color: _TW.muted, marginTop: 2 }}>{bank.holder} · {bank.masked}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: _TW.pos, padding: '4px 10px', background: _TW.posSoft, borderRadius: 999, flexShrink: 0 }}>Холбоотой</span>
        <button onClick={() => setOpen(true)} style={{ flexShrink: 0, border: 'none', background: 'none', color: _TW.indigo, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', padding: '6px 8px', borderRadius: 8 }}>Данс солих →</button>
      </div>
      {open && (
        <WebModal open onClose={() => setOpen(false)} title="Данс солих" footer={<WebButton variant="ghost" full onClick={() => setOpen(false)}>Хаах</WebButton>}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 4px 4px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: _TW.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={_TW.indigo} strokeWidth="1.9" strokeLinejoin="round" /></svg>
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: _TW.muted, lineHeight: 1.6, margin: '0 0 4px', maxWidth: 340 }}>
              Аюулгүй байдлын үүднээс холбогдсон банкны дансыг зөвхөн дэмжлэгийн багийн баталгаажуулалттай солих боломжтой. Бидэнтэй холбогдоно уу — таны хүсэлтийг 1 ажлын өдрийн дотор шийдвэрлэнэ.
            </p>
          </div>
        </WebModal>
      )}
    </>
  );
};

/* ══ TOP-UP (port of wallet_flows.jsx Add-Money flow) ══════════════════════
   Steps: method → qpay|bank → pending → success | notfound
   _forceStep/_forceMethod let a preview page render every step as a static board. ══ */
const TOPUP_CHIPS = [{ l: '₮100к', v: 100000 }, { l: '₮500к', v: 500000 }, { l: '₮1сая', v: 1000000 }, { l: '₮5сая', v: 5000000 }];
/* MMF holds a receiving account at each bank — picking your own keeps the
   transfer intra-bank (instant, no interbank fee). Mirrors mobile AddMoneyBank. */
const TOPUP_BANKS = [
  { id: 'khan',   short: 'Хаан',   name: 'Хаан Банк',                 ab: 'ХААН', c: '#0E7C4A', acct: '5041 28100 1281' },
  { id: 'golomt', short: 'Голомт', name: 'Голомт банк',               ab: 'ГБ',   c: '#0B5CAB', acct: '1165 0012 8100' },
  { id: 'tdb',    short: 'ХХБ',    name: 'Худалдаа хөгжлийн банк',    ab: 'ХХБ',  c: '#0A2A6B', acct: '4990 1281 0028' },
  { id: 'state',  short: 'Төрийн', name: 'Төрийн банк',               ab: 'ТБ',   c: '#0E8F8A', acct: '1050 0128 1005' },
];

const TopUpModal = ({ open, onClose, onSuccess, _forceStep, _forceMethod }) => {
  const { WebModal, WebButton } = window;
  const [step, setStep] = _uSW('method');
  const [method, setMethod] = _uSW('qpay');
  const [amount, setAmount] = _uSW(500000);
  const [copiedKey, setCopiedKey] = _uSW(null);
  const [bank, setBank] = _uSW(TOPUP_BANKS[0]);

  const activeStep = _forceStep || step;
  const activeMethod = _forceMethod || method;
  if (!open) return null;

  const REF = 'MMF-200001281';
  const fields = [
    { key: 'bank', l: 'Хүлээн авах банк', v: bank.name },
    { key: 'acct', l: 'Дансны дугаар', v: bank.acct },
    { key: 'name', l: 'Хүлээн авагч', v: 'Мони Маркет Фанд ХХК' },
    { key: 'amount', l: 'Дүн', v: mntW(amount) },
    { key: 'ref', l: 'Гүйлгээний утга', v: REF, highlight: true },
  ];
  const tap = key => { setCopiedKey(key); setTimeout(() => setCopiedKey(k => k === key ? null : k), 1800); };

  const reset = () => { setStep('method'); setMethod('qpay'); setAmount(500000); setCopiedKey(null); setBank(TOPUP_BANKS[0]); };
  const close = () => { reset(); onClose?.(); };
  const goPending = () => { setStep('pending'); setTimeout(() => { setStep('success'); onSuccess?.(amount, activeMethod); }, 1800); };

  const footer = (() => {
    if (activeStep === 'method') return <WebButton variant="primary" full disabled={amount === 0} onClick={() => setStep(method)}>Үргэлжлүүлэх →</WebButton>;
    if (activeStep === 'qpay') return <WebButton variant="primary" full onClick={goPending}>Төлбөр шалгах</WebButton>;
    if (activeStep === 'bank') return <WebButton variant="primary" full onClick={goPending}>Шилжүүлэг хийсэн →</WebButton>;
    if (activeStep === 'pending') return null;
    if (activeStep === 'success') return <WebButton variant="primary" full onClick={close}>Хэтэвч рүү буцах</WebButton>;
    if (activeStep === 'notfound') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <WebButton variant="primary" full onClick={goPending}>Дахин шалгах</WebButton>
        <WebButton variant="ghost" full onClick={close}>Хэтэвч рүү буцах</WebButton>
      </div>
    );
    return null;
  })();

  return (
    <WebModal open onClose={close} title="Хэтэвч цэнэглэх" footer={footer}>
      {activeStep === 'method' && (
        <>
          <div style={{ background: _TW.field, borderRadius: 16, border: `1.5px solid ${_TW.line}`, padding: 16, marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: _TW.muted, fontWeight: 600 }}>Цэнэглэх дүн</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: _TW.indigo }}>₮</span>
              <input value={amount === 0 ? '' : amount.toLocaleString('en-US')} onChange={e => { const d = e.target.value.replace(/[^0-9]/g, ''); setAmount(d === '' ? 0 : parseInt(d, 10)); }} placeholder="0"
                style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 28, fontWeight: 800, color: _TW.ink, fontFamily: "'JetBrains Mono',monospace" }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {TOPUP_CHIPS.map((c, i) => {
                const on = amount === c.v;
                return <button key={i} onClick={() => setAmount(c.v)} style={{ flex: 1, height: 34, borderRadius: 10, cursor: 'pointer', background: on ? _TW.indigo : _TW.surface, border: `1px solid ${on ? _TW.indigo : _TW.line}`, color: on ? '#fff' : _TW.muted, fontWeight: 700, fontSize: 11.5, fontFamily: 'inherit' }}>{c.l}</button>;
              })}
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: _TW.muted2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Цэнэглэх арга</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { id: 'qpay', t: 'QPay', d: 'Банкны апп эсвэл картаар', ic: <g><rect x="4" y="4" width="7" height="7" rx="1.5" stroke={_TW.indigo} strokeWidth="2" /><rect x="13" y="4" width="7" height="7" rx="1.5" stroke={_TW.indigo} strokeWidth="2" /><rect x="4" y="13" width="7" height="7" rx="1.5" stroke={_TW.indigo} strokeWidth="2" /></g> },
              { id: 'bank', t: 'Дансаар шилжүүлэх', d: 'Банкны шилжүүлгээр цэнэглэх', ic: <g stroke={_TW.indigo} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l8-5 8 5" /><path d="M5 10v8m14-8v8M3 21h18M9 10v8M15 10v8" /></g> },
            ].map(m => {
              const sel = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: 13, borderRadius: 14, cursor: 'pointer', background: sel ? _TW.indigoSoft : _TW.surface, border: `1.5px solid ${sel ? _TW.indigo : _TW.line2}`, fontFamily: 'inherit' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: `1px solid ${_TW.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none">{m.ic}</svg></div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700, color: _TW.ink }}>{m.t}</div><div style={{ fontSize: 11.5, color: _TW.muted, marginTop: 2 }}>{m.d}</div></div>
                  <div style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${sel ? _TW.indigo : _TW.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{sel && <div style={{ width: 10, height: 10, borderRadius: 999, background: _TW.indigo }} />}</div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {activeStep === 'qpay' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: _TW.field, borderRadius: 16, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: _TW.muted }}>Цэнэглэх дүн</span>
            <span className="num" style={{ fontSize: 15, fontWeight: 800, color: _TW.ink, fontFamily: "'JetBrains Mono',monospace" }}>{mntW(amount)}</span>
          </div>
          <div style={{ width: 168, height: 168, borderRadius: 16, background: _TW.field, border: `1px solid ${_TW.line2}`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke={_TW.ink} strokeWidth="1.6" /><rect x="14" y="3" width="7" height="7" stroke={_TW.ink} strokeWidth="1.6" /><rect x="3" y="14" width="7" height="7" stroke={_TW.ink} strokeWidth="1.6" /><rect x="14" y="14" width="7" height="7" stroke={_TW.ink} strokeWidth="1.6" /></svg>
          </div>
          <div style={{ fontSize: 12.5, color: _TW.muted, fontWeight: 600, marginTop: 14 }}>QR код уншуулж төлбөрөө хийнэ үү</div>
        </div>
      )}

      {activeStep === 'bank' && (
        <>
          <p style={{ fontSize: 13, color: _TW.muted, fontWeight: 500, margin: '0 0 14px', lineHeight: 1.55 }}>Доорх мэдээллийг банкны аппдаа хуулж шилжүүлэг хийнэ үү.</p>
          <div style={{ fontSize: 11, fontWeight: 700, color: _TW.muted2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 9 }}>Аль банкнаас шилжүүлэх вэ?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {TOPUP_BANKS.map(b => {
              const sel = bank.id === b.id;
              return (
                <button key={b.id} onClick={() => { setBank(b); setCopiedKey(null); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 7px', borderRadius: 99, cursor: 'pointer', fontFamily: 'inherit', background: sel ? _TW.indigoSoft : _TW.surface, border: `1.5px solid ${sel ? _TW.indigo : _TW.line2}` }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: b.c, color: '#fff', fontSize: 8.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{b.ab}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: sel ? _TW.indigo : _TW.ink, whiteSpace: 'nowrap' }}>{b.short}</span>
                </button>
              );
            })}
          </div>
          <div style={{ background: _TW.surface, borderRadius: 16, border: `1px solid ${_TW.line2}`, overflow: 'hidden' }}>
            {fields.map((f, i) => <CopyRow key={f.key} label={f.l} value={f.v} highlight={f.highlight} copied={copiedKey === f.key} onCopy={() => tap(f.key)} first={i === 0} />)}
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'flex-start', padding: 13, borderRadius: 13, background: _TW.warnSurface, border: `1px solid ${_TW.warnBorder}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 8v5M12 16h.01" stroke={_TW.warn} strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="12" r="9" stroke={_TW.warn} strokeWidth="2" /></svg>
            <div style={{ fontSize: 12, color: '#7A5A1F', lineHeight: 1.55 }}><strong style={{ color: '#5E4413' }}>Гүйлгээний утга</strong>-г яг <strong style={{ color: '#5E4413' }}>{REF}</strong> гэж бичнэ үү — буруу бичвэл орлогыг автоматаар таних боломжгүй.</div>
          </div>
        </>
      )}

      {activeStep === 'pending' && (
        <div style={{ textAlign: 'center', padding: '20px 0 4px' }}>
          <div style={{ position: 'relative', width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <div className="wallet-spin" style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `4px solid ${_TW.indigoSoft}`, borderTopColor: _TW.indigo }} />
            <div style={{ width: 56, height: 56, borderRadius: 18, background: _TW.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="13" rx="3" stroke={_TW.indigo} strokeWidth="2" /><path d="M2 11h20M7 4h10" stroke={_TW.indigo} strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: _TW.ink }}>Гүйлгээг шалгаж байна</div>
          <div style={{ fontSize: 13, color: _TW.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Шилжүүлэг хийсний дараа орлого хэдэн минутын дотор хэтэвчинд тусгагдана.</div>
        </div>
      )}

      {activeStep === 'success' && (
        <div style={{ textAlign: 'center', padding: '20px 0 4px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: `${_TW.pos}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: _TW.pos, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: _TW.ink }}>Хэтэвч цэнэглэгдлээ</div>
          <div style={{ fontSize: 13.5, color: _TW.muted, marginTop: 10 }}><b style={{ color: _TW.ink }}>{mntW(amount)}</b> таны хэтэвчинд нэмэгдлээ.</div>
        </div>
      )}

      {activeStep === 'notfound' && (
        <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: _TW.warnSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={_TW.warn} strokeWidth="2" /><path d="M12 7.5V12l3.5 2" stroke={_TW.warn} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: _TW.ink }}>Гүйлгээ олдсонгүй</div>
          <div style={{ fontSize: 13, color: _TW.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Гүйлгээний утга буруу эсвэл шилжүүлэг хоцрогдсон байж болно. Хэдэн минутын дараа дахин шалгана уу.</div>
          <a href="https://support.mmf.mn" target="_blank" rel="noopener noreferrer" className="ext-link" style={{ display: 'inline-flex', marginTop: 14, fontSize: 12.5 }}>
            Дэмжлэгтэй холбогдох
            <svg className="ext-link__icon" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      )}
    </WebModal>
  );
};

/* ══ WITHDRAW (Зарлага) — amount + live breakdown → PIN → success ══════════
   max = balance − FEE(300); over-amount inline error with tap-to-fill max. */
const WithdrawModal = ({ open, onClose, onSuccess, balance, bank, _forceStep }) => {
  const { WebModal, WebButton } = window;
  const FEE = 300;
  const [step, setStep] = _uSW('amount');
  const [amount, setAmount] = _uSW(1000000);
  const [pin, setPin] = _uSW('');
  const [pinKey, setPinKey] = _uSW(0);

  const activeStep = _forceStep || step;
  if (!open) return null;

  const maxWithdraw = Math.max(0, balance - FEE);
  const over = amount > 0 && (amount + FEE) > balance;
  const canContinue = amount > 0 && !over;

  const reset = () => { setStep('amount'); setAmount(1000000); setPin(''); setPinKey(k => k + 1); };
  const close = () => { reset(); onClose?.(); };
  const submit = () => { onSuccess?.(amount); setStep('success'); };

  const footer = (() => {
    if (activeStep === 'amount') return <WebButton variant="primary" full disabled={!canContinue} reason={over ? 'Шимтгэл нэмэгдэхэд үлдэгдэл хүрэлцэхгүй байна.' : amount === 0 ? 'Дүнгээ оруулна уу.' : undefined} onClick={() => setStep('pin')}>Үргэлжлүүлэх →</WebButton>;
    if (activeStep === 'pin') return <WebButton variant="neg" full disabled={pin.length !== 4} reason={pin.length !== 4 ? 'Гүйлгээний PIN кодоо бүрэн оруулна уу.' : undefined} onClick={submit}>Зарлага гаргах баталгаажуулах</WebButton>;
    if (activeStep === 'success') return <WebButton variant="primary" full onClick={close}>Дуусгах</WebButton>;
    return null;
  })();

  return (
    <WebModal open onClose={close} title="Зарлага гаргах" footer={footer}>
      {activeStep === 'amount' && (
        <>
          <div style={{ background: `linear-gradient(135deg, ${_TW.ink}, #1B2140)`, color: '#fff', borderRadius: 16, padding: 15, marginBottom: 16 }}>
            <div style={{ fontSize: 11, opacity: .7, fontWeight: 600 }}>Боломжит үлдэгдэл · Хэтэвч</div>
            <div className="num" style={{ fontSize: 24, fontWeight: 800, marginTop: 4, fontFamily: "'JetBrains Mono',monospace" }}>{mntW(balance)}</div>
          </div>
          <div style={{ background: _TW.field, borderRadius: 16, border: `1.5px solid ${_TW.line}`, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: _TW.muted, fontWeight: 600 }}>Дүн</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: _TW.indigo }}>₮</span>
              <input value={amount === 0 ? '' : amount.toLocaleString('en-US')} onChange={e => { const d = e.target.value.replace(/[^0-9]/g, ''); setAmount(d === '' ? 0 : parseInt(d, 10)); }} placeholder="0"
                style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 28, fontWeight: 800, color: _TW.ink, fontFamily: "'JetBrains Mono',monospace" }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {[{ l: '25%', v: Math.round(balance * .25) }, { l: '50%', v: Math.round(balance * .5) }, { l: '75%', v: Math.round(balance * .75) }, { l: 'Бүгд', v: maxWithdraw }].map((c, i) => {
                const on = amount === c.v;
                return <button key={i} onClick={() => setAmount(c.v)} style={{ flex: 1, height: 34, borderRadius: 10, cursor: 'pointer', background: on ? _TW.indigo : _TW.surface, border: `1px solid ${on ? _TW.indigo : _TW.line}`, color: on ? '#fff' : _TW.muted, fontWeight: 700, fontSize: 11.5, fontFamily: 'inherit' }}>{c.l}</button>;
              })}
            </div>
          </div>

          {amount > 0 && (
            <div style={{ background: _TW.field, borderRadius: 14, border: `1px solid ${_TW.line2}`, overflow: 'hidden', marginBottom: over ? 10 : 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                <span style={{ fontSize: 12.5, color: _TW.muted, fontWeight: 600 }}>Шимтгэл</span>
                <span className="num" style={{ fontSize: 13, color: _TW.ink, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{mntW(FEE)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: `1px solid ${_TW.line2}` }}>
                <span style={{ fontSize: 12.5, color: _TW.muted, fontWeight: 600 }}>Таны данс руу орох дүн</span>
                <span className="num" style={{ fontSize: 13, color: _TW.ink, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{mntW(amount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: over ? _TW.negSoft : _TW.line2 }}>
                <span style={{ fontSize: 13, color: over ? _TW.neg : _TW.ink, fontWeight: 800 }}>Нийт хасагдах дүн</span>
                <span className="num" style={{ fontSize: 16, color: over ? _TW.neg : _TW.indigo, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{mntW(amount + FEE)}</span>
              </div>
            </div>
          )}

          {over && (
            <button onClick={() => setAmount(maxWithdraw)} style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'flex-start', padding: 13, borderRadius: 12, background: _TW.negSoft, border: `1px solid ${_TW.negBorder}`, cursor: 'pointer', marginBottom: 14, fontFamily: 'inherit' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 8v5M12 16h.01" stroke={_TW.neg} strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="12" r="9" stroke={_TW.neg} strokeWidth="2" /></svg>
              <div style={{ fontSize: 12, color: '#9B2C2C', lineHeight: 1.5 }}>Шимтгэл {mntW(FEE)} нэмэгдэхэд үлдэгдэл хүрэлцэхгүй байна. Татах боломжит дүн: <b className="num">{mntW(maxWithdraw)}</b> <span style={{ color: _TW.neg, fontWeight: 700, textDecoration: 'underline' }}>— энэ дүнгээр бөглөх</span></div>
            </button>
          )}

          <div style={{ fontSize: 12, color: _TW.muted, fontWeight: 600, marginBottom: 8 }}>Шилжүүлэх данс</div>
          <div style={{ background: _TW.surface, borderRadius: 14, border: `1px solid ${_TW.line2}`, padding: 13, display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: bank.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{bank.ab}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: _TW.ink }}>{bank.name}</div>
              <div className="num" style={{ fontSize: 11.5, color: _TW.muted, marginTop: 2 }}>{bank.masked}</div>
            </div>
          </div>
        </>
      )}

      {activeStep === 'pin' && (
        <div style={{ padding: '4px 0' }}>
          <div style={{ background: _TW.field, borderRadius: 14, padding: '11px 15px', display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
            <span style={{ fontSize: 12.5, color: _TW.muted, fontWeight: 700 }}>Нийт хасагдах дүн</span>
            <span className="num" style={{ fontSize: 15, fontWeight: 800, color: _TW.ink, fontFamily: "'JetBrains Mono',monospace" }}>{mntW(amount + FEE)}</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: _TW.muted, marginBottom: 18 }}>Гүйлгээний 4 оронтой PIN кодоо оруулна уу</div>
          <WalletPinInput key={pinKey} length={4} onChange={setPin} />
        </div>
      )}

      {activeStep === 'success' && (
        <div style={{ textAlign: 'center', padding: '20px 0 4px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: `${_TW.pos}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: _TW.pos, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: _TW.ink }}>Зарлага амжилттай</div>
          <div style={{ fontSize: 13.5, color: _TW.muted, marginTop: 10 }}><b className="num" style={{ color: _TW.ink }}>{mntW(amount)}</b> таны {bank.name} данс руу шилжиж байна.</div>
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: _TW.warnSoft, color: _TW.warn, fontSize: 11.5, fontWeight: 700 }}>1 ажлын өдрийн дотор дансанд орно</div>
        </div>
      )}
    </WebModal>
  );
};

/* ══ HoldingsTable — R2 pattern for account tabs (Итгэлцэл/Нэхэмжлэх/Арилжааны бичиг данс)
   sticky one-line mono ticker col + caption, numeric cols mono right-aligned. ══ */
const HoldingsTable = ({ rows }) => {
  const th = { fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: _TW.muted, textTransform: 'uppercase', padding: '12px 16px', background: _TW.field, borderBottom: `1px solid ${_TW.line2}`, whiteSpace: 'nowrap' };
  const td = { padding: '0 16px', height: 58, fontSize: 13, fontWeight: 600, color: _TW.text, borderBottom: `1px solid ${_TW.line2}` };
  const monoTd = { ...td, fontFamily: "'JetBrains Mono',monospace", fontVariantNumeric: 'tabular-nums', textAlign: 'right' };
  if (!rows.length) return (
    <window.WebEmptyState
      icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={_TW.muted} strokeWidth="1.8" /><path d="M3 10h18" stroke={_TW.muted} strokeWidth="1.8" /></svg>}
      title="Байршуулалт байхгүй байна" body="Энэ бүтээгдэхүүнд одоогоор идэвхтэй байршуулалт алга."
    />
  );
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, position: 'sticky', left: 0, zIndex: 2, background: '#EEF1F7', textAlign: 'left', minWidth: 190 }}>Тикер</th>
            <th style={{ ...th, textAlign: 'right' }}>Тоо ширхэг</th>
            <th style={{ ...th, textAlign: 'right' }}>Нэрлэсэн үнэ</th>
            <th style={{ ...th, textAlign: 'right' }}>Өгөөж</th>
            <th style={{ ...th, textAlign: 'right' }}>Дуусах огноо</th>
            <th style={{ ...th, textAlign: 'left' }}>Төлөв</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td style={{ ...td, padding: '0 16px', position: 'sticky', left: 0, zIndex: 1, background: '#F7F9FC', borderRight: `1px solid ${_TW.line2}`, minWidth: 190 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, fontWeight: 700, color: _TW.ink, whiteSpace: 'nowrap' }}>{r.ticker}</div>
                <div className="truncate" style={{ fontSize: 10.5, fontWeight: 600, color: _TW.muted2, marginTop: 2, maxWidth: 190 }} title={r.bank}>{r.bank}</div>
              </td>
              <td style={monoTd}>{r.qty} ширхэг</td>
              <td style={monoTd}>{mntW(r.unit)}</td>
              <td style={{ ...monoTd, color: _TW.pos, fontWeight: 800 }}>{rateW(r.rate)}</td>
              <td style={monoTd}>{dW(r.mat)}</td>
              <td style={td}><window.OrderStatusBadge status={r.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ══ TxTable — transaction history: R0 date, Орлого/Зарлага dot+label
   (non-color cue, a11y §06), amounts mono and signed. ══ */
const TX_KIND = {
  deposit:  { label: 'Орлого',  sign: '+', color: _TW => _TW.pos },
  withdraw: { label: 'Зарлага', sign: '−', color: _TW => _TW.ink },
  buy:      { label: 'Худалдан авалт', sign: '−', color: _TW => _TW.ink },
  sell:     { label: 'Зарсан',  sign: '+', color: _TW => _TW.pos },
};
const TxTable = ({ rows }) => {
  const th = { fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: _TW.muted, textTransform: 'uppercase', padding: '12px 16px', background: _TW.field, borderBottom: `1px solid ${_TW.line2}`, whiteSpace: 'nowrap' };
  const td = { padding: '13px 16px', fontSize: 13, fontWeight: 600, color: _TW.text, borderBottom: `1px solid ${_TW.line2}` };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          <th style={{ ...th, textAlign: 'left' }}>Төрөл</th>
          <th style={{ ...th, textAlign: 'left' }}>Гүйлгээ</th>
          <th style={{ ...th, textAlign: 'right' }}>Огноо</th>
          <th style={{ ...th, textAlign: 'right' }}>Дүн</th>
        </tr></thead>
        <tbody>
          {rows.map((t, i) => {
            const k = TX_KIND[t.type];
            const dotColor = t.type === 'deposit' || t.type === 'sell' ? _TW.pos : _TW.ink;
            return (
              <tr key={i}>
                <td style={{ ...td, textAlign: 'left' }}>
                  {/* non-color cue: dot + text label together, never color alone */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, color: dotColor }}>
                    <window.WebDot color={dotColor} />{k.label}
                  </span>
                </td>
                <td className="truncate" style={{ ...td, textAlign: 'left', maxWidth: 260 }} title={t.desc}>{t.desc}</td>
                <td className="num" style={{ ...td, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{dtW(t.date)}</td>
                <td className="num" style={{ ...td, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, color: k.sign === '+' ? _TW.pos : _TW.ink }}>{k.sign}{'\u00A0'}{mntW(t.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Object.assign(window, {
  WalletPinInput, CopyRow, LinkedBankRow, TopUpModal, WithdrawModal, HoldingsTable, TxTable,
});
