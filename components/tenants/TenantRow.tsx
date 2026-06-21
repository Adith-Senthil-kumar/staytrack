import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor, type RentTone } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import type { Tenant } from '../../types';

const TONE: Record<RentTone, string> = { ok: 'text-ok', warn: 'text-warn', bad: 'text-bad', muted: 'text-muted' };

export function TenantRow({ tenant, roomNumber, rent, onPress }: {
  tenant: Tenant; roomNumber: string; rent: { label: string; tone: RentTone }; onPress: () => void;
}) {
  const vacated = tenant.status === 'vacated';
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
      <Text className="w-16 font-mono text-[13px] text-text">{formatINR(tenant.rent)}</Text>
      <Text className={`w-16 text-[12px] font-sans-semibold ${vacated ? 'text-muted' : TONE[rent.tone]}`}>{vacated ? 'Vacated' : rent.label}</Text>
    </Pressable>
  );
}
