import React from 'react';

/**
 * Button — the MMF action control. Intent drives color; Buy/Sell semantics
 * live here and in SegmentedControl only, never as ad-hoc colors.
 * Disabled buttons must carry a `reason` (shown beneath) — never silent grey.
 */
export function Button({
  variant = 'primary',   // primary | ghost | ink | pos | neg
  size = 'md',           // sm | md
  pill = false,
  full = false,
  disabled = false,
  reason,
  onClick,
  style,
  children,
}) {
  const h = size === 'sm' ? 36 : 52;
  const r = pill ? 999 : (size === 'sm' ? 10 : 14);
  const fs = size === 'sm' ? 13 : 15;

  let bg, color, shadow, border = 'none';
  if (disabled)                { bg = '#E3E5EF'; color = 'var(--muted-2)'; shadow = 'none'; }
  else if (variant === 'ghost'){ bg = 'transparent'; color = 'var(--ink)'; shadow = 'none'; border = '1.5px solid var(--line)'; }
  else if (variant === 'ink')  { bg = 'var(--ink)'; color = '#fff'; shadow = 'none'; }
  else if (variant === 'pos')  { bg = 'var(--pos)'; color = '#fff'; shadow = '0 8px 22px -8px rgba(14,159,110,.5)'; }
  else if (variant === 'neg')  { bg = 'var(--neg)'; color = '#fff'; shadow = '0 8px 22px -8px rgba(220,38,38,.5)'; }
  else                         { bg = 'var(--indigo)'; color = '#fff'; shadow = '0 8px 22px -8px rgba(79,70,229,.55)'; }

  return (
    <div style={{ width: full ? '100%' : 'auto', display: full ? 'block' : 'inline-block' }}>
      <button
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        style={{
          height: h, padding: `0 ${size === 'sm' ? 16 : 22}px`, borderRadius: r,
          fontSize: fs, fontWeight: 700, letterSpacing: '-0.01em',
          background: bg, color, border, boxShadow: shadow,
          cursor: disabled ? 'not-allowed' : 'pointer', width: full ? '100%' : 'auto',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'inherit', transition: 'filter .15s', ...(style || {}),
        }}
      >
        {children}
      </button>
      {disabled && reason && (
        <div style={{ fontSize: 11.5, color: 'var(--muted-2)', fontWeight: 600, textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>
          {reason}
        </div>
      )}
    </div>
  );
}
