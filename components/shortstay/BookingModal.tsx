import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal } from 'react-native';

export function BookingModal({
  visible,
  roomNumber,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  roomNumber: string;
  onClose: () => void;
  onConfirm: (data: { guestName: string; checkOut: string }) => void;
}) {
  const [guestName, setGuestName] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const submit = () => {
    if (!guestName.trim() || !checkOut.trim()) return;
    onConfirm({ guestName: guestName.trim(), checkOut: checkOut.trim() });
    setGuestName('');
    setCheckOut('');
    onClose();
  };

  const input = 'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-full max-w-[480px] overflow-hidden rounded-[18px] bg-surface">
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Walk-in · Room {roomNumber}</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">New Booking</Text>
          </View>
          <View className="px-[26px] py-6">
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Guest Name</Text>
            <TextInput
              value={guestName}
              onChangeText={setGuestName}
              placeholder="e.g. Ravi Kumar"
              placeholderTextColor="#9A9A8A"
              className={`mb-4 ${input}`}
            />
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Check-out Date</Text>
            <TextInput
              value={checkOut}
              onChangeText={setCheckOut}
              placeholder="2026-06-25"
              placeholderTextColor="#9A9A8A"
              className={`font-mono ${input}`}
            />
          </View>
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable
              onPress={onClose}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              className="flex-1 items-center rounded-[10px] py-3"
              style={{ backgroundColor: '#C7842A' }}
            >
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Confirm Booking</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
