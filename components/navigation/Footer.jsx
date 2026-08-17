import React from 'react';

const FOOT_LINKS = [
  { label: 'Үйлчилгээний нөхцөл', href: '15 Terms.html#terms' },
  { label: 'Нууцлалын бодлого', href: '15 Terms.html#privacy' },
  { label: 'Холбоо барих', href: '15 Terms.html#contact' },
  { label: 'Тусламж', href: '14 Education.html' },
];

/**
 * Footer (F-23) — one muted row of policy links + the СЗХ special-licence
 * number. `license` is a placeholder until the real registration number is
 * supplied. Sits at the bottom of the AppShell content column.
 */
export function Footer({ license = '0000/000' }) {
  return (
    <footer style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 20px', padding: '18px 36px', borderTop: '1px solid var(--line)', fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
      {FOOT_LINKS.map((l, i) => (
        <a key={i} href={l.href} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{l.label}</a>
      ))}
      <span style={{ marginLeft: 'auto', color: 'var(--muted-2)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5 }}>СЗХ тусгай зөвшөөрлийн № {license}</span>
    </footer>
  );
}
