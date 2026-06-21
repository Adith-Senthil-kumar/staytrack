import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { STATUS_COL, PRIORITY_UI, MAINT_CATEGORY } from '../../constants/maintenance';
import { VENDOR_TRADE_UI } from '../../constants/vendorTrade';
import { formatINR } from '../../lib/domain/format';
import {
  PhoneIcon,
  CheckIcon,
  PlayIcon,
  ImageIcon,
} from '../icons';
import type { MaintTicket, Vendor } from '../../types';

export function TicketDetailPanel({
  ticket,
  vendors,
  onClose,
  onStart,
  onResolve,
  onReopen,
  onCallVendor,
}: {
  ticket: MaintTicket | null;
  vendors: Vendor[];
  onClose: () => void;
  onStart: (id: string) => void;
  onResolve: (ticket: MaintTicket, cost: number, vendorName: string) => void;
  onReopen: (id: string) => void;
  onCallVendor: (phone: string) => void;
}) {
  const { width } = useWindowDimensions();
  const panelW = Math.min(width, 430);
  const open = !!ticket;
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(open ? 0 : panelW, { duration: 260 }) }],
  }));

  const [costDraft, setCostDraft] = useState('');

  useEffect(() => {
    setCostDraft('');
  }, [ticket?.id]);

  const statusCol = ticket ? STATUS_COL.find((c) => c.key === ticket.status) : null;
  const priorityUi = ticket ? PRIORITY_UI[ticket.priority] : null;
  const assignedVendor = ticket?.vendorId ? vendors.find((x) => x.id === ticket.vendorId) : null;

  return (
    <>
      {open && <Pressable onPress={onClose} className="absolute inset-0 z-40 bg-overlay" />}
      <Animated.View
        style={[{ position: 'absolute', top: 0, bottom: 0, right: 0, width: panelW, zIndex: 50 }, style]}
        className="bg-bg"
      >
        {ticket && (
          <View className="h-full">
            {/* Brand header */}
            <View className="bg-brand px-6 pb-5 pt-6" style={{ position: 'relative' }}>
              <Pressable
                onPress={onClose}
                className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"
              >
                <Text className="text-base text-[#DCE7E1]">✕</Text>
              </Pressable>

              {/* Room + status + priority row */}
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="font-mono text-[13px] text-[#9CC0B5]">
                  Room {ticket.roomNumber}
                </Text>
                {statusCol && (
                  <View
                    className="rounded px-2 py-0.5"
                    style={{ backgroundColor: statusCol.color + '22' }}
                  >
                    <Text
                      className="font-sans-semibold text-[11px]"
                      style={{ color: statusCol.color }}
                    >
                      {statusCol.label}
                    </Text>
                  </View>
                )}
                {priorityUi && (
                  <View
                    className="rounded px-2 py-0.5"
                    style={{ backgroundColor: priorityUi.color + '22' }}
                  >
                    <Text
                      className="font-sans-semibold text-[11px]"
                      style={{ color: priorityUi.color }}
                    >
                      {priorityUi.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* Issue */}
              <Text className="font-serif mt-2 text-[20px] leading-[1.35] text-[#FBF8F0]">
                {ticket.issue}
              </Text>

              {/* Category · logged date */}
              <Text className="mt-1.5 text-[12.5px] text-[#8FB0A5]">
                {MAINT_CATEGORY[ticket.category]} · logged {ticket.createdDate}
              </Text>
            </View>

            {/* Scrollable body */}
            <ScrollView className="flex-1" contentContainerClassName="px-[22px] py-5 pb-[30px]">

              {/* Photo placeholder */}
              {ticket.photo && (
                <View className="mb-4 h-[150px] items-center justify-center rounded-[12px] border border-border bg-surface-2">
                  <ImageIcon size={30} color="#9A9A8A" />
                  <Text className="mt-2 text-[12.5px] text-muted-2">Photo attached for reference</Text>
                </View>
              )}

              {/* Assigned Vendor card */}
              <View className="mb-4 rounded-[12px] border border-border bg-surface px-4 py-[15px]">
                <Text className="mb-2.5 font-sans-semibold text-[11px] uppercase tracking-wide text-soft">
                  ASSIGNED VENDOR
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-sm text-text">
                      {assignedVendor?.name ?? 'No vendor assigned'}
                    </Text>
                    <Text className="text-[12px] text-muted-2">
                      {assignedVendor
                        ? `${VENDOR_TRADE_UI[assignedVendor.trade].label} · ${assignedVendor.phone}`
                        : 'Assign one when logging the ticket'}
                    </Text>
                  </View>
                  {assignedVendor && (
                    <Pressable
                      onPress={() => onCallVendor(assignedVendor.phone)}
                      className="flex-row items-center gap-1.5 rounded-[9px] bg-brand px-3.5 py-2"
                    >
                      <PhoneIcon size={13} color="#F4F1E7" />
                      <Text className="font-sans-semibold text-[12.5px] text-[#F4F1E7]">Call</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Update status label */}
              <Text className="mb-2.5 font-sans-semibold text-[11px] uppercase tracking-wide text-soft">
                UPDATE STATUS
              </Text>

              {/* Open → Start Work */}
              {ticket.status === 'open' && (
                <Pressable
                  onPress={() => onStart(ticket.id)}
                  className="w-full flex-row items-center justify-center gap-2 rounded-[11px] bg-warn py-3.5"
                >
                  <PlayIcon size={16} color="#1A120A" />
                  <Text className="font-sans-semibold text-sm" style={{ color: '#1A120A' }}>
                    Start Work → In Progress
                  </Text>
                </Pressable>
              )}

              {/* In Progress → Resolve */}
              {ticket.status === 'in_progress' && (
                <View className="rounded-[12px] border border-border bg-surface p-4">
                  <Text className="mb-2 font-sans-semibold text-[12.5px] text-label">
                    Repair cost paid to vendor (₹)
                  </Text>
                  <TextInput
                    value={costDraft}
                    onChangeText={setCostDraft}
                    placeholder="e.g. 850"
                    placeholderTextColor="#9A9A8A"
                    keyboardType="numeric"
                    className="rounded-[9px] border border-border bg-field px-3 py-2.5 font-mono text-sm text-text"
                  />
                  <View className="my-3 flex-row items-center gap-1.5">
                    <CheckIcon size={13} color="#9A9A8A" />
                    <Text className="text-[11.5px] text-muted-2">
                      Adds a Repairs entry to Expenses automatically
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      onResolve(
                        ticket,
                        Number(costDraft) || 0,
                        vendors.find((x) => x.id === ticket.vendorId)?.name ?? '',
                      )
                    }
                    className="w-full flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3"
                  >
                    <CheckIcon size={16} color="#FBF8F0" />
                    <Text className="font-sans-semibold text-sm text-[#FBF8F0]">Mark Resolved</Text>
                  </Pressable>
                </View>
              )}

              {/* Done → Resolved card + Reopen */}
              {ticket.status === 'done' && (
                <View className="rounded-[12px] border border-occ-bd bg-occ-bg p-4">
                  <View className="flex-row items-center gap-2.5">
                    <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-accent">
                      <CheckIcon size={14} color="#FBF8F0" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-sans-semibold text-sm text-ink">
                        Resolved on {ticket.resolvedDate}
                      </Text>
                      <Text className="text-[12px] text-muted-2">
                        Cost {formatINR(ticket.cost)} · logged to Expenses
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => onReopen(ticket.id)}
                    className="mt-3.5 w-full items-center rounded-[10px] border border-border bg-surface py-2.5"
                  >
                    <Text className="font-sans-semibold text-[13px] text-label">Re-open Ticket</Text>
                  </Pressable>
                </View>
              )}

            </ScrollView>
          </View>
        )}
      </Animated.View>
    </>
  );
}
