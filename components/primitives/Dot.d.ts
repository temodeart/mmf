import type React from 'react';

export interface DotProps {
  tone?: 'new' | 'active' | 'sell' | 'buy' | 'info' | 'pos' | 'neg';
  color?: string;
  size?: number;
  children?: never;
}
export function Dot(props: DotProps): JSX.Element;
