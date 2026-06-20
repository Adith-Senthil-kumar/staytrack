import type { Due, DueStatus, NewDue, Tenant } from '../../types';

function dueDateOf(monthKey: string, rentDueDay: number): Date {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m - 1, rentDueDay);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function dueStatus(due: Due, today: Date, rentDueDay: number): DueStatus {
  if (due.amountPaid >= due.amountDue) return 'paid';
  const overdue = startOfDay(today).getTime() > dueDateOf(due.monthKey, rentDueDay).getTime();
  if (overdue) return 'overdue';
  return due.amountPaid > 0 ? 'partial' : 'unpaid';
}

export function generateDuesForMonth(
  tenants: Tenant[],
  monthKey: string,
  existingDues: Due[],
): NewDue[] {
  const billed = new Set(
    existingDues.filter((d) => d.monthKey === monthKey).map((d) => d.tenantId),
  );
  return tenants
    .filter((t) => t.status === 'active' && !billed.has(t.id))
    .map((t) => ({
      tenantId: t.id,
      monthKey,
      amountDue: t.rent,
      amountPaid: 0,
      paidAt: null,
    }));
}
