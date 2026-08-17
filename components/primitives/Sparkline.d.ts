import type React from 'react';

export interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}
export function Sparkline(props: SparklineProps): JSX.Element;
