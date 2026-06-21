import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, ScrollView } from 'react-native';
import type { SSRoom } from '../../types';

type IdType = 'aadhaar' | 'passport' | 'licence';
type PayMethod = 'upi' | 'cash';

export function BookingModal({
  visible,
  availableRooms,
  presetRoomId,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  availableRooms: SSRoom[];
  presetRoomId: string | null;
  onClose: () => void;
  onConfirm: (data: { roomId: string; guestName: string; checkIn: string; checkOut: string }) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState<IdType>('aadhaar');
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState('');
  const [rate, setRate] = useState('');
  const [advance, setAdvance] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('upi');

  useEffect(() => {
    if (visible) {
      setRoomId(presetRoomId ?? (availableRooms[0]?.id ?? ''));
      setCheckIn(today);
      // pre-fill rate from preset room
      const preRoom = presetRoomId ? availableRooms.find((r) => r.id === presetRoomId) : availableRooms[0];
      setRate(preRoom ? String(preRoom.dailyRate) : '');
    }
  }, [visible, presetRoomId]);

  // When room selection changes, update rate
  const handleRoomChange = (id: string) => {
    setRoomId(id);
    const r = availableRooms.find((rm) => rm.id === id);
    if (r) setRate(String(r.dailyRate));
  };

  const reset = () => {
    setGuestName(''); setPhone(''); setIdType('aadhaar');
    setRoomId(''); setCheckIn(today); setCheckOut('');
    setRate(''); setAdvance(''); setPayMethod('upi');
  };

  const close = () => { reset(); onClose(); };

  const canSubmit = !!guestName.trim() && !!roomId && !!checkIn && !!checkOut;

  const submit = () => {
    if (!canSubmit) return;
    onConfirm({ roomId, guestName: guestName.trim(), checkIn, checkOut });
    reset();
    onClose();
  };

  const inp = 'rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text';
  const lbl = 'mb-1.5 text-[12px] font-sans-semibold text-label';
  const idBtn = (active: boolean) =>
    `rounded-[8px] border px-4 py-[9px] text-[13.5px] font-sans-semibold ${active ? 'border-[#C7842A55] bg-[#C7842A1F] text-[#C7842A]' : 'border-border bg-surface text-label'}`;
  const pmBtn = (active: boolean) =>
    `rounded-[8px] border px-4 py-[9px] text-[13.5px] font-sans-semibold ${active ? 'border-ok bg-occ-bg text-ok' : 'border-border bg-surface text-label'}`;

  const selectedRoom = availableRooms.find((r) => r.id === roomId);

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="max-h-[92%] w-full max-w-[580px] overflow-hidden rounded-[18px] bg-surface">
          {/* Amber header per design line 1249 */}
          <View className="px-[26px] py-[22px]" style={{ backgroundColor: '#C7842A' }}>
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Short-Stay · Walk-in
            </Text>
            <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">New Booking</Text>
            <Pressable
              onPress={close}
              className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)]"
            >
              <Text className="text-[15px] leading-none text-[#FBF8F0]">✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerClassName="px-[26px] pb-2 pt-6">
            {/* Row 1: Guest Name + Phone */}
            <View className="mb-4 flex-row gap-3.5">
              <View className="flex-1">
                <Text className={lbl}>Guest Name</Text>
                <TextInput
                  value={guestName}
                  onChangeText={setGuestName}
                  placeholder="e.g. Vikram Anand"
                  placeholderTextColor="#9A9A8A"
                  className={inp}
                />
              </View>
              <View className="flex-1">
                <Text className={lbl}>Phone</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98xxx xxxxx"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${inp}`}
                />
              </View>
            </View>

            {/* ID Type */}
            <Text className={lbl}>ID Type</Text>
            <View className="mb-4 flex-row gap-2.5">
              <Pressable onPress={() => setIdType('aadhaar')} className={idBtn(idType === 'aadhaar')}>
                <Text className={`text-[13.5px] font-sans-semibold ${idType === 'aadhaar' ? 'text-[#C7842A]' : 'text-label'}`}>Aadhaar</Text>
              </Pressable>
              <Pressable onPress={() => setIdType('passport')} className={idBtn(idType === 'passport')}>
                <Text className={`text-[13.5px] font-sans-semibold ${idType === 'passport' ? 'text-[#C7842A]' : 'text-label'}`}>Passport</Text>
              </Pressable>
              <Pressable onPress={() => setIdType('licence')} className={idBtn(idType === 'licence')}>
                <Text className={`text-[13.5px] font-sans-semibold ${idType === 'licence' ? 'text-[#C7842A]' : 'text-label'}`}>Driving Licence</Text>
              </Pressable>
            </View>

            {/* Room selector */}
            <Text className={lbl}>Room</Text>
            {availableRooms.length === 0 ? (
              <View className="mb-4 rounded-[9px] border border-dashed border-border bg-surface-2 px-[13px] py-[11px]">
                <Text className="text-[13px] text-soft">No short-stay rooms available right now.</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mb-4 flex-row gap-2">
                {availableRooms.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => handleRoomChange(r.id)}
                    className={`rounded-[9px] border px-3 py-[11px] ${roomId === r.id ? 'border-[#C7842A55] bg-[#C7842A1F]' : 'border-border bg-surface'}`}
                  >
                    <Text className={`font-mono text-[13px] ${roomId === r.id ? 'text-[#C7842A]' : 'text-label'}`}>{r.number}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Check-in / Time / Check-out */}
            <View className="mb-4 flex-row gap-3.5">
              <View style={{ flex: 1.3 }}>
                <Text className={lbl}>Check-in Date</Text>
                <TextInput
                  value={checkIn}
                  onChangeText={setCheckIn}
                  placeholder="2026-06-20"
                  placeholderTextColor="#9A9A8A"
                  className={inp}
                />
              </View>
              <View style={{ flex: 0.9 }}>
                <Text className={lbl}>Time</Text>
                <TextInput
                  placeholder="14:00"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${inp}`}
                />
              </View>
              <View style={{ flex: 1.3 }}>
                <Text className={lbl}>Expected Check-out</Text>
                <TextInput
                  value={checkOut}
                  onChangeText={setCheckOut}
                  placeholder="2026-06-22"
                  placeholderTextColor="#9A9A8A"
                  className={inp}
                />
              </View>
            </View>

            {/* Rate + Advance */}
            <View className="mb-4 flex-row gap-3.5">
              <View className="flex-1">
                <Text className={lbl}>Rate per Day (₹)</Text>
                <TextInput
                  value={rate}
                  onChangeText={setRate}
                  placeholder="1200"
                  keyboardType="number-pad"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${inp}`}
                />
              </View>
              <View className="flex-1">
                <Text className={lbl}>Advance Collected (₹)</Text>
                <TextInput
                  value={advance}
                  onChangeText={setAdvance}
                  placeholder="1500"
                  keyboardType="number-pad"
                  placeholderTextColor="#9A9A8A"
                  className={`font-mono ${inp}`}
                />
              </View>
            </View>

            {/* Payment Method */}
            <Text className={lbl}>Advance Payment Method</Text>
            <View className="mb-2 flex-row gap-2.5">
              <Pressable onPress={() => setPayMethod('upi')} className={pmBtn(payMethod === 'upi')}>
                <Text className={`text-[13.5px] font-sans-semibold ${payMethod === 'upi' ? 'text-ok' : 'text-label'}`}>UPI</Text>
              </Pressable>
              <Pressable onPress={() => setPayMethod('cash')} className={pmBtn(payMethod === 'cash')}>
                <Text className={`text-[13.5px] font-sans-semibold ${payMethod === 'cash' ? 'text-ok' : 'text-label'}`}>Cash</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 border-t border-border px-[26px] py-[14px]" style={{ paddingBottom: 24 }}>
            <Pressable
              onPress={close}
              className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"
            >
              <Text className="text-sm font-sans-semibold text-label">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={!canSubmit}
              className="flex-1 items-center rounded-[10px] py-3"
              style={{ backgroundColor: '#C7842A', opacity: canSubmit ? 1 : 0.45 }}
            >
              <Text className="text-sm font-sans-semibold text-[#FBF8F0]">Confirm Check-in</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
