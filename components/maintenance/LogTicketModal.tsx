import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import { MAINT_CATEGORY, MAINT_CATEGORY_KEYS, PRIORITY_UI } from '../../constants/maintenance';
import { CheckIcon, ImageIcon } from '../icons';
import { SelectField } from '../ui/SelectField';
import type { MaintCategory, MaintPriority, Vendor, Room } from '../../types';

export function LogTicketModal({
  visible,
  onClose,
  onAdd,
  vendors,
  rooms,
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
  rooms: Room[];
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

  const canSubmit = !!roomNumber.trim() && !!issue.trim();

  const input = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';
  const label = 'mb-1.5 text-[12px] font-sans-semibold text-label';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable
          onPress={() => {}}
          className="w-full max-w-[540px] overflow-hidden rounded-[18px] bg-surface"
          style={{ maxHeight: '92%' }}
        >
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]" style={{ position: 'relative' }}>
            <Pressable
              onPress={() => { reset(); onClose(); }}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]"
            >
              <Text className="text-base text-[#DCE7E1]">✕</Text>
            </Pressable>
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">
              New Complaint
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Log Maintenance Ticket</Text>
          </View>

          <ScrollView contentContainerClassName="px-[26px] pb-2 pt-6">
            {/* Room + Category 2-col */}
            <View className="mb-4 flex-row gap-3.5">
              <View className="flex-1">
                <Text className={label}>Room</Text>
                <SelectField
                  value={roomNumber}
                  onChange={setRoomNumber}
                  placeholder="Select room…"
                  options={rooms.map((r) => ({ value: r.number, label: `Room ${r.number}` }))}
                />
              </View>
              <View className="flex-1">
                <Text className={label}>Category</Text>
                <SelectField
                  value={category}
                  onChange={(v) => setCategory(v as MaintCategory)}
                  placeholder="Select category…"
                  options={MAINT_CATEGORY_KEYS.map((k) => ({ value: k, label: MAINT_CATEGORY[k] }))}
                />
              </View>
            </View>

            {/* Issue Description */}
            <Text className={label}>Issue Description</Text>
            <TextInput
              value={issue}
              onChangeText={setIssue}
              placeholder="What is the problem? Where exactly?"
              placeholderTextColor="#9A9A8A"
              multiline
              className={`mb-4 h-[70px] ${input}`}
              style={{ textAlignVertical: 'top' }}
            />

            {/* Priority */}
            <Text className={label}>Priority</Text>
            <View className="mb-4 flex-row gap-2.5">
              {(['high', 'medium', 'low'] as MaintPriority[]).map((p) => {
                const ui = PRIORITY_UI[p];
                const selected = priority === p;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    className="flex-1 items-center rounded-[8px] border px-1.5 py-[9px]"
                    style={{
                      borderColor: selected ? ui.color : undefined,
                      backgroundColor: selected ? ui.color + '1F' : undefined,
                    }}
                  >
                    <Text
                      className="font-sans-semibold text-sm"
                      style={{ color: selected ? ui.color : undefined }}
                    >
                      {ui.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Assign Vendor (optional) */}
            <Text className={label}>
              Assign Vendor{' '}
              <Text className="font-normal text-soft">(optional)</Text>
            </Text>
            <View className="mb-4">
              <SelectField
                value={vendorId ?? ''}
                onChange={(v) => setVendorId(v === '' ? null : v)}
                placeholder="No vendor yet"
                options={[
                  { value: '', label: 'No vendor yet' },
                  ...vendors.map((v) => ({ value: v.id, label: v.name })),
                ]}
              />
            </View>

            {/* Photo toggle */}
            <Pressable
              onPress={() => setPhoto((p) => !p)}
              className="mb-2 flex-row items-center gap-2.5 rounded-[9px] border border-border bg-surface px-3 py-2.5 active:bg-surface-2"
            >
              <View className="h-5 w-5 items-center justify-center rounded-md border border-border bg-field">
                {photo && <CheckIcon size={13} color="#1E6F5C" />}
              </View>
              <ImageIcon size={16} color="#5A6A65" />
              <Text className="text-[13px] text-label">Attach a photo of the issue</Text>
            </Pressable>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 border-t border-border px-[26px] py-[18px]">
            <Pressable
              onPress={() => { reset(); onClose(); }}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="font-sans-semibold text-sm text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={!canSubmit}
              className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"
              style={{ opacity: canSubmit ? 1 : 0.5 }}
            >
              <Text className="font-sans-semibold text-sm text-[#F4F1E7]">Log Ticket</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
