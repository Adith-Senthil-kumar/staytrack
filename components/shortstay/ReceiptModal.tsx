import { View, Text, Pressable, Modal as RNModal, Share } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import { CheckIcon, PaperPlaneIcon } from '../icons';
import type { SSStay } from '../../types';

function nightlyRate(stay: SSStay) {
  return stay.nights > 0 ? Math.round(stay.total / stay.nights) : stay.total;
}

function buildReceiptText(stay: SSStay, propertyName: string) {
  return [
    `RECEIPT · ${propertyName}`,
    ``,
    `Guest: ${stay.guestName}`,
    `Room ${stay.roomNumber} · short-stay`,
    ``,
    `Check-in: ${stay.checkIn}`,
    `Check-out: ${stay.checkOut}`,
    `Nights × rate: ${stay.nights} × ${formatINR(nightlyRate(stay))}`,
    ``,
    `Total Paid: ${formatINR(stay.total)}`,
    `Paid in full.`,
  ].join('\n');
}

export function ReceiptModal({
  visible,
  stay,
  propertyName,
  onClose,
}: {
  visible: boolean;
  stay: SSStay | null;
  propertyName: string;
  onClose: () => void;
}) {
  if (!stay) return null;

  const payMethod = (stay as { paymentMethod?: string }).paymentMethod;
  const paidLabel = payMethod ? `Paid in full via ${payMethod}` : 'Paid in full';
  const receiptText = buildReceiptText(stay, propertyName);
  const handleShare = () => {
    Share.share({ message: receiptText });
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-[430px] max-w-full overflow-hidden rounded-[18px] bg-surface">
          {/* Amber short-stay header */}
          <View className="px-[26px] py-[22px]" style={{ backgroundColor: '#C7842A' }}>
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#ffffffb3]">
              Receipt · {propertyName}
            </Text>
            <Text className="mt-1 font-serif text-[20px] text-[#FBF8F0]">{stay.guestName}</Text>
            <Text className="text-[12.5px] text-[#ffffffc7]">Room {stay.roomNumber} · short-stay</Text>
            {/* Close button */}
            <Pressable
              onPress={onClose}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff40] bg-[#ffffff1f]"
            >
              <Text className="text-[14px] font-sans-semibold text-[#FBF8F0]">✕</Text>
            </Pressable>
          </View>

          {/* Body rows */}
          <View className="px-[26px] py-[22px]">
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Check-in</Text>
              <Text className="font-mono text-[13px] text-text-2">{stay.checkIn}</Text>
            </View>
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Check-out</Text>
              <Text className="font-mono text-[13px] text-text-2">{stay.checkOut}</Text>
            </View>
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Nights × rate</Text>
              <Text className="font-mono text-[13px] text-text-2">
                {stay.nights} × {formatINR(nightlyRate(stay))}
              </Text>
            </View>
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Advance</Text>
              <Text className="font-mono text-[13px] text-text-2">{formatINR(0)}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3 pb-1">
              <Text className="text-sm font-sans-bold text-ink">Total Paid</Text>
              <Text className="font-mono-semibold text-[22px] text-ink">{formatINR(stay.total)}</Text>
            </View>
            <View className="mt-2 flex-row items-center gap-1.5">
              <CheckIcon size={13} color="#1E6F5C" />
              <Text className="text-[12px] text-muted-2">{paidLabel}</Text>
            </View>
          </View>

          {/* Footer buttons */}
          <View className="flex-row gap-3 px-[26px] pb-6">
            <Pressable
              onPress={handleShare}
              className="rounded-[10px] border border-border bg-surface px-4 py-3"
            >
              <Text className="text-[13.5px] font-sans-semibold text-label">Print / PDF</Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3"
            >
              <PaperPlaneIcon size={15} color="#F4F1E7" />
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Share on WhatsApp</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
