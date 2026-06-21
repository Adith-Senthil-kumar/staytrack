import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { VENDOR_TRADE_UI, VENDOR_TRADE_KEYS } from '../../constants/vendorTrade';
import { SelectField } from '../ui/SelectField';
import { TrashIcon } from '../icons';
import type { Vendor, VendorTrade } from '../../types';

export function VendorModal({
  visible,
  editing,
  onClose,
  onSave,
  onRemove,
}: {
  visible: boolean;
  editing: Vendor | null;
  onClose: () => void;
  onSave: (data: { name: string; trade: VendorTrade; phone: string }) => void;
  onRemove?: () => void;
}) {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState<VendorTrade>('plumber');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setTrade(editing.trade);
      setPhone(editing.phone);
    } else {
      setName('');
      setTrade('plumber');
      setPhone('');
    }
  }, [editing, visible]);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), trade, phone: phone.trim() || '+91 —' });
  };

  const input =
    'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center bg-overlay p-6"
      >
        <Pressable
          onPress={() => {}}
          className="w-[460px] max-w-full overflow-hidden rounded-[18px] bg-surface"
        >
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-wide text-[#6F9588]">
              VENDOR DIRECTORY
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">
              {editing ? 'Edit Vendor' : 'Add Vendor'}
            </Text>
          </View>

          {/* Body */}
          <ScrollView className="px-[26px] pt-6 pb-2">
            {/* Name */}
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">
              Vendor / Business Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Mahesh Plumbing"
              placeholderTextColor="#9A9A8A"
              className={`mb-4 ${input}`}
            />

            {/* Trade */}
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Trade</Text>
            <View className="mb-4">
              <SelectField
                value={trade}
                onChange={(v) => setTrade(v as VendorTrade)}
                placeholder="Select a trade…"
                options={VENDOR_TRADE_KEYS.map((k) => ({
                  value: k,
                  label: VENDOR_TRADE_UI[k].label,
                }))}
              />
            </View>

            {/* Phone */}
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98xxx xxxxx"
              placeholderTextColor="#9A9A8A"
              keyboardType="phone-pad"
              className={`mb-2 font-mono ${input}`}
            />
          </ScrollView>

          {/* Footer */}
          <View className="flex-row items-center gap-3 px-[26px] pb-6 pt-2">
            {editing && onRemove && (
              <Pressable
                onPress={onRemove}
                className="h-[46px] w-[46px] items-center justify-center rounded-[10px] border border-maint-bd bg-surface"
              >
                <TrashIcon size={16} color="#B5462F" />
              </Pressable>
            )}
            <Pressable
              onPress={onClose}
              className="rounded-[10px] border border-border bg-surface px-5 py-3"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              className={`flex-1 rounded-[10px] py-3 items-center ${
                canSave ? 'bg-brand' : 'bg-surface-3'
              }`}
            >
              <Text
                className={`text-sm font-sans-semibold ${
                  canSave ? 'text-[#F4F1E7]' : 'text-muted'
                }`}
              >
                Save Vendor
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
