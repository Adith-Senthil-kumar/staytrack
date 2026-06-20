import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor, type RentTone } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import type { Tenant } from '../../types';

const TONE: Record<RentTone, string> = { ok: 'text-ok', warn: 'text-warn', bad: 'text-bad', muted: 'text-muted' };

export function RentRow({ tenant, roomNumber, rent, isDue, onCollect }: {
  tenant: Tenant; roomNumber: string; rent: { label: string; tone: RentTone }; isDue: boolean; onCollect: () => void;
}) {
  return (
    <View className="flex-row items-center gap-3.5 border-b border-border-3 px-[22px] py-3">
      <View className="h-8 w-8 items-center justify-center rounded-[9px]" style={{ backgroundColor: avatarColor(tenant.name) }}>
        <Text className="text-xs font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text>
      </View>
      <Text numberOfLines={1} className="flex-1 text-[13.5px] font-sans-semibold text-text">{tenant.name}</Text>
      <Text className="w-12 font-mono-semibold text-[13px] text-ink">{roomNumber}</Text>
      <Text className="w-16 font-mono text-[13px] text-text">{formatINR(tenant.rent)}</Text>
      <Text className={`w-16 text-[12px] font-sans-semibold ${TONE[rent.tone]}`}>{rent.label}</Text>
      <View className="w-20 items-end">
        {isDue ? (
          <Pressable onPress={onCollect} className="rounded-[8px] bg-brand px-3 py-1.5 active:bg-brand-hover"><Text className="text-[12.5px] font-sans-semibold text-[#F4F1E7]">Collect</Text></Pressable>
        ) : (
          <Text className="text-[12.5px] font-sans-semibold text-ok">Paid ✓</Text>
        )}
      </View>
    </View>
  );
}
