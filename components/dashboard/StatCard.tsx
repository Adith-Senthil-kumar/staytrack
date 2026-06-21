import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function StatCard({ dot, title, children }: { dot: string; title: string; children: React.ReactNode }) {
  return (
    <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] pb-4 pt-[18px] sm:basis-0">
      <View className="flex-row items-center gap-2">
        <View className={`h-2 w-2 rounded-[2px] ${dot}`} />
        <Text className="text-xs font-sans-medium text-muted">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function ProgressBar({ pct, fill = 'bg-accent', gradient }: { pct: number; fill?: string; gradient?: [string, string] }) {
  const width = `${Math.min(100, Math.max(0, pct))}%` as const;
  return (
    <View className="mt-3 h-1.5 overflow-hidden rounded-[4px] bg-track">
      {gradient ? (
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: '100%', borderRadius: 4, width }} />
      ) : (
        <View className={`h-full rounded-[4px] ${fill}`} style={{ width }} />
      )}
    </View>
  );
}
