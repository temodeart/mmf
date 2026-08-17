import type React from 'react';

/**
 * @startingPoint section="Trade" subtitle="Buy/Sell order rail" viewport="384x640"
 */
export interface OrderTicketProps {
  side?: 'buy' | 'sell';
  onSideChange?: (side: 'buy' | 'sell') => void;
  instrument?: (Instrument & { owned?: number }) | null;
  qty?: number;
  onQtyChange?: (qty: number) => void;
  balance?: number;
  onSubmit?: () => void;
  buyOnly?: boolean;   // hide the Buy/Sell segmented header
}
export function OrderTicket(props: OrderTicketProps): JSX.Element;
