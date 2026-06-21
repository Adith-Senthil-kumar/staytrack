import { View, Text, Pressable, Linking, ScrollView, useWindowDimensions, Modal as RNModal } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { MoneyText } from '../ui/MoneyText';
import { dueStatus } from '../../lib/domain/dues';
import { monthName, monthKey } from '../../lib/domain/format';
import { ALL_DOCS } from '../../constants/documents';
import { PhoneIcon, MessageIcon, CheckIcon } from '../icons';
import type { Tenant, Due } from '../../types';

const MONTH = monthName(monthKey(new Date()));

export function TenantDetailPanel({ tenant, roomNumber, roomType, due, rentDueDay, onClose, onRecordPayment, onVacate, onToggleDoc }: {
  tenant: Tenant | null; roomNumber: string; roomType: string; due: Due | undefined; rentDueDay: number;
  onClose: () => void; onRecordPayment: () => void; onVacate: () => void; onToggleDoc: (tenant: Tenant, label: string) => void;
}) {
  const { width, height } = useWindowDimensions();
  const panelW = Math.min(width, 420);
  const open = !!tenant;
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: withTiming(open ? 0 : panelW, { duration: 260 }) }] }));
  const status = due ? dueStatus(due, new Date(), rentDueDay) : undefined;
  const isDue = !!due && due.amountPaid < due.amountDue;
  const docs = tenant?.documents ?? [];
  const payLabel = status === 'paid' ? `Paid · ${MONTH}`
    : status === 'overdue' ? `Overdue · ${MONTH}`
    : status === 'partial' ? `Partial · ${MONTH}`
    : status === 'unpaid' ? `Due · ${MONTH}` : 'No dues';
  const dotHex = status === 'paid' ? '#1E6F5C' : status === 'overdue' ? '#B5462F' : status ? '#C67A1E' : '#85897C';
  const textCls = status === 'paid' ? 'text-ok' : status === 'overdue' ? 'text-bad' : status ? 'text-warn' : 'text-muted';
  const boxCls = status === 'paid' ? 'bg-occ-bg' : status ? 'bg-bad-bg' : 'bg-surface-3';
  const headChipCls = status === 'paid' ? 'bg-occ-bg text-ok border-occ-bd'
    : (status === 'overdue' || status === 'unpaid') ? 'bg-maint-bg text-bad border-maint-bd'
    : 'bg-pend-bg text-warn border-pend-bd';
  const headChipLabel = status === 'paid' ? 'Paid'
    : status === 'overdue' ? 'Overdue'
    : status === 'unpaid' ? 'Rent due'
    : 'Partial';

  return (
    <RNModal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ width, height }}>
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, width, height }} className="bg-overlay" />
        <Animated.View style={[{ position: 'absolute', top: 0, right: 0, width: panelW, height }, style]} className="bg-bg">
        {tenant && (
          <View style={{ height }} className="bg-surface-2">
            <View className="bg-brand px-6 pb-5 pt-6">
              <Pressable onPress={onClose} style={{ zIndex: 10 }} className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"><Text className="text-base text-[#DCE7E1]">✕</Text></Pressable>
              <View className="flex-row items-center gap-2">
                <Text className="font-mono-medium text-[13px] text-[#9CC0B5]">Room {roomNumber}</Text>
                {status && <Text className={`rounded-[20px] border px-[9px] py-[3px] text-[10.5px] font-sans-semibold uppercase tracking-[0.3px] ${headChipCls}`}>{headChipLabel}</Text>}
              </View>
              <Text className="mt-1.5 font-serif text-[23px] text-[#FBF8F0]">{tenant.name}</Text>
              <Text className="mt-0.5 text-[13px] text-[#8FB0A5]">{roomType} sharing · {tenant.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}</Text>
            </View>

            <ScrollView className="flex-1" contentContainerClassName="px-6 pt-[22px] pb-[30px]">
              <View className="rounded-[14px] border border-border bg-surface p-[18px]">
                <View className="flex-row items-center gap-[13px]">
                  <View className="h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: avatarColor(tenant.name) }}><Text className="text-lg font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text></View>
                  <View className="flex-1">
                    <Text className="text-base font-sans-bold text-text">{tenant.name}</Text>
                    <View className="mt-1 flex-row items-center gap-2">
                      <Text className={`text-[12.5px] font-sans-semibold ${tenant.foodPreference === 'veg' ? 'text-veg' : 'text-nonveg'}`}>{tenant.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}</Text>
                      <View className="h-[3px] w-[3px] rounded-full bg-border" />
                      <Text className="text-[12.5px] text-muted-2">{roomType} sharing</Text>
                    </View>
                  </View>
                </View>

                <View className="mt-[15px] flex-row gap-2">
                  {tenant.phone ? (
                    <Pressable onPress={() => Linking.openURL(`tel:${tenant.phone}`)} className="flex-1 flex-row items-center justify-center gap-2 rounded-[9px] bg-brand py-[9px] active:bg-brand-hover"><PhoneIcon size={14} color="#F4F1E7" /><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">{tenant.phone}</Text></Pressable>
                  ) : (
                    <View className="flex-1 items-center rounded-[9px] bg-surface-3 py-2.5"><Text className="text-[13px] text-soft">No phone on file</Text></View>
                  )}
                  <Pressable onPress={() => tenant.phone && Linking.openURL(`sms:${tenant.phone}`)} className="w-[44px] items-center justify-center rounded-[9px] border border-border bg-surface-3 active:bg-surface-2"><MessageIcon size={16} color="#13352C" /></Pressable>
                </View>

                <View className="mt-[15px] flex-row gap-2.5">
                  <View className="flex-1 rounded-[10px] bg-surface-3 p-3"><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Monthly Rent</Text><MoneyText amount={tenant.rent} className="mt-1.5 text-lg" /></View>
                  <View className={`flex-1 rounded-[10px] p-3 ${boxCls}`}><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Rent Status</Text><View className="mt-1.5 flex-row items-center gap-1.5"><View className="h-2 w-2 rounded-full" style={{ backgroundColor: dotHex }} /><Text className={`text-sm font-sans-semibold ${textCls}`}>{payLabel}</Text></View></View>
                </View>

                {isDue && (
                  <View className="mt-3 flex-row gap-2">
                    <Pressable onPress={onRecordPayment} className="flex-1 flex-row items-center justify-center gap-2 rounded-[9px] bg-accent py-2.5 active:bg-accent-hover"><Text className="text-[13px] font-sans-semibold text-[#FBF8F0]">Record Payment</Text></Pressable>
                    <Pressable onPress={() => tenant.phone && Linking.openURL(`sms:${tenant.phone}`)} className="rounded-[9px] border border-border bg-surface px-3.5 py-2.5 active:bg-surface-2"><Text className="text-[13px] font-sans-semibold text-label">Remind</Text></Pressable>
                  </View>
                )}

                <View className="mt-[13px] flex-row justify-between border-t border-dashed border-border pt-[13px]"><Text className="text-[12.5px] text-muted-2">Checked in</Text><Text className="font-mono text-[12.5px] text-text-2">{tenant.joinDate}</Text></View>
                <View className="mt-2 flex-row justify-between"><Text className="text-[12.5px] text-muted-2">Security deposit</Text><MoneyText amount={tenant.deposit} className="text-[12.5px] text-text-2" /></View>

                <View className="mt-4">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Documents · tap to toggle</Text>
                    <Text className={`font-mono-semibold text-[12px] ${docs.length === ALL_DOCS.length ? 'text-ok' : 'text-warn'}`}>{docs.length}/{ALL_DOCS.length}</Text>
                  </View>
                  {ALL_DOCS.map((d) => {
                    const has = docs.includes(d);
                    return (
                      <Pressable key={d} onPress={() => onToggleDoc(tenant, d)} className="flex-row items-center gap-2.5 rounded-md px-1 py-[5px] active:bg-field-hover">
                        <View className={`h-[18px] w-[18px] items-center justify-center rounded-[5px] border ${has ? 'border-accent bg-accent' : 'border-border bg-surface-2'}`}>{has && <CheckIcon size={11} color="#FBF8F0" />}</View>
                        <Text className={`flex-1 text-[13px] ${has ? 'text-text-2' : 'text-soft'}`}>{d}</Text>
                        <Text className={`text-[11.5px] font-sans-medium ${has ? 'text-ok' : 'text-warn'}`}>{has ? 'On file' : 'Tap to collect'}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {tenant.status === 'active' && (
                <Pressable onPress={onVacate} className="mt-4 items-center rounded-[11px] border border-maint-bd bg-surface py-3 active:bg-bad-bg"><Text className="text-[13.5px] font-sans-semibold text-bad">Vacate Room</Text></Pressable>
              )}
            </ScrollView>
          </View>
        )}
        </Animated.View>
      </View>
    </RNModal>
  );
}
