import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { STAFF_ROLE_UI, STAFF_ROLE_KEYS } from '../../constants/staffRole';
import { SelectField } from '../ui/SelectField';
import { XIcon } from '../icons';
import type { Staff, StaffRole } from '../../types';

export function AddStaffModal({
  visible,
  onClose,
  onAdd,
  initial,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (s: { name: string; role: StaffRole; phone: string; idProof: string; joinDate: string; salary: number }) => void;
  initial?: Staff | null;
  onSave?: (id: string, patch: Partial<Staff>) => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('cook');
  const [phone, setPhone] = useState('');
  const [idProof, setIdProof] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setRole(initial.role);
      setPhone(initial.phone);
      setIdProof(initial.idProof);
      setJoinDate(initial.joinDate);
      setSalary(String(initial.salary));
    } else {
      setName('');
      setRole('cook');
      setPhone('');
      setIdProof('');
      setJoinDate('');
      setSalary('');
    }
  }, [initial]);

  const resetFields = () => {
    setName(''); setRole('cook'); setPhone(''); setIdProof(''); setJoinDate(''); setSalary('');
  };

  const submit = () => {
    if (!name.trim() || !Number(salary)) return;
    if (initial && onSave) {
      onSave(initial.id, {
        name: name.trim(),
        role,
        phone: phone.trim(),
        idProof: idProof.trim(),
        joinDate: joinDate.trim() || initial.joinDate,
        salary: Number(salary),
      });
    } else {
      onAdd({
        name: name.trim(),
        role,
        phone: phone.trim(),
        idProof: idProof.trim(),
        joinDate: joinDate.trim() || new Date().toISOString().slice(0, 10),
        salary: Number(salary),
      });
      resetFields();
    }
    onClose();
  };

  const isEdit = !!initial;
  const canSubmit = !!name.trim() && !!Number(salary);

  const label = 'mb-1.5 text-[12px] font-sans-semibold text-label';
  const input = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable
          onPress={() => {}}
          className="max-h-[92%] w-full max-w-[540px] overflow-hidden rounded-[18px] bg-surface"
          style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.4)' } as never}
        >
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]">
            <Pressable
              onPress={onClose}
              style={{ zIndex: 10 }}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]"
            >
              <XIcon size={16} color="#DCE7E1" />
            </Pressable>
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">
              {isEdit ? 'Edit Member' : 'New Member'}
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">
              {isEdit ? 'Edit Staff' : 'Add Staff'}
            </Text>
          </View>

          <ScrollView contentContainerClassName="px-[26px] pb-2 pt-6">
            {/* Full Name */}
            <Text className={label}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Suresh Babu"
              placeholderTextColor="#9A9A8A"
              className={`mb-4 ${input}`}
            />

            {/* Role + Phone — 2-col grid */}
            <View className="mb-4 flex-row gap-3.5">
              <View className="flex-1">
                <Text className={label}>Role</Text>
                <SelectField
                  value={role}
                  onChange={(v) => setRole(v as StaffRole)}
                  placeholder="Select a role…"
                  options={STAFF_ROLE_KEYS.map((k) => ({ value: k, label: STAFF_ROLE_UI[k].label }))}
                />
              </View>
              <View className="flex-1">
                <Text className={label}>Phone</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98xxx xxxxx"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${input}`}
                />
              </View>
            </View>

            {/* ID Proof + Date of Joining — 2-col grid */}
            <View className="mb-4 flex-row gap-3.5">
              <View className="flex-1">
                <Text className={label}>ID Proof</Text>
                <TextInput
                  value={idProof}
                  onChangeText={setIdProof}
                  placeholder="Aadhaar / PAN no."
                  placeholderTextColor="#9A9A8A"
                  className={input}
                />
              </View>
              <View className="flex-1">
                <Text className={label}>Date of Joining</Text>
                <TextInput
                  value={joinDate}
                  onChangeText={setJoinDate}
                  placeholder="e.g. 20 Jun 2026"
                  placeholderTextColor="#9A9A8A"
                  className={input}
                />
              </View>
            </View>

            {/* Monthly Salary */}
            <Text className={label}>Monthly Salary (₹)</Text>
            <TextInput
              value={salary}
              onChangeText={setSalary}
              placeholder="12000"
              keyboardType="number-pad"
              placeholderTextColor="#9A9A8A"
              className={`mb-1.5 font-mono ${input}`}
            />
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable
              onPress={onClose}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={!canSubmit}
              className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"
              style={{ opacity: canSubmit ? 1 : 0.5 }}
            >
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">
                {isEdit ? 'Save Changes' : 'Add Staff'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
