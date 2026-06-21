import { View, Text, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { groupByFloor } from '../../lib/domain/dashboard';
import { addRoom, removeRoom, setRoomType, setRoomStatus } from '../../lib/db/rooms';
import { useRooms } from '../../lib/db/hooks';
import { useAuthStore } from '../../store/auth';
import type { Room, RoomType } from '../../types';

export function ManagePropertyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const floors = groupByFloor(rooms);

  const nextNumber = (floor: number, count: number) => `${floor}${String(count + 1).padStart(2, '0')}`;
  const addRoomToFloor = (floor: number, count: number) => uid && addRoom(uid, { number: nextNumber(floor, count), floor, type: 'single', baseRent: 0, status: 'vacant' });
  const addFloor = () => { const f = (floors[0]?.floor ?? 0) + 1; uid && addRoom(uid, { number: `${f}01`, floor: f, type: 'single', baseRent: 0, status: 'vacant' }); };

  const typeBtn = (room: Room, t: RoomType, label: string) => (
    <Pressable onPress={() => uid && setRoomType(uid, room.id, t)} className={`rounded-md border px-2.5 py-1 ${room.type === t ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
      <Text className={`text-[12px] font-sans-semibold ${room.type === t ? 'text-ok' : 'text-muted'}`}>{label}</Text>
    </Pressable>
  );

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="max-h-[90%] w-full max-w-[680px] overflow-hidden rounded-[18px] bg-surface">
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Property Setup</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Manage Rooms & Floors</Text>
            <Text className="mt-1 text-[12.5px] text-[#8FB0A5]">{floors.length} floors · {rooms.length} rooms · set sharing, status or remove</Text>
          </View>

          <ScrollView className="px-[22px] py-4">
            {floors.map((f) => (
              <View key={f.floor} className="mb-4">
                <View className="mb-2.5 flex-row items-center gap-2.5">
                  <Text className="rounded-md border border-border bg-surface-2 px-2 py-0.5 font-mono-semibold text-[13px] text-ink">{f.floor}F</Text>
                  <Text className="text-[12px] text-soft">{f.rooms.length} rooms</Text>
                  <Pressable onPress={() => uid && f.rooms.forEach((r) => removeRoom(uid, r.id))} className="ml-auto"><Text className="text-[11.5px] font-sans-semibold text-bad">Remove floor</Text></Pressable>
                  <Pressable onPress={() => addRoomToFloor(f.floor, f.rooms.length)} className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5"><Text className="text-[12px] font-sans-semibold text-ink">+ Add Room</Text></Pressable>
                </View>
                {f.rooms.map((r) => (
                  <View key={r.id} className="mb-2 flex-row items-center gap-3 rounded-[10px] border border-border bg-surface px-3 py-2">
                    <Text className="w-12 font-mono-semibold text-sm text-ink">{r.number}</Text>
                    <View className="flex-row gap-1.5">{typeBtn(r, 'single', 'Single')}{typeBtn(r, 'double', 'Double')}</View>
                    <Pressable onPress={() => uid && setRoomStatus(uid, r.id, r.status === 'repair' ? 'vacant' : 'repair')} className={`ml-auto rounded-md px-2 py-1 ${r.status === 'repair' ? 'bg-maint-bg' : 'bg-surface-2'}`}><Text className={`text-[11px] font-sans-semibold ${r.status === 'repair' ? 'text-bad' : 'text-muted'}`}>{r.status === 'repair' ? 'Repair' : 'OK'}</Text></Pressable>
                    <Pressable onPress={() => uid && removeRoom(uid, r.id)} className="h-7 w-7 items-center justify-center rounded-md active:bg-bad-bg"><Text className="text-soft">🗑</Text></Pressable>
                  </View>
                ))}
              </View>
            ))}
            <Pressable onPress={addFloor} className="mb-2 items-center rounded-[11px] border border-dashed border-border py-3"><Text className="text-[13.5px] font-sans-semibold text-ink">+ Add a Floor</Text></Pressable>
          </ScrollView>

          <View className="border-t border-border px-[26px] py-3.5">
            <Pressable onPress={onClose} className="items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"><Text className="text-sm font-sans-semibold text-[#F4F1E7]">Done</Text></Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
