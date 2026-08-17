import type React from 'react';

export interface ChipOption { value: string; label: string; color?: string }
export interface FilterChipsProps {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
}
export function FilterChips(props: FilterChipsProps): JSX.Element;
