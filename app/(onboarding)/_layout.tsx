import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../store/auth';

export default function OnboardingLayout() {
  const { user, initializing } = useAuthStore();
  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
