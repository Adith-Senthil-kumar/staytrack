import { ReactNode } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';

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
  return (
    <View className="mb-6 flex-row items-center border-b border-border">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexDirection: 'row', gap: 20 }}
      >
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <Pressable key={t.key} onPress={() => onChange(t.key)} className="pb-[9px]">
              <Text
                className={`px-1 text-[13.5px] font-sans-semibold ${isActive ? 'text-ink' : 'text-muted'}`}
              >
                {t.label}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-brand" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      {action && <View className="ml-auto pb-2 pl-4">{action}</View>}
    </View>
  );
}
