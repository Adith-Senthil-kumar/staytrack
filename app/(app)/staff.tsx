import { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useStaff, useAttendance, useSchedule, useLeave, useUserDoc } from '../../lib/db/hooks';
import { addStaff, updateStaff, removeStaff } from '../../lib/db/staff';
import { addLeave, setLeaveStatus } from '../../lib/db/leave';
import { markAttendance, setShift } from '../../lib/db/attendance';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { StaffCard } from '../../components/staff/StaffCard';
import { AddStaffModal } from '../../components/staff/AddStaffModal';
import { StaffDetailPanel } from '../../components/staff/StaffDetailPanel';
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
  const { width } = useWindowDimensions();
  // Pad the last roster row with invisible fillers so a lone card keeps its
  // column width instead of stretching (flex `grow` would otherwise expand it).
  const rosterCols = width >= 1024 ? 3 : 2;
  const rosterFillers = (rosterCols - (staff.length % rosterCols)) % rosterCols;
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
  const selectedStaffId = useUiStore((s) => s.selectedStaffId);
  const selectStaff = useUiStore((s) => s.selectStaff);
  const clearStaffSelection = useUiStore((s) => s.clearStaffSelection);
  const [tab, setTab] = useState<StaffTab>('roster');
  const [editStaffId, setEditStaffId] = useState<string | null>(null);

  return (
    <View>
      <SubTabBar
        tabs={TABS}
        active={tab}
        onChange={setTab}
        action={
          tab === 'roster' ? (
            <Pressable
              onPress={openAddStaff}
              className="flex-row items-center gap-1.5 rounded-[9px] bg-brand px-3.5 py-[9px] active:bg-brand-hover"
            >
              <PlusIcon size={15} color="#F4F1E7" />
              <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Add Staff</Text>
            </Pressable>
          ) : tab === 'leave' ? (
            <Pressable
              onPress={openLogLeave}
              className="flex-row items-center gap-1.5 rounded-[9px] bg-brand px-3.5 py-[9px] active:bg-brand-hover"
            >
              <PlusIcon size={15} color="#F4F1E7" />
              <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Log Leave</Text>
            </Pressable>
          ) : undefined
        }
      />

      {tab === 'roster' && (
        <>
          {staff.length === 0 ? (
            <View className="items-center rounded-[14px] border border-dashed border-border py-16">
              <ThemedText variant="body" className="text-muted">
                No staff yet — add your first member.
              </ThemedText>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              {staff.map((s) => (
                <StaffCard
                  key={s.id}
                  staff={s}
                  attendance={attendance}
                  onPress={() => selectStaff(s.id)}
                />
              ))}
              {Array.from({ length: rosterFillers }).map((_, i) => (
                <View key={`filler-${i}`} className="grow basis-[47%] lg:basis-[31%]" />
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
        <LeaveTab
          staff={staff}
          leave={leave}
          onApprove={(id) => { if (uid) setLeaveStatus(uid, id, 'approved'); }}
          onReject={(id) => { if (uid) setLeaveStatus(uid, id, 'rejected'); }}
        />
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
        onClose={() => { closeAddStaff(); setEditStaffId(null); }}
        onAdd={(s) => {
          if (uid) addStaff(uid, s);
        }}
        initial={staff.find((s) => s.id === editStaffId) ?? null}
        onSave={(id, patch) => {
          if (uid) updateStaff(uid, id, patch);
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

      <StaffDetailPanel
        staff={staff.find((s) => s.id === selectedStaffId) ?? null}
        attendance={attendance}
        leave={leave}
        onClose={clearStaffSelection}
        onPayslip={(id) => { clearStaffSelection(); openPayslip(id); }}
        onEdit={(id) => { setEditStaffId(id); clearStaffSelection(); openAddStaff(); }}
        onAddNote={(id, note) => {
          if (uid) {
            const m = staff.find((s) => s.id === id);
            updateStaff(uid, id, { notes: [...(m?.notes ?? []), note] });
          }
        }}
        onRemove={(id) => {
          if (uid) { removeStaff(uid, id); clearStaffSelection(); }
        }}
      />
    </View>
  );
}
