import { View, Text, Pressable } from 'react-native';
import { PRIORITY_UI, MAINT_CATEGORY } from '../../constants/maintenance';
import type { MaintTicket } from '../../types';

export function TicketCard({ ticket, onPress }: { ticket: MaintTicket; onPress: () => void }) {
  const { roomNumber, priority, issue, category } = ticket;
  const pri = PRIORITY_UI[priority];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-[11px] border border-border bg-surface p-3.5 active:border-brand"
    >
      <View className="mb-2 flex-row items-center justify-between gap-2">
        <Text className="font-mono-semibold text-[13px] text-text">Room {roomNumber}</Text>
        <View
          className="rounded-[6px] px-2 py-0.5"
          style={{ backgroundColor: pri.color + '22' }}
        >
          <Text className="text-[11px] font-sans-semibold" style={{ color: pri.color }}>
            {pri.label}
          </Text>
        </View>
      </View>
      <Text numberOfLines={2} className="mb-2 text-[13px] text-muted leading-[18px]">
        {issue}
      </Text>
      <View className="flex-row">
        <View className="rounded-[6px] border border-border bg-surface-2 px-2 py-0.5">
          <Text className="text-[11px] font-sans-medium text-muted">{MAINT_CATEGORY[category]}</Text>
        </View>
      </View>
    </Pressable>
  );
}
