import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '../store/auth';
import { useUserDoc } from '../lib/db/hooks';
import { ensureUserDoc } from '../lib/db/user';

export default function Index() {
  const { user, initializing } = useAuthStore();
  const { userDoc, loading } = useUserDoc();

  useEffect(() => {
    if (user) ensureUserDoc(user.uid, user.email ?? '').catch(() => {});
  }, [user]);

  if (initializing || (user && loading)) return <View className="flex-1 bg-bg" />;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (!userDoc?.onboardingComplete) return <Redirect href="/(onboarding)/property" />;
  return <Redirect href="/(app)/rooms" />;
}
