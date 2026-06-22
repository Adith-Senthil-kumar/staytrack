import { nightsBetween, bookingFinancials } from '../../lib/domain/shortstay';
test('nightsBetween counts whole nights, min 1', () => {
  expect(nightsBetween('2026-06-01', '2026-06-04')).toBe(3);
  expect(nightsBetween('2026-06-10', '2026-06-10')).toBe(1);
  expect(nightsBetween('2026-06-10', '2026-06-09')).toBe(1);
});

test('bookingFinancials: total = nights × rate, balance = total − advance', () => {
  // 3 nights at the agreed rate (1500, overriding base 1200), 2000 advance
  expect(bookingFinancials({ dailyRate: 1200, rate: 1500, advance: 2000, checkIn: '2026-06-01' }, '2026-06-04'))
    .toEqual({ nights: 3, rate: 1500, total: 4500, advance: 2000, balance: 2500 });
  // no agreed rate → falls back to dailyRate; no advance → balance = total
  expect(bookingFinancials({ dailyRate: 1000, checkIn: '2026-06-10' }, '2026-06-12'))
    .toEqual({ nights: 2, rate: 1000, total: 2000, advance: 0, balance: 2000 });
  // advance ≥ total → balance clamps to 0 (never negative)
  expect(bookingFinancials({ dailyRate: 1000, advance: 5000, checkIn: '2026-06-10' }, '2026-06-11').balance).toBe(0);
});
