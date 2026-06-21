import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal } from 'react-native';
import { CATEGORY_UI, CATEGORY_KEYS } from '../../constants/expenseCategory';
import type { ExpenseCategory } from '../../types';

export function AddExpenseModal({ visible, onClose, onAdd }: {
  visible: boolean; onClose: () => void; onAdd: (e: { note: string; category: ExpenseCategory; amount: number }) => void;
}) {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('utilities');
  const [amount, setAmount] = useState('');
  const submit = () => {
    if (!note.trim() || !Number(amount)) return;
    onAdd({ note: note.trim(), category, amount: Number(amount) });
    setNote(''); setAmount(''); setCategory('utilities'); onClose();
  };
  const input = 'rounded-[9px] border border-border bg-field px-3.5 py-3 text-sm text-text';
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
        <Pressable onPress={() => {}} className="w-full max-w-[480px] overflow-hidden rounded-[18px] bg-surface">
          <View className="bg-brand px-[26px] py-[22px]">
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">New Entry</Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">Record Expense</Text>
          </View>
          <View className="px-[26px] py-6">
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Description</Text>
            <TextInput value={note} onChangeText={setNote} placeholder="e.g. Electricity bill" placeholderTextColor="#9A9A8A" className={`mb-4 ${input}`} />
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Category</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {CATEGORY_KEYS.map((k) => (
                <Pressable key={k} onPress={() => setCategory(k)} className={`rounded-lg border px-3 py-2 ${category === k ? 'border-accent bg-occ-bg' : 'border-border bg-surface'}`}>
                  <Text className={`text-[13px] font-sans-semibold ${category === k ? 'text-ok' : 'text-muted'}`}>{CATEGORY_UI[k].label}</Text>
                </Pressable>
              ))}
            </View>
            <Text className="mb-1.5 text-xs font-sans-semibold text-label">Amount (₹)</Text>
            <TextInput value={amount} onChangeText={setAmount} placeholder="14200" keyboardType="number-pad" placeholderTextColor="#9A9A8A" className={`font-mono ${input}`} />
          </View>
          <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
            <Pressable onPress={onClose} className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"><Text className="text-sm font-sans-semibold text-label">Cancel</Text></Pressable>
            <Pressable onPress={submit} className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"><Text className="text-sm font-sans-semibold text-[#F4F1E7]">Add Expense</Text></Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
