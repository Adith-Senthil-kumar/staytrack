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

  const card = 'min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface p-[18px] sm:basis-0';
  const dot = (c: string) => <View className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: c }} />;

  return (
    <View className="mb-[22px] flex-row flex-wrap gap-3 sm:gap-4">
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#C7842A')}<Text className="text-xs text-muted">Available</Text></View>
        <Text className="mt-2 font-mono-bold text-2xl" style={{ color: '#C7842A' }}>{available}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#2A3730')}<Text className="text-xs text-muted">Occupied</Text></View>
        <Text className="mt-2 font-mono-bold text-2xl text-text">{occupied}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#7C6F5B')}<Text className="text-xs text-muted">Cleaning pending</Text></View>
        <Text className="mt-2 font-mono-bold text-2xl text-muted">{cleaning}</Text>
      </View>
      <View className={card}>
        <View className="flex-row items-center gap-2">{dot('#1E6F5C')}<Text className="text-xs text-muted">Short-stay income</Text></View>
        <Text className="mt-2 font-mono-bold text-2xl text-ok">{formatINR(income)}</Text>
      </View>
    </View>
  );
}
