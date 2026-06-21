import type { Room, Tenant, Due } from '../../types';

export type FloorGroup = { floor: number; rooms: Room[] };
export function groupByFloor(rooms: Room[]): FloorGroup[] {
  const byFloor = new Map<number, Room[]>();
  for (const r of rooms) { const a = byFloor.get(r.floor) ?? []; a.push(r); byFloor.set(r.floor, a); }
  return [...byFloor.entries()]
    .map(([floor, rs]) => ({ floor, rooms: rs.sort((a, b) => a.number.localeCompare(b.number)) }))
    .sort((a, b) => b.floor - a.floor);
}

export type RoomTileVM = { number: string; status: Room['status']; occLine: string; sub: string; dueChip: string };
export function roomTileVM(room: Room, tenant: Tenant | undefined, due: Due | undefined): RoomTileVM {
  const occLine = tenant ? tenant.name : room.status === 'vacant' ? 'Available' : room.status === 'repair' ? 'Under repair' : 'Unassigned';
  const dueChip = due && due.amountPaid < due.amountDue ? 'DUE' : '';
  return { number: room.number, status: room.status, occLine, sub: room.type.toUpperCase(), dueChip };
}

export function messCounts(tenants: Tenant[]) {
  const active = tenants.filter((t) => t.status === 'active');
  const veg = active.filter((t) => t.foodPreference === 'veg').length;
  return { veg, nonveg: active.length - veg, total: active.length };
}

export function statusCounts(rooms: Room[]) {
  const c = (s: Room['status']) => rooms.filter((r) => r.status === s).length;
  return { occupied: c('occupied'), pending: c('pending') + c('reserved'), vacant: c('vacant'), repair: c('repair') };
}

export const floorTag = (floor: number) => `${floor}F`;

const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
// Floor 1 is the Ground floor; floor N (N>1) is the (N-1)th floor — matches the design.
export const floorName = (floor: number) => (floor === 1 ? 'Ground' : ORDINALS[floor - 2] ?? `${floor - 1}th`);
