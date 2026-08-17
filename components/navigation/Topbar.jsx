import React, { useState } from 'react';

/**
 * Topbar — sticky content-area header. Page title left; notification bell,
 * settings gear, and the user chip (avatar + NAME, never the raw ALL-CAPS
 * email) right. The email is demoted into the avatar dropdown. Bell / gear /
 * avatar button and every dropdown menu item are keyboard-focusable and
 * inherit the global R0 focus ring (F-24). Frosted-glass surface.
 */
export function Topbar({
  title,
  userName = 'Тэмүүжин Батбаяр',
  userEmail = 'temuujin.batbayar@example.mn',
  initials = 'ТБ',
  notifCount = 0,
  defaultMenuOpen = false,
}) {
  const [open, setOpen] = useState(defaultMenuOpen);
  const iconBtn = { width: 42, height: 42, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 };
  return (
    <header style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', borderBottom: '1px solid var(--line)', background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 20, flexShrink: 0 }}>
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button aria-label="Мэдэгдэл" style={iconBtn}>
          {notifCount > 0 && <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 999, background: 'var(--orange)', border: '1.5px solid #fff' }} />}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke="var(--text)" strokeWidth="1.8" strokeLinejoin="round" /><path d="M10 20a2 2 0 004 0" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <button aria-label="Тохиргоо" onClick={() => { window.location.href = '07 Profile.html?tab=settings'; }} style={iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke="var(--text)" strokeWidth="1.8" /><path d="M12 3v2.4M12 18.6V21M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M3 12h2.4M18.6 12H21M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '5px 12px 5px 5px', borderRadius: 999, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', minHeight: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: 'linear-gradient(135deg,var(--blue),var(--indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}><path d="M6 9l6 6 6-6" stroke="var(--muted-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {open && (
            <>
              <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
              <div role="menu" style={{ position: 'absolute', right: 0, top: 52, width: 258, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, boxShadow: 'var(--e-3)', zIndex: 40, padding: 6 }}>
                <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--line-2)', marginBottom: 6 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                  <div title={userEmail} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted-2)', marginTop: 3, fontFamily: "'JetBrains Mono',monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
                </div>
                <button role="menuitem" className="dropdown-item" onClick={() => { window.location.href = '07 Profile.html'; }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>Профайл
                </button>
                <button role="menuitem" className="dropdown-item" onClick={() => { window.location.href = '07 Profile.html?tab=settings'; }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 4v1.6M12 18.4V20M5 12H3.4M20.6 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>Тохиргоо
                </button>
                <button role="menuitem" className="dropdown-item" style={{ color: 'var(--neg)' }} onClick={() => { window.location.href = '05 Login.html'; }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 12H4M8 8l-4 4 4 4M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Гарах
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
