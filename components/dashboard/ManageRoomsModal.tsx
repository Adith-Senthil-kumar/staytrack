import { View, Text, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { groupByFloor, floorName } from '../../lib/domain/dashboard';
import type { Room } from '../../types';

function TrashIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#B5462F" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><Path d="M10 11v6M14 11v6" />
    </Svg>
  );
}

const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  occupied: { label: 'Occupied', cls: 'bg-occ-bg border-occ-bd text-ok' },
  pending: { label: 'Pending', cls: 'bg-pend-bg border-pend-bd text-warn' },
  reserved: { label: 'Reserved', cls: 'bg-pend-bg border-pend-bd text-warn' },
  vacant: { label: 'Vacant', cls: 'bg-vac-bg border-vac-bd text-st-vac' },
  repair: { label: 'Repair', cls: 'bg-maint-bg border-maint-bd text-bad' },
};

export function ManageRoomsModal({
  visible, rooms, onClose, onAddRoom, onRemoveRoom, onSetSharing, onToggleStatus, onAddFloor,
}: {
  visible: boolean;
  rooms: Room[];
  onClose: () => void;
  onAddRoom: (floor: number) => void;
  onRemoveRoom: (id: string) => void;
  onSetSharing: (id: string, sharing: 'single' | 'double') => void;
  onToggleStatus: (room: Room) => void;
  onAddFloor: () => void;
}) {
  const floors = groupByFloor(rooms);
  const totalRooms = rooms.length;

  const shBtn = (active: boolean) => `rounded-md border px-2.5 py-1.5 ${active ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`;
  const shTxt = (active: boolean) => `text-[12px] font-sans-semibold ${active ? 'text-ok' : 'text-label'}`;

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="flex max-h-[90%] w-[680px] max-w-full flex-col overflow-hidden rounded-[18px] bg-surface">
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-wide text-[#6F9588]">Property Setup</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Manage Rooms &amp; Floors</Text>
            <Text className="mt-0.5 text-[12.5px] text-[#8FB0A5]">{floors.length} floors · {totalRooms} rooms · set sharing, status or remove</Text>
            <Pressable onPress={onClose} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"><Text className="text-base text-[#DCE7E1]">✕</Text></Pressable>
          </View>

          <ScrollView contentContainerClassName="px-[22px] pb-2.5 pt-[18px]">
            {floors.map((f) => (
              <View key={f.floor} className="mb-[18px]">
                <View className="mb-2.5 flex-row items-center gap-2.5">
                  <Text className="rounded-[7px] border border-border bg-surface-2 px-2.5 py-[3px] font-mono-semibold text-[13px] text-ink">{f.floor}F</Text>
                  <Text className="text-[13.5px] font-sans-semibold text-text">{floorName(f.floor)} Floor</Text>
                  <Text className="text-[12px] text-soft">{f.rooms.length} rooms</Text>
                  <Pressable onPress={() => onAddRoom(f.floor)} className="ml-auto flex-row items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-[11px] py-1.5 active:bg-surface-3">
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#13352C" strokeWidth={2.4} strokeLinecap="round"><Path d="M12 5v14M5 12h14" /></Svg>
                    <Text className="text-[12px] font-sans-semibold text-ink">Add Room</Text>
                  </Pressable>
                </View>
                <View className="gap-2">
                  {f.rooms.map((r) => {
                    const chip = STATUS_CHIP[r.status] ?? STATUS_CHIP.vacant;
                    return (
                      <View key={r.id} className="flex-row items-center gap-3 rounded-[10px] border border-border bg-surface px-3 py-2">
                        <Text className="w-[46px] font-mono-semibold text-sm text-ink">{r.number}</Text>
                        <View className="flex-row gap-1.5">
                          <Pressable onPress={() => onSetSharing(r.id, 'single')} className={shBtn(r.type === 'single')}><Text className={shTxt(r.type === 'single')}>Single</Text></Pressable>
                          <Pressable onPress={() => onSetSharing(r.id, 'double')} className={shBtn(r.type === 'double')}><Text className={shTxt(r.type === 'double')}>Double</Text></Pressable>
                        </View>
                        <Pressable onPress={() => onToggleStatus(r)} disabled={r.status === 'occupied'} className={`flex-1 items-center rounded-md border py-1.5 ${chip.cls}`}>
                          <Text className={`text-[12px] font-sans-semibold ${chip.cls.split(' ').pop()}`}>{chip.label}</Text>
                        </Pressable>
                        <Pressable onPress={() => onRemoveRoom(r.id)} className="h-8 w-8 items-center justify-center rounded-md border border-border active:bg-bad-bg"><TrashIcon /></Pressable>
                      </View>
                    );
                  })}
                  {f.rooms.length === 0 && (
                    <View className="rounded-[10px] border border-dashed border-border p-4"><Text className="text-center text-[12.5px] text-soft">No rooms yet — use “Add Room” above.</Text></View>
                  )}
                </View>
              </View>
            ))}
            <Pressable onPress={onAddFloor} className="mb-1.5 flex-row items-center justify-center gap-2 rounded-[11px] border-[1.5px] border-dashed border-border py-3 active:bg-surface-2">
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#13352C" strokeWidth={2.2} strokeLinecap="round"><Path d="M12 5v14M5 12h14" /></Svg>
              <Text className="text-[13.5px] font-sans-semibold text-ink">Add a Floor</Text>
            </Pressable>
          </ScrollView>

          <View className="border-t border-border px-[26px] py-3.5">
            <Pressable onPress={onClose} className="items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"><Text className="text-sm font-sans-semibold text-[#F4F1E7]">Done</Text></Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
