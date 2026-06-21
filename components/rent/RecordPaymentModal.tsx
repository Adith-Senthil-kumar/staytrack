import { useState } from 'react';
import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import { MoneyText } from '../ui/MoneyText';
import type { PaymentMethod, Tenant, Due } from '../../types';

const METHODS: { key: PaymentMethod; label: string }[] = [{ key: 'upi', label: 'UPI' }, { key: 'cash', label: 'Cash' }, { key: 'bank', label: 'Bank' }];

export function RecordPaymentModal({ tenant, roomNumber, due, monthLabel, onClose, onConfirm }: {
  tenant: Tenant | null; roomNumber: string; due: Due | null; monthLabel: string;
  onClose: () => void; onConfirm: (method: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const open = !!(tenant && due);
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-full max-w-[440px] overflow-hidden rounded-[18px] bg-surface">
          {tenant && due && (
            <>
              <View className="bg-brand px-[26px] py-[22px]">
                <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Record Payment</Text>
                <View className="mt-2.5 flex-row items-center gap-3">
                  <View className="h-[42px] w-[42px] items-center justify-center rounded-[11px]" style={{ backgroundColor: avatarColor(tenant.name) }}><Text className="text-[15px] font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text></View>
                  <View><Text className="font-serif text-lg text-[#FBF8F0]">{tenant.name}</Text><Text className="text-[12.5px] text-[#8FB0A5]">Room {roomNumber} · {monthLabel} rent</Text></View>
                </View>
              </View>
              <View className="px-[26px] py-[22px]">
                <View className="mb-[18px] items-center rounded-xl border border-border bg-field p-4">
                  <Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Amount Due</Text>
                  <MoneyText amount={due.amountDue - due.amountPaid} className="mt-1 text-[34px]" />
                </View>
                <Text className="mb-2.5 text-xs font-sans-semibold text-label">Payment Method</Text>
                <View className="flex-row gap-2.5">
                  {METHODS.map((m) => (
                    <Pressable key={m.key} onPress={() => setMethod(m.key)} className={`flex-1 items-center rounded-[10px] border py-3 ${method === m.key ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
                      <Text className={`text-[13px] font-sans-semibold ${method === m.key ? 'text-ok' : 'text-muted'}`}>{m.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View className="flex-row gap-3 px-[26px] pb-6">
                <Pressable onPress={onClose} className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"><Text className="text-sm font-sans-semibold text-label">Cancel</Text></Pressable>
                <Pressable onPress={() => onConfirm(method)} className="flex-1 items-center rounded-[10px] bg-accent py-3 active:bg-accent-hover"><Text className="text-sm font-sans-semibold text-[#F4F1E7]">Mark {formatINR(due.amountDue - due.amountPaid)} Paid</Text></Pressable>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
