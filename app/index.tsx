import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '../store/auth';

export default function Index() {
  const { user, initializing } = useAuthStore();
  if (initializing) return <View className="flex-1 bg-bg" />;
  return <Redirect href={user ? '/(app)/rooms' : '/(auth)/login'} />;
}
