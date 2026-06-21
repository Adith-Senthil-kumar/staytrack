import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import type { Staff, LeaveRequest, LeaveType } from '../../types';

export function LogLeaveModal({
  visible,
  staff,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  staff: Staff[];
  onClose: () => void;
  onSubmit: (req: Omit<LeaveRequest, 'id'>) => void;
}) {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [type, setType] = useState<LeaveType>('casual');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [days, setDays] = useState('');
  const [reason, setReason] = useState('');

  const reset = () => {
    setSelectedStaffId(null);
    setType('casual');
    setFrom('');
    setTo('');
    setDays('');
    setReason('');
  };

  const submit = () => {
    if (!selectedStaffId) return;
    onSubmit({
      staffId: selectedStaffId,
      type,
      from: from.trim(),
      to: to.trim() || from.trim(),
      days: Number(days) || 1,
      reason: reason.trim(),
      status: 'pending',
    });
    reset();
    onClose();
  };

  const input = 'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable
          onPress={() => {}}
          className="max-h-[92%] w-full max-w-[480px] overflow-hidden rounded-[18px] bg-surface"
        >
          {/* Header */}
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">
              New Request
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Log Leave</Text>
          </View>

          <ScrollView className="px-[26px] py-6">
            {/* Staff picker */}
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Staff Member</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4 flex-row"
            >
              <View className="flex-row gap-2">
                {staff.map((s) => (
                  <Pressable
                    key={s.id}
                    onPress={() => setSelectedStaffId(s.id)}
                    className={`rounded-lg border px-3 py-2 ${
                      selectedStaffId === s.id
                        ? 'border-accent bg-occ-bg'
                        : 'border-border bg-surface'
                    }`}
                  >
                    <Text
                      className={`text-[13px] font-sans-semibold ${
                        selectedStaffId === s.id ? 'text-ok' : 'text-muted'
                      }`}
                    >
                      {s.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Leave type */}
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Type</Text>
            <View className="mb-4 flex-row gap-2">
              {(['casual', 'sick'] as LeaveType[]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  className={`rounded-lg border px-3 py-2 ${
                    type === t ? 'border-accent bg-occ-bg' : 'border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-[13px] font-sans-semibold ${
                      type === t ? 'text-ok' : 'text-muted'
                    }`}
                  >
                    {t === 'casual' ? 'Casual' : 'Sick'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* From / To / Days */}
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">From</Text>
                <TextInput
                  value={from}
                  onChangeText={setFrom}
                  placeholder="24 Jun"
                  placeholderTextColor="#9A9A8A"
                  className={input}
                />
              </View>
              <View className="flex-1">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">To</Text>
                <TextInput
                  value={to}
                  onChangeText={setTo}
                  placeholder="24 Jun"
                  placeholderTextColor="#9A9A8A"
                  className={input}
                />
              </View>
              <View className="w-[70px]">
                <Text className="mb-1.5 text-xs font-sans-semibold text-label">Days</Text>
                <TextInput
                  value={days}
                  onChangeText={setDays}
                  placeholder="1"
                  keyboardType="number-pad"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${input}`}
                />
              </View>
            </View>

            {/* Reason */}
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Reason</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Reason for leave..."
              placeholderTextColor="#9A9A8A"
              multiline
              numberOfLines={3}
              className={`h-20 ${input}`}
              style={{ textAlignVertical: 'top' }}
            />
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable
              onPress={() => { reset(); onClose(); }}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={!selectedStaffId}
              className={`flex-1 items-center rounded-[10px] py-3 ${
                selectedStaffId ? 'bg-brand active:bg-brand-hover' : 'bg-surface-3'
              }`}
            >
              <Text
                className={`text-sm font-sans-semibold ${
                  selectedStaffId ? 'text-[#F4F1E7]' : 'text-muted'
                }`}
              >
                Log Leave
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
