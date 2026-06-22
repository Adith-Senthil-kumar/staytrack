import React from 'react';

// Web: a real <input type="date"|"time"> so the user gets the OS date/time picker
// (calendar / clock) instead of typing a raw string. Styled to match the app's
// fields and theme-aware via the same CSS variables Tailwind uses.
export function DateTimeField({ mode, value, onChange, min, max, placeholder }: {
  mode: 'date' | 'time';
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
}) {
  return React.createElement('input', {
    type: mode,
    value: value || '',
    min,
    max,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 42,
      backgroundColor: 'rgb(var(--field))',
      border: '1px solid rgb(var(--border))',
      borderRadius: 9,
      padding: '0 13px',
      fontSize: 14,
      color: 'rgb(var(--text))',
      fontFamily: 'inherit',
      outline: 'none',
    },
  });
}
