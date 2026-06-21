import { View, Text } from 'react-native';
import { monthKey, formatINR } from '../../lib/domain/format';
import type { MaintTicket } from '../../types';

export function MaintStatCards({ tickets }: { tickets: MaintTicket[] }) {
  const mk = monthKey(new Date());

  const active = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const highPriority = tickets.filter(
    (t) => (t.status === 'open' || t.status === 'in_progress') && t.priority === 'high',
  ).length;
  const resolvedThisMonth = tickets.filter(
    (t) => t.status === 'done' && t.createdDate.startsWith(mk),
  ).length;
  const repairSpend = tickets
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + t.cost, 0);

  const card = 'min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface p-[18px] sm:basis-0';
  const dot = (c: string) => <View className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: c }} />;

  return (
    <View className="mb-[22px] flex-row flex-wrap gap-3 sm:gap-4">
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#B5462F')}<Text className="text-xs text-muted">Active tickets</Text></View>
        <Text className="mt-2 font-mono-semibold text-2xl text-ink">{active}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#B5462F')}<Text className="text-xs text-muted">High priority</Text></View>
        <Text className="mt-2 font-mono-semibold text-2xl text-bad">{highPriority}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#1E6F5C')}<Text className="text-xs text-muted">Resolved · this month</Text></View>
        <Text className="mt-2 font-mono-semibold text-2xl text-ok">{resolvedThisMonth}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#C67A1E')}<Text className="text-xs text-muted">Repair spend</Text></View>
        <Text className="mt-2 font-mono-semibold text-2xl text-ink">{formatINR(repairSpend)}</Text>
      </View>
    </View>
  );
}
