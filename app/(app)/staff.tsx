import { View, Text, Pressable } from 'react-native';
import { useStaff } from '../../lib/db/hooks';
import { addStaff } from '../../lib/db/staff';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { StaffCard } from '../../components/staff/StaffCard';
import { AddStaffModal } from '../../components/staff/AddStaffModal';
import { ThemedText } from '../../components/ui/ThemedText';
import { PlusIcon } from '../../components/icons';
export default function Staff() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { staff } = useStaff();
  const showAddStaff = useUiStore((s) => s.showAddStaff);
  const openAddStaff = useUiStore((s) => s.openAddStaff);
  const closeAddStaff = useUiStore((s) => s.closeAddStaff);
  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <ThemedText variant="label">{staff.length} members</ThemedText>
        <Pressable onPress={openAddStaff} className="flex-row items-center gap-1.5 rounded-[9px] bg-brand px-3.5 py-2 active:bg-brand-hover"><PlusIcon size={14} color="#F4F1E7" /><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Add Staff</Text></Pressable>
      </View>
      {staff.length === 0 ? (
        <View className="items-center rounded-[14px] border border-dashed border-border py-16"><ThemedText variant="body" className="text-muted">No staff yet — add your first member.</ThemedText></View>
      ) : (
        <View className="flex-row flex-wrap gap-4">{staff.map((s) => <StaffCard key={s.id} staff={s} />)}</View>
      )}
      <AddStaffModal visible={showAddStaff} onClose={closeAddStaff} onAdd={(s) => { if (uid) addStaff(uid, s); }} />
    </View>
  );
}
