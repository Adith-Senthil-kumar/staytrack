import { View, Text, Pressable, Modal as RNModal, Linking } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import { toDateStr } from '../../lib/domain/dates';
import { printReceipt } from '../../lib/receipt/printReceipt';
import { rentReceiptHtml } from '../../lib/receipt/rentReceiptHtml';
import { CheckIcon, PaperPlaneIcon, FileTextIcon } from '../icons';
import type { Tenant, Due } from '../../types';

function buildText(tenant: Tenant, roomNumber: string, due: Due, monthLabel: string, propertyName: string) {
  const method = due.method ? ` via ${due.method.toUpperCase()}` : '';
  return [
    `RENT RECEIPT · ${propertyName}`,
    ``,
    `Tenant: ${tenant.name}`,
    `Room ${roomNumber} · ${monthLabel}`,
    ``,
    `Monthly rent: ${formatINR(tenant.rent)}`,
    due.paidAt ? `Paid on: ${toDateStr(due.paidAt)}` : '',
    ``,
    `Amount Paid: ${formatINR(due.amountPaid)}`,
    `Rent received in full${method}.`,
  ].filter(Boolean).join('\n');
}

export function RentReceiptModal({ tenant, roomNumber, due, monthLabel, propertyName, onClose }: {
  tenant: Tenant | null;
  roomNumber: string;
  due: Due | null;
  monthLabel: string;
  propertyName: string;
  onClose: () => void;
}) {
  if (!tenant || !due) return null;

  const text = buildText(tenant, roomNumber, due, monthLabel, propertyName);
  const handlePrint = () => { printReceipt({ html: rentReceiptHtml(tenant, roomNumber, due, monthLabel, propertyName), text }); };
  const handleWhatsApp = () => { Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`); };
  const paidLabel = due.method ? `Paid in full via ${due.method.toUpperCase()}` : 'Paid in full';

  return (
    <RNModal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-[430px] max-w-full overflow-hidden rounded-[18px] bg-surface">
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Rent Receipt · {propertyName}</Text>
            <Text className="mt-1 font-serif text-[20px] text-[#FBF8F0]">{tenant.name}</Text>
            <Text className="text-[12.5px] text-[#8FB0A5]">Room {roomNumber} · {monthLabel}</Text>
            <Pressable onPress={onClose} style={{ zIndex: 10 }} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]">
              <Text className="text-[14px] font-sans-semibold text-[#FBF8F0]">✕</Text>
            </Pressable>
          </View>

          {/* Body */}
          <View className="px-[26px] py-[22px]">
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Month</Text>
              <Text className="font-mono text-[13px] text-text-2">{monthLabel}</Text>
            </View>
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Monthly rent</Text>
              <Text className="font-mono text-[13px] text-text-2">{formatINR(tenant.rent)}</Text>
            </View>
            <View className="flex-row justify-between border-b border-border-3 py-2">
              <Text className="text-[13px] text-muted-2">Paid on</Text>
              <Text className="font-mono text-[13px] text-text-2">{toDateStr(due.paidAt)}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3 pb-1">
              <Text className="text-sm font-sans-bold text-ink">Amount Paid</Text>
              <Text className="font-mono-semibold text-[22px] text-ink">{formatINR(due.amountPaid)}</Text>
            </View>
            <View className="mt-2 flex-row items-center gap-1.5">
              <CheckIcon size={13} color="#1E6F5C" />
              <Text className="text-[12px] text-muted-2">{paidLabel}</Text>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row gap-3 px-[26px] pb-6">
            <Pressable onPress={handlePrint} className="flex-none flex-row items-center gap-2 rounded-[10px] border border-border bg-surface-2 px-4 py-3 active:bg-surface-3">
              <FileTextIcon size={15} color="#13352C" />
              <Text className="text-[13.5px] font-sans-semibold text-ink">Print / PDF</Text>
            </Pressable>
            <Pressable onPress={handleWhatsApp} className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3 active:opacity-80">
              <PaperPlaneIcon size={15} color="#F4F1E7" />
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Share on WhatsApp</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
