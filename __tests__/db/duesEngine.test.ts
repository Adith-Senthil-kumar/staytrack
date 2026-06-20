import { duesToCreate } from '../../lib/db/duesEngine';
import type { Due, Tenant } from '../../types';

const tenant = (id: string, rent: number, status: Tenant['status'] = 'active'): Tenant => ({
  id, name: id, phone: '', roomId: 'r', rent, deposit: 0, joinDate: '2026-01-01', status, foodPreference: 'veg',
});

test('returns dues for active tenants missing the month, skipping existing + vacated', () => {
  const tenants = [tenant('a', 8000), tenant('b', 6000), tenant('c', 5000, 'vacated')];
  const existing: Due[] = [{ id: 'x', tenantId: 'a', monthKey: '2026-06', amountDue: 8000, amountPaid: 0, paidAt: null }];
  expect(duesToCreate(tenants, existing, '2026-06')).toEqual([
    { tenantId: 'b', monthKey: '2026-06', amountDue: 6000, amountPaid: 0, paidAt: null },
  ]);
});
