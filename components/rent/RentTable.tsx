import { View, Text, ScrollView } from 'react-native';

export function RentTable({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  const head = 'text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2';
  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[560px] grow">
          <View className="flex-row gap-3.5 border-b border-border bg-surface-2 px-[22px] py-3">
            <View className="w-8" />
            <Text className={`flex-1 ${head}`}>Tenant</Text>
            <Text className={`w-12 ${head}`}>Room</Text>
            <Text className={`w-16 ${head}`}>Rent</Text>
            <Text className={`w-16 ${head}`}>Status</Text>
            <Text className={`w-20 text-right ${head}`}>Action</Text>
          </View>
          {empty ? <Text className="px-[22px] py-12 text-center text-[13.5px] text-soft">No dues for this month yet.</Text> : children}
        </View>
      </ScrollView>
    </View>
  );
}
