import { View, Text, Pressable, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { LogoMark } from '../brand/LogoMark';
import { RoomsIcon, TenantsIcon, RentIcon, ExpensesIcon, StaffIcon, LogoutIcon, MaintenanceIcon } from '../icons';
import { signOutUser } from '../../lib/auth/actions';

const NAV = [
  { href: '/(app)/rooms', label: 'Rooms', Icon: RoomsIcon },
  { href: '/(app)/tenants', label: 'Tenants', Icon: TenantsIcon },
  { href: '/(app)/staff', label: 'Staff', Icon: StaffIcon },
  { href: '/(app)/rent', label: 'Rent Collection', Icon: RentIcon },
  { href: '/(app)/expenses', label: 'Expenses', Icon: ExpensesIcon },
  { href: '/(app)/maintenance', label: 'Maintenance', Icon: MaintenanceIcon },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <View className="h-full w-[252px] bg-sidebar">
      <View className="flex-row items-center gap-3 border-b border-[#ffffff12] px-[22px] pb-5 pt-6">
        <LogoMark size={38} />
        <View>
          <Text className="font-serif-bold text-[20px] text-[#FBF8F0]">StayTrack</Text>
          <Text className="mt-px text-[10.5px] font-sans-semibold uppercase tracking-[1.5px] text-[#5E8579]">PG Manager</Text>
        </View>
      </View>

      <Text className="px-3.5 pb-1.5 pt-[18px] text-[10.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#4F756A]">Manage</Text>
      <ScrollView className="flex-1 px-3.5" contentContainerClassName="gap-[3px]">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href.replace('/(app)', ''));
          return (
            <Pressable key={href} onPress={() => { router.push(href); onNavigate?.(); }}
              className={`flex-row items-center gap-3 rounded-[9px] px-3 py-2.5 ${active ? 'bg-accent' : 'active:bg-[#ffffff0d]'}`}>
              <Icon size={18} color={active ? '#FBF8F0' : '#9CBBAF'} />
              <Text className={`text-[13.5px] font-sans-semibold ${active ? 'text-[#FBF8F0]' : 'text-[#CFE0D8]'}`}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="p-3.5">
        <View className="rounded-xl border border-[#ffffff14] bg-[#ffffff0a] p-3.5">
          <Text className="mb-2 text-[10.5px] font-sans-semibold uppercase tracking-[1.2px] text-[#5E8579]">Property</Text>
          <View className="flex-row items-center gap-2.5">
            <View className="h-[30px] w-[30px] items-center justify-center rounded-[7px] bg-accent">
              <Text className="text-[13px] font-sans-bold text-[#FBF8F0]">SN</Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-[13px] font-sans-semibold text-[#F2EEE2]">Your Property</Text>
              <Text numberOfLines={1} className="text-[11px] text-[#6B8C80]">Set up in onboarding</Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-2.5 px-1.5 pb-0.5 pt-2.5">
          <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E7B45A]">
            <Text className="text-xs font-sans-bold text-[#3A2A06]">PG</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="text-[12.5px] font-sans-semibold text-[#E4E9DF]">Owner</Text>
            <Text className="text-[10.5px] text-[#5E8579]">Owner · access</Text>
          </View>
          <Pressable onPress={signOutUser} className="h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#ffffff1f] bg-[#ffffff0f] active:bg-[#b5462f33]">
            <LogoutIcon size={14} color="#9CBBAF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
