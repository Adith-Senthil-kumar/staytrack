import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LogoMark } from '../../components/brand/LogoMark';
import { sendReset } from '../../lib/auth/actions';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null); setBusy(true);
    try { await sendReset(email); setSent(true); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#0A1B16] p-10">
      <View className="w-full max-w-[320px]">
        <View className="mb-7 flex-row items-center gap-3">
          <LogoMark size={40} />
          <Text className="font-serif-bold text-[20px] text-[#FBF8F0]">StayTrack</Text>
        </View>
        <Text className="font-serif text-2xl text-[#FBF8F0]">Reset password</Text>
        <Text className="mb-7 mt-1.5 text-[13.5px] text-[#6B8C80]">We'll email you a reset link.</Text>

        {sent ? (
          <Text className="text-[13.5px] leading-6 text-[#8FB0A5]">If an account exists for {email.trim()}, a reset link is on its way. Check your inbox.</Text>
        ) : (
          <>
            <Text className="mb-1.5 text-xs font-sans-semibold text-[#9CBBAF]">Email</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#4F756A"
              autoCapitalize="none" keyboardType="email-address"
              className="rounded-[10px] border border-[#ffffff24] bg-[#ffffff0a] px-3.5 py-3 text-sm text-[#F2EEE2]" />
            {error && <Text className="mt-2.5 text-[12.5px] text-[#E0846A]">{error}</Text>}
            <Pressable onPress={onSubmit} disabled={busy}
              className="mt-5 items-center rounded-[10px] bg-[#1E6F5C] py-3.5 active:bg-[#23806A]" style={{ opacity: busy ? 0.7 : 1 }}>
              <Text className="text-[14.5px] font-sans-semibold text-[#FBF8F0]">{busy ? 'Sending…' : 'Send reset link'}</Text>
            </Pressable>
          </>
        )}

        <Link href="/(auth)/login" className="mt-5 text-center text-[13px] font-sans-semibold text-[#6B8C80]">
          Back to sign in
        </Link>
      </View>
    </View>
  );
}
