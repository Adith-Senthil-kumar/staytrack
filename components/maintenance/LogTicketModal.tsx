import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import { MAINT_CATEGORY, MAINT_CATEGORY_KEYS, PRIORITY_UI } from '../../constants/maintenance';
import type { MaintCategory, MaintPriority } from '../../types';

export function LogTicketModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: { roomNumber: string; category: MaintCategory; issue: string; priority: MaintPriority }) => void;
}) {
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState<MaintCategory>('other');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<MaintPriority>('medium');

  const submit = () => {
    if (!roomNumber.trim() || !issue.trim()) return;
    onAdd({ roomNumber: roomNumber.trim(), category, issue: issue.trim(), priority });
    setRoomNumber('');
    setCategory('other');
    setIssue('');
    setPriority('medium');
    onClose();
  };

  const input = 'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-full max-w-[480px] overflow-hidden rounded-[18px] bg-surface">
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">New Complaint</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Log Maintenance Ticket</Text>
          </View>
          <ScrollView>
            <View className="px-[26px] py-6">
              <Text className="mb-1.5 text-xs font-sans-semibold text-label">Room</Text>
              <TextInput
                value={roomNumber}
                onChangeText={setRoomNumber}
                placeholder="Room number"
                placeholderTextColor="#9A9A8A"
                className={`mb-4 ${input}`}
              />

              <Text className="mb-1.5 text-xs font-sans-semibold text-label">Category</Text>
              <View className="mb-4 flex-row flex-wrap gap-2">
                {MAINT_CATEGORY_KEYS.map((k) => (
                  <Pressable
                    key={k}
                    onPress={() => setCategory(k)}
                    className={`rounded-lg border px-3 py-2 ${category === k ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}
                  >
                    <Text className={`text-[13px] font-sans-semibold ${category === k ? 'text-ok' : 'text-muted'}`}>
                      {MAINT_CATEGORY[k]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="mb-1.5 text-xs font-sans-semibold text-label">Issue Description</Text>
              <TextInput
                value={issue}
                onChangeText={setIssue}
                placeholder="Describe the issue..."
                placeholderTextColor="#9A9A8A"
                multiline
                numberOfLines={3}
                className={`mb-4 h-20 ${input}`}
                style={{ textAlignVertical: 'top' }}
              />

              <Text className="mb-1.5 text-xs font-sans-semibold text-label">Priority</Text>
              <View className="flex-row gap-2">
                {(['high', 'medium', 'low'] as MaintPriority[]).map((p) => {
                  const ui = PRIORITY_UI[p];
                  const selected = priority === p;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => setPriority(p)}
                      className="rounded-lg border px-3 py-2"
                      style={{
                        borderColor: selected ? ui.color : undefined,
                        backgroundColor: selected ? ui.color + '22' : undefined,
                      }}
                    >
                      <Text
                        className="text-[13px] font-sans-semibold"
                        style={{ color: selected ? ui.color : undefined }}
                      >
                        {ui.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable
              onPress={onClose}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"
            >
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Log Ticket</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
