import { View, Text, Pressable, ScrollView } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { ATT_UI, ATT_KEYS } from '../../constants/staffMeta';
import { useNarrow } from '../../lib/ui/useNarrow';
import type { Staff, Attendance, AttendanceStatus } from '../../types';

const today = new Date().toISOString().slice(0, 10);

// Format today as e.g. "20 June 2026"
const todayFormatted = new Date().toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// Month attendance % for a staff member
function monthPct(attendance: Attendance[], staffId: string): string {
  const ym = today.slice(0, 7);
  const recs = attendance.filter((a) => a.staffId === staffId && a.date.startsWith(ym));
  if (!recs.length) return '0';
  const present = recs.filter((a) => a.status === 'present' || a.status === 'late').length;
  return String(Math.round((present / recs.length) * 100));
}

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
  const present = countOf('present') + countOf('late');
  const absent = countOf('absent');
  const onLeave = countOf('leave');

  const statusFor = (staffId: string): AttendanceStatus | null =>
    todayRecs.find((a) => a.staffId === staffId)?.status ?? null;
  const narrow = useNarrow();

  return (
    <View>
      {/* Stat cards — 4-col grid */}
      <View className="mb-5 flex-row flex-wrap gap-4">
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] py-4 sm:basis-0">
          <Text className="text-[12px] text-muted">Present today</Text>
          <Text className="mt-[5px] font-mono text-[26px] font-semibold text-ok">{present}</Text>
        </View>
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] py-4 sm:basis-0">
          <Text className="text-[12px] text-muted">Absent</Text>
          <Text className="mt-[5px] font-mono text-[26px] font-semibold text-bad">{absent}</Text>
        </View>
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] py-4 sm:basis-0">
          <Text className="text-[12px] text-muted">On leave</Text>
          <Text className="mt-[5px] font-mono text-[26px] font-semibold text-muted-2">{onLeave}</Text>
        </View>
        <View className="min-w-0 grow basis-[47%] rounded-[14px] border border-border bg-surface px-[18px] py-4 sm:basis-0">
          <Text className="text-[12px] text-muted">Not marked</Text>
          <Text className="mt-[5px] font-mono text-[26px] font-semibold text-soft">{notMarked}</Text>
        </View>
      </View>

      {/* Today's attendance table card */}
      <View className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-sm">
        {/* Card header */}
        <View className="flex-row items-center justify-between border-b border-border-2 px-5 py-[14px]">
          <Text className="font-serif text-base font-semibold text-ink">
            Today · {todayFormatted}
          </Text>
          <Text className="text-[12.5px] text-muted-2">Tap to mark each member</Text>
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
                className={`px-5 py-[13px] ${idx < staff.length - 1 ? 'border-b border-border-3' : ''} ${narrow ? '' : 'flex-row items-center gap-[18px]'}`}
              >
                {/* Avatar + name — on mobile this is its own row above the buttons */}
                <View className="min-w-0 flex-row items-center gap-[11px]" style={narrow ? undefined : { flex: 1.4 }}>
                  <View
                    className={`flex-none items-center justify-center rounded-[10px] ${narrow ? 'h-8 w-8' : 'h-9 w-9'}`}
                    style={{ backgroundColor: avatarColor(member.name) }}
                  >
                    <Text className="text-[12px] font-sans-semibold text-[#FBF8F0]">
                      {initials(member.name)}
                    </Text>
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">
                      {member.name}
                    </Text>
                    <Text className="text-[11.5px] text-muted-2">
                      {monthPct(attendance, member.id)}% this month
                    </Text>
                  </View>
                </View>

                {/* Status buttons — full-width row on mobile so labels don't overlap */}
                <View className={`flex-row gap-[7px] ${narrow ? 'mt-2.5' : ''}`} style={narrow ? undefined : { flex: 2 }}>
                  {ATT_KEYS.map((k) => {
                    const isSelected = current === k;
                    const activeBg: Record<AttendanceStatus, string> = {
                      present: '#EAF1EC',
                      late: '#FAF0DD',
                      absent: '#F7E7E1',
                      leave: '#F2EDDF',
                    };
                    return (
                      <Pressable
                        key={k}
                        onPress={() => onMark(member.id, k)}
                        className="flex-1 items-center rounded-lg border py-[7px]"
                        style={{
                          borderColor: isSelected ? ATT_UI[k].color : '#DED8C8',
                          backgroundColor: isSelected ? activeBg[k] : '#FBF9F2',
                        }}
                      >
                        <Text
                          className="text-[12px] font-sans-semibold"
                          style={{ color: isSelected ? ATT_UI[k].color : '#5C6157' }}
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
