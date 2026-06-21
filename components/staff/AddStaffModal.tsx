import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { STAFF_ROLE_UI, STAFF_ROLE_KEYS } from '../../constants/staffRole';
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
  const input = 'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="max-h-[92%] w-full max-w-[540px] overflow-hidden rounded-[18px] bg-surface">
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">
              {isEdit ? 'Edit Member' : 'New Member'}
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">
              {isEdit ? 'Edit Staff' : 'Add Staff'}
            </Text>
          </View>
          <ScrollView className="px-[26px] py-6">
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Full Name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="e.g. Suresh Babu" placeholderTextColor="#9A9A8A" className={`mb-4 ${input}`} />
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Role</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {STAFF_ROLE_KEYS.map((k) => (
                <Pressable key={k} onPress={() => setRole(k)} className={`rounded-lg border px-3 py-2 ${role === k ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
                  <Text className={`text-[13px] font-sans-semibold ${role === k ? 'text-ok' : 'text-muted'}`}>{STAFF_ROLE_UI[k].label}</Text>
                </Pressable>
              ))}
            </View>
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">Phone</Text>
                <TextInput value={phone} onChangeText={setPhone} placeholder="+91 98xxx" keyboardType="phone-pad" placeholderTextColor="#9A9A8A" className={`font-mono ${input}`} />
              </View>
              <View className="flex-1">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">Salary (₹)</Text>
                <TextInput value={salary} onChangeText={setSalary} placeholder="12000" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`font-mono ${input}`} />
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">ID Proof</Text>
                <TextInput value={idProof} onChangeText={setIdProof} placeholder="Aadhaar / PAN" placeholderTextColor="#9A9A8A" className={input} />
              </View>
              <View className="flex-1">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">Date of Joining</Text>
                <TextInput value={joinDate} onChangeText={setJoinDate} placeholder="2026-06-20" placeholderTextColor="#9A9A8A" className={input} />
              </View>
            </View>
          </ScrollView>
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable onPress={onClose} className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2">
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable onPress={submit} className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover">
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">{isEdit ? 'Save Changes' : 'Add Staff'}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
