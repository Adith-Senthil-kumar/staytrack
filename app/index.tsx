import { Pressable, ScrollView, View } from 'react-native';
import { useThemeStore } from '../store/theme';
import { ThemedText } from '../components/ui/ThemedText';
import { MoneyText } from '../components/ui/MoneyText';
import { Card } from '../components/ui/Card';
import { StatusChip } from '../components/ui/StatusChip';

export default function Index() {
  const pref = useThemeStore((s) => s.pref);
  const setPref = useThemeStore((s) => s.setPref);
  return (
    <ScrollView className="flex-1 bg-bg" contentContainerClassName="gap-4 p-6 pt-16">
      <ThemedText variant="title">StayTrack</ThemedText>
      <ThemedText variant="label">Foundation smoke test</ThemedText>
      <Card className="gap-3 p-5">
        <ThemedText variant="heading">Collected · June</ThemedText>
        <MoneyText amount={96300} className="text-2xl" />
        <View className="flex-row gap-2">
          <StatusChip status="occupied" />
          <StatusChip status="pending" />
          <StatusChip status="vacant" />
          <StatusChip status="repair" />
        </View>
      </Card>
      <Pressable
        className="self-start rounded-xl bg-brand px-5 py-3"
        onPress={() => setPref(pref === 'dark' ? 'light' : 'dark')}
      >
        <ThemedText variant="body" className="text-white">Toggle theme ({pref})</ThemedText>
      </Pressable>
    </ScrollView>
  );
}
