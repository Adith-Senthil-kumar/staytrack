import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal } from 'react-native';
import { toPaise, toRupees } from '../../lib/domain/format';
import { XIcon } from '../icons';
import type { Tenant, FoodPreference } from '../../types';

export type EditTenantData = { name: string; phone: string; rent: number; foodPreference: FoodPreference };

// Edit an existing tenant's basic details (name / phone / rent / food). Room
// re-assignment is intentionally out of scope here — use vacate + re-add for that.
export function EditTenantModal({ tenant, onClose, onSave }: {
  tenant: Tenant | null;
  onClose: () => void;
  onSave: (id: string, data: EditTenantData) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState('');
  const [food, setFood] = useState<FoodPreference>('veg');

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setPhone(tenant.phone);
      setRent(String(toRupees(tenant.rent)));
      setFood(tenant.foodPreference);
    }
  }, [tenant]);

  if (!tenant) return null;

  const canSave = !!name.trim();
  const label = 'mb-1.5 text-[12px] font-sans-semibold text-label';
  const input = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';
  const seg = (active: boolean) => `flex-1 flex-row items-center justify-center rounded-[9px] border py-[11px] ${active ? 'border-brand bg-brand' : 'border-border bg-surface'}`;
  const segTxt = (active: boolean) => `text-[13.5px] font-sans-semibold ${active ? 'text-[#F4F1E7]' : 'text-label'}`;

  const save = () => {
    if (!canSave) return;
    onSave(tenant.id, { name: name.trim(), phone: phone.trim(), rent: toPaise(Number(rent) || 0), foodPreference: food });
    onClose();
  };

  return (
    <RNModal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="w-[480px] max-w-full overflow-hidden rounded-[18px] bg-surface" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.4, shadowRadius: 70 }}>
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Edit Tenant</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">{tenant.name}</Text>
            <Pressable onPress={onClose} style={{ zIndex: 10 }} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-[8px] border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]">
              <XIcon size={16} color="#DCE7E1" />
            </Pressable>
          </View>

          <View className="px-[26px] pb-2 pt-6">
            <Text className={label}>Full Name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="e.g. Ananya Desai" placeholderTextColor="#9A9A8A" className={`mb-4 ${input}`} />

            <Text className={label}>Phone Number</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="+91 98xxx xxxxx" keyboardType="phone-pad" placeholderTextColor="#9A9A8A" className={`mb-4 font-mono ${input}`} />

            <Text className={label}>Monthly Rent (₹)</Text>
            <TextInput value={rent} onChangeText={setRent} placeholder="8500" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`mb-4 font-mono ${input}`} />

            <Text className={label}>Food Preference</Text>
            <View className="mb-1.5 flex-row gap-2.5">
              <Pressable onPress={() => setFood('veg')} className={seg(food === 'veg')}>
                <View className="mr-2 h-[9px] w-[9px] rounded-full bg-veg" /><Text className={segTxt(food === 'veg')}>Vegetarian</Text>
              </Pressable>
              <Pressable onPress={() => setFood('nonveg')} className={seg(food === 'nonveg')}>
                <View className="mr-2 h-[9px] w-[9px] rounded-full bg-nonveg" /><Text className={segTxt(food === 'nonveg')}>Non-Veg</Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-row gap-3 border-t border-border px-[26px] pb-6 pt-[14px]">
            <Pressable onPress={onClose} className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"><Text className="text-sm font-sans-semibold text-label">Cancel</Text></Pressable>
            <Pressable onPress={save} disabled={!canSave} className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover" style={{ opacity: canSave ? 1 : 0.5 }}>
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
