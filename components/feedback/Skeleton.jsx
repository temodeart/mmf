import React from 'react';

const VARIANTS = {
  text:   { height: 14, borderRadius: 4 },
  title:  { height: 22, borderRadius: 4 },
  num:    { height: 32, borderRadius: 4, minWidth: 80 },
  avatar: { width: 44, height: 44, borderRadius: 10, flexShrink: 0 },
  card:   { height: 120, borderRadius: 16 },
  row:    { height: 52, borderRadius: 4 },
};

/**
 * Skeleton — shimmer placeholder that matches the final layout (never a bare
 * spinner). Relies on the `.skeleton` keyframes in the design system base CSS.
 */
export function Skeleton({ variant = 'text', width, style }) {
  const s = VARIANTS[variant] || VARIANTS.text;
  return <div className="skeleton" style={{ ...s, width: width || s.width || '100%', ...(style || {}) }} />;
}
