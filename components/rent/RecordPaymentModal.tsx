import { useState } from 'react';
import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { Svg, Path, Rect, Circle } from 'react-native-svg';
import type React from 'react';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { formatINR } from '../../lib/domain/format';
import { MoneyText } from '../ui/MoneyText';
import type { PaymentMethod, Tenant, Due } from '../../types';

// UPI icon: phone shape
function UPIIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={5} y={2} width={14} height={20} rx={2} />
      <Path d="M12 18h.01" />
    </Svg>
  );
}
// Cash icon: banknote
function CashIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={2} y={6} width={20} height={12} rx={2} />
      <Circle cx={12} cy={12} r={2} />
    </Svg>
  );
}
// Bank icon: building columns
function BankIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m3 9 9-7 9 7v1H3z" />
      <Path d="M5 10v8M19 10v8M9 10v8M15 10v8M3 21h18" />
    </Svg>
  );
}

// Close X icon
function CloseIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <Path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

// Checkmark icon
function CheckIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

const METHODS: { key: PaymentMethod; label: string; Icon: () => React.ReactElement }[] = [
  { key: 'upi',  label: 'UPI',  Icon: UPIIcon  },
  { key: 'cash', label: 'Cash', Icon: CashIcon },
  { key: 'bank', label: 'Bank', Icon: BankIcon },
];

/** Format "2026-06" → "June 2026" */
function fmtMonthLabel(mk: string): string {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [y, m] = mk.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1] ?? mk} ${y}`;
}

export function RecordPaymentModal({ tenant, roomNumber, due, monthLabel, onClose, onConfirm }: {
  tenant: Tenant | null; roomNumber: string; due: Due | null; monthLabel: string;
  onClose: () => void; onConfirm: (method: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const open = !!(tenant && due);
  const amountDue = due ? due.amountDue - due.amountPaid : 0;

  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-full max-w-[440px] overflow-hidden rounded-[18px] bg-surface">
          {tenant && due && (
            <>
              {/* Brand header */}
              <View className="bg-brand px-[26px] py-[22px]">
                {/* Close button */}
                <Pressable
                  onPress={onClose}
                  className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-[8px] border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]"
                >
                  <CloseIcon />
                </Pressable>
                <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">Record Payment</Text>
                <View className="mt-2.5 flex-row items-center gap-3">
                  <View
                    className="h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px]"
                    style={{ backgroundColor: avatarColor(tenant.name) }}
                  >
                    <Text className="text-[15px] font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text>
                  </View>
                  <View>
                    <Text className="font-serif text-lg font-semibold text-[#FBF8F0]">{tenant.name}</Text>
                    <Text className="text-[12.5px] text-[#8FB0A5]">Room {roomNumber} · {fmtMonthLabel(monthLabel)} rent</Text>
                  </View>
                </View>
              </View>

              {/* Body */}
              <View className="px-[26px] py-[22px]">
                {/* Amount due banner */}
                <View className="mb-[18px] items-center rounded-xl border border-border bg-field p-4">
                  <Text className="text-[11px] font-sans-semibold uppercase tracking-[0.5px] text-soft">Amount Due</Text>
                  <MoneyText amount={amountDue} className="mt-1 text-[34px]" />
                </View>

                {/* Payment method */}
                <Text className="mb-[9px] text-xs font-sans-semibold text-label">Payment Method</Text>
                <View className="flex-row gap-2.5">
                  {METHODS.map((m) => {
                    const active = method === m.key;
                    return (
                      <Pressable
                        key={m.key}
                        onPress={() => setMethod(m.key)}
                        className={`flex-1 items-center gap-1 rounded-[10px] border py-3 ${active ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}
                      >
                        <m.Icon />
                        <Text className={`text-[13px] font-sans-semibold ${active ? 'text-ok' : 'text-muted'}`}>{m.label}</Text>
                      </Pressable>
                    );
                  })}
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
                  onPress={() => onConfirm(method)}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3 active:bg-accent-hover"
                >
                  <CheckIcon />
                  <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Mark {formatINR(amountDue)} Paid</Text>
                </Pressable>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
