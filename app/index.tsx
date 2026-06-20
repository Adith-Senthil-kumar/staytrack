import { Text, View } from 'react-native';
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <View className="rounded-2xl bg-surface px-6 py-5">
        <Text className="text-ink">Light/dark token check</Text>
        <Text className="text-accent">accent</Text>
      </View>
    </View>
  );
}
