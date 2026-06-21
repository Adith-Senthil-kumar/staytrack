import { View, Text, Pressable } from 'react-native';
import { PRIORITY_UI, MAINT_CATEGORY } from '../../constants/maintenance';
import { formatINR } from '../../lib/domain/format';
import { WrenchIcon, ImageIcon } from '../icons';
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
          <Text className="font-sans-semibold text-[11px]" style={{ color: pri.color }}>
            {pri.label}
          </Text>
        </View>
      </View>
      <Text numberOfLines={2} className="mb-2 text-[13px] leading-[18px] text-muted">
        {issue}
      </Text>
      {/* Footer chips row */}
      <View className="flex-row flex-wrap items-center gap-2">
        {/* Category chip with wrench */}
        <View className="flex-row items-center gap-1.5 rounded-md bg-surface-2 px-2 py-[3px]">
          <WrenchIcon size={11} color="#9A9A8A" />
          <Text className="text-[11.5px] text-muted-2">{MAINT_CATEGORY[category]}</Text>
        </View>
        {/* Photo chip */}
        {ticket.photo && (
          <View className="flex-row items-center gap-1">
            <ImageIcon size={12} color="#9A9A8A" />
            <Text className="text-[11.5px] text-muted-2">Photo</Text>
          </View>
        )}
        {/* Resolved cost pushed right */}
        {ticket.status === 'done' && (
          <Text className="ml-auto font-mono-semibold text-[12px] text-ok">
            {formatINR(ticket.cost)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
