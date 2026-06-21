import { useEffect, useMemo } from 'react';
import { View, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { Redirect, Slot, usePathname } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAuthStore } from '../../store/auth';
import { useUserDoc, useTenants, useDues, useRooms } from '../../lib/db/hooks';
import { useUiStore } from '../../store/ui';
import { ensureCurrentMonthDues } from '../../lib/db/duesEngine';
import { addTenant } from '../../lib/db/tenants';
import { roomCapacity } from '../../lib/domain/dashboard';
import { monthKey } from '../../lib/domain/format';
import { Sidebar } from '../../components/shell/Sidebar';
import { TopBar } from '../../components/shell/TopBar';
import { AddTenantModal } from '../../components/tenants/AddTenantModal';

const META: Record<string, { title: string; subtitle: string; action?: string }> = {
  rooms: { title: 'Rooms & Occupancy', subtitle: 'Live view of all your rooms', action: 'Add Tenant' },
  tenants: { title: 'Tenants', subtitle: 'Everyone on record', action: 'Add Tenant' },
  'short-stay': { title: 'Short-Stay Rooms', subtitle: 'Walk-in, day-by-day stays', action: 'Add Tenant' },
  staff: { title: 'Staff Management', subtitle: 'Your team & attendance', action: 'Add Tenant' },
  rent: { title: 'Rent Collection', subtitle: 'Dues & payments this month', action: 'Add Tenant' },
  expenses: { title: 'Revenue & Expenses', subtitle: 'Where the money goes', action: 'Add Tenant' },
  maintenance: { title: 'Maintenance & Complaints', subtitle: 'Tickets & repairs', action: 'Add Tenant' },
};

export default function AppLayout() {
  const { user, initializing } = useAuthStore();
  const { userDoc, loading } = useUserDoc();
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const { drawerOpen, closeDrawer } = useUiStore();
  const pathname = usePathname();
  const key = pathname.split('/').filter(Boolean).pop() ?? 'rooms';
  const meta = META[key] ?? META.rooms;

  const mk = monthKey(new Date());
  const { tenants } = useTenants();
  const { dues } = useDues(mk);
  const { rooms } = useRooms();
  const uid = useAuthStore((s) => s.user?.uid);
  const showAddTenant = useUiStore((s) => s.showAddTenant);
  const assignRoomId = useUiStore((s) => s.assignRoomId);
  const closeAddTenant = useUiStore((s) => s.closeAddTenant);
  useEffect(() => {
    if (uid && tenants.length) ensureCurrentMonthDues(uid, tenants, dues, mk).catch(() => {});
  }, [uid, tenants, dues, mk]);

  useEffect(() => { if (wide) closeDrawer(); }, [wide, closeDrawer]);

  // Rooms that still have an open slot (capacity by sharing type), excluding rooms under repair.
  const assignableRooms = useMemo(() => {
    const count = new Map<string, number>();
    tenants.filter((t) => t.status === 'active' && t.roomId).forEach((t) => count.set(t.roomId!, (count.get(t.roomId!) ?? 0) + 1));
    return rooms.filter((r) => r.status !== 'repair' && (count.get(r.id) ?? 0) < roomCapacity(r.type));
  }, [rooms, tenants]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(drawerOpen ? 0 : -252, { duration: 260 }) }],
  }));

  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (loading) return null;
  if (!userDoc?.onboardingComplete) return <Redirect href="/(onboarding)/property" />;

  return (
    <View className="flex-1 flex-row bg-bg">
      {wide && <Sidebar />}
      <View className="min-w-0 flex-1">
        <TopBar title={meta.title} subtitle={meta.subtitle} actionLabel={meta.action} showBurger={!wide} />
        <ScrollView className="flex-1" contentContainerClassName="px-4 pb-[60px] pt-7 sm:px-[34px]">
          <Slot />
        </ScrollView>
      </View>

      {!wide && drawerOpen && (
        <Pressable onPress={closeDrawer} className="absolute inset-0 z-30 bg-overlay" />
      )}
      {!wide && (
        <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, left: 0, zIndex: 40 }, drawerStyle]}>
          <Sidebar onNavigate={closeDrawer} />
        </Animated.View>
      )}

      <AddTenantModal
        visible={showAddTenant}
        assignableRooms={assignableRooms}
        presetRoomId={assignRoomId}
        onClose={closeAddTenant}
        onAdd={(d) => {
          if (uid) addTenant(uid, { name: d.name, phone: d.phone, roomId: d.roomId, rent: d.rent, deposit: 0, foodPreference: d.food }, d.sharing);
          closeAddTenant();
        }}
      />
    </View>
  );
}
