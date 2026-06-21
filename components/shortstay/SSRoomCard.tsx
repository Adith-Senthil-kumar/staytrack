import { View, Text, Pressable } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import type { SSRoom } from '../../types';

const STATUS_CHIP: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: 'Available', bg: '#C7842A22', text: '#C7842A' },
  occupied: { label: 'Occupied', bg: '#B5462F22', text: '#B5462F' },
  cleaning: { label: 'Cleaning', bg: '#7C6F5B22', text: '#7C6F5B' },
};

export function SSRoomCard({
  room,
  onBook,
  onCheckout,
  onClean,
}: {
  room: SSRoom;
  onBook: () => void;
  onCheckout: () => void;
  onClean: () => void;
}) {
  const chip = STATUS_CHIP[room.status];

  return (
    <View className="min-h-[178px] rounded-[14px] border border-border bg-surface p-4">
      {/* Top row */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-mono-bold text-[17px] text-text">Room {room.number}</Text>
        <View className="rounded-[7px] px-2.5 py-1" style={{ backgroundColor: chip.bg }}>
          <Text className="text-[11px] font-sans-semibold" style={{ color: chip.text }}>{chip.label}</Text>
        </View>
      </View>

      {room.status === 'occupied' && (
        <View className="flex-1">
          <Text className="font-sans-semibold text-[15px] text-text">{room.guestName}</Text>
          <Text className="mt-1 text-[12px] text-muted">{room.checkIn} → {room.checkOut ?? '—'}</Text>
          <Text className="mt-1 text-[12px] text-muted">{formatINR(room.dailyRate)}/night</Text>
          <Pressable
            onPress={onCheckout}
            className="mt-3 items-center rounded-[9px] bg-brand py-2.5 active:bg-brand-hover"
          >
            <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Check Out</Text>
          </Pressable>
        </View>
      )}

      {room.status === 'available' && (
        <View className="flex-1 justify-between">
          <View>
            <Text className="mb-0.5 text-[10.5px] font-sans-semibold uppercase tracking-[1.2px] text-muted">Daily Rate</Text>
            <Text className="font-mono-bold text-[22px]" style={{ color: '#C7842A' }}>{formatINR(room.dailyRate)}</Text>
          </View>
          <Pressable
            onPress={onBook}
            className="mt-3 items-center rounded-[9px] border px-4 py-2.5"
            style={{ backgroundColor: '#C7842A1f', borderColor: '#C7842A55' }}
          >
            <Text className="text-[13px] font-sans-semibold" style={{ color: '#C7842A' }}>Book this room</Text>
          </Pressable>
        </View>
      )}

      {room.status === 'cleaning' && (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-center text-[13px] text-muted">Awaiting housekeeping</Text>
          <Pressable
            onPress={onClean}
            className="items-center rounded-[9px] border border-border bg-surface-2 px-4 py-2.5 active:bg-surface"
          >
            <Text className="text-[13px] font-sans-semibold text-label">Mark Cleaned · Available</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
