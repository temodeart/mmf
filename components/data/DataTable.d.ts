import type React from 'react';

/**
 * @startingPoint section="Data" subtitle="Sortable table w/ 4 states" viewport="760x420"
 */
export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right';
  sortable?: boolean;
  width?: string;
  mono?: boolean;                       // numeric column: mono + tabular
  render?: (row: any) => React.ReactNode;
}
export interface DataTableProps {
  columns: Column[];
  rows?: any[];                         // objects with an id
  loading?: boolean;
  error?: { title?: string; body?: string; action?: { label: string; onClick: () => void } };
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: { label: string; onClick: () => void };
  onRowClick?: (row: any) => void;
  selected?: string | number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  page?: number;
  perPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  title?: string;
  action?: React.ReactNode;
}
export function DataTable(props: DataTableProps): JSX.Element;
