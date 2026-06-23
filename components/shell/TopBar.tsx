import { View, Text, TextInput, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useThemeStore } from '../../store/theme';
import { useUiStore } from '../../store/ui';
import { MenuIcon, SearchIcon, SunIcon, MoonIcon, PlusIcon } from '../icons';

export function TopBar({ title, subtitle, actionLabel, showBurger }: {
  title: string; subtitle?: string; actionLabel?: string; showBurger: boolean;
}) {
  const setPref = useThemeStore((s) => s.setPref);
  const toggleDrawer = useUiStore((s) => s.toggleDrawer);
  const openAddTenant = useUiStore((s) => s.openAddTenant);
  const searchTerm = useUiStore((s) => s.searchTerm);
  const setSearch = useUiStore((s) => s.setSearch);
  const { colorScheme } = useColorScheme(); // reactive — re-renders on toggle so the icon flips
  const isDark = colorScheme === 'dark';
  const softColor = isDark ? '#6F8379' : '#9A9A8A';
  return (
    <View className="border-b border-border bg-topbar px-4 py-3.5 sm:px-[34px] sm:py-[18px]">
      <View className="flex-row items-center gap-3 sm:gap-5">
        {showBurger && (
          // Icon color follows the applied theme via `text-ink` (currentColor) rather than
          // the device color scheme, so the burger is dark on the light UI (not white).
          <Pressable onPress={toggleDrawer} className="h-10 w-10 flex-none items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
            <MenuIcon size={18} className="text-ink" />
          </Pressable>
        )}
        <View className="min-w-0 flex-1">
          <Text numberOfLines={2} className="font-serif text-[19px] leading-[1.15] tracking-[-0.4px] text-ink sm:text-2xl">{title}</Text>
          {subtitle ? <Text numberOfLines={1} className="mt-0.5 hidden text-[13px] text-muted sm:flex">{subtitle}</Text> : null}
        </View>
        <View className="flex-row items-center gap-2.5 sm:gap-3.5">
          <View className="hidden w-[240px] flex-row items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2 sm:flex">
            <SearchIcon size={16} color={softColor} />
            <TextInput value={searchTerm} onChangeText={setSearch} placeholder="Search room or tenant…" placeholderTextColor={softColor} className="flex-1 text-[13px] text-text" />
          </View>
          <Pressable onPress={() => setPref(isDark ? 'light' : 'dark')}
            className="h-10 w-10 flex-none items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
            {isDark ? <SunIcon size={17} className="text-muted" /> : <MoonIcon size={16} className="text-muted" />}
          </Pressable>
          {actionLabel ? (
            <Pressable onPress={() => openAddTenant()} className="h-10 flex-none flex-row items-center gap-2 rounded-[9px] bg-brand px-3.5 py-2.5 active:bg-brand-hover sm:px-4">
              <PlusIcon size={16} color="#F4F1E7" />
              <Text className="hidden text-[13.5px] font-sans-semibold text-[#F4F1E7] sm:flex">{actionLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Phone: full-width search row (the inline search is hidden < sm) */}
      <View className="mt-3 flex-row items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2.5 sm:hidden">
        <SearchIcon size={16} color={softColor} />
        <TextInput value={searchTerm} onChangeText={setSearch} placeholder="Search room or tenant…" placeholderTextColor={softColor} className="flex-1 text-[13px] text-text" />
      </View>
    </View>
  );
}
