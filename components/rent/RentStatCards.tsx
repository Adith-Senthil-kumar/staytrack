import { View, Text, useWindowDimensions } from 'react-native';
import { MoneyText } from '../ui/MoneyText';

export function RentStatCards({ collected, outstanding, billed, overdueCount }: {
  collected: number; outstanding: number; billed: number; overdueCount: number;
}) {
  const { width } = useWindowDimensions();
  const pct = billed ? Math.round((collected / billed) * 100) : 0;
  const card = 'min-w-0 flex-1 rounded-[14px] border border-border bg-surface p-[18px]';
  return (
    <View className={width >= 700 ? 'mb-5 flex-row gap-4' : 'mb-5 gap-3'}>
      <View className={card}>
        <Text className="text-xs text-muted">Collected · this month</Text>
        <MoneyText amount={collected} className="mt-1.5 text-[26px] text-ok" />
        <View className="mt-2.5 h-1.5 overflow-hidden rounded-[4px] bg-track"><View className="h-full rounded-[4px] bg-accent" style={{ width: `${pct}%` }} /></View>
      </View>
      <View className={card}>
        <Text className="text-xs text-muted">Outstanding</Text>
        <MoneyText amount={outstanding} className="mt-1.5 text-[26px] text-bad" />
        <Text className="mt-2 text-xs text-soft">{overdueCount} tenants to follow up</Text>
      </View>
      <View className={card}>
        <Text className="text-xs text-muted">Total Billed</Text>
        <MoneyText amount={billed} className="mt-1.5 text-[26px] text-ink" />
        <Text className="mt-2 text-xs text-soft">{pct}% collected</Text>
      </View>
    </View>
  );
}
