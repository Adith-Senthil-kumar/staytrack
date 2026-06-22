import { View, Text, Pressable, Modal as RNModal, Linking } from 'react-native';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { calcPayroll, monthRecords, WORKDAYS } from '../../lib/domain/payroll';
import { formatINR, monthKey, monthName } from '../../lib/domain/format';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import { printReceipt } from '../../lib/receipt/printReceipt';
import { payslipHtml } from '../../lib/receipt/payslipHtml';
import { PaperPlaneIcon, XIcon, FileTextIcon } from '../icons';
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

  // Web → browser print dialog (Save as PDF) of the payslip HTML; native → share text.
  const handlePrint = () => { printReceipt({ html: payslipHtml(staff, roleUi.label, propertyName, currentMonthName, currentYear, c), text: payslipText }); };
  const handleWhatsApp = () => { Linking.openURL(`https://wa.me/?text=${encodeURIComponent(payslipText)}`); };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center bg-overlay p-6"
      >
        <Pressable
          onPress={() => {}}
          className="w-[440px] max-w-full overflow-hidden rounded-[18px] bg-surface"
          style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.4)' } as never}
        >
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]">
            {/* Close button */}
            <Pressable
              onPress={onClose}
              style={{ zIndex: 10 }}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]"
            >
              <XIcon size={16} color="#DCE7E1" />
            </Pressable>

            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">
                  Payslip · {currentMonthName} {currentYear}
                </Text>
                <Text className="mt-[3px] font-serif text-[20px] text-[#FBF8F0]">
                  {staff.name}
                </Text>
                <Text className="text-[12px] text-[#8FB0A5]">
                  {roleUi.label} · {propertyName}
                </Text>
              </View>
              {/* Avatar top-right */}
              <View
                className="h-[46px] w-[46px] items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <Text className="text-base font-sans-semibold text-[#FBF8F0]">
                  {initials(staff.name)}
                </Text>
              </View>
            </View>
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
              <Text className="text-[13px] text-muted-2">Days worked</Text>
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
            <View className="flex-row items-center justify-between pt-[14px]">
              <Text className="text-sm font-sans-bold text-ink">Net Payable</Text>
              <Text className="font-mono text-[24px] font-semibold text-ink">
                {formatINR(c.net)}
              </Text>
            </View>
          </View>

          {/* Footer buttons */}
          <View className="flex-row gap-3 px-[26px] pb-6">
            <Pressable
              onPress={handlePrint}
              className="flex-none flex-row items-center gap-2 rounded-[10px] border border-border bg-surface-2 px-4 py-3 active:bg-surface-3"
            >
              <FileTextIcon size={15} color="#13352C" />
              <Text className="text-[13.5px] font-sans-semibold text-ink">Print / PDF</Text>
            </Pressable>
            <Pressable
              onPress={handleWhatsApp}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-[10px] bg-accent py-3 active:opacity-80"
            >
              <PaperPlaneIcon size={16} color="#F4F1E7" />
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Share on WhatsApp</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
