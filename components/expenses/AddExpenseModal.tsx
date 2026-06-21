import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import { CATEGORY_UI, CATEGORY_KEYS } from '../../constants/expenseCategory';
import type { ExpenseCategory } from '../../types';

export function AddExpenseModal({ visible, onClose, onAdd }: {
  visible: boolean; onClose: () => void; onAdd: (e: { note: string; category: ExpenseCategory; amount: number }) => void;
}) {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('utilities');
  const [amount, setAmount] = useState('');

  const reset = () => { setNote(''); setAmount(''); setCategory('utilities'); };
  const close = () => { reset(); onClose(); };

  const submit = () => {
    if (!note.trim() || !Number(amount)) return;
    onAdd({ note: note.trim(), category, amount: Number(amount) });
    reset();
    onClose();
  };

  const canSubmit = !!note.trim() && !!Number(amount);

  const label = 'mb-[6px] text-[12px] font-sans-semibold text-label';
  const input = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="w-[480px] max-w-full overflow-hidden rounded-[18px] bg-surface" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.4, shadowRadius: 70 }}>
          {/* Brand header */}
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">New Entry</Text>
            <Text className="mt-1 font-serif text-[22px] font-semibold text-[#FBF8F0]">Record Expense</Text>
            {/* Close button */}
            <Pressable
              onPress={close}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-[8px] border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]"
            >
              <Text className="text-base leading-none text-[#DCE7E1]">✕</Text>
            </Pressable>
          </View>

          {/* Form body */}
          <View className="px-[26px] pb-2 pt-6">
            {/* Description */}
            <Text className={label}>Description</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Electricity bill"
              placeholderTextColor="#9A9A8A"
              className={`mb-4 ${input}`}
            />

            {/* Category + Amount in 2-col grid */}
            <View className="mb-2 flex-row gap-[14px]">
              {/* Category col */}
              <View className="flex-1">
                <Text className={label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2 py-1">
                    {CATEGORY_KEYS.map((k) => {
                      const active = category === k;
                      return (
                        <Pressable
                          key={k}
                          onPress={() => setCategory(k)}
                          className="rounded-[9px] border px-3 py-[9px]"
                          style={{
                            borderColor: active ? CATEGORY_UI[k].color : undefined,
                            backgroundColor: active ? CATEGORY_UI[k].color + '22' : undefined,
                          }}
                          // fallback NativeWind for non-active
                        >
                          <Text
                            className={`text-[12.5px] font-sans-semibold ${active ? '' : 'border-border bg-surface text-label'}`}
                            style={active ? { color: CATEGORY_UI[k].color } : undefined}
                          >
                            {CATEGORY_UI[k].label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              {/* Amount col */}
              <View className="w-[140px]">
                <Text className={label}>Amount (₹)</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="14200"
                  keyboardType="number-pad"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${input}`}
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-[14px] flex-row gap-3 border-t border-border px-[26px] pb-6 pt-[14px]">
            <Pressable
              onPress={close}
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
              <Text className="text-sm font-sans-semibold text-[#F4F1E7]">Add Expense</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
