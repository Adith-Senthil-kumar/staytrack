import { View, Text } from 'react-native';
import { formatINR, monthKey } from '../../lib/domain/format';
import type { SSRoom, SSStay } from '../../types';

export function SSStatCards({ rooms, stays }: { rooms: SSRoom[]; stays: SSStay[] }) {
  const mk = monthKey(new Date());
  const available = rooms.filter((r) => r.status === 'available').length;
  const occupied = rooms.filter((r) => r.status === 'occupied').length;
  const cleaning = rooms.filter((r) => r.status === 'cleaning').length;
  const income = stays
    .filter((s) => s.createdAt.startsWith(mk))
    .reduce((sum, s) => sum + s.total, 0);

  const card = 'min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] py-4 sm:basis-0';

  return (
    <View className="mb-[22px] flex-row flex-wrap gap-4">
      <View className={card}>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: '#C7842A' }} />
          <Text className="text-[12px] text-muted">Available</Text>
        </View>
        <Text className="mt-[6px] font-mono-semibold text-[26px]" style={{ color: '#C7842A' }}>{available}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-[2px] bg-bad" />
          <Text className="text-[12px] text-muted">Occupied</Text>
        </View>
        <Text className="mt-[6px] font-mono-semibold text-[26px] text-ink">{occupied}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-[2px] bg-soft" />
          <Text className="text-[12px] text-muted">Cleaning pending</Text>
        </View>
        <Text className="mt-[6px] font-mono-semibold text-[26px] text-muted-2">{cleaning}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-[2px] bg-ok" />
          <Text className="text-[12px] text-muted">Short-stay income</Text>
        </View>
        <Text className="mt-[6px] font-mono-semibold text-[26px] text-ok">{formatINR(income)}</Text>
      </View>
    </View>
  );
}
