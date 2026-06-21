import { View, Text, Pressable, ScrollView } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { calcPayroll, monthRecords, WORKDAYS } from '../../lib/domain/payroll';
import { formatINR, monthKey } from '../../lib/domain/format';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import type { Staff, Attendance } from '../../types';

const ym = monthKey(new Date());

export function PayrollTab({
  staff,
  attendance,
  onPayslip,
}: {
  staff: Staff[];
  attendance: Attendance[];
  onPayslip: (id: string) => void;
}) {
  const calcs = staff.map((s) => ({
    s,
    c: calcPayroll(s, monthRecords(attendance, s.id, ym)),
  }));

  const totalNet = calcs.reduce((sum, { c }) => sum + c.net, 0);

  const headerCell = 'text-[11px] font-sans-semibold uppercase tracking-[0.6px] text-muted-2';

  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-sm">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 560 }}>
          {/* Header row */}
          <View className="flex-row border-b border-border bg-surface-2 px-[22px] py-[13px]">
            <Text className={`${headerCell} flex-[2]`}>Staff</Text>
            <Text className={headerCell} style={{ flex: 1 }}>Base</Text>
            <Text className={headerCell} style={{ flex: 1 }}>Days</Text>
            <Text className={headerCell} style={{ flex: 1 }}>Net Pay</Text>
            <Text className={`${headerCell} text-right`} style={{ flex: 1.3 }}>Payslip</Text>
          </View>

          {/* Staff rows */}
          {staff.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-sm text-muted-2">No staff members yet.</Text>
            </View>
          ) : (
            calcs.map(({ s, c }, idx) => {
              const roleUi = STAFF_ROLE_UI[s.role];
              return (
                <View
                  key={s.id}
                  className={`flex-row items-center px-[22px] py-3 ${idx < calcs.length - 1 ? 'border-b border-border-3' : ''}`}
                >
                  {/* Staff cell */}
                  <View className="flex-[2] flex-row items-center gap-[11px] min-w-0">
                    <View
                      className="h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]"
                      style={{ backgroundColor: avatarColor(s.name) }}
                    >
                      <Text className="text-[12px] font-sans-semibold text-[#FBF8F0]">
                        {initials(s.name)}
                      </Text>
                    </View>
                    <View className="min-w-0">
                      <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">
                        {s.name}
                      </Text>
                      <Text className="text-[11.5px] text-muted-2">{roleUi.label}</Text>
                    </View>
                  </View>

                  {/* Base */}
                  <Text className="font-mono text-[13px] text-text-2" style={{ flex: 1 }}>
                    {formatINR(s.salary)}
                  </Text>

                  {/* Days worked */}
                  <Text className="font-mono text-[13px] text-text-2" style={{ flex: 1 }}>
                    {c.worked}/{WORKDAYS}
                  </Text>

                  {/* Net pay */}
                  <Text className="font-mono-semibold text-[13.5px] text-ink" style={{ flex: 1 }}>
                    {formatINR(c.net)}
                  </Text>

                  {/* Payslip button */}
                  <View className="items-end" style={{ flex: 1.3 }}>
                    <Pressable
                      onPress={() => onPayslip(s.id)}
                      className="rounded-lg border border-border bg-surface-2 px-[13px] py-[7px] active:bg-surface-3"
                    >
                      <Text className="text-[12.5px] font-sans-semibold text-ink">Payslip</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}

          {/* Footer total row */}
          <View className="flex-row items-center justify-between border-t border-border bg-surface-2 px-[22px] py-[14px]">
            <Text className="text-[13px] font-sans-semibold text-ink">
              Total monthly payroll
            </Text>
            <Text className="font-mono text-[13px] font-semibold text-ink">
              {formatINR(totalNet)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
