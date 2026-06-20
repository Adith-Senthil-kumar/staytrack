import { groupByFloor, roomTileVM, messCounts } from '../../lib/domain/dashboard';
import type { Room, Tenant, Due } from '../../types';

const room = (id: string, number: string, floor: number, status: Room['status'] = 'vacant'): Room =>
  ({ id, number, floor, type: 'single', baseRent: 8000, status });
const tenant = (id: string, roomId: string, name: string, food: Tenant['foodPreference'] = 'veg'): Tenant =>
  ({ id, name, phone: '', roomId, rent: 8000, deposit: 0, joinDate: '2026-01-01', status: 'active', foodPreference: food });

test('groupByFloor sorts floors descending and rooms by number', () => {
  const rooms = [room('1', '101', 1), room('3', '301', 3), room('2', '302', 3)];
  const g = groupByFloor(rooms);
  expect(g.map((f) => f.floor)).toEqual([3, 1]);
  expect(g[0].rooms.map((r) => r.number)).toEqual(['301', '302']);
});

test('roomTileVM composes occupant line + due chip', () => {
  const occ = roomTileVM(room('r', '301', 3, 'occupied'), tenant('t', 'r', 'R. Verma'), { id: 'd', tenantId: 't', monthKey: '2026-06', amountDue: 8000, amountPaid: 0, paidAt: null });
  expect(occ.occLine).toBe('R. Verma');
  expect(occ.sub).toBe('SINGLE');
  expect(occ.dueChip).toBe('DUE');
  const vac = roomTileVM(room('r2', '303', 3, 'vacant'), undefined, undefined);
  expect(vac.occLine).toBe('Available');
  expect(vac.dueChip).toBe('');
});

test('messCounts splits veg/nonveg for active tenants', () => {
  const tenants = [tenant('a', 'r1', 'A', 'veg'), tenant('b', 'r2', 'B', 'nonveg'), tenant('c', 'r3', 'C', 'veg')];
  expect(messCounts(tenants)).toEqual({ veg: 2, nonveg: 1, total: 3 });
});
