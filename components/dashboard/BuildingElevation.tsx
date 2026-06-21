import { View, Text, Pressable } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { RoomTile } from './RoomTile';
import { STATUS_UI } from '../../constants/roomStatus';
import { roomTileVM, type FloorGroup } from '../../lib/domain/dashboard';
import type { Room, Tenant, Due } from '../../types';

const LEGEND: { key: keyof typeof STATUS_UI; }[] = [{ key: 'occupied' }, { key: 'pending' }, { key: 'vacant' }, { key: 'repair' }];

export function BuildingElevation({ floors, tenantByRoom, dueByTenant, subtitle, onManage, onSelectRoom }: {
  floors: FloorGroup[]; tenantByRoom: Map<string, Tenant>; dueByTenant: Map<string, Due>;
  subtitle: string; onManage?: () => void; onSelectRoom?: (r: Room) => void;
}) {
  return (
    <View className="flex-1 rounded-[14px] border border-border bg-surface px-6 pb-6 pt-5">
      <View className="mb-4 flex-row items-start justify-between">
        <View>
          <Text className="font-serif text-[17px] text-ink">Building Occupancy</Text>
          <Text className="mt-0.5 text-[12.5px] text-muted-2">{subtitle}</Text>
        </View>
        <Pressable onPress={onManage} className="flex-row items-center gap-1.5 rounded-[9px] border border-border bg-surface px-3 py-1.5 active:bg-surface-2">
          <Text className="text-[12.5px] font-sans-semibold text-ink">Manage</Text>
        </Pressable>
      </View>
      <View className="mb-3 flex-row flex-wrap gap-3.5">
        {LEGEND.map(({ key }) => (
          <View key={key} className="flex-row items-center gap-1.5">
            <View className={`h-2.5 w-2.5 rounded-[3px] ${STATUS_UI[key].dot}`} />
            <Text className="text-[11.5px] text-muted">{STATUS_UI[key].label}</Text>
          </View>
        ))}
      </View>

      <View className="items-center"><Svg width={28} height={16} viewBox="0 0 28 16"><Polygon points="14,0 28,16 0,16" fill="#2A4A40" /></Svg></View>

      {floors.map((f) => (
        <View key={f.floor} className="flex-row border-b border-border-2 py-3.5">
          <View className="w-12 justify-center">
            <Text className="font-mono-semibold text-[15px] text-ink">{f.floor}F</Text>
          </View>
          <View className="flex-1 flex-row flex-wrap gap-2.5">
            {f.rooms.length === 0 ? (
              <Text className="py-3 text-xs text-soft">No rooms on this floor yet.</Text>
            ) : f.rooms.map((r) => (
              <View key={r.id} className="grow basis-[30%] sm:basis-[14%]">
                <RoomTile vm={roomTileVM(r, tenantByRoom.get(r.id), dueByTenant.get(tenantByRoom.get(r.id)?.id ?? ''))} onPress={() => onSelectRoom?.(r)} />
              </View>
            ))}
          </View>
        </View>
      ))}
      <LinearGradient colors={['#C8C1AE', '#D8D1BF']} style={{ marginLeft: 14, height: 8, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
    </View>
  );
}
