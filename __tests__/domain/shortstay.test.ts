import { nightsBetween } from '../../lib/domain/shortstay';
test('nightsBetween counts whole nights, min 1', () => {
  expect(nightsBetween('2026-06-01', '2026-06-04')).toBe(3);
  expect(nightsBetween('2026-06-10', '2026-06-10')).toBe(1);
  expect(nightsBetween('2026-06-10', '2026-06-09')).toBe(1);
});
