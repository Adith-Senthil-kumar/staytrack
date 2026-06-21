import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Room, FoodPreference } from '../../types';

export type AddTenantData = {
  name: string; phone: string; roomId: string; sharing: 'single' | 'double'; food: FoodPreference; rent: number;
};

export function AddTenantModal({
  visible, vacantRooms, presetRoomId, onClose, onAdd,
}: {
  visible: boolean;
  vacantRooms: Room[];
  presetRoomId: string | null;
  onClose: () => void;
  onAdd: (data: AddTenantData) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomId, setRoomId] = useState('');
  const [sharing, setSharing] = useState<'single' | 'double'>('single');
  const [food, setFood] = useState<FoodPreference>('veg');
  const [rent, setRent] = useState('');
  const [roomOpen, setRoomOpen] = useState(false);
  const [ddRect, setDdRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const roomBtnRef = useRef<View>(null);

  useEffect(() => {
    if (visible) {
      setRoomId(presetRoomId ?? '');
      const preset = presetRoomId ? vacantRooms.find((r) => r.id === presetRoomId) : null;
      setSharing(preset?.type === 'double' ? 'double' : 'single');
    }
  }, [visible, presetRoomId, vacantRooms]);
  useEffect(() => { if (!visible) setRoomOpen(false); }, [visible]);

  const reset = () => { setName(''); setPhone(''); setRoomId(''); setSharing('single'); setFood('veg'); setRent(''); setRoomOpen(false); };
  const close = () => { reset(); onClose(); };
  const selectedRoom = vacantRooms.find((r) => r.id === roomId);
  const submit = () => {
    if (!name.trim() || !roomId) return;
    onAdd({ name: name.trim(), phone: phone.trim(), roomId, sharing, food, rent: Number(rent) || 0 });
    reset();
  };

  const openRoomDropdown = () => {
    if (roomOpen) { setRoomOpen(false); return; }
    roomBtnRef.current?.measureInWindow((x, y, w, h) => {
      setDdRect({ top: y + h + 4, left: x, width: w });
      setRoomOpen(true);
    });
  };
  const pickRoom = (id: string) => { setRoomId(id); setRoomOpen(false); };

  const label = 'mb-1.5 text-[12px] font-sans-semibold text-label';
  const input = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';
  const seg = (active: boolean) => `flex-1 flex-row items-center justify-center rounded-[9px] border py-[11px] ${active ? 'border-brand bg-brand' : 'border-border bg-surface'}`;
  const segTxt = (active: boolean) => `text-sm font-sans-semibold ${active ? 'text-[#F4F1E7]' : 'text-label'}`;
  const canSubmit = !!name.trim() && !!roomId;

  return (
    <>
      <RNModal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <View className="flex-1 items-center justify-center bg-overlay p-6">
          <View className="max-h-[92%] w-[560px] max-w-full overflow-hidden rounded-[18px] bg-surface">
            {/* Brand header */}
            <View className="bg-brand px-[26px] py-[22px]">
              <Text className="text-[11.5px] font-sans-semibold uppercase tracking-wide text-[#6F9588]">Onboard New Tenant</Text>
              <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Add Tenant</Text>
              <Pressable onPress={close} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]">
                <Text className="text-base text-[#DCE7E1]">✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerClassName="px-[26px] pb-2 pt-6">
              <Text className={label}>Full Name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="e.g. Ananya Desai" placeholderTextColor="#9A9A8A" className={`mb-4 ${input}`} />

              <View className="mb-4 flex-row gap-3.5">
                <View className="flex-1">
                  <Text className={label}>Phone Number</Text>
                  <TextInput value={phone} onChangeText={setPhone} placeholder="+91 98xxx xxxxx" keyboardType="phone-pad" placeholderTextColor="#9A9A8A" className={`font-mono ${input}`} />
                </View>
                <View className="flex-1">
                  <Text className={label}>Assign Room</Text>
                  <Pressable ref={roomBtnRef} onPress={openRoomDropdown} className="flex-row items-center rounded-[9px] border border-border bg-field px-[13px] py-[11px]">
                    <Text numberOfLines={1} className={`flex-1 text-sm ${selectedRoom ? 'text-text' : 'text-soft'}`}>
                      {selectedRoom ? `Room ${selectedRoom.number}` : 'Select vacant room…'}
                    </Text>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#9A9A8A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: [{ rotate: roomOpen ? '180deg' : '0deg' }] }}><Path d="m6 9 6 6 6-6" /></Svg>
                  </Pressable>
                </View>
              </View>

              <Text className={label}>Sharing Type</Text>
              <View className="mb-4 flex-row gap-2.5">
                <Pressable onPress={() => setSharing('single')} className={seg(sharing === 'single')}><Text className={segTxt(sharing === 'single')}>Single</Text></Pressable>
                <Pressable onPress={() => setSharing('double')} className={seg(sharing === 'double')}><Text className={segTxt(sharing === 'double')}>Double</Text></Pressable>
              </View>

              <Text className={label}>Food Preference</Text>
              <View className="mb-4 flex-row gap-2.5">
                <Pressable onPress={() => setFood('veg')} className={seg(food === 'veg')}>
                  <View className="mr-2 h-[9px] w-[9px] rounded-full bg-veg" /><Text className={segTxt(food === 'veg')}>Vegetarian</Text>
                </Pressable>
                <Pressable onPress={() => setFood('nonveg')} className={seg(food === 'nonveg')}>
                  <View className="mr-2 h-[9px] w-[9px] rounded-full bg-nonveg" /><Text className={segTxt(food === 'nonveg')}>Non-Veg</Text>
                </Pressable>
              </View>

              <Text className={label}>Monthly Rent (₹)</Text>
              <TextInput value={rent} onChangeText={setRent} placeholder="8500" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`mb-1.5 font-mono ${input}`} />
            </ScrollView>

            <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
              <Pressable onPress={close} className="rounded-[10px] border border-border bg-surface px-5 py-3"><Text className="text-sm font-sans-semibold text-label">Cancel</Text></Pressable>
              <Pressable onPress={submit} disabled={!canSubmit} className="flex-1 items-center rounded-[10px] bg-brand py-3" style={{ opacity: canSubmit ? 1 : 0.5 }}>
                <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Add Tenant</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Floating room dropdown — anchored under the control, over the form */}
      <RNModal visible={roomOpen} transparent animationType="none" onRequestClose={() => setRoomOpen(false)}>
        <Pressable onPress={() => setRoomOpen(false)} style={{ flex: 1 }}>
          {ddRect && (
            <View
              style={{ position: 'absolute', top: ddRect.top, left: ddRect.left, width: ddRect.width, maxHeight: 240, elevation: 12, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } }}
              className="overflow-hidden rounded-[10px] border border-border bg-surface"
            >
              {vacantRooms.length === 0 ? (
                <Text className="px-3.5 py-3 text-[13px] text-soft">No vacant rooms available</Text>
              ) : (
                <ScrollView nestedScrollEnabled>
                  {vacantRooms.map((r, i) => (
                    <Pressable key={r.id} onPress={() => pickRoom(r.id)} className={`px-3.5 py-3 active:bg-surface-2 ${i < vacantRooms.length - 1 ? 'border-b border-border-3' : ''}`}>
                      <Text className="text-[13.5px] text-text">Room {r.number} · Floor {r.floor === 1 ? 'G' : r.floor} · {r.type === 'double' ? 'Double' : 'Single'}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </Pressable>
      </RNModal>
    </>
  );
}
