import { formatINR, monthKey, toPaise, toRupees } from '../../lib/domain/format';

// formatINR takes integer PAISE and renders whole rupees.
describe('formatINR', () => {
  test('groups with Indian digit separators and ₹ symbol', () => {
    expect(formatINR(10280000)).toBe('₹1,02,800'); // ₹1,02,800 = 10280000 paise
    expect(formatINR(9630000)).toBe('₹96,300');
    expect(formatINR(2770000)).toBe('₹27,700');
  });
  test('rounds paise to whole rupees, zero handled', () => {
    expect(formatINR(0)).toBe('₹0');
    expect(formatINR(125060)).toBe('₹1,251'); // ₹1250.60 → ₹1,251
  });
  test('handles negatives, crore-scale grouping, and -0 normalization', () => {
    expect(formatINR(-500000)).toBe('-₹5,000');
    expect(formatINR(1000000000)).toBe('₹1,00,00,000');   // 1 crore rupees
    expect(formatINR(1234567800)).toBe('₹1,23,45,678');
    expect(formatINR(-40)).toBe('₹0');                    // -₹0.40 → normalized, no "-₹0"
    expect(formatINR(-0)).toBe('₹0');
  });
});

describe('paise conversion', () => {
  test('toPaise / toRupees round-trip', () => {
    expect(toPaise(6000)).toBe(600000);
    expect(toRupees(600000)).toBe(6000);
    expect(toPaise(1250.5)).toBe(125050);
  });
});

describe('monthKey', () => {
  test('formats local date as YYYY-MM', () => {
    expect(monthKey(new Date(2026, 5, 15))).toBe('2026-06');
    expect(monthKey(new Date(2026, 11, 1))).toBe('2026-12');
    expect(monthKey(new Date(2026, 0, 31))).toBe('2026-01');
  });
});
