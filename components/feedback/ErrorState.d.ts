import type React from 'react';

export interface ErrorStateProps {
  variant?: 'neg' | 'warn' | 'info';
  title: string;
  body?: string;
  action?: { label: string; onClick: () => void };
}
export function ErrorState(props: ErrorStateProps): JSX.Element;
