import { initials, tenantRentLabel } from '../../lib/domain/tenants';
import type { Due } from '../../types';

test('initials takes up to two leading letters, uppercased', () => {
  expect(initials('Ramesh Kumar')).toBe('RK');
  expect(initials('ananya')).toBe('A');
  expect(initials('  ravi   teja singh ')).toBe('RT');
});

test('tenantRentLabel maps the current due to a label + tone', () => {
  const due = (over: Partial<Due>): Due => ({ id: 'd', tenantId: 't', monthKey: '2026-06', amountDue: 8000, amountPaid: 0, paidAt: null, ...over });
  const today = new Date(2026, 5, 10); // past due day 5
  expect(tenantRentLabel(due({ amountPaid: 8000 }), today, 5)).toEqual({ label: 'Paid', tone: 'ok' });
  expect(tenantRentLabel(due({ amountPaid: 2000 }), today, 5)).toEqual({ label: 'Overdue', tone: 'bad' });
  // Design's rent table is binary (paid → green, unpaid → red), so an unpaid due
  // is 'bad'-toned even before the due day — matches StayTrack.dc.html.
  expect(tenantRentLabel(due({}), new Date(2026, 5, 3), 5)).toEqual({ label: 'Due', tone: 'bad' });
  expect(tenantRentLabel(undefined, today, 5)).toEqual({ label: 'No dues', tone: 'muted' });
});
