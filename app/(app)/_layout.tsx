import { Redirect, Slot } from 'expo-router';
import { useAuthStore } from '../../store/auth';

export default function AppLayout() {
  const { user, initializing } = useAuthStore();
  if (initializing) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Slot />;
}
