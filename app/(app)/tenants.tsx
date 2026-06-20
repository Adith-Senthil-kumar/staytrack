import { View } from 'react-native';
import { ThemedText } from '../../components/ui/ThemedText';

export default function Tenants() {
  return (
    <View className="items-center justify-center py-24">
      <ThemedText variant="heading" className="text-center">Tenants</ThemedText>
      <ThemedText variant="body" className="mt-2 text-center text-muted">Coming in the next build.</ThemedText>
    </View>
  );
}
