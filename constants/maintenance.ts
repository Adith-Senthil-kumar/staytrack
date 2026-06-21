import type { MaintCategory, MaintPriority, MaintStatus } from '../types';

// Order + labels match the design (StayTrack.dc.html MCATS): plumbing first,
// "Carpentry" and "Appliance / AC" labels. Keys are kept stable for the data model.
export const MAINT_CATEGORY: Record<MaintCategory, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  furniture: 'Carpentry',
  appliance: 'Appliance / AC',
  cleaning: 'Cleaning',
  other: 'Other',
};
export const MAINT_CATEGORY_KEYS = Object.keys(MAINT_CATEGORY) as MaintCategory[];

export const PRIORITY_UI: Record<MaintPriority, { label: string; color: string }> = {
  high: { label: 'High', color: '#B5462F' },
  medium: { label: 'Medium', color: '#C67A1E' },
  low: { label: 'Low', color: '#3A5A78' },
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
