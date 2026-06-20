import { View } from 'react-native';
import { ThemedText } from '../../components/ui/ThemedText';

export default function Rent() {
  return (
    <View className="items-center justify-center py-24">
      <ThemedText variant="heading" className="text-center">Rent Collection</ThemedText>
      <ThemedText variant="body" className="mt-2 text-center text-muted">Coming in the next build.</ThemedText>
    </View>
  );
}
