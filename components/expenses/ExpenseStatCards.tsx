import { View, Text } from 'react-native';
import { MoneyText } from '../ui/MoneyText';

export function ExpenseStatCards({ collected, shortStay, expenses, net, marginPct }: {
  collected: number; shortStay: number; expenses: number; net: number; marginPct: number;
}) {
  const card = 'min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface p-[18px] sm:basis-0';
  const dot = (c: string) => <View className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: c }} />;
  return (
    <View className="mb-[22px] flex-row flex-wrap gap-3 sm:gap-4">
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#1E6F5C')}<Text className="text-xs text-muted">PG Rent · collected</Text></View>
        <MoneyText amount={collected} className="mt-2 text-2xl text-ok" />
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#C7842A')}<Text className="text-xs text-muted">Short-stay income</Text></View>
        <MoneyText amount={shortStay} className="mt-2 text-2xl" style={{ color: '#C7842A' }} />
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#B5462F')}<Text className="text-xs text-muted">Expenses · this month</Text></View>
        <MoneyText amount={expenses} className="mt-2 text-2xl text-bad" />
      </View>
      <View className="min-w-0 grow basis-[47%] rounded-[14px] bg-brand p-[18px] sm:basis-0">
        <Text className="text-xs text-[#8FB0A5]">Net Operating Profit</Text>
        <View className="mt-2 flex-row items-baseline gap-2">
          <MoneyText amount={net} className="text-2xl text-[#FBF8F0]" />
          <Text className="font-mono-semibold text-[13px] text-[#7FBBA8]">{marginPct}%</Text>
        </View>
      </View>
    </View>
  );
}
