import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { addTenant } from '../../lib/db/tenants';
import { completeOnboarding } from '../../lib/db/user';
import { useRooms, useTenants } from '../../lib/db/hooks';
import { Stepper } from '../../components/onboarding/Stepper';
import { ThemedText } from '../../components/ui/ThemedText';
import type { FoodPreference } from '../../types';

export default function TenantsStep() {
  const router = useRouter();
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const { tenants } = useTenants();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomId, setRoomId] = useState('');
  const [sharing, setSharing] = useState<'single' | 'double'>('single');
  const [food, setFood] = useState<FoodPreference>('veg');
  const [rent, setRent] = useState('');

  const vacant = rooms.filter((r) => r.status === 'vacant');
  const finish = async () => { if (uid) await completeOnboarding(uid); router.replace('/(app)/rooms'); };

  const add = async () => {
    if (!uid || !name.trim() || !roomId) return;
    await addTenant(uid, { name: name.trim(), phone: phone.trim(), roomId, rent: Number(rent) || 0, deposit: 0, foodPreference: food }, sharing);
    setName(''); setPhone(''); setRoomId(''); setRent('');
  };

  const input = 'rounded-[9px] border border-border bg-field px-3 py-2.5 text-sm text-text';
  const seg = (active: boolean) => `rounded-lg border px-3 py-2 ${active ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`;

  return (
    <View className="flex-1 bg-bg px-6 pt-16">
      <Stepper step={2} total={3} />
      <ThemedText variant="title">Add tenants</ThemedText>
      <ThemedText variant="body" className="mb-5 mt-1 text-muted">{tenants.length} added · optional, you can do this later.</ThemedText>

      <ScrollView className="flex-1">
        <View className="rounded-2xl border border-border bg-surface p-4">
          <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#9A9A8A" className={`mb-3 ${input}`} />
          <View className="mb-3 flex-row gap-2">
            <TextInput value={phone} onChangeText={setPhone} placeholder="+91 98xxx xxxxx" keyboardType="phone-pad" placeholderTextColor="#9A9A8A" className={`flex-1 font-mono ${input}`} />
            <TextInput value={rent} onChangeText={setRent} placeholder="Rent ₹" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`w-28 font-mono ${input}`} />
          </View>
          <Text className="mb-1.5 text-xs font-sans-semibold text-label">Assign room</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2">
              {vacant.length === 0 ? <Text className="text-xs text-muted">No vacant rooms</Text> :
                vacant.map((r) => (
                  <Pressable key={r.id} onPress={() => setRoomId(r.id)} className={seg(roomId === r.id)}>
                    <Text className={`font-mono text-[13px] ${roomId === r.id ? 'text-ok' : 'text-muted'}`}>{r.number}</Text>
                  </Pressable>
                ))}
            </View>
          </ScrollView>
          <View className="mb-3 flex-row gap-2">
            <Pressable onPress={() => setSharing('single')} className={seg(sharing === 'single')}><Text className={`text-[13px] font-sans-semibold ${sharing === 'single' ? 'text-ok' : 'text-muted'}`}>Single</Text></Pressable>
            <Pressable onPress={() => setSharing('double')} className={seg(sharing === 'double')}><Text className={`text-[13px] font-sans-semibold ${sharing === 'double' ? 'text-ok' : 'text-muted'}`}>Double</Text></Pressable>
            <Pressable onPress={() => setFood('veg')} className={seg(food === 'veg')}><Text className="text-[13px] font-sans-semibold text-veg">● Veg</Text></Pressable>
            <Pressable onPress={() => setFood('nonveg')} className={seg(food === 'nonveg')}><Text className="text-[13px] font-sans-semibold text-nonveg">● Non-Veg</Text></Pressable>
          </View>
          <Pressable onPress={add} disabled={!name.trim() || !roomId} className="items-center rounded-[9px] bg-surface-2 py-2.5" style={{ opacity: name.trim() && roomId ? 1 : 0.5 }}>
            <Text className="text-[13px] font-sans-semibold text-ink">+ Add tenant</Text>
          </Pressable>
        </View>

        {tenants.map((t) => (
          <View key={t.id} className="mb-2 mt-2 flex-row items-center gap-3 rounded-[10px] border border-border bg-surface px-3 py-2.5">
            <Text className="text-sm font-sans-semibold text-ink">{t.name}</Text>
            <Text className="text-xs text-muted">₹{t.rent} · {t.foodPreference}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable onPress={finish} className="my-6 items-center rounded-[10px] bg-brand py-3.5">
        <Text className="text-[14.5px] font-sans-semibold text-[#F4F1E7]">{tenants.length ? 'Finish setup' : 'Skip for now'}</Text>
      </Pressable>
    </View>
  );
}
