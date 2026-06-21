import { View, Text } from 'react-native';
import { MoneyText } from '../ui/MoneyText';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function monthName(mk: string): string {
  // mk is YYYY-MM
  const parts = mk.split('-');
  if (parts.length !== 2) return mk;
  const idx = parseInt(parts[1], 10) - 1;
  return MONTH_NAMES[idx] ?? mk;
}

export function ExpenseStatCards({ collected, shortStay, expenses, net, marginPct, monthLabel }: {
  collected: number; shortStay: number; expenses: number; net: number; marginPct: number; monthLabel: string;
}) {
  const card = 'min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface p-[18px] sm:basis-0';
  const dot = (c: string) => <View className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: c }} />;
  const mon = monthName(monthLabel);
  return (
    <View className="mb-[22px] flex-row flex-wrap gap-3 sm:gap-4">
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#1E6F5C')}<Text className="text-xs text-muted">PG Rent · collected</Text></View>
        <MoneyText amount={collected} className="mt-[9px] text-2xl text-ok" />
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#C7842A')}<Text className="text-xs text-muted">Short-stay income</Text></View>
        <MoneyText amount={shortStay} className="mt-[9px] text-2xl" style={{ color: '#C7842A' }} />
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#B5462F')}<Text className="text-xs text-muted">Expenses · {mon}</Text></View>
        <MoneyText amount={expenses} className="mt-[9px] text-2xl text-bad" />
      </View>
      <View className="min-w-0 grow basis-[47%] rounded-[14px] bg-brand p-[18px] sm:basis-0" style={{ shadowColor: 'rgba(19,53,44,1)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8 }}>
        <Text className="text-xs text-[#8FB0A5]">Net Operating Profit</Text>
        <View className="mt-[9px] flex-row items-baseline gap-2">
          <MoneyText amount={net} className="text-2xl text-[#FBF8F0]" />
          <Text className="font-mono text-[13px] font-semibold text-[#7FBBA8]">{marginPct}%</Text>
        </View>
      </View>
    </View>
  );
}
