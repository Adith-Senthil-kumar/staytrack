import { View, Text, Pressable } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { initials, avatarColor, type RentTone } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import { useNarrow } from '../../lib/ui/useNarrow';
import { FileTextIcon } from '../icons';
import type { Tenant } from '../../types';

// Status chip — pill badge matching design chip() helper:
// paid → occ-bg / ok / occ-bd
// overdue → maint-bg / bad / maint-bd
// partial/unpaid/Due → pend-bg / warn / pend-bd
const CHIP_CLASS: Record<RentTone, string> = {
  ok:   'bg-occ-bg border-occ-bd',
  bad:  'bg-maint-bg border-maint-bd',
  warn: 'bg-pend-bg border-pend-bd',
  muted:'bg-surface-2 border-border',
};
const CHIP_TEXT_CLASS: Record<RentTone, string> = {
  ok:   'text-ok',
  bad:  'text-bad',
  warn: 'text-warn',
  muted:'text-muted-2',
};

function BellIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function RentRow({ tenant, roomNumber, rent, isDue, onCollect, onReceipt }: {
  tenant: Tenant; roomNumber: string; rent: { label: string; tone: RentTone }; isDue: boolean; onCollect: () => void; onReceipt?: () => void;
}) {
  const narrow = useNarrow();

  // Mobile: a stacked card with a full-width action button.
  if (narrow) {
    return (
      <View className="border-b border-border-3 px-[18px] py-3.5">
        <View className="flex-row items-center gap-3">
          <View className="h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px]" style={{ backgroundColor: avatarColor(tenant.name) }}>
            <Text className="text-xs font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="text-[14px] font-sans-semibold text-text">{tenant.name}</Text>
            <Text className="mt-0.5 font-mono text-[12.5px] text-label">Room {roomNumber} · {formatINR(tenant.rent)}</Text>
          </View>
          <View className={`flex-none rounded-[20px] border px-[9px] py-[3px] ${CHIP_CLASS[rent.tone]}`}>
            <Text className={`text-[11px] font-sans-semibold ${CHIP_TEXT_CLASS[rent.tone]}`}>{rent.label}</Text>
          </View>
        </View>
        {isDue ? (
          <View className="mt-2.5 flex-row gap-2">
            <Pressable onPress={onCollect} className="flex-1 items-center rounded-[9px] bg-brand py-2.5 active:bg-brand-hover">
              <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Record Payment</Text>
            </Pressable>
            <Pressable className="h-[40px] w-[40px] flex-none items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
              <BellIcon />
            </Pressable>
          </View>
        ) : onReceipt ? (
          <Pressable onPress={onReceipt} className="mt-2.5 flex-row items-center justify-center gap-1.5 rounded-[9px] border border-accent bg-occ-bg py-2.5 active:opacity-80">
            <FileTextIcon size={14} color="#1E6F5C" />
            <Text className="text-[13px] font-sans-semibold text-ok">Receipt</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View className="flex-row items-center border-b border-border-3 px-[22px] py-3">
      {/* Tenant column: avatar + name (flex 2.2) */}
      <View className="min-w-0 flex-[2.2] flex-row items-center gap-[11px] pr-3.5">
        <View className="h-8 w-8 flex-none items-center justify-center rounded-[9px]" style={{ backgroundColor: avatarColor(tenant.name) }}>
          <Text className="text-xs font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text>
        </View>
        <Text numberOfLines={1} className="flex-1 text-[13.5px] font-sans-semibold text-text">{tenant.name}</Text>
      </View>

      {/* Room column (flex 0.8) */}
      <Text className="flex-[0.8] pr-3.5 font-mono-semibold text-[13px] text-ink">{roomNumber}</Text>

      {/* Rent column (flex 1) */}
      <Text className="flex-[1] pr-3.5 font-mono text-[13px] text-text">{formatINR(tenant.rent)}</Text>

      {/* Status chip column (flex 1.2) */}
      <View className="flex-[1.2] pr-3.5">
        <View className={`self-start rounded-[20px] border px-[9px] py-[3px] ${CHIP_CLASS[rent.tone]}`}>
          <Text className={`text-[11px] font-sans-semibold ${CHIP_TEXT_CLASS[rent.tone]}`}>{rent.label}</Text>
        </View>
      </View>

      {/* Action column (flex 1.6) — bell + Record Payment / Receipt */}
      <View className="flex-[1.6] flex-row items-center justify-end gap-2">
        {isDue && (
          <Pressable
            className="h-[34px] w-[34px] flex-none items-center justify-center rounded-[8px] border border-border bg-surface text-label active:bg-surface-2"
          >
            <BellIcon />
          </Pressable>
        )}
        {isDue ? (
          <Pressable
            onPress={onCollect}
            className="items-center rounded-[8px] bg-brand px-[14px] py-[7px] active:bg-brand-hover"
          >
            <Text className="text-[12.5px] font-sans-semibold text-[#F4F1E7]">Record Payment</Text>
          </Pressable>
        ) : onReceipt ? (
          <Pressable
            onPress={onReceipt}
            className="flex-row items-center gap-1.5 rounded-[8px] border border-accent bg-occ-bg px-[14px] py-[7px] active:opacity-80"
          >
            <FileTextIcon size={13} color="#1E6F5C" />
            <Text className="text-[12.5px] font-sans-semibold text-ok">Receipt</Text>
          </Pressable>
        ) : (
          <Text className="px-[14px] text-[12.5px] text-soft">—</Text>
        )}
      </View>
    </View>
  );
}
