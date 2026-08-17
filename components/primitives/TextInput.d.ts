import type React from 'react';

export interface TextInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  type?: string;
  /** Render value in JetBrains Mono with tabular figures (money/qty/codes). */
  mono?: boolean;
  prefix?: React.ReactNode;
}
export function TextInput(props: TextInputProps): JSX.Element;
