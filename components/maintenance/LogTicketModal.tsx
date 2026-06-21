import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import { MAINT_CATEGORY, MAINT_CATEGORY_KEYS, PRIORITY_UI } from '../../constants/maintenance';
import { CheckIcon, ImageIcon } from '../icons';
import type { MaintCategory, MaintPriority, Vendor } from '../../types';

export function LogTicketModal({
  visible,
  onClose,
  onAdd,
  vendors,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: {
    roomNumber: string;
    category: MaintCategory;
    issue: string;
    priority: MaintPriority;
    vendorId: string | null;
    photo: boolean;
  }) => void;
  vendors: Vendor[];
}) {
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState<MaintCategory>('other');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<MaintPriority>('medium');
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [photo, setPhoto] = useState(false);

  const reset = () => {
    setRoomNumber('');
    setCategory('other');
    setIssue('');
    setPriority('medium');
    setVendorId(null);
    setPhoto(false);
  };

  const submit = () => {
    if (!roomNumber.trim() || !issue.trim()) return;
    onAdd({
      roomNumber: roomNumber.trim(),
      category,
      issue: issue.trim(),
      priority,
      vendorId,
      photo,
    });
    reset();
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
                    <Text className={`font-sans-semibold text-[13px] ${category === k ? 'text-ok' : 'text-muted'}`}>
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
              <View className="mb-4 flex-row gap-2">
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
                        className="font-sans-semibold text-[13px]"
                        style={{ color: selected ? ui.color : undefined }}
                      >
                        {ui.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Assign Vendor (optional) */}
              <Text className="mb-1.5 text-xs font-sans-semibold text-label">Assign Vendor (optional)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                <View className="flex-row gap-2">
                  {/* No vendor yet pill */}
                  <Pressable
                    onPress={() => setVendorId(null)}
                    className={`rounded-lg border px-3 py-2 ${
                      vendorId === null ? 'bg-brand' : 'border-border bg-surface'
                    }`}
                  >
                    <Text
                      className={`font-sans-semibold text-[13px] ${
                        vendorId === null ? 'text-[#F4F1E7]' : 'text-label'
                      }`}
                    >
                      No vendor yet
                    </Text>
                  </Pressable>
                  {vendors.map((v) => (
                    <Pressable
                      key={v.id}
                      onPress={() => setVendorId(v.id)}
                      className={`rounded-lg border px-3 py-2 ${
                        vendorId === v.id ? 'bg-brand' : 'border-border bg-surface'
                      }`}
                    >
                      <Text
                        className={`font-sans-semibold text-[13px] ${
                          vendorId === v.id ? 'text-[#F4F1E7]' : 'text-label'
                        }`}
                      >
                        {v.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              {/* Photo toggle */}
              <Pressable
                onPress={() => setPhoto((p) => !p)}
                className="flex-row items-center gap-2.5 rounded-[9px] border border-border bg-surface px-3 py-2.5"
              >
                <View
                  className="h-5 w-5 items-center justify-center rounded-md border border-border bg-field"
                >
                  {photo && <CheckIcon size={13} color="#1E6F5C" />}
                </View>
                <ImageIcon size={16} color="#5A6A65" />
                <Text className="text-[13px] text-label">Attach a photo of the issue</Text>
              </Pressable>
            </View>
          </ScrollView>
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable
              onPress={() => { reset(); onClose(); }}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="font-sans-semibold text-sm text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"
            >
              <Text className="font-sans-semibold text-sm text-[#F4F1E7]">Log Ticket</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
