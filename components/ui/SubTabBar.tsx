import { ScrollView, Pressable, Text, View } from 'react-native';

export function SubTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (k: T) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6 border-b border-border"
    >
      <View className="flex-row gap-5">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <Pressable key={t.key} onPress={() => onChange(t.key)} className="pb-3">
              <Text
                className={`px-1 text-[14px] font-sans-semibold ${isActive ? 'text-ink' : 'text-muted'}`}
              >
                {t.label}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent" />
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
