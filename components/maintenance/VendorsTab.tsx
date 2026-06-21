import { View, Text, Pressable, Linking } from 'react-native';
import { VendorCard } from './VendorCard';
import { PlusIcon } from '../icons';
import type { Vendor } from '../../types';

export function VendorsTab({
  vendors,
  onAdd,
  onEdit,
  onCall,
}: {
  vendors: Vendor[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCall: (phone: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {vendors.map((v) => (
        <View key={v.id} className="grow basis-full lg:basis-[48%]">
          <VendorCard
            vendor={v}
            onEdit={() => onEdit(v.id)}
            onCall={() => onCall(v.phone)}
          />
        </View>
      ))}

      {/* Add a Vendor dashed cell */}
      <Pressable
        onPress={onAdd}
        className="min-h-[88px] grow basis-full flex-row items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-border py-[18px] lg:basis-[48%]"
      >
        <PlusIcon size={17} color="#6B6B5A" />
        <Text className="text-sm font-sans-semibold text-ink">Add a Vendor</Text>
      </Pressable>
    </View>
  );
}
