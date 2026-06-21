import { View, Text, Pressable } from 'react-native';
import { VENDOR_TRADE_UI } from '../../constants/vendorTrade';
import { initials } from '../../lib/domain/tenants';
import { PencilIcon, PhoneIcon } from '../icons';
import type { Vendor } from '../../types';

export function VendorCard({
  vendor,
  onEdit,
  onCall,
}: {
  vendor: Vendor;
  onEdit: () => void;
  onCall: () => void;
}) {
  const tradeInfo = VENDOR_TRADE_UI[vendor.trade];
  const abbr = initials(vendor.name);

  return (
    <View className="flex-row items-center gap-3.5 rounded-[14px] border border-border bg-surface p-[18px]">
      {/* Avatar */}
      <View
        className="h-12 w-12 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: tradeInfo.color }}
      >
        <Text className="text-[16px] font-sans-semibold text-[#FBF8F0]">{abbr}</Text>
      </View>

      {/* Info */}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-[15px] font-sans-bold text-text">
          {vendor.name}
        </Text>
        <Text className="text-[12.5px] text-muted-2">
          {tradeInfo.label} · {vendor.jobs} jobs done
        </Text>
        <Text className="mt-[3px] font-mono text-[12.5px] text-text-2">{vendor.phone}</Text>
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-2">
        <Pressable
          onPress={onEdit}
          className="h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-border bg-surface-2"
        >
          <PencilIcon size={16} color="#6B6B5A" />
        </Pressable>
        <Pressable
          onPress={onCall}
          className="h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-brand"
        >
          <PhoneIcon size={18} color="#F4F1E7" />
        </Pressable>
      </View>
    </View>
  );
}
