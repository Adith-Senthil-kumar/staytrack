import type { Due } from '../../types';
import { dueStatus } from './dues';

export function initials(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

const PALETTE = ['#1E6F5C', '#13352C', '#C67A1E', '#3A6B5C', '#7A4A2E', '#2E5E7D'];
export function avatarColor(name: string): string {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export type RentTone = 'ok' | 'warn' | 'bad' | 'muted';
export function tenantRentLabel(due: Due | undefined, today: Date, rentDueDay: number): { label: string; tone: RentTone } {
  if (!due) return { label: 'No dues', tone: 'muted' };
  switch (dueStatus(due, today, rentDueDay)) {
    case 'paid': return { label: 'Paid', tone: 'ok' };
    case 'overdue': return { label: 'Overdue', tone: 'bad' };
    case 'partial': return { label: 'Partial', tone: 'warn' };
    default: return { label: 'Due', tone: 'warn' };
  }
}
