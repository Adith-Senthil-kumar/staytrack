import { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { LogoMark } from '../../components/brand/LogoMark';
import { ArrowRightIcon } from '../../components/icons';
import { signInWithEmail } from '../../lib/auth/actions';

export default function Login() {
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null); setBusy(true);
    try { await signInWithEmail(email, password); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <View className="flex-1 flex-row bg-[#0E2E27]">
      {wide && (
        <LinearGradient colors={['#13453A', '#0A2019']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ flex: 1, padding: 48, justifyContent: 'space-between' }}>
          <View className="flex-row items-center gap-3">
            <LogoMark size={44} />
            <View>
              <Text className="font-serif-bold text-[23px] tracking-[-0.3px] text-[#FBF8F0]">StayTrack</Text>
              <Text className="text-[11px] font-sans-semibold uppercase tracking-[1.6px] text-[#5E8579]">PG Manager</Text>
            </View>
          </View>
          <View className="max-w-[420px]">
            <Text className="font-serif text-[34px] leading-[42px] tracking-[-0.5px] text-[#FBF8F0]">Run your PG like a ledger, not a guessbook.</Text>
            <Text className="mt-4 text-[14.5px] leading-6 text-[#8FB0A5]">Rooms, tenants, rent and expenses — every rupee and every bed, tracked in one place.</Text>
          </View>
          <View className="flex-row gap-6">
            <Text className="text-[12.5px] text-[#5E8579]">Owner access</Text>
            <Text className="text-[12.5px] text-[#5E8579]">One property</Text>
          </View>
        </LinearGradient>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ width: wide ? 460 : '100%', maxWidth: wide ? '50%' : '100%', backgroundColor: '#0A1B16', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <View className="w-full max-w-[320px]">
          {!wide && (
            <View className="mb-7 flex-row items-center gap-3">
              <LogoMark size={40} />
              <Text className="font-serif-bold text-[20px] tracking-[-0.3px] text-[#FBF8F0]">StayTrack</Text>
            </View>
          )}
          <Text className="font-serif text-2xl text-[#FBF8F0]">Sign in</Text>
          <Text className="mb-7 mt-1.5 text-[13.5px] text-[#6B8C80]">Access your property.</Text>

          <Text className="mb-1.5 text-xs font-sans-semibold text-[#9CBBAF]">Email</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#4F756A"
            autoCapitalize="none" keyboardType="email-address" autoComplete="email"
            className="mb-4 rounded-[10px] border border-[#ffffff24] bg-[#ffffff0a] px-3.5 py-3 text-sm text-[#F2EEE2]" />

          <Text className="mb-1.5 text-xs font-sans-semibold text-[#9CBBAF]">Password</Text>
          <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#4F756A"
            secureTextEntry autoComplete="password"
            className="rounded-[10px] border border-[#ffffff24] bg-[#ffffff0a] px-3.5 py-3 font-mono text-sm text-[#F2EEE2]" />

          {error && <Text className="mt-2.5 text-[12.5px] text-[#E0846A]">{error}</Text>}

          <Pressable onPress={onSubmit} disabled={busy}
            className="mt-5 flex-row items-center justify-center gap-2 rounded-[10px] bg-[#1E6F5C] py-3.5 active:bg-[#23806A]"
            style={{ opacity: busy ? 0.7 : 1 }}>
            <ArrowRightIcon size={16} color="#FBF8F0" />
            <Text className="text-[14.5px] font-sans-semibold text-[#FBF8F0]">{busy ? 'Signing in…' : 'Sign In'}</Text>
          </Pressable>

          <Link href="/(auth)/forgot-password" className="mt-4 text-center text-[13px] font-sans-semibold text-[#6B8C80]">
            Forgot password?
          </Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
