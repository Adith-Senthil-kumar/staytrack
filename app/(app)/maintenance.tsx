import { View, Text, Pressable } from 'react-native';
import { useMaintenance } from '../../lib/db/hooks';
import { addTicket, setTicketStatus } from '../../lib/db/maintenance';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { MaintStatCards } from '../../components/maintenance/MaintStatCards';
import { MaintBoard } from '../../components/maintenance/MaintBoard';
import { LogTicketModal } from '../../components/maintenance/LogTicketModal';
import { NEXT_STATUS } from '../../constants/maintenance';
import type { MaintCategory, MaintPriority, MaintTicket } from '../../types';

export default function Maintenance() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { tickets } = useMaintenance();
  const showLogTicket = useUiStore((s) => s.showLogTicket);
  const openLogTicket = useUiStore((s) => s.openLogTicket);
  const closeLogTicket = useUiStore((s) => s.closeLogTicket);

  const onAdd = (data: { roomNumber: string; category: MaintCategory; issue: string; priority: MaintPriority }) => {
    if (!uid) return;
    addTicket(uid, {
      ...data,
      status: 'open',
      createdDate: new Date().toISOString().slice(0, 10),
      cost: 0,
    });
  };

  const onAdvance = (ticket: MaintTicket) => {
    if (!uid) return;
    setTicketStatus(uid, ticket.id, NEXT_STATUS[ticket.status]);
  };

  return (
    <View>
      <MaintStatCards tickets={tickets} />
      <View className="mb-4 flex-row items-center justify-end">
        <Pressable
          onPress={openLogTicket}
          className="rounded-[10px] bg-brand px-4 py-2.5 active:bg-brand-hover"
        >
          <Text className="text-sm font-sans-semibold text-[#F4F1E7]">+ Log Ticket</Text>
        </Pressable>
      </View>
      <MaintBoard tickets={tickets} onAdvance={onAdvance} />
      <LogTicketModal visible={showLogTicket} onClose={closeLogTicket} onAdd={onAdd} />
    </View>
  );
}
