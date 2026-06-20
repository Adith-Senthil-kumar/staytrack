import { Text, View } from 'react-native';
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-bg">
      <Text className="font-serif-bold text-3xl text-ink">StayTrack</Text>
      <Text className="font-sans text-text">IBM Plex Sans body</Text>
      <Text className="font-mono-semibold text-accent">₹96,300</Text>
    </View>
  );
}
