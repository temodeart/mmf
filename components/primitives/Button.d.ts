import type React from 'react';

export interface ButtonProps {
  /** Visual intent. Buy=pos, Sell=neg — never ad-hoc colors. */
  variant?: 'primary' | 'ghost' | 'ink' | 'pos' | 'neg';
  size?: 'sm' | 'md';
  pill?: boolean;
  full?: boolean;
  disabled?: boolean;
  /** REQUIRED when disabled — human sentence shown beneath the button. */
  reason?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
