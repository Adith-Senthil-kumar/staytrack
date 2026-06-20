import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { setProperty } from '../../lib/db/user';
import { Stepper } from '../../components/onboarding/Stepper';
import { ThemedText } from '../../components/ui/ThemedText';

export default function PropertyStep() {
  const router = useRouter();
  const uid = useAuthStore((s) => s.user?.uid);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dueDay, setDueDay] = useState('5');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = async () => {
    if (!uid || !name.trim()) return;
    setBusy(true); setError(null);
    try {
      await setProperty(uid, { name: name.trim(), address: address.trim(), rentDueDay: Number(dueDay) || 5 });
      router.push('/(onboarding)/rooms');
    } catch (e) {
      setError((e as Error)?.message ?? 'Could not save. Check your connection and try again.');
      setBusy(false);
    }
  };

  const input = 'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';
  return (
    <View className="flex-1 bg-bg px-6 pt-16">
      <Stepper step={0} total={3} />
      <ThemedText variant="title">Your property</ThemedText>
      <ThemedText variant="body" className="mb-6 mt-1 text-muted">Tell us about your PG.</ThemedText>
      <Text className="mb-1.5 text-xs font-sans-semibold text-label">Property name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="e.g. Sai Nilaya PG" placeholderTextColor="#9A9A8A" className={`mb-4 ${input}`} />
      <Text className="mb-1.5 text-xs font-sans-semibold text-label">Area / address</Text>
      <TextInput value={address} onChangeText={setAddress} placeholder="HSR Layout, Bengaluru" placeholderTextColor="#9A9A8A" className={`mb-4 ${input}`} />
      <Text className="mb-1.5 text-xs font-sans-semibold text-label">Rent due day (of month)</Text>
      <TextInput value={dueDay} onChangeText={setDueDay} keyboardType="number-pad" className={`mb-6 w-24 font-mono ${input}`} />
      <Pressable onPress={next} disabled={busy || !name.trim()} className="items-center rounded-[10px] bg-brand py-3.5" style={{ opacity: busy || !name.trim() ? 0.6 : 1 }}>
        <Text className="text-[14.5px] font-sans-semibold text-[#F4F1E7]">Continue</Text>
      </Pressable>
      {error ? <Text className="mt-3 text-[12.5px] text-bad">{error}</Text> : null}
    </View>
  );
}
