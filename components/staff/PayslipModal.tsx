import { View, Text, Pressable, Modal as RNModal, Share } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { calcPayroll, monthRecords, WORKDAYS } from '../../lib/domain/payroll';
import { formatINR, monthKey, monthName } from '../../lib/domain/format';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import { PaperPlaneIcon } from '../icons';
import type { Staff, Attendance } from '../../types';

const now = new Date();
const ym = monthKey(now);
const currentMonthName = monthName(ym);
const currentYear = now.getFullYear();

function buildPayslipText(
  staff: Staff,
  roleLabel: string,
  propertyName: string,
  c: ReturnType<typeof calcPayroll>,
) {
  return [
    `PAYSLIP · ${currentMonthName} ${currentYear}`,
    ``,
    `Name: ${staff.name}`,
    `Role: ${roleLabel} · ${propertyName}`,
    ``,
    `Base Salary: ${formatINR(staff.salary)}`,
    `Per-day rate (÷ ${WORKDAYS}): ${formatINR(Math.round(c.perDay))}`,
    `Days Worked: ${c.worked} / ${WORKDAYS}`,
    `Earned: ${formatINR(c.earned)}`,
    `Advance / deduction: ${c.advance ? `− ${formatINR(c.advance)}` : '₹0'}`,
    ``,
    `Net Payable: ${formatINR(c.net)}`,
  ].join('\n');
}

export function PayslipModal({
  visible,
  staff,
  attendance,
  propertyName,
  onClose,
}: {
  visible: boolean;
  staff: Staff | null;
  attendance: Attendance[];
  propertyName: string;
  onClose: () => void;
}) {
  if (!staff) return null;

  const c = calcPayroll(staff, monthRecords(attendance, staff.id, ym));
  const roleUi = STAFF_ROLE_UI[staff.role];
  const payslipText = buildPayslipText(staff, roleUi.label, propertyName, c);

  const handleShare = () => {
    Share.share({ message: payslipText });
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center bg-overlay p-6"
      >
        <Pressable
          onPress={() => {}}
          className="w-[440px] max-w-full overflow-hidden rounded-[18px] bg-surface"
        >
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-[11.5px] font-sans-semibold uppercase tracking-wide text-[#6F9588]">
                  PAYSLIP · {currentMonthName.toUpperCase()} {currentYear}
                </Text>
                <Text className="mt-1.5 font-serif text-[20px] text-[#FBF8F0]">{staff.name}</Text>
                <Text className="mt-0.5 text-[12px] text-[#8FB0A5]">
                  {roleUi.label} · {propertyName}
                </Text>
              </View>
              {/* Avatar top-right */}
              <View
                className="h-[46px] w-[46px] items-center justify-center rounded-full"
                style={{ backgroundColor: avatarColor(staff.name) + 'bb' }}
              >
                <Text className="text-[14px] font-sans-semibold text-[#FBF8F0]">
                  {initials(staff.name)}
                </Text>
              </View>
            </View>
            {/* Close button */}
            <Pressable
              onPress={onClose}
              className="absolute right-[14px] top-[14px] h-[28px] w-[28px] items-center justify-center rounded-full border border-[#ffffff2e] bg-[#ffffff14]"
            >
              <Text className="text-[14px] font-sans-semibold text-[#FBF8F0]">✕</Text>
            </Pressable>
          </View>

          {/* Body rows */}
          <View className="px-[26px] py-[22px]">
            {/* Base salary */}
            <View className="flex-row justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Base salary</Text>
              <Text className="font-mono text-[13px] text-text-2">{formatINR(staff.salary)}</Text>
            </View>

            {/* Per-day rate */}
            <View className="flex-row justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Per-day rate (÷ {WORKDAYS})</Text>
              <Text className="font-mono text-[13px] text-text-2">
                {formatINR(Math.round(c.perDay))}
              </Text>
            </View>

            {/* Days worked */}
            <View className="flex-row justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Days worked ({c.worked} / {WORKDAYS})</Text>
              <Text className="font-mono text-[13px] text-text-2">
                {c.worked} / {WORKDAYS}
              </Text>
            </View>

            {/* Earned */}
            <View className="flex-row justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Earned</Text>
              <Text className="font-mono-semibold text-[13px] text-ok">
                {formatINR(c.earned)}
              </Text>
            </View>

            {/* Advance / deduction */}
            <View className="flex-row justify-between border-b border-border-3 py-[9px]">
              <Text className="text-[13px] text-muted-2">Advance / deduction</Text>
              <Text className="font-mono text-[13px] text-bad">
                {c.advance ? `− ${formatINR(c.advance)}` : '₹0'}
              </Text>
            </View>

            {/* Net Payable */}
            <View className="flex-row items-center justify-between pt-3.5">
              <Text className="text-sm font-sans-bold text-ink">Net Payable</Text>
              <Text className="font-mono-semibold text-2xl text-ink">{formatINR(c.net)}</Text>
            </View>
          </View>

          {/* Footer buttons */}
          <View className="flex-row gap-3 px-[26px] pb-6">
            <Pressable
              onPress={handleShare}
              className="rounded-[10px] border border-border bg-surface px-4 py-3"
            >
              <Text className="text-[13.5px] font-sans-semibold text-label">Print / PDF</Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3"
            >
              <PaperPlaneIcon size={15} color="#F4F1E7" />
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Share on WhatsApp</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
