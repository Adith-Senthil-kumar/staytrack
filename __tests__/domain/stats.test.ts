import {
  occupancyStats, collectionStats, marginStats, categoryBreakdown,
} from '../../lib/domain/stats';
import type { Due, Expense, Room } from '../../types';

const room = (status: Room['status']): Room =>
  ({ id: status + Math.random(), number: '0', floor: 1, type: 'single', baseRent: 0, status });

describe('occupancyStats', () => {
  test('counts and rounds percent', () => {
    const rooms = [
      room('occupied'), room('occupied'), room('occupied'),
      room('vacant'), room('pending'), room('repair'),
    ];
    expect(occupancyStats(rooms)).toEqual({
      occupied: 3, total: 6, percent: 50, vacant: 1, pending: 1,
    });
  });
  test('empty building → 0% (no divide-by-zero)', () => {
    expect(occupancyStats([])).toEqual({ occupied: 0, total: 0, percent: 0, vacant: 0, pending: 0 });
  });
});

describe('collectionStats', () => {
  const d = (amountDue: number, amountPaid: number, monthKey = '2026-06'): Due =>
    ({ id: 'x', tenantId: 't', monthKey, amountDue, amountPaid, paidAt: null });
  test('sums billed/collected/pending and counts overdue', () => {
    const today = new Date(2026, 5, 10); // past due day 5
    const dues = [d(8000, 8000), d(8000, 8000), d(7000, 0), d(6000, 2000), d(5000, 5000)];
    expect(collectionStats(dues, today, 5)).toEqual({
      billed: 34000, collected: 23000, pending: 11000, overdueCount: 2,
    });
  });
});

describe('marginStats', () => {
  test('profit and rounded margin %', () => {
    expect(marginStats(102800, 74399)).toEqual({ profit: 28401, marginPercent: 28 });
  });
  test('zero revenue → 0% margin', () => {
    expect(marginStats(0, 5000)).toEqual({ profit: -5000, marginPercent: 0 });
  });
});

describe('categoryBreakdown', () => {
  const e = (category: Expense['category'], amount: number): Expense =>
    ({ id: 'x', category, amount, vendor: '', note: '', date: '2026-06-01' });
  test('sums per category, sorted descending by total', () => {
    const expenses = [
      e('utilities', 14200), e('utilities', 3500), e('staff', 15000),
      e('mess', 28000), e('repairs', 2400),
    ];
    expect(categoryBreakdown(expenses)).toEqual([
      { category: 'mess', total: 28000 },
      { category: 'utilities', total: 17700 },
      { category: 'staff', total: 15000 },
      { category: 'repairs', total: 2400 },
    ]);
  });
});
