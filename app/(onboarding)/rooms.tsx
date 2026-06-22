import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { addRoom, removeRoom } from '../../lib/db/rooms';
import { useRooms } from '../../lib/db/hooks';
import { Stepper } from '../../components/onboarding/Stepper';
import { ThemedText } from '../../components/ui/ThemedText';
import { toPaise, formatINR } from '../../lib/domain/format';
import type { RoomType } from '../../types';

export default function RoomsStep() {
  const router = useRouter();
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const [number, setNumber] = useState('');
  const [floor, setFloor] = useState('1');
  const [type, setType] = useState<RoomType>('single');
  const [rent, setRent] = useState('');

  const add = async () => {
    if (!uid || !number.trim()) return;
    await addRoom(uid, { number: number.trim(), floor: Number(floor) || 1, type, baseRent: toPaise(Number(rent) || 0), status: 'vacant' });
    setNumber(''); setRent('');
  };

  const input = 'rounded-[9px] border border-border bg-field px-3 py-2.5 text-sm text-text';
  const typeBtn = (t: RoomType, label: string) => (
    <Pressable onPress={() => setType(t)} className={`rounded-lg border px-3 py-2 ${type === t ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
      <Text className={`text-[13px] font-sans-semibold ${type === t ? 'text-ok' : 'text-muted'}`}>{label}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-bg px-6 pt-16">
      <Stepper step={1} total={3} />
      <ThemedText variant="title">Add your rooms</ThemedText>
      <ThemedText variant="body" className="mb-5 mt-1 text-muted">{rooms.length} rooms added.</ThemedText>

      <View className="rounded-2xl border border-border bg-surface p-4">
        <View className="mb-3 flex-row gap-2">
          <TextInput value={number} onChangeText={setNumber} placeholder="Room # (301)" placeholderTextColor="#9A9A8A" className={`flex-1 font-mono ${input}`} />
          <TextInput value={floor} onChangeText={setFloor} placeholder="Floor" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`w-20 font-mono ${input}`} />
        </View>
        <View className="mb-3 flex-row items-center gap-2">
          {typeBtn('single', 'Single')}{typeBtn('double', 'Double')}{typeBtn('triple', 'Triple')}
          <TextInput value={rent} onChangeText={setRent} placeholder="Rent ₹" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`ml-auto w-28 font-mono ${input}`} />
        </View>
        <Pressable onPress={add} disabled={!number.trim()} className="items-center rounded-[9px] bg-surface-2 py-2.5" style={{ opacity: number.trim() ? 1 : 0.5 }}>
          <Text className="text-[13px] font-sans-semibold text-ink">+ Add room</Text>
        </Pressable>
      </View>

      <ScrollView className="my-4 flex-1">
        {rooms.map((r) => (
          <View key={r.id} className="mb-2 flex-row items-center gap-3 rounded-[10px] border border-border bg-surface px-3 py-2.5">
            <Text className="font-mono-semibold text-sm text-ink">{r.number}</Text>
            <Text className="text-xs text-muted">F{r.floor} · {r.type} · {formatINR(r.baseRent)}</Text>
            <Pressable onPress={() => uid && removeRoom(uid, r.id)} className="ml-auto"><Text className="text-xs font-sans-semibold text-bad">Remove</Text></Pressable>
          </View>
        ))}
      </ScrollView>

      <Pressable onPress={() => router.push('/(onboarding)/tenants')} disabled={rooms.length === 0} className="mb-6 items-center rounded-[10px] bg-brand py-3.5" style={{ opacity: rooms.length ? 1 : 0.6 }}>
        <Text className="text-[14.5px] font-sans-semibold text-[#F4F1E7]">Continue</Text>
      </Pressable>
    </View>
  );
}
