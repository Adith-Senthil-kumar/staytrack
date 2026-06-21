import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStaff, useAttendance, useSchedule, useLeave, useUserDoc } from '../../lib/db/hooks';
import { addStaff } from '../../lib/db/staff';
import { addLeave, setLeaveStatus } from '../../lib/db/leave';
import { markAttendance, setShift } from '../../lib/db/attendance';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { StaffCard } from '../../components/staff/StaffCard';
import { AddStaffModal } from '../../components/staff/AddStaffModal';
import { AttendanceTab } from '../../components/staff/AttendanceTab';
import { ScheduleTab } from '../../components/staff/ScheduleTab';
import { LeaveTab } from '../../components/staff/LeaveTab';
import { PayrollTab } from '../../components/staff/PayrollTab';
import { PayslipModal } from '../../components/staff/PayslipModal';
import { LogLeaveModal } from '../../components/staff/LogLeaveModal';
import { SubTabBar } from '../../components/ui/SubTabBar';
import { ThemedText } from '../../components/ui/ThemedText';
import { PlusIcon } from '../../components/icons';
import { SHIFT_CYCLE } from '../../constants/staffMeta';

type StaffTab = 'roster' | 'attendance' | 'schedule' | 'leave' | 'payroll';

const today = new Date().toISOString().slice(0, 10);

const TABS: { key: StaffTab; label: string }[] = [
  { key: 'roster', label: 'Roster' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'leave', label: 'Leave' },
  { key: 'payroll', label: 'Payroll' },
];

export default function Staff() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { staff } = useStaff();
  const { attendance } = useAttendance();
  const { schedule } = useSchedule();
  const { leave } = useLeave();
  const { userDoc } = useUserDoc();
  const showAddStaff = useUiStore((s) => s.showAddStaff);
  const openAddStaff = useUiStore((s) => s.openAddStaff);
  const closeAddStaff = useUiStore((s) => s.closeAddStaff);
  const payslipStaffId = useUiStore((s) => s.payslipStaffId);
  const openPayslip = useUiStore((s) => s.openPayslip);
  const closePayslip = useUiStore((s) => s.closePayslip);
  const showLogLeave = useUiStore((s) => s.showLogLeave);
  const openLogLeave = useUiStore((s) => s.openLogLeave);
  const closeLogLeave = useUiStore((s) => s.closeLogLeave);
  const [tab, setTab] = useState<StaffTab>('roster');

  return (
    <View>
      <SubTabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'roster' && (
        <>
          <View className="mb-4 flex-row items-center justify-between">
            <ThemedText variant="label">{staff.length} members</ThemedText>
            <Pressable
              onPress={openAddStaff}
              className="flex-row items-center gap-1.5 rounded-[9px] bg-brand px-3.5 py-2 active:bg-brand-hover"
            >
              <PlusIcon size={14} color="#F4F1E7" />
              <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Add Staff</Text>
            </Pressable>
          </View>
          {staff.length === 0 ? (
            <View className="items-center rounded-[14px] border border-dashed border-border py-16">
              <ThemedText variant="body" className="text-muted">
                No staff yet — add your first member.
              </ThemedText>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              {staff.map((s) => (
                <StaffCard key={s.id} staff={s} />
              ))}
            </View>
          )}
        </>
      )}

      {tab === 'attendance' && (
        <AttendanceTab
          staff={staff}
          attendance={attendance}
          onMark={(id, st) => {
            if (uid) markAttendance(uid, id, today, st);
          }}
        />
      )}

      {tab === 'schedule' && (
        <ScheduleTab
          staff={staff}
          schedule={schedule}
          onCycle={(id, d, cur) => {
            if (uid) setShift(uid, id, d, SHIFT_CYCLE[cur]);
          }}
        />
      )}

      {tab === 'leave' && (
        <>
          <View className="mb-4 flex-row justify-end">
            <Pressable
              onPress={openLogLeave}
              className="flex-row items-center gap-1.5 rounded-[9px] bg-brand px-3.5 py-2 active:bg-brand-hover"
            >
              <PlusIcon size={14} color="#F4F1E7" />
              <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Log Leave</Text>
            </Pressable>
          </View>
          <LeaveTab
            staff={staff}
            leave={leave}
            onApprove={(id) => { if (uid) setLeaveStatus(uid, id, 'approved'); }}
            onReject={(id) => { if (uid) setLeaveStatus(uid, id, 'rejected'); }}
          />
        </>
      )}

      {tab === 'payroll' && (
        <PayrollTab
          staff={staff}
          attendance={attendance}
          onPayslip={openPayslip}
        />
      )}

      <AddStaffModal
        visible={showAddStaff}
        onClose={closeAddStaff}
        onAdd={(s) => {
          if (uid) addStaff(uid, s);
        }}
      />

      <PayslipModal
        visible={!!payslipStaffId}
        staff={staff.find((s) => s.id === payslipStaffId) ?? null}
        attendance={attendance}
        propertyName={userDoc?.property?.name ?? 'PG'}
        onClose={closePayslip}
      />

      <LogLeaveModal
        visible={showLogLeave}
        staff={staff}
        onClose={closeLogLeave}
        onSubmit={(req) => {
          if (uid) addLeave(uid, req);
        }}
      />
    </View>
  );
}
