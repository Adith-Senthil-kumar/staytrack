import { View, Text } from 'react-native';

export function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <View className="mb-6 flex-row items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-track'}`} />
      ))}
      <Text className="ml-2 text-xs font-sans-semibold text-muted">{step + 1}/{total}</Text>
    </View>
  );
}
