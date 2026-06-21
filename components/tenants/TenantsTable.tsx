import { View, Text, ScrollView } from 'react-native';
import { COL } from './TenantRow';

export function TenantsTable({ children, empty }: { children: React.ReactNode; empty: boolean }) {
  const head = 'text-[11px] font-sans-semibold uppercase tracking-[0.6px] text-muted-2';
  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[640px] grow">
          <View className="flex-row gap-3.5 border-b border-border bg-surface-2 px-[22px] py-[13px]">
            <Text style={{ flex: COL.tenant }} className={head}>Tenant</Text>
            <Text style={{ flex: COL.phone }} className={head}>Phone</Text>
            <Text style={{ flex: COL.room }} className={head}>Room</Text>
            <Text style={{ flex: COL.sharing }} className={head}>Sharing</Text>
            <Text style={{ flex: COL.rent }} className={head}>Rent</Text>
            <Text style={{ flex: COL.status }} className={head}>Status</Text>
          </View>
          {empty ? <Text className="px-[22px] py-12 text-center text-[13.5px] text-soft">No tenants yet — add them from onboarding or the dashboard.</Text> : children}
        </View>
      </ScrollView>
    </View>
  );
}
