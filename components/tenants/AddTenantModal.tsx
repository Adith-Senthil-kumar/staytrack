import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
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

  useEffect(() => {
    if (visible) {
      setRoomId(presetRoomId ?? '');
      const preset = presetRoomId ? vacantRooms.find((r) => r.id === presetRoomId) : null;
      setSharing(preset?.type === 'double' ? 'double' : 'single');
    }
  }, [visible, presetRoomId, vacantRooms]);

  const reset = () => { setName(''); setPhone(''); setRoomId(''); setSharing('single'); setFood('veg'); setRent(''); };
  const close = () => { reset(); onClose(); };
  const submit = () => {
    if (!name.trim() || !roomId) return;
    onAdd({ name: name.trim(), phone: phone.trim(), roomId, sharing, food, rent: Number(rent) || 0 });
    reset();
  };

  const label = 'mb-1.5 text-[12px] font-sans-semibold text-label';
  const input = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';
  const seg = (active: boolean) => `flex-1 flex-row items-center justify-center rounded-[9px] border py-[11px] ${active ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`;
  const segTxt = (active: boolean) => `text-sm font-sans-semibold ${active ? 'text-ok' : 'text-label'}`;
  const canSubmit = !!name.trim() && !!roomId;

  return (
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {vacantRooms.length === 0 ? (
                      <Text className="py-2.5 text-[13px] text-soft">No vacant rooms</Text>
                    ) : vacantRooms.map((r) => (
                      <Pressable key={r.id} onPress={() => setRoomId(r.id)} className={`rounded-[9px] border px-3 py-[11px] ${roomId === r.id ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
                        <Text className={`font-mono text-[13px] ${roomId === r.id ? 'text-ok' : 'text-label'}`}>{r.number}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
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
  );
}
