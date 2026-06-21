import type { MaintCategory, MaintPriority, MaintStatus } from '../types';

export const MAINT_CATEGORY: Record<MaintCategory, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  furniture: 'Furniture',
  appliance: 'Appliance',
  cleaning: 'Cleaning',
  other: 'Other',
};
export const MAINT_CATEGORY_KEYS = Object.keys(MAINT_CATEGORY) as MaintCategory[];

export const PRIORITY_UI: Record<MaintPriority, { label: string; color: string }> = {
  high: { label: 'High', color: '#B5462F' },
  medium: { label: 'Medium', color: '#C67A1E' },
  low: { label: 'Low', color: '#1E6F5C' },
};

export const STATUS_COL: { key: MaintStatus; label: string; color: string }[] = [
  { key: 'open', label: 'Open', color: '#B5462F' },
  { key: 'in_progress', label: 'In Progress', color: '#C67A1E' },
  { key: 'done', label: 'Done', color: '#1E6F5C' },
];

export const NEXT_STATUS: Record<MaintStatus, MaintStatus> = {
  open: 'in_progress',
  in_progress: 'done',
  done: 'open',
};
