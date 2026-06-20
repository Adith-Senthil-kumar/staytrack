import { formatINR, monthKey } from '../../lib/domain/format';

describe('formatINR', () => {
  test('groups with Indian digit separators and ₹ symbol', () => {
    expect(formatINR(102800)).toBe('₹1,02,800');
    expect(formatINR(96300)).toBe('₹96,300');
    expect(formatINR(27700)).toBe('₹27,700');
  });
  test('no decimals, zero handled', () => {
    expect(formatINR(0)).toBe('₹0');
    expect(formatINR(1250.6)).toBe('₹1,251');
  });
  test('handles negatives, crore-scale grouping, and -0 normalization', () => {
    expect(formatINR(-5000)).toBe('-₹5,000');
    expect(formatINR(10000000)).toBe('₹1,00,00,000');   // 1 crore
    expect(formatINR(12345678)).toBe('₹1,23,45,678');
    expect(formatINR(-0.4)).toBe('₹0');                  // normalized, no "-₹0"
    expect(formatINR(-0)).toBe('₹0');
  });
});

describe('monthKey', () => {
  test('formats local date as YYYY-MM', () => {
    expect(monthKey(new Date(2026, 5, 15))).toBe('2026-06');
    expect(monthKey(new Date(2026, 11, 1))).toBe('2026-12');
    expect(monthKey(new Date(2026, 0, 31))).toBe('2026-01');
  });
});
