import { ReactNode } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { useNarrow } from '../../lib/ui/useNarrow';

export function SubTabBar<T extends string>({
  tabs,
  active,
  onChange,
  action,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (k: T) => void;
  action?: ReactNode;
}) {
  const narrow = useNarrow();

  // Mobile: render tabs as separated pills (same chip style as the filters) so they
  // don't run together, wrapping onto rows as needed; the action drops below.
  if (narrow) {
    return (
      <View className="mb-5">
        <View className="flex-row flex-wrap gap-2">
          {tabs.map((t) => {
            const isActive = t.key === active;
            return (
              <Pressable
                key={t.key}
                onPress={() => onChange(t.key)}
                className={`rounded-full border px-3.5 py-1.5 ${isActive ? 'border-brand bg-brand' : 'border-border bg-surface'}`}
              >
                <Text className={`text-[13px] font-sans-semibold ${isActive ? 'text-[#F4F1E7]' : 'text-label'}`}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {action && <View className="mt-3 flex-row">{action}</View>}
      </View>
    );
  }

  const tabList = tabs.map((t) => {
    const isActive = t.key === active;
    return (
      <Pressable key={t.key} onPress={() => onChange(t.key)} className="pb-[9px]">
        <Text className={`px-1 text-[13.5px] font-sans-semibold ${isActive ? 'text-ink' : 'text-muted'}`}>{t.label}</Text>
        {isActive && <View className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-brand" />}
      </Pressable>
    );
  });

  return (
    <View className="mb-6 flex-row items-center border-b border-border">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexDirection: 'row', gap: 20 }}>
        {tabList}
      </ScrollView>
      {action && <View className="ml-auto pb-2 pl-4">{action}</View>}
    </View>
  );
}
