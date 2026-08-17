import type React from 'react';

/**
 * @startingPoint section="Trade" subtitle="Primary-market product card" viewport="340x360"
 */
export interface Instrument {
  bank: string;
  ticker: string;
  type: 'cd' | 'trust' | 'inv' | 'cp';
  rate: number;      // annual %
  unit: number;      // nominal price (₮)
  term: number;      // days
  avail: number;
  total: number;
  badge?: 'new' | 'active';
}
export interface InstrumentCardProps {
  data: Instrument;
  selected?: boolean;
  onSelect?: () => void;
  onBuy?: () => void;
}
export function InstrumentCard(props: InstrumentCardProps): JSX.Element;
