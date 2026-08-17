import type React from 'react';

export interface PaginationProps {
  page: number;
  total: number;
  perPage?: number;
  onChange: (page: number) => void;
}
export function Pagination(props: PaginationProps): JSX.Element | null;
