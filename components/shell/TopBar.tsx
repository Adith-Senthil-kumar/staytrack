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
  // theme-aware icon colors (design uses var(--ink)/--soft/--muted, which shift light↔dark)
  const inkColor = isDark ? '#E4EDE7' : '#13352C';
  const softColor = isDark ? '#6F8379' : '#9A9A8A';
  const mutedColor = isDark ? '#8DA098' : '#71776A';
  return (
    <View className="flex-row items-center gap-5 border-b border-border bg-topbar px-[34px] py-[18px]">
      {showBurger && (
        <Pressable onPress={toggleDrawer} className="h-10 w-10 items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
          <MenuIcon size={18} color={inkColor} />
        </Pressable>
      )}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-serif text-2xl text-ink">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-[13px] text-muted">{subtitle}</Text> : null}
      </View>
      <View className="flex-row items-center gap-3.5">
        <View className="hidden w-[240px] flex-row items-center gap-2 rounded-[9px] border border-border bg-surface px-3 py-2 lg:flex">
          <SearchIcon size={16} color={softColor} />
          <TextInput placeholder="Search room or tenant…" placeholderTextColor={softColor} className="flex-1 text-[13px] text-text" />
        </View>
        <Pressable onPress={() => setPref(isDark ? 'light' : 'dark')}
          className="h-10 w-10 items-center justify-center rounded-[9px] border border-border bg-surface active:bg-surface-2">
          {isDark ? <SunIcon size={17} color={mutedColor} /> : <MoonIcon size={16} color={mutedColor} />}
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
