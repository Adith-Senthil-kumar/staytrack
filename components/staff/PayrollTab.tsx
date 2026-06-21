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

  const headerCell = 'text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2';

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ minWidth: 560 }}>
        {/* Header row */}
        <View className="flex-row border-b border-border bg-surface-2 px-[22px] py-3">
          <Text className={`${headerCell} flex-1`}>Staff</Text>
          <Text className={`${headerCell} w-[110px]`}>Base</Text>
          <Text className={`${headerCell} w-[90px]`}>Days</Text>
          <Text className={`${headerCell} w-[110px]`}>Net Pay</Text>
          <Text className={`${headerCell} w-[80px] text-right`}>Payslip</Text>
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
                className={`flex-row items-center px-[22px] py-3.5 ${idx < calcs.length - 1 ? 'border-b border-border-3' : ''}`}
              >
                {/* Staff cell */}
                <View className="flex-1 flex-row items-center gap-2.5">
                  <View
                    className="h-[34px] w-[34px] items-center justify-center rounded-full"
                    style={{ backgroundColor: avatarColor(s.name) }}
                  >
                    <Text className="text-[11px] font-sans-semibold text-[#FBF8F0]">
                      {initials(s.name)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-[13.5px] font-sans-semibold text-text">{s.name}</Text>
                    <Text className="text-[11.5px] text-muted-2">{roleUi.label}</Text>
                  </View>
                </View>

                {/* Base */}
                <Text className="w-[110px] font-mono text-[13px] text-text-2">
                  {formatINR(s.salary)}
                </Text>

                {/* Days */}
                <Text className="w-[90px] font-mono text-[13px] text-text-2">
                  {c.worked}/{WORKDAYS}
                </Text>

                {/* Net pay */}
                <Text className="w-[110px] font-mono-semibold text-[13px] text-ink">
                  {formatINR(c.net)}
                </Text>

                {/* Payslip button */}
                <View className="w-[80px] items-end">
                  <Pressable
                    onPress={() => onPayslip(s.id)}
                    className="rounded-lg border border-border bg-surface-2 px-3 py-[7px]"
                  >
                    <Text className="text-[12.5px] font-sans-semibold text-ink">Payslip</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        {/* Footer total row */}
        <View className="flex-row items-center justify-between border-t border-border bg-surface-2 px-[22px] py-3.5">
          <Text className="text-[12.5px] font-sans-semibold text-text-2">
            Total monthly payroll
          </Text>
          <Text className="font-mono-semibold text-[14px] text-ink">{formatINR(totalNet)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
