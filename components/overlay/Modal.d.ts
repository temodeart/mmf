import type React from 'react';

/**
 * @startingPoint section="Overlay" subtitle="Order-confirmation dialog" viewport="520x520"
 */
export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  logo?: React.ReactNode;      // letter-mark or glyph
  logoColor?: string;
  title?: string;
  ticker?: string;             // mono instrument code
  children?: React.ReactNode;
  footer?: React.ReactNode;    // sticky CTA area
}
export function Modal(props: ModalProps): JSX.Element | null;
