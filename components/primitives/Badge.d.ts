import type React from 'react';

export interface BadgeProps {
  /** One tone per meaning. */
  tone?: 'new' | 'active' | 'pending' | 'sell' | 'buy' | 'info' | 'default';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
