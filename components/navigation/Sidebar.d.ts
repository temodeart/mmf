import type React from 'react';

/**
 * @startingPoint section="Navigation" subtitle="Desktop left nav rail" viewport="268x640"
 */
export interface SidebarProps {
  /** Current route; the matching group auto-expands + highlights. */
  activePath?: string;
}
export function Sidebar(props: SidebarProps): JSX.Element;
