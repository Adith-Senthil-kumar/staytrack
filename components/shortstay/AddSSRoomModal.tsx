import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal } from 'react-native';

export function AddSSRoomModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { number: string; dailyRate: number }) => void;
}) {
  const [dailyRate, setDailyRate] = useState('');

  const reset = () => setDailyRate('');
  const close = () => { reset(); onClose(); };

  const submit = () => {
    const rate = Number(dailyRate);
    if (!rate) return;
    // auto-number handled by caller; pass empty string — caller uses next free S-number
    onAdd({ number: '', dailyRate: rate });
    reset();
    onClose();
  };

  const canSubmit = !!Number(dailyRate);

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="w-full max-w-[420px] overflow-hidden rounded-[18px] bg-surface">
          {/* Amber header per design line 1225 */}
          <View className="px-[26px] py-[22px]" style={{ backgroundColor: '#C7842A' }}>
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Short-Stay
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Add a Room</Text>
            <Pressable
              onPress={close}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)]"
            >
              <Text className="text-[15px] leading-none text-[#FBF8F0]">✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View className="px-[26px] pb-2 pt-6">
            <Text className="mb-4 text-[13px] leading-[1.5] text-muted-2">
              The room will be auto-numbered (next free S-number) and start as available.
            </Text>
            <Text className="mb-1.5 text-[12px] font-sans-semibold text-label">Default Daily Rate (₹)</Text>
            <TextInput
              value={dailyRate}
              onChangeText={setDailyRate}
              placeholder="1200"
              keyboardType="number-pad"
              placeholderTextColor="#9A9A8A"
              className="rounded-[9px] border border-border bg-field px-[13px] py-[11px] font-mono text-sm text-text"
            />
          </View>

          {/* Footer */}
          <View className="flex-row gap-3 px-[26px] pb-6 pt-[18px]">
            <Pressable
              onPress={close}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={!canSubmit}
              className="flex-1 items-center rounded-[10px] bg-brand py-3"
              style={{ opacity: canSubmit ? 1 : 0.45 }}
            >
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Add Room</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
