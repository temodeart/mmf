import type React from 'react';

export interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}
export function OTPInput(props: OTPInputProps): JSX.Element;
