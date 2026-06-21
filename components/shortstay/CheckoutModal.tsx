import { useState } from 'react';
import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import { nightsBetween } from '../../lib/domain/shortstay';
import type { SSRoom } from '../../types';

type PayMethod = 'upi' | 'cash';

export function CheckoutModal({
  visible,
  room,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  room: SSRoom | null;
  onClose: () => void;
  onConfirm: (room: SSRoom) => void;
}) {
  const [payMethod, setPayMethod] = useState<PayMethod>('upi');

  if (!room || !room.guestName || !room.checkIn) return null;

  const today = new Date().toISOString().slice(0, 10);
  const nights = nightsBetween(room.checkIn, today);
  const total = nights * room.dailyRate;
  // advance not stored on room type — show full total as balance
  const balance = total;

  const pmBtn = (active: boolean) =>
    `rounded-[8px] border px-4 py-[9px] ${active ? 'border-[#C7842A55] bg-[#C7842A1F]' : 'border-border bg-surface'}`;

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="w-full max-w-[450px] overflow-hidden rounded-[18px] bg-surface">
          {/* Brand green header per design line 1335 */}
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">
              Check Out · {room.number}
            </Text>
            <Text className="mt-[3px] font-serif text-[20px] text-[#FBF8F0]">{room.guestName}</Text>
            <Text className="mt-[2px] text-[12.5px] text-[#8FB0A5]">
              {room.checkIn} → {today}
            </Text>
            <Pressable
              onPress={onClose}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)]"
            >
              <Text className="text-[15px] leading-none text-[#DCE7E1]">✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View className="px-[26px] py-[22px]">
            {/* Nights × rate */}
            <View className="flex-row items-center justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Nights × rate</Text>
              <Text className="font-mono text-[13px] text-text-2">
                {nights} × {formatINR(room.dailyRate)}
              </Text>
            </View>
            {/* Total stay cost */}
            <View className="flex-row items-center justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Total stay cost</Text>
              <Text className="font-mono-semibold text-[13px] text-ink">{formatINR(total)}</Text>
            </View>
            {/* Advance */}
            <View className="flex-row items-center justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Advance already paid</Text>
              <Text className="font-mono text-[13px] text-ok">− {formatINR(0)}</Text>
            </View>
            {/* Balance due */}
            <View className="flex-row items-center justify-between pb-1 pt-[13px]">
              <Text className="text-[14px] font-sans-semibold text-ink">Balance Due</Text>
              <Text className="font-mono-semibold text-[22px] text-bad">{formatINR(balance)}</Text>
            </View>

            {/* Payment method */}
            <Text className="mb-2 mt-[14px] text-[12px] font-sans-semibold text-label">Collect balance via</Text>
            <View className="flex-row gap-2.5">
              <Pressable onPress={() => setPayMethod('upi')} className={pmBtn(payMethod === 'upi')}>
                <Text className={`text-[13.5px] font-sans-semibold ${payMethod === 'upi' ? 'text-[#C7842A]' : 'text-label'}`}>UPI</Text>
              </Pressable>
              <Pressable onPress={() => setPayMethod('cash')} className={pmBtn(payMethod === 'cash')}>
                <Text className={`text-[13.5px] font-sans-semibold ${payMethod === 'cash' ? 'text-[#C7842A]' : 'text-label'}`}>Cash</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row gap-3 px-[26px] pb-6">
            <Pressable
              onPress={onClose}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => { onConfirm(room); onClose(); }}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3"
            >
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Complete Check-out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
