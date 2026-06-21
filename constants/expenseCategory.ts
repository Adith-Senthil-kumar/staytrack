import type { ExpenseCategory } from '../types';

export const CATEGORY_UI: Record<ExpenseCategory, { label: string; color: string }> = {
  mess:      { label: 'Mess',      color: '#1E6F5C' },
  staff:     { label: 'Staff',     color: '#2E5E7D' },
  utilities: { label: 'Utilities', color: '#C67A1E' },
  repairs:   { label: 'Repairs',   color: '#B5462F' },
  supplies:  { label: 'Supplies',  color: '#7A4A2E' },
  other:     { label: 'Other',     color: '#85897C' },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_UI) as ExpenseCategory[];
