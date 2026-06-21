import { View, Text, Pressable } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { formatINR, monthKey } from '../../lib/domain/format';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import { ATT_UI } from '../../constants/staffMeta';
import type { Staff, Attendance, AttendanceStatus } from '../../types';

const today = new Date().toISOString().slice(0, 10);
const ym = monthKey(new Date());

function attPct(attendance: Attendance[], staffId: string): number {
  const recs = attendance.filter((a) => a.staffId === staffId && a.date.startsWith(ym));
  if (!recs.length) return 0;
  const present = recs.filter((a) => a.status === 'present' || a.status === 'late').length;
  return Math.round((present / recs.length) * 100);
}

export function StaffCard({
  staff,
  attendance = [],
  onPress,
}: {
  staff: Staff;
  attendance?: Attendance[];
  onPress?: () => void;
}) {
  const role = STAFF_ROLE_UI[staff.role];
  const todayRec = attendance.find((a) => a.staffId === staff.id && a.date === today);
  const todayStatus: AttendanceStatus | null = todayRec?.status ?? null;
  const pct = attPct(attendance, staff.id);

  // Today chip styles
  const chipColors: Record<AttendanceStatus, { bg: string; text: string; label: string }> = {
    present: { bg: '#E6F4F1', text: '#1E6F5C', label: 'Present' },
    late: { bg: '#FDF3E3', text: '#C67A1E', label: 'Late' },
    absent: { bg: '#FDECEA', text: '#B5462F', label: 'Absent' },
    leave: { bg: '#F2F2EF', text: '#85897C', label: 'On Leave' },
  };
  const chip = todayStatus ? chipColors[todayStatus] : null;

  return (
    <Pressable
      onPress={onPress}
      className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface p-[18px] shadow-sm active:border-brand lg:basis-[31%]"
    >
      {/* Top row: avatar + name + role badge */}
      <View className="flex-row items-center gap-3">
        <View
          className="h-[46px] w-[46px] flex-none items-center justify-center rounded-xl"
          style={{ backgroundColor: avatarColor(staff.name) }}
        >
          <Text className="text-base font-sans-semibold text-[#FBF8F0]">{initials(staff.name)}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[15px] font-sans-bold text-text">
            {staff.name}
          </Text>
          <View
            className="mt-1 self-start rounded px-1.5 py-0.5"
            style={{ backgroundColor: role.color + '22' }}
          >
            <Text className="text-[11px] font-sans-semibold" style={{ color: role.color }}>
              {role.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Phone row */}
      <View className="mt-3.5 flex-row items-center justify-between">
        <Text className="text-[12.5px] text-muted-2">Phone</Text>
        <Text numberOfLines={1} className="font-mono text-[12.5px] text-text-2">
          {staff.phone || '—'}
        </Text>
      </View>

      {/* Salary row */}
      <View className="mt-1.5 flex-row items-center justify-between">
        <Text className="text-[12.5px] text-muted-2">Salary</Text>
        <Text className="font-mono-semibold text-[12.5px] text-ink">{formatINR(staff.salary)}</Text>
      </View>

      {/* Footer: today chip + attendance % */}
      <View className="mt-[13px] flex-row items-center justify-between border-t border-border-3 pt-[13px]">
        {chip ? (
          <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: chip.bg }}>
            <Text className="text-[11.5px] font-sans-semibold" style={{ color: chip.text }}>
              {chip.label}
            </Text>
          </View>
        ) : (
          <View className="rounded-full bg-surface-2 px-2.5 py-0.5">
            <Text className="text-[11.5px] font-sans-semibold text-soft">Not marked</Text>
          </View>
        )}
        <Text className="text-[12px] text-muted-2">{pct}% attendance</Text>
      </View>
    </Pressable>
  );
}
