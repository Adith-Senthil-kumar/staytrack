import { View, Text, Pressable, ScrollView } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { ATT_UI, ATT_KEYS } from '../../constants/staffMeta';
import type { Staff, Attendance, AttendanceStatus } from '../../types';

const today = new Date().toISOString().slice(0, 10);

export function AttendanceTab({
  staff,
  attendance,
  onMark,
}: {
  staff: Staff[];
  attendance: Attendance[];
  onMark: (staffId: string, status: AttendanceStatus) => void;
}) {
  const todayRecs = attendance.filter((a) => a.date === today);
  const countOf = (s: AttendanceStatus) => todayRecs.filter((a) => a.status === s).length;
  const markedIds = new Set(todayRecs.map((a) => a.staffId));
  const notMarked = staff.filter((s) => !markedIds.has(s.id)).length;
  const present = countOf('present');
  const absent = countOf('absent');
  const onLeave = countOf('leave');

  const statusFor = (staffId: string): AttendanceStatus | null =>
    todayRecs.find((a) => a.staffId === staffId)?.status ?? null;

  return (
    <View>
      {/* Stat cards */}
      <View className="mb-6 flex-row flex-wrap gap-3 sm:gap-4">
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] pb-4 pt-[18px] sm:basis-0">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-[2px] bg-ok" />
            <Text className="text-xs font-sans-medium text-muted">Present</Text>
          </View>
          <Text className="mt-2 font-serif text-[28px] text-ok">{present}</Text>
        </View>
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] pb-4 pt-[18px] sm:basis-0">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-[2px] bg-bad" />
            <Text className="text-xs font-sans-medium text-muted">Absent</Text>
          </View>
          <Text className="mt-2 font-serif text-[28px] text-bad">{absent}</Text>
        </View>
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] pb-4 pt-[18px] sm:basis-0">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-[2px] bg-muted" />
            <Text className="text-xs font-sans-medium text-muted">On Leave</Text>
          </View>
          <Text className="mt-2 font-serif text-[28px] text-muted">{onLeave}</Text>
        </View>
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] pb-4 pt-[18px] sm:basis-0">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-[2px] bg-warn" />
            <Text className="text-xs font-sans-medium text-muted">Not Marked</Text>
          </View>
          <Text className="mt-2 font-serif text-[28px] text-warn">{notMarked}</Text>
        </View>
      </View>

      {/* Today's attendance card */}
      <View className="rounded-[14px] border border-border bg-surface">
        <View className="border-b border-border px-5 py-4">
          <Text className="text-[13px] font-sans-semibold text-text">Today · {today}</Text>
        </View>
        {staff.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-sm text-muted">No staff members yet.</Text>
          </View>
        ) : (
          staff.map((member, idx) => {
            const current = statusFor(member.id);
            return (
              <View
                key={member.id}
                className={`flex-row items-center gap-3 px-5 py-3.5 ${idx < staff.length - 1 ? 'border-b border-border' : ''}`}
              >
                {/* Avatar */}
                <View
                  className="h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: avatarColor(member.name) }}
                >
                  <Text className="text-[12px] font-sans-semibold text-[#FBF8F0]">
                    {initials(member.name)}
                  </Text>
                </View>
                {/* Name */}
                <Text numberOfLines={1} className="flex-1 text-[14px] font-sans-medium text-text">
                  {member.name}
                </Text>
                {/* Status buttons */}
                <View className="flex-row gap-1.5">
                  {ATT_KEYS.map((k) => {
                    const isSelected = current === k;
                    return (
                      <Pressable
                        key={k}
                        onPress={() => onMark(member.id, k)}
                        className="rounded-md border px-2 py-1"
                        style={{
                          borderColor: isSelected ? ATT_UI[k].color : undefined,
                          backgroundColor: isSelected ? ATT_UI[k].color + '22' : undefined,
                        }}
                        // fallback classes for unselected
                      >
                        <Text
                          className={`text-[11.5px] font-sans-semibold ${isSelected ? '' : 'text-muted'}`}
                          style={isSelected ? { color: ATT_UI[k].color } : undefined}
                        >
                          {ATT_UI[k].label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
