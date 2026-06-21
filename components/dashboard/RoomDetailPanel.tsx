import { View, Text, Pressable, Linking, ScrollView, useWindowDimensions, Modal as RNModal } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { MoneyText } from '../ui/MoneyText';
import { dueStatus } from '../../lib/domain/dues';
import { monthName, monthKey } from '../../lib/domain/format';
import { STATUS_UI } from '../../constants/roomStatus';
import { ALL_DOCS } from '../../constants/documents';
import { PhoneIcon, MessageIcon, CheckIcon } from '../icons';
import type { Room, Tenant, Due } from '../../types';

const MONTH = monthName(monthKey(new Date()));

export function RoomDetailPanel({
  room, tenants, dueByTenant, rentDueDay, onClose, onAssign, onRecordPayment, onVacate, onToggleDoc,
}: {
  room: Room | null;
  tenants: Tenant[];
  dueByTenant: Map<string, Due>;
  rentDueDay: number;
  onClose: () => void;
  onAssign: (roomId: string) => void;
  onRecordPayment: (due: Due) => void;
  onVacate: (tenant: Tenant) => void;
  onToggleDoc: (tenant: Tenant, label: string) => void;
}) {
  const { width, height } = useWindowDimensions();
  const panelW = Math.min(width, 430);
  const open = !!room;
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: withTiming(open ? 0 : panelW, { duration: 280 }) }] }));

  const ui = room ? STATUS_UI[room.status] : null;
  const occ = !room ? '' : room.type === 'double' ? 'Double sharing' : room.type === 'triple' ? 'Triple sharing' : 'Single occupancy';
  const title = !room ? ''
    : tenants.length ? (tenants.length === 1 ? tenants[0].name : `${tenants.length} Tenants`)
    : room.status === 'repair' ? 'Under Maintenance'
    : (room.status === 'reserved' || room.status === 'pending') ? 'Reserved'
    : 'Vacant Room';
  const sub = !room ? ''
    : tenants.length ? occ
    : room.status === 'repair' ? `${occ} · temporarily blocked`
    : (room.status === 'reserved' || room.status === 'pending') ? `${occ} · awaiting check-in`
    : `${occ} · ready to assign`;

  return (
    <RNModal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ width, height }}>
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 0, left: 0, width, height }} className="bg-overlay" />
        <Animated.View style={[{ position: 'absolute', top: 0, right: 0, width: panelW, height }, style]} className="bg-bg">
        {room && (
          <View style={{ height }} className="bg-surface-2">
            <View className="bg-brand px-6 pb-5 pt-6">
              <Pressable onPress={onClose} style={{ zIndex: 10 }} className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"><Text className="text-base text-[#DCE7E1]">✕</Text></Pressable>
              <View className="flex-row items-center gap-2">
                <Text className="font-mono text-[13px] text-[#9CC0B5]">Room {room.number}</Text>
                {ui && <View className="rounded-full border border-[#ffffff40] px-2.5 py-[3px]" style={{ backgroundColor: '#ffffff1f' }}><Text className="text-[10.5px] font-sans-semibold uppercase tracking-[0.3px] text-[#CFE0D8]">{ui.label}</Text></View>}
              </View>
              <Text className="mt-1.5 font-serif text-[23px] text-[#FBF8F0]">{title}</Text>
              <Text className="mt-0.5 text-[13px] text-[#8FB0A5]">{sub}</Text>
            </View>

            <ScrollView className="flex-1" contentContainerClassName="p-6">
              {tenants.map((t) => {
                const due = dueByTenant.get(t.id);
                const status = due ? dueStatus(due, new Date(), rentDueDay) : undefined;
                const isDue = !!due && due.amountPaid < due.amountDue;
                const docs = t.documents ?? [];
                const payLabel = status === 'paid' ? `Paid · ${MONTH}`
                  : status === 'overdue' ? `Overdue · ${MONTH}`
                  : status === 'partial' ? `Partial · ${MONTH}`
                  : status === 'unpaid' ? `Due · ${MONTH}` : 'No dues';
                const dotHex = status === 'paid' ? '#1E6F5C' : status === 'overdue' ? '#B5462F' : status ? '#C67A1E' : '#85897C';
                const textCls = status === 'paid' ? 'text-ok' : status === 'overdue' ? 'text-bad' : status ? 'text-warn' : 'text-muted';
                const boxCls = status === 'paid' ? 'bg-occ-bg' : status === 'overdue' ? 'bg-bad-bg' : status ? 'bg-pend-bg' : 'bg-surface-3';
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

                    <View className="mt-4 flex-row gap-2">
                      {t.phone ? (
                        <Pressable onPress={() => Linking.openURL(`tel:${t.phone}`)} className="flex-1 flex-row items-center justify-center gap-2 rounded-[9px] bg-brand py-2.5 active:bg-brand-hover"><PhoneIcon size={14} color="#F4F1E7" /><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">{t.phone}</Text></Pressable>
                      ) : (
                        <View className="flex-1 items-center rounded-[9px] bg-surface-3 py-2.5"><Text className="text-[13px] text-soft">No phone on file</Text></View>
                      )}
                      <Pressable onPress={() => t.phone && Linking.openURL(`sms:${t.phone}`)} className="w-[44px] items-center justify-center rounded-[9px] border border-border bg-surface-3 active:bg-surface-2"><MessageIcon size={16} color="#13352C" /></Pressable>
                    </View>

                    <View className="mt-4 flex-row gap-2.5">
                      <View className="flex-1 rounded-[10px] bg-surface-3 p-3"><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Monthly Rent</Text><MoneyText amount={t.rent} className="mt-1.5 text-lg" /></View>
                      <View className={`flex-1 rounded-[10px] p-3 ${boxCls}`}><Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">Rent Status</Text><View className="mt-1.5 flex-row items-center gap-1.5"><View className="h-2 w-2 rounded-full" style={{ backgroundColor: dotHex }} /><Text className={`text-sm font-sans-semibold ${textCls}`}>{payLabel}</Text></View></View>
                    </View>

                    {isDue && due && (
                      <View className="mt-3 flex-row gap-2">
                        <Pressable onPress={() => onRecordPayment(due)} className="flex-1 flex-row items-center justify-center gap-2 rounded-[9px] bg-accent py-2.5 active:bg-accent-hover"><Text className="text-[13px] font-sans-semibold text-[#FBF8F0]">Record Payment</Text></Pressable>
                        <Pressable onPress={() => t.phone && Linking.openURL(`sms:${t.phone}`)} className="rounded-[9px] border border-border bg-surface px-3.5 py-2.5 active:bg-surface-2"><Text className="text-[13px] font-sans-semibold text-label">Remind</Text></Pressable>
                      </View>
                    )}

                    <View className="mt-3 flex-row justify-between border-t border-dashed border-border pt-3"><Text className="text-[12.5px] text-muted-2">Checked in</Text><Text className="font-mono text-[12.5px] text-text-2">{t.joinDate}</Text></View>
                    <View className="mt-2 flex-row justify-between"><Text className="text-[12.5px] text-muted-2">Security deposit</Text><MoneyText amount={t.deposit} className="text-[12.5px] text-text-2" /></View>

                    <View className="mt-4">
                      <View className="mb-1.5 flex-row items-center justify-between">
                        <Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Documents · tap to toggle</Text>
                        <Text className={`font-mono-semibold text-[12px] ${docs.length === ALL_DOCS.length ? 'text-ok' : 'text-warn'}`}>{docs.length}/{ALL_DOCS.length}</Text>
                      </View>
                      {ALL_DOCS.map((d) => {
                        const has = docs.includes(d);
                        return (
                          <Pressable key={d} onPress={() => onToggleDoc(t, d)} className="flex-row items-center gap-2.5 rounded-md px-1 py-[5px] active:bg-field-hover">
                            <View className={`h-[18px] w-[18px] items-center justify-center rounded-[5px] border ${has ? 'border-accent bg-accent' : 'border-border bg-surface-2'}`}>{has && <CheckIcon size={11} color="#FBF8F0" />}</View>
                            <Text className={`flex-1 text-[13px] ${has ? 'text-text-2' : 'text-soft'}`}>{d}</Text>
                            <Text className={`text-[11.5px] font-sans-medium ${has ? 'text-ok' : 'text-warn'}`}>{has ? 'On file' : 'Tap to collect'}</Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Pressable onPress={() => onVacate(t)} className="mt-4 items-center rounded-[11px] border border-maint-bd bg-surface py-3 active:bg-bad-bg"><Text className="text-[13.5px] font-sans-semibold text-bad">Vacate Room</Text></Pressable>
                  </View>
                );
              })}

              {tenants.length === 0 && (
                <View className="items-center rounded-[14px] border border-dashed border-border bg-surface px-[22px] py-[34px]">
                  <Text className="text-center text-sm leading-[1.5] text-muted-2">
                    {room.status === 'repair' ? 'This room is blocked for repairs and not available for assignment right now.' : 'This room is empty and ready for a new tenant. Onboard someone to start collecting rent.'}
                  </Text>
                  {room.status !== 'repair' && (
                    <Pressable onPress={() => onAssign(room.id)} className="mt-4 rounded-[9px] bg-brand px-4 py-2.5 active:bg-brand-hover"><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">+ Assign a Tenant</Text></Pressable>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        )}
        </Animated.View>
      </View>
    </RNModal>
  );
}
