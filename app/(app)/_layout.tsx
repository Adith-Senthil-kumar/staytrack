import { useEffect } from 'react';
import { View, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { Redirect, Slot, usePathname } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { Sidebar } from '../../components/shell/Sidebar';
import { TopBar } from '../../components/shell/TopBar';

const META: Record<string, { title: string; subtitle: string; action?: string }> = {
  rooms: { title: 'Rooms & Occupancy', subtitle: 'Live view of all your rooms', action: 'Add Tenant' },
  tenants: { title: 'Tenants', subtitle: 'Everyone staying with you', action: 'Add Tenant' },
  rent: { title: 'Rent Collection', subtitle: 'Dues and payments this month' },
  expenses: { title: 'Expenses & Margin', subtitle: 'Where the money goes' },
};

export default function AppLayout() {
  const { user, initializing } = useAuthStore();
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const { drawerOpen, closeDrawer } = useUiStore();
  const pathname = usePathname();
  const key = pathname.split('/').filter(Boolean).pop() ?? 'rooms';
  const meta = META[key] ?? META.rooms;

  useEffect(() => { if (wide) closeDrawer(); }, [wide, closeDrawer]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(drawerOpen ? 0 : -252, { duration: 260 }) }],
  }));

  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <View className="flex-1 flex-row bg-bg">
      {wide && <Sidebar />}
      <View className="min-w-0 flex-1">
        <TopBar title={meta.title} subtitle={meta.subtitle} actionLabel={meta.action} showBurger={!wide} />
        <ScrollView className="flex-1" contentContainerClassName="px-[34px] pb-[60px] pt-7">
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
    </View>
  );
}
