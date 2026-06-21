import { View, Text, Pressable, ScrollView } from 'react-native';
import { SHIFT_UI, WEEKDAYS } from '../../constants/staffMeta';
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
    <View>
      {/* Legend */}
      <View className="mb-4 flex-row flex-wrap gap-4">
        {(Object.keys(SHIFT_UI) as Shift[]).map((s) => (
          <View key={s} className="flex-row items-center gap-1.5">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SHIFT_UI[s].color }} />
            <Text className="text-[12px] font-sans-medium text-muted">{SHIFT_UI[s].label}</Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 640 }}>
          {/* Header row */}
          <View className="mb-1 flex-row items-center gap-1">
            <View style={{ width: 160 }}>
              <Text className="text-[12px] font-sans-semibold text-muted">Staff</Text>
            </View>
            {WEEKDAYS.map((day) => (
              <View key={day} className="h-9 flex-1 items-center justify-center">
                <Text className="text-[12px] font-sans-semibold text-muted">{day}</Text>
              </View>
            ))}
          </View>

          {/* Staff rows */}
          {staff.length === 0 ? (
            <View className="items-center rounded-[14px] border border-dashed border-border py-12">
              <Text className="text-sm text-muted">No staff members yet.</Text>
            </View>
          ) : (
            staff.map((member) => (
              <View key={member.id} className="mb-1 flex-row items-center gap-1">
                {/* Name + role */}
                <View style={{ width: 160 }} className="pr-3">
                  <Text numberOfLines={1} className="text-[13px] font-sans-semibold text-text">
                    {member.name}
                  </Text>
                  <Text numberOfLines={1} className="text-[11px] text-muted">
                    {member.role}
                  </Text>
                </View>
                {/* 7 day cells */}
                {WEEKDAYS.map((_, dayIdx) => {
                  const shift = shiftFor(member.id, dayIdx);
                  const ui = SHIFT_UI[shift];
                  return (
                    <Pressable
                      key={dayIdx}
                      onPress={() => onCycle(member.id, dayIdx, shift)}
                      className="h-9 flex-1 items-center justify-center rounded-md"
                      style={{ backgroundColor: ui.color + '22' }}
                    >
                      <Text className="text-[13px] font-sans-semibold" style={{ color: ui.color }}>
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
