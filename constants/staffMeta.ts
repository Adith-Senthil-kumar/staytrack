import type { AttendanceStatus, Shift } from '../types';
export const ATT_UI: Record<AttendanceStatus, { label: string; color: string }> = {
  present: { label: 'Present', color: '#1E6F5C' }, late: { label: 'Late', color: '#C67A1E' },
  absent: { label: 'Absent', color: '#B5462F' }, leave: { label: 'Leave', color: '#85897C' },
};
export const ATT_KEYS = Object.keys(ATT_UI) as AttendanceStatus[];
export const SHIFT_UI: Record<Shift, { label: string; letter: string; color: string }> = {
  morning: { label: 'Morning', letter: 'M', color: '#C67A1E' }, evening: { label: 'Evening', letter: 'E', color: '#1E6F5C' },
  night: { label: 'Night', letter: 'N', color: '#13352C' }, off: { label: 'Off', letter: '–', color: '#85897C' },
};
export const SHIFT_CYCLE: Record<Shift, Shift> = { off: 'morning', morning: 'evening', evening: 'night', night: 'off' };
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
