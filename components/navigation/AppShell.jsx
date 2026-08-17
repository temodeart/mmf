import React from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { Footer } from './Footer.jsx';

/**
 * AppShell — the shared desktop shell. Composes, in order:
 *   1. skip-to-content link (F-24, visible only on keyboard focus)
 *   2. Sidebar (left rail, icons + labels, active pill — audit-endorsed)
 *   3. Topbar (name + avatar, email demoted to dropdown)
 *   4. <main id="mmf-main"> — the skip-link target and tab landing point
 *   5. Footer (F-23)
 *
 * F-01: pass a `rail` node to lay the content area out on the R0 fluid grid
 * (minmax(0,1fr) 320px); every child gets min-width:0 so long labels truncate
 * instead of forcing horizontal overflow. Without `rail`, content is full-width.
 */
export function AppShell({ activePath = '/trade/primary', title, notifCount = 0, defaultMenuOpen = false, rail, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <a href="#mmf-main" className="skip-link">Үндсэн хэсэг рүү очих</a>
      <Sidebar activePath={activePath} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} notifCount={notifCount} defaultMenuOpen={defaultMenuOpen} />
        <main id="mmf-main" tabIndex={-1} style={{ flex: 1, padding: '30px 36px 40px', outline: 'none' }}>
          {rail ? (
            <div className="app-grid">
              <div style={{ minWidth: 0 }}>{children}</div>
              <div style={{ minWidth: 0 }}>{rail}</div>
            </div>
          ) : children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
