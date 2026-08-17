import type React from 'react';

/**
 * @startingPoint section="Data" subtitle="KPI stat with delta + sparkline" viewport="340x150"
 */
export interface StatCardProps {
  label: string;
  value?: string;          // pre-formatted mono value
  delta?: string;
  deltaPositive?: boolean;
  trend?: number[] | null; // sparkline series
  loading?: boolean;
  heroValue?: boolean;     // larger figure
}
export function StatCard(props: StatCardProps): JSX.Element;
