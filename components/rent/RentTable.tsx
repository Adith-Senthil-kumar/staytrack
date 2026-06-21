import { View, Text, ScrollView } from 'react-native';

export function RentTable({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  const head = 'text-[11px] font-sans-semibold uppercase tracking-[0.6px] text-muted-2';
  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-sm">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[600px] grow">
          {/* Header: columns match design 2.2fr 0.8fr 1fr 1.2fr 1.6fr */}
          <View className="flex-row items-center border-b border-border bg-surface-2 px-[22px] py-3">
            <Text className={`flex-[2.2] pr-3.5 ${head}`}>Tenant</Text>
            <Text className={`flex-[0.8] pr-3.5 ${head}`}>Room</Text>
            <Text className={`flex-[1] pr-3.5 ${head}`}>Rent</Text>
            <Text className={`flex-[1.2] pr-3.5 ${head}`}>Status</Text>
            <Text className={`flex-[1.6] text-right ${head}`}>Action</Text>
          </View>
          {empty ? (
            <Text className="px-[22px] py-12 text-center text-[13.5px] text-soft">No dues for this month yet.</Text>
          ) : children}
        </View>
      </ScrollView>
    </View>
  );
}
