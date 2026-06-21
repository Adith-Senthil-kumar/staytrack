import { View, Text, Pressable, ScrollView } from 'react-native';
import { SHIFT_UI, WEEKDAYS } from '../../constants/staffMeta';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import type { Staff, ScheduleEntry, Shift } from '../../types';

export function ScheduleTab({
  staff,
  schedule,
  onCycle,
}: {
  staff: Staff[];
  schedule: ScheduleEntry[];
  onCycle: (staffId: string, day: number, current: Shift) => void;
}) {
  const shiftFor = (staffId: string, day: number): Shift =>
    schedule.find((s) => s.staffId === staffId && s.day === day)?.shift ?? 'off';

  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-sm">
      {/* Card header: title + legend */}
      <View className="flex-row items-center justify-between border-b border-border-2 px-5 py-[14px]">
        <Text className="font-serif text-base font-semibold text-ink">Weekly Duty Roster</Text>
        <View className="flex-row gap-[13px]">
          <View className="flex-row items-center gap-[5px]">
            <View className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: SHIFT_UI.morning.color }} />
            <Text className="text-[11.5px] text-muted">Morning</Text>
          </View>
          <View className="flex-row items-center gap-[5px]">
            <View className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: SHIFT_UI.evening.color }} />
            <Text className="text-[11.5px] text-muted">Evening</Text>
          </View>
          <View className="flex-row items-center gap-[5px]">
            <View className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: SHIFT_UI.night.color }} />
            <Text className="text-[11.5px] text-muted">Night</Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[620px] grow">
          {/* Column header row */}
          <View className="flex-row items-center border-b border-border-2 bg-surface-2 px-5 py-3">
            <View style={{ flex: 1.4 }}>
              <Text className="text-[11px] font-sans-semibold uppercase tracking-[0.5px] text-muted-2">
                Staff
              </Text>
            </View>
            {WEEKDAYS.map((day) => (
              <View key={day} style={{ flex: 1 }} className="items-center">
                <Text className="text-[11px] font-sans-semibold uppercase tracking-[0.5px] text-muted-2">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Staff rows */}
          {staff.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-sm text-muted">No staff members yet.</Text>
            </View>
          ) : (
            staff.map((member, idx) => (
              <View
                key={member.id}
                className={`flex-row items-center px-5 py-[10px] ${idx < staff.length - 1 ? 'border-b border-border-3' : ''}`}
              >
                {/* Name + role */}
                <View style={{ flex: 1.4 }} className="pr-2">
                  <Text numberOfLines={1} className="text-[13px] font-sans-semibold text-text">
                    {member.name}
                  </Text>
                  <Text numberOfLines={1} className="text-[11px] text-muted-2">
                    {STAFF_ROLE_UI[member.role].label}
                  </Text>
                </View>

                {/* 7 day shift cells */}
                {WEEKDAYS.map((_, dayIdx) => {
                  const shift = shiftFor(member.id, dayIdx);
                  const ui = SHIFT_UI[shift];
                  const cellBg: Record<Shift, string> = {
                    morning: '#FAF0DD',
                    evening: '#EAF1EC',
                    night: '#F2EDDF',
                    off: '#FBF9F2',
                  };
                  const letterColor = shift === 'off' ? '#9A9A8A' : ui.color;
                  return (
                    <Pressable
                      key={dayIdx}
                      onPress={() => onCycle(member.id, dayIdx, shift)}
                      style={{
                        flex: 1,
                        backgroundColor: cellBg[shift],
                        borderWidth: 1,
                        borderColor: '#DED8C8',
                      }}
                      className="mx-1 items-center justify-center rounded-lg py-[7px]"
                      accessibilityLabel="Tap to change shift"
                    >
                      <Text
                        className="font-mono text-[13px] font-semibold"
                        style={{ color: letterColor }}
                      >
                        {ui.letter}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
