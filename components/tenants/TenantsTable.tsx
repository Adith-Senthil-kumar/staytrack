import { View, Text, ScrollView } from 'react-native';

export function TenantsTable({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  const head = 'text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2';
  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[640px] grow">
          <View className="flex-row gap-3.5 border-b border-border bg-surface-2 px-[22px] py-3">
            <View className="w-[34px]" />
            <Text className={`flex-1 ${head}`}>Tenant</Text>
            <Text className={`w-24 ${head}`}>Phone</Text>
            <Text className={`w-12 ${head}`}>Room</Text>
            <Text className={`w-16 ${head}`}>Sharing</Text>
            <Text className={`w-16 ${head}`}>Rent</Text>
            <Text className={`w-16 ${head}`}>Status</Text>
          </View>
          {empty ? <Text className="px-[22px] py-12 text-center text-[13.5px] text-soft">No tenants yet — add them from onboarding or the dashboard.</Text> : children}
        </View>
      </ScrollView>
    </View>
  );
}
