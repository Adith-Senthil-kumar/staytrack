import { View, Text } from 'react-native';
import { CATEGORY_UI } from '../../constants/expenseCategory';
import { formatINR } from '../../lib/domain/format';
import type { ExpenseCategory } from '../../types';

export function CategoryBreakdown({ rows }: { rows: { category: ExpenseCategory; total: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <View className="rounded-[14px] border border-border bg-surface px-5 py-[18px]">
      <Text className="mb-4 text-[11.5px] font-sans-semibold uppercase tracking-wider text-muted-2">By Category</Text>
      {rows.length === 0 ? <Text className="text-xs text-soft">No expenses yet.</Text> : rows.map((r) => {
        const ui = CATEGORY_UI[r.category];
        return (
          <View key={r.category} className="mb-3.5">
            <View className="mb-1.5 flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: ui.color }} />
              <Text className="flex-1 text-[12.5px] text-text-2">{ui.label}</Text>
              <Text className="font-mono-semibold text-[12.5px] text-ink">{formatINR(r.total)}</Text>
            </View>
            <View className="h-1.5 overflow-hidden rounded-[4px] bg-track"><View className="h-full rounded-[4px]" style={{ width: `${(r.total / max) * 100}%` as `${number}%`, backgroundColor: ui.color }} /></View>
          </View>
        );
      })}
    </View>
  );
}
