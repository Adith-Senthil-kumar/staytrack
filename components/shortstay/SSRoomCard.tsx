import { View, Text, Pressable } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import type { SSRoom } from '../../types';

// Status chip styles per design line 821
const CHIP: Record<string, { label: string; bg: string; dot: string; text: string }> = {
  available: { label: 'Available', bg: '#C7842A1F', dot: '#C7842A', text: '#C7842A' },
  occupied:  { label: 'Occupied',  bg: '#B5462F1F', dot: '#B5462F', text: '#B5462F' },
  cleaning:  { label: 'Cleaning',  bg: '#7C6F5B1F', dot: '#7C6F5B', text: '#7C6F5B' },
};

// Background per status (design: cardStyle)
const CARD_BG: Record<string, string> = {
  available: 'bg-surface border border-border',
  occupied:  'bg-occ-bg border border-border',
  cleaning:  'bg-pend-bg border border-border',
};

export function SSRoomCard({
  room,
  onBook,
  onCheckout,
  onClean,
  onRemove,
  onView,
}: {
  room: SSRoom;
  onBook: () => void;
  onCheckout: () => void;
  onClean: () => void;
  onRemove?: () => void;
  onView?: () => void;
}) {
  const chip = CHIP[room.status] ?? CHIP.available;
  const cardBg = CARD_BG[room.status] ?? CARD_BG.available;

  return (
    <View className={`${cardBg} min-h-[178px] rounded-[14px] p-4`}>
      {/* Header row: room number + status chip */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-mono-semibold text-[17px] text-ink">{room.number}</Text>
        <View className="flex-row items-center gap-1.5 rounded-[7px] px-2.5 py-1" style={{ backgroundColor: chip.bg }}>
          <View className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: chip.dot }} />
          <Text className="text-[11px] font-sans-semibold" style={{ color: chip.text }}>{chip.label}</Text>
        </View>
      </View>

      {/* Occupied state */}
      {room.status === 'occupied' && (
        <View className="flex-1">
          <Pressable onPress={onView} className="active:opacity-70">
            <Text className="text-[14.5px] font-sans-semibold text-text">{room.guestName}</Text>
            <View className="mt-[5px] flex-row items-center gap-1.5">
              <Text className="text-[11.5px] text-muted-2">
                {room.checkIn}{room.checkInTime ? ` ${room.checkInTime}` : ''} → {room.checkOut ?? '—'}
              </Text>
            </View>
            <Text className="mt-1 font-mono text-[12px] text-text-2">{formatINR(room.rate ?? room.dailyRate)}/day</Text>
          </Pressable>
          <View className="mt-3 flex-row gap-2">
            <Pressable
              onPress={onView}
              className="flex-1 items-center justify-center rounded-[9px] border border-border bg-surface py-[9px] active:bg-surface-2"
            >
              <Text className="text-[13px] font-sans-semibold text-label">Details</Text>
            </Pressable>
            <Pressable
              onPress={onCheckout}
              className="flex-1 items-center justify-center rounded-[9px] bg-brand py-[9px] active:bg-brand-hover"
            >
              <Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">Check Out</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Available state */}
      {room.status === 'available' && (
        <View className="flex-1">
          <View className="flex-1 justify-center">
            <Text className="text-[11px] font-sans-semibold uppercase tracking-[0.5px] text-soft">Daily Rate</Text>
            <Text className="mt-[3px] font-mono-semibold text-[22px]" style={{ color: '#C7842A' }}>
              {formatINR(room.dailyRate)}
            </Text>
          </View>
          <Pressable
            onPress={onBook}
            className="mt-3 items-center rounded-[9px] border py-[9px]"
            style={{ backgroundColor: '#C7842A1F', borderColor: '#C7842A55' }}
          >
            <Text className="text-[13px] font-sans-semibold" style={{ color: '#C7842A' }}>Book this room</Text>
          </Pressable>
          {onRemove && (
            <Pressable onPress={onRemove} className="mt-2 items-center py-1 active:opacity-70">
              <Text className="text-[11.5px] font-sans-medium text-muted-2">Remove room</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Cleaning state */}
      {room.status === 'cleaning' && (
        <View className="flex-1">
          <View className="flex-1 items-center justify-center gap-[7px]">
            {/* Broom/housekeeping icon */}
            <Text className="text-[24px] text-muted-2">🧹</Text>
            <Text className="text-center text-[12.5px] text-muted-2">Awaiting housekeeping</Text>
          </View>
          <Pressable
            onPress={onClean}
            className="mt-3 w-full items-center rounded-[9px] border border-border bg-surface py-[9px] active:bg-surface-3"
          >
            <Text className="text-[13px] font-sans-semibold text-ink">Mark Cleaned · Available</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
