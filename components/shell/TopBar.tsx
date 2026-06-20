import { View, Text, TextInput, Pressable } from 'react-native';
import { useThemeStore } from '../../store/theme';
import { useUiStore } from '../../store/ui';
import { MenuIcon, SearchIcon, SunIcon, MoonIcon, PlusIcon } from '../icons';
import { colorScheme } from 'nativewind';

export function TopBar({ title, subtitle, actionLabel, showBurger }: {
  title: string; subtitle?: string; actionLabel?: string; showBurger: boolean;
}) {
  const setPref = useThemeStore((s) => s.setPref);
  const toggleDrawer = useUiStore((s) => s.toggleDrawer);
  const isDark = colorScheme.get() === 'dark';
  return (
    <View className="flex-row items-center gap-5 border-b border-border bg-topbar px-[34px] py-[18px]">
      {showBurger && (
        <Pressable onPress={toggleDrawer} className="h-10 w-10 items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
          <MenuIcon size={18} color="#13352C" />
        </Pressable>
      )}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-serif text-2xl text-ink">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-[13px] text-muted">{subtitle}</Text> : null}
      </View>
      <View className="flex-row items-center gap-3.5">
        <View className="hidden w-[240px] flex-row items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2 lg:flex">
          <SearchIcon size={16} color="#9A9A8A" />
          <TextInput placeholder="Search room or tenant…" placeholderTextColor="#9A9A8A" className="flex-1 text-[13px] text-text" />
        </View>
        <Pressable onPress={() => setPref(isDark ? 'light' : 'dark')}
          className="h-10 w-10 items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
          {isDark ? <SunIcon size={17} color="#8DA098" /> : <MoonIcon size={16} color="#71776A" />}
        </Pressable>
        {actionLabel ? (
          <Pressable className="flex-row items-center gap-2 rounded-[9px] bg-brand px-4 py-2.5 active:bg-brand-hover">
            <PlusIcon size={16} color="#F4F1E7" />
            <Text className="text-[13.5px] font-sans-semibold text-[#F4F1E7]">{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
