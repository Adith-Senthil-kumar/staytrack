import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import type { Staff } from '../../types';
export function StaffCard({ staff, onPress }: { staff: Staff; onPress?: () => void }) {
  const role = STAFF_ROLE_UI[staff.role];
  return (
    <Pressable onPress={onPress} className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface p-[18px] active:border-brand lg:basis-[31%]">
      <View className="flex-row items-center gap-3">
        <View className="h-[46px] w-[46px] items-center justify-center rounded-xl" style={{ backgroundColor: avatarColor(staff.name) }}><Text className="text-base font-sans-semibold text-[#FBF8F0]">{initials(staff.name)}</Text></View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[15px] font-sans-bold text-text">{staff.name}</Text>
          <View className="mt-1 self-start rounded px-1.5 py-0.5" style={{ backgroundColor: role.color + '22' }}><Text className="text-[11px] font-sans-semibold" style={{ color: role.color }}>{role.label}</Text></View>
        </View>
      </View>
      <View className="mt-3.5 flex-row items-center justify-between"><Text className="text-[12.5px] text-muted-2">Phone</Text><Text numberOfLines={1} className="font-mono text-[12.5px] text-text-2">{staff.phone || '—'}</Text></View>
      <View className="mt-1.5 flex-row items-center justify-between"><Text className="text-[12.5px] text-muted-2">Salary</Text><Text className="font-mono-semibold text-[12.5px] text-ink">{formatINR(staff.salary)}</Text></View>
    </Pressable>
  );
}
