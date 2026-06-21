import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { leaveUsed } from '../../lib/domain/payroll';
import { CheckIcon } from '../icons';
import type { Staff, LeaveRequest } from '../../types';

const currentYear = new Date().getFullYear();

function typeLabel(type: 'casual' | 'sick') {
  return type === 'casual' ? 'Casual leave' : 'Sick leave';
}

function statusChipClass(status: LeaveRequest['status']) {
  if (status === 'approved') return 'bg-occ-bg';
  if (status === 'rejected') return 'bg-maint-bg';
  return 'bg-pend-bg';
}

function statusTextClass(status: LeaveRequest['status']) {
  if (status === 'approved') return 'text-ok';
  if (status === 'rejected') return 'text-bad';
  return 'text-warn';
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
        <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
          <View className="border-b border-border-2 px-5 py-3.5">
            <Text className="font-serif text-base text-ink">Leave Requests</Text>
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
              return (
                <View
                  key={req.id}
                  className="border-b border-border-3 px-5 py-[15px]"
                >
                  {/* Top row: avatar + name/sub + status chip */}
                  <View className="flex-row items-center gap-2.5">
                    <View
                      className="h-[34px] w-[34px] items-center justify-center rounded-full"
                      style={{ backgroundColor: avatarColor(name) }}
                    >
                      <Text className="text-[11px] font-sans-semibold text-[#FBF8F0]">
                        {initials(name)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[13.5px] font-sans-semibold text-text">{name}</Text>
                      <Text className="text-[12px] text-muted-2">
                        {typeLabel(req.type)} · {dateRange} · {req.days}d
                      </Text>
                    </View>
                    <View
                      className={`rounded px-2 py-0.5 ${statusChipClass(req.status)}`}
                    >
                      <Text
                        className={`text-[11px] font-sans-semibold ${statusTextClass(req.status)}`}
                      >
                        {capitalize(req.status)}
                      </Text>
                    </View>
                  </View>
                  {/* Reason */}
                  <Text className="mt-2 pl-[45px] text-[12.5px] text-muted-2">
                    "{req.reason}"
                  </Text>
                  {/* Action buttons for pending */}
                  {req.status === 'pending' && (
                    <View className="mt-3 flex-row gap-2.5 pl-[45px]">
                      <Pressable
                        onPress={() => onApprove(req.id)}
                        className="flex-row items-center gap-1.5 rounded-lg bg-accent px-3.5 py-[7px]"
                      >
                        <CheckIcon size={12} color="#FBF8F0" />
                        <Text className="text-[12.5px] font-sans-semibold text-[#FBF8F0]">
                          Approve
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => onReject(req.id)}
                        className="rounded-lg border border-maint-bd bg-surface px-3.5 py-[7px]"
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
          <Text className="mb-3.5 text-[11.5px] font-sans-semibold uppercase tracking-wide text-muted-2">
            Leave Balance · {currentYear}
          </Text>
          {staff.map((s) => {
            const casualLimit = s.leave?.cl ?? 12;
            const sickLimit = s.leave?.sl ?? 6;
            const casualRemaining = casualLimit - leaveUsed(leave, s.id, 'casual');
            const sickRemaining = sickLimit - leaveUsed(leave, s.id, 'sick');
            return (
              <View key={s.id} className="mb-3 flex-row items-center gap-2.5">
                <View
                  className="h-[30px] w-[30px] items-center justify-center rounded-full"
                  style={{ backgroundColor: avatarColor(s.name) }}
                >
                  <Text className="text-[10px] font-sans-semibold text-[#FBF8F0]">
                    {initials(s.name)}
                  </Text>
                </View>
                <Text numberOfLines={1} className="flex-1 text-[13px] text-text-2">
                  {s.name}
                </Text>
                <Text className="font-mono text-[11.5px] text-muted-2">
                  {casualRemaining} · {sickRemaining}
                </Text>
              </View>
            );
          })}
          <Text className="mt-1.5 text-[11px] text-soft">Casual · Sick days remaining</Text>
        </View>
      </View>
    </View>
  );
}
