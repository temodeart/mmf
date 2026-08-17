import type React from 'react';

export interface TopbarProps {
  title: string;
  userName?: string;
  initials?: string;
  notifCount?: number;
}
export function Topbar(props: TopbarProps): JSX.Element;
