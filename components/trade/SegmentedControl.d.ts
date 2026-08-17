import type React from 'react';

export interface SegOption { value: string; label: string; count?: number }
export interface SegmentedControlProps {
  options: SegOption[];
  value: string;
  onChange: (value: string) => void;
  /** 'buy-sell' → buy segment goes --pos, sell goes --neg. */
  semantic?: 'buy-sell';
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
