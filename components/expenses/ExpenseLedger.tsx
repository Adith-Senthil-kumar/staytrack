import { View, Text, Pressable, ScrollView } from 'react-native';
import { CATEGORY_UI } from '../../constants/expenseCategory';
import { formatINR } from '../../lib/domain/format';
import { useNarrow } from '../../lib/ui/useNarrow';
import { PlusIcon, TrashIcon } from '../icons';
import type { Expense } from '../../types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso: string): string {
  // iso is YYYY-MM-DD
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const mon = MONTH_NAMES[(month - 1) % 12] ?? parts[1];
  return `${day} ${mon} ${year}`;
}

function formatMonthLabel(mk: string): string {
  // mk is YYYY-MM
  const parts = mk.split('-');
  if (parts.length !== 2) return mk;
  const month = parseInt(parts[1], 10);
  const year = parts[0];
  const mon = MONTH_NAMES[(month - 1) % 12] ?? parts[1];
  return `${mon} ${year}`;
}

const head = 'text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2';

export function ExpenseLedger({ expenses, total, monthLabel, onRecord, onDelete }: {
  expenses: Expense[]; total: number; monthLabel: string; onRecord: () => void; onDelete: (id: string) => void;
}) {
  const narrow = useNarrow();
  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2 }}>
      {/* Table header bar */}
      <View className="flex-row items-center justify-between border-b border-border-2 px-[20px] py-4">
        <Text className="font-serif text-base font-semibold text-ink">Expense Ledger</Text>
        <Pressable onPress={onRecord} className="flex-row items-center gap-[7px] rounded-[8px] bg-brand px-[13px] py-2 active:bg-brand-hover">
          <PlusIcon size={14} color="#F4F1E7" />
          <Text className="text-[12.5px] font-sans-semibold text-[#F4F1E7]">Record Expense</Text>
        </Pressable>
      </View>

      {/* Mobile: stacked cards — no horizontal scroll */}
      {narrow ? (
        expenses.length === 0 ? (
          <Text className="px-[20px] py-12 text-center text-[13.5px] text-soft">No expenses recorded this month.</Text>
        ) : (
          <View>
            {expenses.map((e) => {
              const ui = CATEGORY_UI[e.category];
              return (
                <View key={e.id} className="flex-row items-start gap-3 border-b border-border-3 px-[18px] py-3">
                  <View className="min-w-0 flex-1">
                    <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">{e.note || ui.label}</Text>
                    <View className="mt-1 flex-row items-center gap-2">
                      <View className="self-start rounded px-[7px] py-[3px]" style={{ backgroundColor: ui.color + '22' }}>
                        <Text className="text-[11px] font-sans-semibold" style={{ color: ui.color }}>{ui.label}</Text>
                      </View>
                      <Text className="font-mono text-[11.5px] text-soft">{formatDate(e.date)}</Text>
                    </View>
                  </View>
                  <View className="items-end gap-1.5">
                    <Text className="font-mono text-[14px] font-semibold text-bad">{formatINR(e.amount)}</Text>
                    <Pressable onPress={() => onDelete(e.id)} className="h-[28px] w-[28px] items-center justify-center rounded-[7px] active:bg-bad-bg">
                      <TrashIcon size={15} color="#9A9A8A" />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )
      ) : (
      /* Scrollable ledger table */
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[620px] grow">
          {/* Column header */}
          <View className="flex-row items-center border-b border-border bg-surface-2 px-[20px] py-[11px]" style={{ gap: 14 }}>
            <Text className={`flex-[2.4] ${head}`}>Expense</Text>
            <Text className={`flex-[1.2] ${head}`}>Category</Text>
            <Text className={`flex-1 text-right ${head}`}>Amount</Text>
            <View className="w-[30px]" />
          </View>

          {/* Rows */}
          {expenses.length === 0 ? (
            <Text className="px-[20px] py-12 text-center text-[13.5px] text-soft">No expenses recorded this month.</Text>
          ) : (
            expenses.map((e) => {
              const ui = CATEGORY_UI[e.category];
              return (
                <View key={e.id} className="flex-row items-center border-b border-border-3 px-[20px] py-3" style={{ gap: 14 }}>
                  {/* Title + date */}
                  <View className="min-w-0 flex-[2.4]">
                    <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">{e.note || ui.label}</Text>
                    <Text className="font-mono text-[11.5px] text-soft">{formatDate(e.date)}</Text>
                  </View>
                  {/* Category chip */}
                  <View className="flex-[1.2]">
                    <View
                      className="self-start rounded px-[7px] py-[3px]"
                      style={{ backgroundColor: ui.color + '22' }}
                    >
                      <Text className="text-[11px] font-sans-semibold" style={{ color: ui.color }}>{ui.label}</Text>
                    </View>
                  </View>
                  {/* Amount */}
                  <Text className="flex-1 text-right font-mono text-[13.5px] font-semibold text-bad">{formatINR(e.amount)}</Text>
                  {/* Delete */}
                  <Pressable
                    onPress={() => onDelete(e.id)}
                    className="h-[30px] w-[30px] items-center justify-center rounded-[7px] active:bg-bad-bg"
                  >
                    <TrashIcon size={15} color="#9A9A8A" />
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      )}

      {/* Footer total */}
      <View className="flex-row items-center justify-between bg-surface-2 px-[20px] py-[14px]">
        <Text className="text-[13px] font-sans-semibold text-ink">Total · {formatMonthLabel(monthLabel)}</Text>
        <Text className="font-mono text-[13px] font-semibold text-ink">{formatINR(total)}</Text>
      </View>
    </View>
  );
}
