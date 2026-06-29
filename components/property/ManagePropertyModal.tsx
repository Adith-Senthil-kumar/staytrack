import { View, Text, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { groupByFloor, floorName, roomCapacity } from '../../lib/domain/dashboard';
import { addRoom, removeRoom, setRoomType, setRoomStatus } from '../../lib/db/rooms';
import { useRooms, useTenants } from '../../lib/db/hooks';
import { useAuthStore } from '../../store/auth';
import { confirmAction, notify } from '../../store/confirm';
import { XIcon } from '../icons';
import type { Room, RoomType } from '../../types';

const PlusGlyph = ({ size = 13, color = '#13352C' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const TrashGlyph = ({ size = 15, color = '#9A9A8A' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <Path d="M10 11v6M14 11v6" />
  </Svg>
);

export function ManagePropertyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const { tenants } = useTenants();
  const floors = groupByFloor(rooms);

  // Active tenants per room — used to block edits that would orphan or over-fill.
  const countByRoom = new Map<string, number>();
  tenants.filter((t) => t.status === 'active' && t.roomId).forEach((t) => countByRoom.set(t.roomId!, (countByRoom.get(t.roomId!) ?? 0) + 1));

  const nextNumber = (floor: number, count: number) => `${floor}${String(count + 1).padStart(2, '0')}`;
  const addRoomToFloor = (floor: number, count: number) => uid && addRoom(uid, { number: nextNumber(floor, count), floor, type: 'single', baseRent: 0, status: 'vacant' });
  const addFloor = () => { const f = (floors[0]?.floor ?? 0) + 1; uid && addRoom(uid, { number: `${f}01`, floor: f, type: 'single', baseRent: 0, status: 'vacant' }); };

  const changeSharing = (room: Room, t: RoomType) => {
    if (!uid) return;
    const n = countByRoom.get(room.id) ?? 0;
    const cap = roomCapacity(t);
    if (n > cap) { notify('Too many tenants', `Room ${room.number} has ${n} tenants — ${t} sharing allows only ${cap}. Vacate ${n - cap} before changing it.`); return; }
    setRoomType(uid, room.id, t);
  };
  const deleteRoom = (room: Room) => {
    if (!uid) return;
    const n = countByRoom.get(room.id) ?? 0;
    if (n > 0) { notify('Room is occupied', `Room ${room.number} has ${n} tenant${n > 1 ? 's' : ''}. Vacate ${n > 1 ? 'them' : 'the tenant'} before removing it.`); return; }
    confirmAction({ title: 'Remove this room?', message: `Room ${room.number} will be deleted from your property.`, confirmLabel: 'Remove', danger: true, onConfirm: () => removeRoom(uid, room.id) });
  };
  const deleteFloor = (floorRooms: Room[]) => {
    if (!uid || floorRooms.length === 0) return;
    const occupied = floorRooms.reduce((s, r) => s + (countByRoom.get(r.id) ?? 0), 0);
    if (occupied > 0) { notify('Floor is occupied', `This floor has ${occupied} tenant${occupied > 1 ? 's' : ''} across its rooms. Vacate everyone before removing the whole floor.`); return; }
    confirmAction({ title: 'Remove this entire floor?', message: `All ${floorRooms.length} room${floorRooms.length > 1 ? 's' : ''} on this floor will be deleted. This can't be undone.`, confirmLabel: 'Remove floor', danger: true, onConfirm: () => floorRooms.forEach((r) => removeRoom(uid, r.id)) });
  };

  const typeBtn = (room: Room, t: RoomType, label: string) => (
    <Pressable onPress={() => changeSharing(room, t)} className={`rounded-md border px-2.5 py-1 ${room.type === t ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
      <Text className={`text-[12px] font-sans-semibold ${room.type === t ? 'text-ok' : 'text-muted'}`}>{label}</Text>
    </Pressable>
  );

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="max-h-[90%] w-full max-w-[680px] overflow-hidden rounded-[18px] bg-surface">
          <View className="relative bg-brand px-[26px] py-[22px]">
            <Pressable onPress={onClose} style={{ zIndex: 10 }} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]">
              <XIcon size={16} color="#DCE7E1" />
            </Pressable>
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Property Setup</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Manage Rooms & Floors</Text>
            <Text className="mt-1 text-[12.5px] text-[#8FB0A5]">{floors.length} floors · {rooms.length} rooms · set sharing, status or remove</Text>
          </View>

          <ScrollView className="px-[22px] pb-2.5 pt-[18px]">
            {floors.map((f) => (
              <View key={f.floor} className="mb-4">
                <View className="mb-2.5 flex-row items-center gap-2.5">
                  <Text className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono-semibold text-[13px] text-ink">{f.floor === 1 ? 'G' : f.floor - 1}</Text>
                  <Text className="text-[13.5px] font-sans-semibold text-text">{floorName(f.floor)} Floor</Text>
                  <Text className="text-[12px] text-soft">{f.rooms.length} rooms</Text>
                  <Pressable onPress={() => deleteFloor(f.rooms)}><Text className="text-[11.5px] font-sans-semibold text-bad">Remove floor</Text></Pressable>
                  <Pressable onPress={() => addRoomToFloor(f.floor, f.rooms.length)} className="ml-auto flex-row items-center gap-[5px] rounded-lg border border-border bg-surface-2 px-2.5 py-1.5"><PlusGlyph /><Text className="text-[12px] font-sans-semibold text-ink">Add Room</Text></Pressable>
                </View>
                {f.rooms.map((r) => (
                  <View key={r.id} className="mb-2 flex-row items-center gap-3 rounded-[10px] border border-border bg-surface px-3 py-2">
                    <Text className="w-[54px] font-mono-semibold text-sm text-ink">{r.number}</Text>
                    <View className="w-[214px] flex-row gap-1.5">{typeBtn(r, 'single', 'Single')}{typeBtn(r, 'double', 'Double')}{typeBtn(r, 'triple', 'Triple')}</View>
                    <View className="flex-1">
                      <Pressable onPress={() => uid && setRoomStatus(uid, r.id, r.status === 'repair' ? 'vacant' : 'repair')} className={`self-start rounded-md px-2 py-1 ${r.status === 'repair' ? 'border border-maint-bd bg-maint-bg' : 'bg-surface-2'}`}><Text className={`text-[11px] font-sans-semibold ${r.status === 'repair' ? 'text-bad' : 'text-muted'}`}>{r.status === 'repair' ? 'Repair' : 'OK'}</Text></Pressable>
                    </View>
                    <Pressable onPress={() => deleteRoom(r)} className="h-[34px] w-[34px] items-center justify-center rounded-md active:bg-bad-bg"><TrashGlyph size={15} color="#9A9A8A" /></Pressable>
                  </View>
                ))}
              </View>
            ))}
            <Pressable onPress={addFloor} className="mb-2 flex-row items-center justify-center gap-2 rounded-[11px] border-[1.5px] border-dashed border-border py-3"><PlusGlyph size={16} /><Text className="text-[13.5px] font-sans-semibold text-ink">Add a Floor</Text></Pressable>
          </ScrollView>

          <View className="border-t border-border px-[26px] py-3.5">
            <Pressable onPress={onClose} className="items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"><Text className="text-sm font-sans-semibold text-[#F4F1E7]">Done</Text></Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
