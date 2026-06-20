import { View, Text, Pressable } from 'react-native';
import { STATUS_UI } from '../../constants/roomStatus';
import type { RoomTileVM } from '../../lib/domain/dashboard';

export function RoomTile({ vm, onPress }: { vm: RoomTileVM; onPress?: () => void }) {
  const ui = STATUS_UI[vm.status];
  return (
    <Pressable onPress={onPress} className={`min-w-0 flex-1 rounded-[10px] border p-2.5 ${ui.tile}`}>
      <View className="flex-row items-center justify-between">
        <Text className={`font-mono-semibold text-sm ${ui.num}`}>{vm.number}</Text>
        <View className={`h-2 w-2 rounded-full ${ui.dot}`} />
      </View>
      <Text numberOfLines={1} className={`mt-1.5 text-[11.5px] font-sans-medium ${ui.line}`}>{vm.occLine}</Text>
      <View className="mt-1.5 flex-row items-center justify-between">
        <Text className={`text-[9.5px] font-sans-semibold uppercase tracking-wide ${ui.sub}`}>{vm.sub}</Text>
        {vm.dueChip ? <Text className="rounded bg-due-bg px-1.5 text-[9.5px] font-sans-bold text-bad">{vm.dueChip}</Text> : null}
      </View>
    </Pressable>
  );
}
