import { Pressable, Text, View } from 'react-native';
import { useThemeStore } from '../store/theme';

export default function Index() {
  const pref = useThemeStore((s) => s.pref);
  const setPref = useThemeStore((s) => s.setPref);
  const next = pref === 'dark' ? 'light' : 'dark';
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-bg">
      <Text className="font-serif-bold text-3xl text-ink">StayTrack</Text>
      <View className="rounded-2xl border border-border bg-surface px-6 py-5">
        <Text className="font-sans text-text">Theme: {pref}</Text>
      </View>
      <Pressable className="rounded-xl bg-brand px-5 py-3" onPress={() => setPref(next)}>
        <Text className="font-sans-semibold text-white">Switch to {next}</Text>
      </Pressable>
    </View>
  );
}
