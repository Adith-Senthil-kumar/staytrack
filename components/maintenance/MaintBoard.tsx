import { View, Text } from 'react-native';
import { STATUS_COL } from '../../constants/maintenance';
import { TicketCard } from './TicketCard';
import type { MaintTicket, MaintStatus } from '../../types';

export function MaintBoard({
  tickets,
  onAdvance,
}: {
  tickets: MaintTicket[];
  onAdvance: (ticket: MaintTicket) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {STATUS_COL.map((col) => {
        const colTickets = tickets.filter((t) => t.status === col.key);
        return (
          <View
            key={col.key}
            className="grow basis-full rounded-[14px] border border-border bg-surface-2 p-3.5 lg:basis-[31%]"
          >
            <View className="mb-3 flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
              <Text className="flex-1 text-[13px] font-sans-semibold text-text">{col.label}</Text>
              <View className="rounded-full bg-surface px-2 py-0.5">
                <Text className="font-mono-semibold text-[12px] text-muted">{colTickets.length}</Text>
              </View>
            </View>
            {colTickets.length === 0 ? (
              <Text className="py-4 text-center text-[13px] text-muted">Nothing here</Text>
            ) : (
              <View className="gap-2">
                {colTickets.map((t) => (
                  <TicketCard key={t.id} ticket={t} onPress={() => onAdvance(t)} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
