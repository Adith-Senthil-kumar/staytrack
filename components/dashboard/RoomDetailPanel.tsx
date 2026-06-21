import { View, Text, Pressable, Linking, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { MoneyText } from '../ui/MoneyText';
import { dueStatus } from '../../lib/domain/dues';
import { STATUS_UI } from '../../constants/roomStatus';
import type { Room, Tenant, Due } from '../../types';

export function RoomDetailPanel({
  room, tenants, dueByTenant, rentDueDay, onClose, onAssign, onRecordPayment, onVacate,
}: {
  room: Room | null;
  tenants: Tenant[];
  dueByTenant: Map<string, Due>;
  rentDueDay: number;
  onClose: () => void;
  onAssign: (roomId: string) => void;
  onRecordPayment: (due: Due) => void;
  onVacate: (tenant: Tenant) => void;
}) {
  const { width } = useWindowDimensions();
  const panelW = Math.min(width, 430);
  const open = !!room;
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: withTiming(open ? 0 : panelW, { duration: 280 }) }] }));

  const ui = room ? STATUS_UI[room.status] : null;
  const title = !room ? '' : tenants.length ? (tenants.length === 1 ? tenants[0].name : `${tenants.length} tenants`)
    : room.status === 'repair' ? 'Under Repair' : room.status === 'reserved' || room.status === 'pending' ? 'Reserved' : 'Vacant Room';
  const sub = !room ? '' : tenants.length ? `${room.type} sharing` : room.status === 'repair' ? 'Maintenance in progress' : 'Ready to assign';

  return (
    <>
      {open && <Pressable onPress={onClose} className="absolute inset-0 z-40 bg-overlay" />}
      <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, right: 0, width: panelW, zIndex: 50 }, style]} className="bg-bg">
        {room && (
          <View className="h-full">
            <View className="bg-brand px-6 pb-5 pt-6">
              <Pressable onPress={onClose} className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"><Text className="text-base text-[#DCE7E1]">✕</Text></Pressable>
              <View className="flex-row items-center gap-2">
                <Text className="font-mono text-[13px] text-[#9CC0B5]">Room {room.number}</Text>
                {ui && <View className="rounded px-2 py-0.5" style={{ backgroundColor: '#ffffff1f' }}><Text className="text-[11px] font-sans-semibold text-[#DCE7E1]">{ui.label}</Text></View>}
              </View>
              <Text className="mt-1.5 font-serif text-[23px] text-[#FBF8F0]">{title}</Text>
              <Text className="mt-0.5 text-[13px] text-[#8FB0A5]">{sub}</Text>
            </View>

            <View className="flex-1 p-6">
              {tenants.map((t) => {
                const due = dueByTenant.get(t.id);
                const status = due ? dueStatus(due, new Date(), rentDueDay) : undefined;
                const isDue = !!due && due.amountPaid < due.amountDue;
                return (
                  <View key={t.id} className="mb-4 rounded-[14px] border border-border bg-surface p-[18px]">
                    <View className="flex-row items-center gap-3">
                      <View className="h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: avatarColor(t.name) }}><Text className="text-lg font-sans-semibold text-[#FBF8F0]">{initials(t.name)}</Text></View>
                      <View className="flex-1">
                        <Text className="text-base font-sans-bold text-text">{t.name}</Text>
                        <View className="mt-1 flex-row items-center gap-2">
                          <Text className="text-[12.5px] font-sans-semibold" style={{ color: t.foodPreference === 'veg' ? '#1E6F5C' : '#B5462F' }}>{t.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}</Text>
                          <View className="h-[3px] w-[3px] rounded-full bg-border" />
                          <Text className="text-[12.5px] text-muted-2">{room.type} sharing</Text>
                        </View>
                      </View>
                    </View>

                    {t.phone ? (
                      <Pressable onPress={() => Linking.openURL(`tel:${t.phone}`)} className="mt-4 items-center rounded-[9px] bg-brand py-2.5 active:bg-brand-hover"><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Call {t.phone}</Text></Pressable>
                    ) : null}

                    <View className="mt-4 flex-row gap-2.5">
                      <View className="flex-1 rounded-[10px] bg-surface-3 p-3"><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Monthly Rent</Text><MoneyText amount={t.rent} className="mt-1.5 text-lg" /></View>
                      <View className="flex-1 rounded-[10px] bg-surface-3 p-3"><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Rent Status</Text><Text className={`mt-1.5 text-sm font-sans-semibold ${status === 'paid' ? 'text-ok' : status === 'overdue' ? 'text-bad' : status ? 'text-warn' : 'text-muted'}`}>{status ? status[0].toUpperCase() + status.slice(1) : 'No dues'}</Text></View>
                    </View>

                    {isDue && due && (
                      <Pressable onPress={() => onRecordPayment(due)} className="mt-3 flex-row items-center justify-center gap-2 rounded-[9px] bg-accent py-2.5 active:bg-accent-hover"><Text className="text-[13px] font-sans-semibold text-[#FBF8F0]">Record Payment</Text></Pressable>
                    )}

                    <View className="mt-3 flex-row justify-between border-t border-dashed border-border pt-3"><Text className="text-[12.5px] text-muted-2">Checked in</Text><Text className="font-mono text-[12.5px] text-text-2">{t.joinDate}</Text></View>
                    <View className="mt-2 flex-row justify-between"><Text className="text-[12.5px] text-muted-2">Security deposit</Text><MoneyText amount={t.deposit} className="text-[12.5px] text-text-2" /></View>

                    <Pressable onPress={() => onVacate(t)} className="mt-4 items-center rounded-[11px] border border-maint-bd bg-surface py-3 active:bg-bad-bg"><Text className="text-[13.5px] font-sans-semibold text-bad">Vacate Room</Text></Pressable>
                  </View>
                );
              })}

              {tenants.length === 0 && (
                <View className="items-center rounded-[14px] border border-dashed border-border px-[22px] py-[34px]">
                  <Text className="text-center text-sm leading-[1.5] text-muted-2">
                    {room.status === 'repair' ? 'This room is under maintenance.' : 'This room is empty — assign a tenant to fill it.'}
                  </Text>
                  {room.status !== 'repair' && (
                    <Pressable onPress={() => onAssign(room.id)} className="mt-4 rounded-[9px] bg-brand px-4 py-2.5 active:bg-brand-hover"><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">+ Assign a Tenant</Text></Pressable>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
      </Animated.View>
    </>
  );
}
