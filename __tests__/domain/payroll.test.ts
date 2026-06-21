import { calcPayroll, monthRecords, leaveUsed, WORKDAYS } from '../../lib/domain/payroll';
import type { Staff, Attendance, LeaveRequest } from '../../types';

const makeStaff = (overrides: Partial<Staff> = {}): Staff => ({
  id: 's1',
  name: 'Test Staff',
  role: 'cook',
  phone: '9999999999',
  idProof: 'AADHAAR',
  joinDate: '2026-01-01',
  salary: 26000,
  ...overrides,
});

const makeAttendance = (staffId: string, status: Attendance['status'], date: string): Attendance => ({
  id: `${staffId}_${date}`,
  staffId,
  date,
  status,
});

describe('calcPayroll', () => {
  test('perDay = salary / WORKDAYS for 26000 salary', () => {
    const staff = makeStaff({ salary: 26000 });
    const c = calcPayroll(staff, []);
    expect(c.perDay).toBe(1000); // 26000 / 26
  });

  test('20 present + 2 late + 1 absent + 1 leave → worked=22, earned=22000, elapsed=24, attPct=92', () => {
    const staff = makeStaff({ salary: 26000 });
    const records: Attendance[] = [
      ...Array.from({ length: 20 }, (_, i) => makeAttendance('s1', 'present', `2026-06-${String(i + 1).padStart(2, '0')}`)),
      makeAttendance('s1', 'late', '2026-06-21'),
      makeAttendance('s1', 'late', '2026-06-22'),
      makeAttendance('s1', 'absent', '2026-06-23'),
      makeAttendance('s1', 'leave', '2026-06-24'),
    ];
    const c = calcPayroll(staff, records);
    expect(c.present).toBe(20);
    expect(c.late).toBe(2);
    expect(c.absent).toBe(1);
    expect(c.leaveD).toBe(1);
    expect(c.worked).toBe(22);
    expect(c.earned).toBe(22000);
    expect(c.attPct).toBe(92); // round(22/24 * 100) = 91.67 → 92
    expect(c.net).toBe(22000); // no advance
  });

  test('with advance:2000 net is 20000', () => {
    const staff = makeStaff({ salary: 26000, advance: 2000 });
    const records: Attendance[] = [
      ...Array.from({ length: 20 }, (_, i) => makeAttendance('s1', 'present', `2026-06-${String(i + 1).padStart(2, '0')}`)),
      makeAttendance('s1', 'late', '2026-06-21'),
      makeAttendance('s1', 'late', '2026-06-22'),
      makeAttendance('s1', 'absent', '2026-06-23'),
      makeAttendance('s1', 'leave', '2026-06-24'),
    ];
    const c = calcPayroll(staff, records);
    expect(c.advance).toBe(2000);
    expect(c.net).toBe(20000);
  });

  test('empty records → all 0, attPct 0, earned 0, net -(advance)', () => {
    const staff = makeStaff({ salary: 26000, advance: 1500 });
    const c = calcPayroll(staff, []);
    expect(c.present).toBe(0);
    expect(c.late).toBe(0);
    expect(c.absent).toBe(0);
    expect(c.leaveD).toBe(0);
    expect(c.worked).toBe(0);
    expect(c.earned).toBe(0);
    expect(c.attPct).toBe(0);
    expect(c.net).toBe(-1500);
  });

  test('WORKDAYS constant is 26', () => {
    expect(WORKDAYS).toBe(26);
  });
});

describe('leaveUsed', () => {
  const requests: LeaveRequest[] = [
    { id: 'l1', staffId: 's1', type: 'casual', from: '2026-06-01', to: '2026-06-02', days: 2, reason: 'personal', status: 'approved' },
    { id: 'l2', staffId: 's1', type: 'casual', from: '2026-06-10', to: '2026-06-10', days: 1, reason: 'personal', status: 'pending' },
    { id: 'l3', staffId: 's1', type: 'sick', from: '2026-06-15', to: '2026-06-16', days: 2, reason: 'fever', status: 'approved' },
    { id: 'l4', staffId: 's2', type: 'casual', from: '2026-06-01', to: '2026-06-03', days: 3, reason: 'vacation', status: 'approved' },
    { id: 'l5', staffId: 's1', type: 'casual', from: '2026-06-20', to: '2026-06-20', days: 1, reason: 'other', status: 'rejected' },
  ];

  test('sums only approved casual leaves for a given staff', () => {
    expect(leaveUsed(requests, 's1', 'casual')).toBe(2); // l1 only; l2 pending, l5 rejected
  });

  test('sums only approved sick leaves for a given staff', () => {
    expect(leaveUsed(requests, 's1', 'sick')).toBe(2); // l3
  });

  test('does not bleed across staff ids', () => {
    expect(leaveUsed(requests, 's2', 'casual')).toBe(3); // l4
    expect(leaveUsed(requests, 's2', 'sick')).toBe(0);
  });

  test('empty list → 0', () => {
    expect(leaveUsed([], 's1', 'casual')).toBe(0);
  });
});

describe('monthRecords', () => {
  const allAttendance: Attendance[] = [
    { id: 'a1', staffId: 's1', date: '2026-06-01', status: 'present' },
    { id: 'a2', staffId: 's1', date: '2026-06-15', status: 'late' },
    { id: 'a3', staffId: 's2', date: '2026-06-01', status: 'present' },
    { id: 'a4', staffId: 's1', date: '2026-07-01', status: 'present' },
    { id: 'a5', staffId: 's1', date: '2026-05-30', status: 'absent' },
  ];

  test('filters by staffId and month prefix', () => {
    const recs = monthRecords(allAttendance, 's1', '2026-06');
    expect(recs.length).toBe(2);
    expect(recs.map((r) => r.id)).toEqual(['a1', 'a2']);
  });

  test('different staff same month → not included', () => {
    const recs = monthRecords(allAttendance, 's2', '2026-06');
    expect(recs.length).toBe(1);
    expect(recs[0].staffId).toBe('s2');
  });

  test('different month same staff → not included', () => {
    const recs = monthRecords(allAttendance, 's1', '2026-07');
    expect(recs.length).toBe(1);
    expect(recs[0].id).toBe('a4');
  });

  test('empty attendance → empty result', () => {
    expect(monthRecords([], 's1', '2026-06')).toEqual([]);
  });
});
