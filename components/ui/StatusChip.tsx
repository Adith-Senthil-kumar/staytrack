import { Text, View } from 'react-native';
import type { RoomStatus } from '../../types';

const map: Record<RoomStatus, { bg: string; text: string; label: string }> = {
  occupied: { bg: 'bg-occ-bg', text: 'text-ok', label: 'Occupied' },
  vacant:   { bg: 'bg-vac-bg', text: 'text-muted', label: 'Vacant' },
  pending:  { bg: 'bg-pend-bg', text: 'text-warn', label: 'Pending' },
  reserved: { bg: 'bg-pend-bg', text: 'text-warn', label: 'Reserved' },
  repair:   { bg: 'bg-maint-bg', text: 'text-bad', label: 'Repair' },
};

export function StatusChip({ status }: { status: RoomStatus }) {
  const s = map[status];
  return (
    <View className={`rounded-md px-2 py-0.5 ${s.bg}`}>
      <Text className={`font-sans-semibold text-[11px] ${s.text}`}>{s.label}</Text>
    </View>
  );
}
