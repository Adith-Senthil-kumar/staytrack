import type { StaffRole } from '../types';
export const STAFF_ROLE_UI: Record<StaffRole, { label: string; color: string }> = {
  warden: { label: 'Warden', color: '#1E6F5C' }, cook: { label: 'Cook', color: '#C67A1E' },
  cleaner: { label: 'Cleaner', color: '#2E5E7D' }, security: { label: 'Security', color: '#7A4A2E' },
  manager: { label: 'Manager', color: '#13352C' }, other: { label: 'Other', color: '#85897C' },
};
export const STAFF_ROLE_KEYS = Object.keys(STAFF_ROLE_UI) as StaffRole[];
