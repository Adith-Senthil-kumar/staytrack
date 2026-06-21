import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { leaveUsed } from '../../lib/domain/payroll';
import { CheckIcon } from '../icons';
import type { Staff, LeaveRequest } from '../../types';

const currentYear = new Date().getFullYear();

function typeLabel(type: 'casual' | 'sick') {
  return type === 'casual' ? 'Casual leave' : 'Sick leave';
}

type Status = LeaveRequest['status'];

function statusChipStyle(status: Status): { bg: string; text: string } {
  if (status === 'approved') return { bg: '#E6F4F1', text: '#1E6F5C' };
  if (status === 'rejected') return { bg: '#FDECEA', text: '#B5462F' };
  return { bg: '#FDF3E3', text: '#C67A1E' };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function LeaveTab({
  staff,
  leave,
  onApprove,
  onReject,
}: {
  staff: Staff[];
  leave: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <View className="flex-col gap-4 lg:flex-row lg:items-start">
      {/* LEFT pane — leave requests */}
      <View className="lg:flex-1">
        <View className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-sm">
          {/* Header */}
          <View className="border-b border-border-2 px-5 py-[14px]">
            <Text className="font-serif text-base font-semibold text-ink">Leave Requests</Text>
          </View>

          {leave.length === 0 ? (
            <View className="px-5 py-8">
              <Text className="text-sm text-muted-2">No leave requests yet.</Text>
            </View>
          ) : (
            leave.map((req) => {
              const member = staff.find((s) => s.id === req.staffId);
              const name = member?.name ?? '—';
              const dateRange =
                req.from !== req.to ? `${req.from} – ${req.to}` : req.from;
              const chip = statusChipStyle(req.status);
              return (
                <View key={req.id} className="border-b border-border-3 px-5 py-[15px]">
                  {/* Top row: avatar + name/sub + status chip */}
                  <View className="flex-row items-center gap-[11px]">
                    <View
                      className="h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]"
                      style={{ backgroundColor: avatarColor(name) }}
                    >
                      <Text className="text-[12px] font-sans-semibold text-[#FBF8F0]">
                        {initials(name)}
                      </Text>
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-[13.5px] font-sans-semibold text-text">{name}</Text>
                      <Text className="text-[12px] text-muted-2">
                        {typeLabel(req.type)} · {dateRange} · {req.days}d
                      </Text>
                    </View>
                    <View
                      className="rounded-full px-2.5 py-0.5"
                      style={{ backgroundColor: chip.bg }}
                    >
                      <Text
                        className="text-[11px] font-sans-semibold"
                        style={{ color: chip.text }}
                      >
                        {capitalize(req.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Reason */}
                  <Text className="mt-[9px] pl-[45px] text-[12.5px] text-muted">
                    "{req.reason}"
                  </Text>

                  {/* Action buttons for pending */}
                  {req.status === 'pending' && (
                    <View className="mt-[11px] flex-row gap-[9px] pl-[45px]">
                      <Pressable
                        onPress={() => onApprove(req.id)}
                        className="flex-row items-center gap-1.5 rounded-lg bg-accent px-3.5 py-[7px] active:opacity-80"
                      >
                        <CheckIcon size={13} color="#FBF8F0" />
                        <Text className="text-[12.5px] font-sans-semibold text-[#FBF8F0]">
                          Approve
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => onReject(req.id)}
                        className="rounded-lg border border-maint-bd bg-surface px-3.5 py-[7px] active:bg-bad-bg"
                      >
                        <Text className="text-[12.5px] font-sans-semibold text-bad">Reject</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* RIGHT pane — leave balance */}
      <View className="lg:w-[300px]">
        <View className="rounded-[14px] border border-border bg-surface px-5 py-[18px]">
          <Text className="mb-[14px] text-[11.5px] font-sans-semibold uppercase tracking-[1px] text-muted-2">
            Leave Balance · {currentYear}
          </Text>
          {staff.map((s) => {
            const casualLimit = s.leave?.cl ?? 12;
            const sickLimit = s.leave?.sl ?? 6;
            const casualRemaining = casualLimit - leaveUsed(leave, s.id, 'casual');
            const sickRemaining = sickLimit - leaveUsed(leave, s.id, 'sick');
            return (
              <View key={s.id} className="mb-[13px] flex-row items-center gap-[10px]">
                <View
                  className="h-[30px] w-[30px] flex-none items-center justify-center rounded-lg"
                  style={{ backgroundColor: avatarColor(s.name) }}
                >
                  <Text className="text-[11px] font-sans-semibold text-[#FBF8F0]">
                    {initials(s.name)}
                  </Text>
                </View>
                <Text numberOfLines={1} className="flex-1 text-[13px] text-text-2">
                  {s.name}
                </Text>
                <Text
                  className="font-mono text-[11.5px] text-muted-2"
                  accessibilityLabel="Casual / Sick remaining"
                >
                  {casualRemaining} · {sickRemaining}
                </Text>
              </View>
            );
          })}
          <Text className="mt-[6px] text-[11px] text-soft">Casual · Sick days remaining</Text>
        </View>
      </View>
    </View>
  );
}
