import { dueStatus, generateDuesForMonth } from '../../lib/domain/dues';
import type { Due, Tenant } from '../../types';

const due = (over: Partial<Due> = {}): Due => ({
  id: 'd1', tenantId: 't1', monthKey: '2026-06',
  amountDue: 8000, amountPaid: 0, paidAt: null, ...over,
});

describe('dueStatus', () => {
  const rentDueDay = 5;
  test('fully paid → paid', () => {
    expect(dueStatus(due({ amountPaid: 8000 }), new Date(2026, 5, 20), rentDueDay)).toBe('paid');
  });
  test('nothing paid, before due day → unpaid', () => {
    expect(dueStatus(due(), new Date(2026, 5, 3), rentDueDay)).toBe('unpaid');
  });
  test('nothing paid, past due day → overdue', () => {
    expect(dueStatus(due(), new Date(2026, 5, 10), rentDueDay)).toBe('overdue');
  });
  test('partial, before due day → partial', () => {
    expect(dueStatus(due({ amountPaid: 2000 }), new Date(2026, 5, 3), rentDueDay)).toBe('partial');
  });
  test('partial, past due day → overdue', () => {
    expect(dueStatus(due({ amountPaid: 2000 }), new Date(2026, 5, 10), rentDueDay)).toBe('overdue');
  });
  test('unpaid for a past month → overdue regardless of day', () => {
    expect(dueStatus(due({ monthKey: '2026-05' }), new Date(2026, 5, 2), rentDueDay)).toBe('overdue');
  });
});

describe('generateDuesForMonth', () => {
  const tenants: Tenant[] = [
    { id: 't1', name: 'A', phone: '', roomId: 'r1', rent: 8000, deposit: 0, joinDate: '2026-01-01', status: 'active', foodPreference: 'veg' },
    { id: 't2', name: 'B', phone: '', roomId: 'r2', rent: 6000, deposit: 0, joinDate: '2026-01-01', status: 'active', foodPreference: 'veg' },
    { id: 't3', name: 'C', phone: '', roomId: null, rent: 5000, deposit: 0, joinDate: '2026-01-01', status: 'vacated', foodPreference: 'nonveg' },
  ];
  test('creates one due per active tenant with rent as amountDue', () => {
    const result = generateDuesForMonth(tenants, '2026-06', []);
    expect(result).toEqual([
      { tenantId: 't1', monthKey: '2026-06', amountDue: 8000, amountPaid: 0, paidAt: null },
      { tenantId: 't2', monthKey: '2026-06', amountDue: 6000, amountPaid: 0, paidAt: null },
    ]);
  });
  test('is idempotent — skips tenants who already have a due that month', () => {
    const existing: Due[] = [due({ id: 'x', tenantId: 't1' })];
    const result = generateDuesForMonth(tenants, '2026-06', existing);
    expect(result).toEqual([
      { tenantId: 't2', monthKey: '2026-06', amountDue: 6000, amountPaid: 0, paidAt: null },
    ]);
  });
  test('returns [] when all active tenants already billed', () => {
    const existing: Due[] = [due({ tenantId: 't1' }), due({ tenantId: 't2', amountDue: 6000 })];
    expect(generateDuesForMonth(tenants, '2026-06', existing)).toEqual([]);
  });
});
