import type React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: { label: string; onClick: () => void };
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
