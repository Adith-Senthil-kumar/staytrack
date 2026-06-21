import type { Staff, Attendance, LeaveRequest, LeaveType } from '../../types';

export const WORKDAYS = 26;

export interface PayrollCalc {
  present: number;
  late: number;
  absent: number;
  leaveD: number;
  worked: number;
  perDay: number;
  earned: number;
  advance: number;
  net: number;
  attPct: number;
}

export function calcPayroll(staff: Staff, records: Attendance[], workdays = WORKDAYS): PayrollCalc {
  const present = records.filter((r) => r.status === 'present').length;
  const late = records.filter((r) => r.status === 'late').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const leaveD = records.filter((r) => r.status === 'leave').length;
  const worked = present + late;
  const elapsed = worked + absent + leaveD;
  const perDay = staff.salary / workdays;
  const earned = Math.round(perDay * worked);
  const advance = staff.advance ?? 0;
  const net = earned - advance;
  const attPct = elapsed ? Math.round((worked / elapsed) * 100) : 0;
  return { present, late, absent, leaveD, worked, perDay, earned, advance, net, attPct };
}

export const monthRecords = (attendance: Attendance[], staffId: string, ym: string) =>
  attendance.filter((a) => a.staffId === staffId && a.date.startsWith(ym));

export const leaveUsed = (requests: LeaveRequest[], staffId: string, type: LeaveType) =>
  requests
    .filter((r) => r.staffId === staffId && r.type === type && r.status === 'approved')
    .reduce((a, r) => a + r.days, 0);
