import { View, Text, Pressable, Linking, useWindowDimensions, Modal as RNModal } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { MoneyText } from '../ui/MoneyText';
import { dueStatus } from '../../lib/domain/dues';
import type { Tenant, Due } from '../../types';

export function TenantDetailPanel({ tenant, roomNumber, roomType, due, rentDueDay, onClose, onRecordPayment, onVacate }: {
  tenant: Tenant | null; roomNumber: string; roomType: string; due: Due | undefined; rentDueDay: number;
  onClose: () => void; onRecordPayment: () => void; onVacate: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const panelW = Math.min(width, 420);
  const open = !!tenant;
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: withTiming(open ? 0 : panelW, { duration: 260 }) }] }));
  const status = due ? dueStatus(due, new Date(), rentDueDay) : undefined;
  const isDue = !!due && due.amountPaid < due.amountDue;

  return (
    <RNModal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ width, height }}>
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, width, height }} className="bg-overlay" />
        <Animated.View style={[{ position: 'absolute', top: 0, right: 0, width: panelW, height }, style]} className="bg-bg">
        {tenant && (
          <View style={{ height }} className="bg-surface-2">
            <View className="bg-brand px-6 pb-5 pt-6">
              <Pressable onPress={onClose} className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"><Text className="text-base text-[#DCE7E1]">✕</Text></Pressable>
              <Text className="font-mono text-[13px] text-[#9CC0B5]">Room {roomNumber}</Text>
              <Text className="mt-1.5 font-serif text-[23px] text-[#FBF8F0]">{tenant.name}</Text>
              <Text className="mt-0.5 text-[13px] text-[#8FB0A5]">{roomType} sharing · {tenant.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}</Text>
            </View>

            <View className="flex-1 p-6">
              <View className="rounded-[14px] border border-border bg-surface p-[18px]">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: avatarColor(tenant.name) }}><Text className="text-lg font-sans-semibold text-[#FBF8F0]">{initials(tenant.name)}</Text></View>
                  <View className="flex-1">
                    <Text className="text-base font-sans-bold text-text">{tenant.name}</Text>
                    <Text className="mt-0.5 text-[12.5px] text-muted-2">{tenant.phone || 'No phone'}</Text>
                  </View>
                </View>

                {tenant.phone ? (
                  <Pressable onPress={() => Linking.openURL(`tel:${tenant.phone}`)} className="mt-4 items-center rounded-[9px] bg-brand py-2.5 active:bg-brand-hover"><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Call {tenant.phone}</Text></Pressable>
                ) : null}

                <View className="mt-4 flex-row gap-2.5">
                  <View className="flex-1 rounded-[10px] bg-surface-3 p-3"><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Monthly Rent</Text><MoneyText amount={tenant.rent} className="mt-1.5 text-lg" /></View>
                  <View className="flex-1 rounded-[10px] bg-surface-3 p-3"><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Rent Status</Text><Text className={`mt-1.5 text-sm font-sans-semibold ${status === 'paid' ? 'text-ok' : status === 'overdue' ? 'text-bad' : status ? 'text-warn' : 'text-muted'}`}>{status ? status[0].toUpperCase() + status.slice(1) : 'No dues'}</Text></View>
                </View>

                {isDue && (
                  <Pressable onPress={onRecordPayment} className="mt-3 items-center rounded-[9px] bg-accent py-2.5 active:bg-accent-hover"><Text className="text-[13px] font-sans-semibold text-[#FBF8F0]">Record Payment</Text></Pressable>
                )}

                <View className="mt-3 flex-row justify-between border-t border-dashed border-border pt-3"><Text className="text-[12.5px] text-muted-2">Checked in</Text><Text className="font-mono text-[12.5px] text-text-2">{tenant.joinDate}</Text></View>
                <View className="mt-2 flex-row justify-between"><Text className="text-[12.5px] text-muted-2">Security deposit</Text><MoneyText amount={tenant.deposit} className="text-[12.5px] text-text-2" /></View>
              </View>

              {tenant.status === 'active' && (
                <Pressable onPress={onVacate} className="mt-4 items-center rounded-[11px] border border-maint-bd bg-surface py-3 active:bg-bad-bg"><Text className="text-[13.5px] font-sans-semibold text-bad">Vacate Room</Text></Pressable>
              )}
            </View>
          </View>
        )}
        </Animated.View>
      </View>
    </RNModal>
  );
}
