import type React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}
export function PageHeader(props: PageHeaderProps): JSX.Element;
