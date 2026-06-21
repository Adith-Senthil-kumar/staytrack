import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor, type RentTone } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import type { Tenant } from '../../types';

// Design tenants table: Paid → green pill, anything unpaid → red "Rent due" pill (binary, matches StayTrack.dc.html)
const PILL: Record<RentTone | 'vacated', { bg: string; bd: string; txt: string; label: string }> = {
  ok: { bg: 'bg-occ-bg', bd: 'border-occ-bd', txt: 'text-ok', label: 'Paid' },
  warn: { bg: 'bg-maint-bg', bd: 'border-maint-bd', txt: 'text-bad', label: 'Rent due' },
  bad: { bg: 'bg-maint-bg', bd: 'border-maint-bd', txt: 'text-bad', label: 'Rent due' },
  muted: { bg: 'bg-surface-3', bd: 'border-border', txt: 'text-muted', label: 'No dues' },
  vacated: { bg: 'bg-surface-3', bd: 'border-border', txt: 'text-muted', label: 'Vacated' },
};

export function TenantRow({ tenant, roomNumber, sharing, rent, onPress }: {
  tenant: Tenant; roomNumber: string; sharing: string; rent: { label: string; tone: RentTone }; onPress: () => void;
}) {
  const vacated = tenant.status === 'vacated';
  const pill = vacated ? PILL.vacated : PILL[rent.tone];
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3.5 border-b border-border-3 px-[22px] py-3.5 active:bg-surface-3">
      <View className="h-[34px] w-[34px] items-center justify-center rounded-[9px]" style={{ backgroundColor: avatarColor(tenant.name) }}>
        <Text className="text-[13px] font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text>
      </View>
      <View className="w-[120px] min-w-0 flex-1">
        <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">{tenant.name}</Text>
        <Text numberOfLines={1} className={`text-[11.5px] font-sans-medium ${tenant.foodPreference === 'veg' ? 'text-veg' : 'text-nonveg'}`}>{tenant.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}</Text>
      </View>
      <Text numberOfLines={1} className="w-24 font-mono text-[12.5px] text-label">{tenant.phone || '—'}</Text>
      <Text className="w-12 font-mono-semibold text-[13px] text-ink">{roomNumber}</Text>
      <Text numberOfLines={1} className="w-16 text-[12.5px] capitalize text-label">{sharing}</Text>
      <Text className="w-16 font-mono text-[13px] text-text">{formatINR(tenant.rent)}</Text>
      <View className="w-20">
        <View className={`self-start flex-row items-center rounded-[20px] border px-[9px] py-[3px] ${pill.bg} ${pill.bd}`}>
          <Text className={`text-[11px] font-sans-semibold ${pill.txt}`}>{pill.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}
