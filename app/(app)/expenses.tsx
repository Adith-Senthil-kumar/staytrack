import { useMemo } from 'react';
import { View } from 'react-native';
import { useExpenses, useDues, useUserDoc } from '../../lib/db/hooks';
import { addExpense, removeExpense } from '../../lib/db/expenses';
import { collectionStats, marginStats, categoryBreakdown } from '../../lib/domain/stats';
import { monthKey, formatINR } from '../../lib/domain/format';
import { useUiStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { confirmAction } from '../../store/confirm';
import { ExpenseStatCards } from '../../components/expenses/ExpenseStatCards';
import { ExpenseLedger } from '../../components/expenses/ExpenseLedger';
import { CategoryBreakdown } from '../../components/expenses/CategoryBreakdown';
import { AddExpenseModal } from '../../components/expenses/AddExpenseModal';
import type { ExpenseCategory } from '../../types';

export default function Expenses() {
  const mk = monthKey(new Date());
  const uid = useAuthStore((s) => s.user?.uid);
  const { expenses } = useExpenses();
  const { dues } = useDues(mk);
  const { userDoc } = useUserDoc();
  const dueDay = userDoc?.property?.rentDueDay ?? 5;
  const showExpense = useUiStore((s) => s.showExpense);
  const openExpense = useUiStore((s) => s.openExpense);
  const closeExpense = useUiStore((s) => s.closeExpense);

  const monthExpenses = useMemo(() => expenses.filter((e) => e.date.startsWith(mk)), [expenses, mk]);
  const expTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const col = collectionStats(dues, new Date(), dueDay);
  const margin = marginStats(col.collected, expTotal);
  const cats = categoryBreakdown(monthExpenses);

  const onAdd = (e: { note: string; category: ExpenseCategory; amount: number }) => {
    if (uid) addExpense(uid, { ...e, vendor: '', date: new Date().toISOString().slice(0, 10) });
  };

  return (
    <View>
      <ExpenseStatCards collected={col.collected} shortStay={0} expenses={expTotal} net={margin.profit} marginPct={margin.marginPercent} monthLabel={mk} />
      <View className="flex-row flex-wrap items-start gap-4">
        <View className="min-w-[280px] flex-1">
          <ExpenseLedger expenses={monthExpenses} total={expTotal} monthLabel={mk} onRecord={openExpense}
            onDelete={(id) => {
              if (!uid) return;
              const e = monthExpenses.find((x) => x.id === id);
              confirmAction({
                title: 'Delete this expense?',
                message: e ? `"${e.note || e.category}" (${formatINR(e.amount)}) will be removed from the ledger.` : 'This entry will be removed from the ledger.',
                confirmLabel: 'Delete',
                danger: true,
                onConfirm: () => removeExpense(uid, id),
              });
            }} />
        </View>
        <View className="w-[270px] shrink-0 grow-0">
          <CategoryBreakdown rows={cats} />
        </View>
      </View>
      <AddExpenseModal visible={showExpense} onClose={closeExpense} onAdd={onAdd} />
    </View>
  );
}
