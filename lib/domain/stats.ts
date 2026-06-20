import type { Due, Expense, ExpenseCategory, Room } from '../../types';
import { dueStatus } from './dues';

export function occupancyStats(rooms: Room[]) {
  const total = rooms.length;
  const occupied = rooms.filter((r) => r.status === 'occupied').length;
  const vacant = rooms.filter((r) => r.status === 'vacant').length;
  const pending = rooms.filter((r) => r.status === 'pending').length;
  const percent = total === 0 ? 0 : Math.round((occupied / total) * 100);
  return { occupied, total, percent, vacant, pending };
}

export function collectionStats(dues: Due[], today: Date, rentDueDay: number) {
  const billed = dues.reduce((s, d) => s + d.amountDue, 0);
  const collected = dues.reduce((s, d) => s + d.amountPaid, 0);
  const overdueCount = dues.filter((d) => dueStatus(d, today, rentDueDay) === 'overdue').length;
  return { billed, collected, pending: billed - collected, overdueCount };
}

export function marginStats(revenueCollected: number, expenses: number) {
  const profit = revenueCollected - expenses;
  const marginPercent =
    revenueCollected === 0 ? 0 : Math.round((profit / revenueCollected) * 100);
  return { profit, marginPercent };
}

export function categoryBreakdown(expenses: Expense[]) {
  const totals = new Map<ExpenseCategory, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
