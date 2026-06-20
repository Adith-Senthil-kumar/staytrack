import { View, Text, ScrollView } from 'react-native';

export function TenantsTable({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
      <View className="flex-row gap-3.5 border-b border-border bg-surface-2 px-[22px] py-3">
        <View className="w-[34px]" />
        <Text className="flex-1 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Tenant</Text>
        <Text className="hidden w-24 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2 md:flex">Phone</Text>
        <Text className="w-12 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Room</Text>
        <Text className="w-16 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Rent</Text>
        <Text className="w-16 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Status</Text>
      </View>
      {empty ? <Text className="px-[22px] py-12 text-center text-[13.5px] text-soft">No tenants yet — add them from onboarding or the dashboard.</Text> : <ScrollView>{children}</ScrollView>}
    </View>
  );
}
