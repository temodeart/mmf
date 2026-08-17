import type React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'title' | 'num' | 'avatar' | 'card' | 'row';
  width?: number | string;
  style?: React.CSSProperties;
}
export function Skeleton(props: SkeletonProps): JSX.Element;
