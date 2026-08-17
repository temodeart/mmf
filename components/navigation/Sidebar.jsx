import React, { useState } from 'react';

const NAV = [
  { path: '/dashboard', label: 'Миний самбар', icon: <><rect x="3" y="3" width="7" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none" /><rect x="14" y="3" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none" /><rect x="14" y="12" width="7" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none" /><rect x="3" y="16" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none" /></> },
  { path: '/trade', label: 'Арилжаа', icon: <path d="M7 7h11l-3-3M17 17H6l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />, sub: [{ path: '/trade/cd', label: 'Хадгаламжийн сертификат' }, { path: '/trade/trust', label: 'Итгэлцэл' }, { path: '/trade/inv', label: 'Нэхэмжлэх' }, { path: '/trade/cp', label: 'Арилжааны бичиг' }] },
  { path: '/wallet', label: 'Хэтэвч', icon: <><rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" /><path d="M3 10h18M16 14.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></> },
  { path: '/loan', label: 'Зээл', icon: <path d="M12 3l8 4v5c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" /> },
  { path: '/news', label: 'Мэдээ мэдээлэл', icon: <><path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" /><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></> },
];

/**
 * Sidebar — the desktop left rail. Logo lockup, an "Үндсэн цэс" eyebrow, and
 * nav groups (Арилжаа expands). Active item = indigo pill; parent auto-expands
 * when a child is active. Uses the frosted-glass surface treatment.
 */
export function Sidebar({ activePath = '/trade/primary' }) {
  const [exp, setExp] = useState('/trade');
  return (
    <aside style={{ width: 268, flexShrink: 0, background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(14px)', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', padding: '26px 18px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 4px' }}>
        <svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C" /><path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF" /></svg>
        <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.05, letterSpacing: '-0.02em' }}>Money Market<br /><span style={{ color: 'var(--muted-2)', fontWeight: 600 }}>Fund</span></div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: 'var(--muted-2)', padding: '26px 12px 10px', textTransform: 'uppercase' }}>ҮНДСЭН</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(item => {
          const isAct = activePath.startsWith(item.path);
          const isExp = exp === item.path;
          return (
            <React.Fragment key={item.path}>
              <a href="#" onClick={e => { e.preventDefault(); if (item.sub) setExp(isExp ? null : item.path); }} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px', borderRadius: 14, fontSize: 14.5, fontWeight: 600, color: isAct ? 'var(--indigo)' : 'var(--text)', textDecoration: 'none', border: `1px solid ${isAct ? 'var(--indigo-border)' : 'transparent'}`, background: isAct ? 'var(--indigo-soft)' : 'transparent', transition: 'background .15s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>{item.icon}</svg>
                {item.label}
                {item.sub && <svg style={{ marginLeft: 'auto', opacity: 0.5, transition: 'transform .2s', transform: isExp ? 'rotate(180deg)' : 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </a>
              {item.sub && isExp && (
                <div style={{ margin: '2px 0 2px 30px', paddingLeft: 14, borderLeft: '1.5px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {item.sub.map(s => <a key={s.path} href="#" style={{ fontSize: 13.5, fontWeight: activePath === s.path ? 700 : 600, color: activePath === s.path ? 'var(--indigo)' : 'var(--muted)', padding: '8px 12px', borderRadius: 10, textDecoration: 'none' }}>{s.label}</a>)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', padding: '14px 12px 2px' }}>
        <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>v2 · 2026.06.23</div>
      </div>
    </aside>
  );
}
