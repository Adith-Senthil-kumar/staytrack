import { View, Text, Pressable, ScrollView } from 'react-native';
import { CATEGORY_UI } from '../../constants/expenseCategory';
import { formatINR } from '../../lib/domain/format';
import { PlusIcon } from '../icons';
import type { Expense } from '../../types';

export function ExpenseLedger({ expenses, total, monthLabel, onRecord, onDelete }: {
  expenses: Expense[]; total: number; monthLabel: string; onRecord: () => void; onDelete: (id: string) => void;
}) {
  return (
    <View className="flex-1 overflow-hidden rounded-[14px] border border-border bg-surface">
      <View className="flex-row items-center justify-between border-b border-border-2 px-5 py-4">
        <Text className="font-serif text-base text-ink">Expense Ledger</Text>
        <Pressable onPress={onRecord} className="flex-row items-center gap-1.5 rounded-lg bg-brand px-3 py-2 active:bg-brand-hover"><PlusIcon size={14} color="#F4F1E7" /><Text className="text-[12.5px] font-sans-semibold text-[#F4F1E7]">Record Expense</Text></Pressable>
      </View>
      <View className="flex-row gap-3.5 border-b border-border bg-surface-2 px-5 py-2.5">
        <Text className="flex-1 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Expense</Text>
        <Text className="w-20 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Category</Text>
        <Text className="w-20 text-right text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Amount</Text>
        <View className="w-7" />
      </View>
      {expenses.length === 0 ? (
        <Text className="px-5 py-12 text-center text-[13.5px] text-soft">No expenses recorded this month.</Text>
      ) : (
        <ScrollView>
          {expenses.map((e) => (
            <View key={e.id} className="flex-row items-center gap-3.5 border-b border-border-3 px-5 py-3">
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">{e.note || CATEGORY_UI[e.category].label}</Text>
                <Text className="font-mono text-[11.5px] text-soft">{e.date}</Text>
              </View>
              <View className="w-20"><View className="self-start rounded px-1.5 py-0.5" style={{ backgroundColor: CATEGORY_UI[e.category].color + '22' }}><Text className="text-[11px] font-sans-semibold" style={{ color: CATEGORY_UI[e.category].color }}>{CATEGORY_UI[e.category].label}</Text></View></View>
              <Text className="w-20 text-right font-mono-semibold text-[13.5px] text-bad">{formatINR(e.amount)}</Text>
              <Pressable onPress={() => onDelete(e.id)} className="h-7 w-7 items-center justify-center rounded-md active:bg-bad-bg"><Text className="text-soft">🗑</Text></Pressable>
            </View>
          ))}
        </ScrollView>
      )}
      <View className="flex-row justify-between bg-surface-2 px-5 py-3.5"><Text className="text-[13px] font-sans-semibold text-ink">Total · {monthLabel}</Text><Text className="font-mono-semibold text-[13px] text-ink">{formatINR(total)}</Text></View>
    </View>
  );
}
