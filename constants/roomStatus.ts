import type { RoomStatus } from '../types';

// Tailwind className fragments per room status (used by RoomTile + legend).
export const STATUS_UI: Record<RoomStatus, {
  tile: string; num: string; line: string; sub: string; dot: string; label: string;
}> = {
  occupied: { tile: 'bg-occ-bg border-occ-bd', num: 'text-ink', line: 'text-text-2', sub: 'text-muted', dot: 'bg-brand', label: 'Occupied' },
  pending:  { tile: 'bg-pend-bg border-pend-bd', num: 'text-ink', line: 'text-text-2', sub: 'text-warn', dot: 'bg-warn', label: 'Pending' },
  reserved: { tile: 'bg-pend-bg border-pend-bd', num: 'text-ink', line: 'text-text-2', sub: 'text-warn', dot: 'bg-warn', label: 'Reserved' },
  vacant:   { tile: 'bg-vac-bg border-vac-bd border-dashed', num: 'text-soft', line: 'text-soft', sub: 'text-st-vac', dot: 'bg-st-vac', label: 'Vacant' },
  repair:   { tile: 'bg-maint-bg border-maint-bd', num: 'text-ink', line: 'text-bad', sub: 'text-bad', dot: 'bg-bad', label: 'Repair' },
};
