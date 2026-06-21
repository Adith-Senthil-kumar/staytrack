import { View, Text, Pressable } from 'react-native';
import Svg, { Polygon, Path, Defs, Pattern, Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { RoomTile } from './RoomTile';
import { STATUS_UI } from '../../constants/roomStatus';
import { roomTileVM, floorName, type FloorGroup } from '../../lib/domain/dashboard';
import type { Room, Tenant, Due } from '../../types';

const ROW_H = 96;

// Legend swatch — vacant is a dashed outline, the rest are solid squares (matches design).
function LegendSwatch({ status }: { status: keyof typeof STATUS_UI }) {
  if (status === 'vacant') {
    return <View className="h-[11px] w-[11px] rounded-[3px] border-[1.5px] border-dashed border-vac-bd bg-vac-bg" />;
  }
  return <View className={`h-[11px] w-[11px] rounded-[3px] ${STATUS_UI[status].dot}`} />;
}

function chunk6<T>(arr: T[]): (T | null)[][] {
  const rows: (T | null)[][] = [];
  for (let i = 0; i < arr.length; i += 6) {
    const row: (T | null)[] = arr.slice(i, i + 6);
    while (row.length < 6) row.push(null);
    rows.push(row);
  }
  return rows.length ? rows : [[null, null, null, null, null, null]];
}

export function BuildingElevation({ floors, tenantByRoom, dueByTenant, subtitle, onManage, onSelectRoom }: {
  floors: FloorGroup[]; tenantByRoom: Map<string, Tenant>; dueByTenant: Map<string, Due>;
  subtitle: string; onManage?: () => void; onSelectRoom?: (r: Room) => void;
}) {
  const bodyH = Math.max(floors.length, 1) * ROW_H;
  return (
    <View className="flex-1 rounded-[14px] border border-border bg-surface px-6 pb-[26px] pt-[22px]">
      {/* header: title + inline legend + Manage */}
      <View className="mb-[18px] flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="font-serif text-[17px] text-ink">Building Occupancy</Text>
          <Text numberOfLines={1} className="mt-0.5 text-[12.5px] text-muted-2">{subtitle}</Text>
        </View>
        <View className="flex-row items-center gap-3.5">
          <View className="hidden flex-row gap-3.5 lg:flex">
            {(['occupied', 'pending', 'vacant', 'repair'] as const).map((k) => (
              <View key={k} className="flex-row items-center gap-1.5">
                <LegendSwatch status={k} />
                <Text className="text-[11.5px] text-muted">{STATUS_UI[k].label}</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={onManage} className="flex-row items-center gap-1.5 rounded-[9px] border border-border bg-surface px-3 py-1.5 active:bg-surface-2">
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#13352C" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </Svg>
            <Text className="text-[12.5px] font-sans-semibold text-ink">Manage</Text>
          </Pressable>
        </View>
      </View>

      {/* roof — wide & shallow, offset to sit above the room columns */}
      <View style={{ marginLeft: 58, marginRight: 2 }}>
        <Svg width="100%" height={16} viewBox="0 0 100 16" preserveAspectRatio="none">
          <Polygon points="0,16 50,0 100,16" fill="#2A4A40" />
        </Svg>
      </View>

      {/* building body with stairwell shaft */}
      <View className="relative">
        <View className="absolute bottom-0 top-0 border-x border-border" style={{ left: 21, width: 16 }}>
          <Svg width={16} height={bodyH}>
            <Defs>
              <Pattern id="stair" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
                <Rect width={10} height={10} fill="#E7E1D2" />
                <Line x1={0} y1={5} x2={10} y2={5} stroke="#F1ECDD" strokeWidth={5} />
              </Pattern>
            </Defs>
            <Rect width={16} height={bodyH} fill="url(#stair)" />
          </Svg>
        </View>

        {floors.map((f) => (
          <View key={f.floor} className="flex-row items-stretch border-b border-border-2" style={{ minHeight: ROW_H }}>
            <View className="justify-center pl-[42px]" style={{ width: 84 }}>
              <Text numberOfLines={1} className="font-mono-semibold text-[15px] text-ink">{f.floor}F</Text>
              <Text numberOfLines={1} className="text-[10px] text-soft">{floorName(f.floor)}</Text>
            </View>
            <View className="flex-1 justify-center py-3.5 pr-1">
              {f.rooms.length === 0 ? (
                <Text className="text-xs text-soft">No rooms on this floor yet — add them from Manage.</Text>
              ) : (
                chunk6(f.rooms).map((row, ri) => (
                  <View key={ri} className={`flex-row gap-2.5 ${ri > 0 ? 'mt-2.5' : ''}`}>
                    {row.map((r, ci) =>
                      r ? (
                        <View key={r.id} className="flex-1">
                          <RoomTile vm={roomTileVM(r, tenantByRoom.get(r.id), dueByTenant.get(tenantByRoom.get(r.id)?.id ?? ''))} onPress={() => onSelectRoom?.(r)} />
                        </View>
                      ) : (
                        <View key={`e${ci}`} className="flex-1" />
                      ),
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        ))}

        {/* ground */}
        <LinearGradient colors={['#C8C1AE', '#D8D1BF']} style={{ marginLeft: 14, height: 8, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
      </View>
    </View>
  );
}
