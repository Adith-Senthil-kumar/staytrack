import { useState } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { useMaintenance, useVendors } from '../../lib/db/hooks';
import { addTicket, setTicketStatus } from '../../lib/db/maintenance';
import { addVendor, updateVendor, removeVendor } from '../../lib/db/vendors';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { MaintStatCards } from '../../components/maintenance/MaintStatCards';
import { MaintBoard } from '../../components/maintenance/MaintBoard';
import { LogTicketModal } from '../../components/maintenance/LogTicketModal';
import { VendorsTab } from '../../components/maintenance/VendorsTab';
import { VendorModal } from '../../components/maintenance/VendorModal';
import { ResolutionLog } from '../../components/maintenance/ResolutionLog';
import { SubTabBar } from '../../components/ui/SubTabBar';
import { NEXT_STATUS } from '../../constants/maintenance';
import type { MaintCategory, MaintPriority, MaintTicket } from '../../types';

type MainTab = 'board' | 'vendors' | 'log';

export default function Maintenance() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { tickets } = useMaintenance();
  const { vendors } = useVendors();

  const showLogTicket = useUiStore((s) => s.showLogTicket);
  const openLogTicket = useUiStore((s) => s.openLogTicket);
  const closeLogTicket = useUiStore((s) => s.closeLogTicket);

  const vendorModalId = useUiStore((s) => s.vendorModalId);
  const openAddVendor = useUiStore((s) => s.openAddVendor);
  const openEditVendor = useUiStore((s) => s.openEditVendor);
  const closeVendor = useUiStore((s) => s.closeVendor);

  const [tab, setTab] = useState<MainTab>('board');

  const onAdd = (data: {
    roomNumber: string;
    category: MaintCategory;
    issue: string;
    priority: MaintPriority;
  }) => {
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

  const editingVendor =
    vendorModalId && vendorModalId !== 'new'
      ? vendors.find((v) => v.id === vendorModalId) ?? null
      : null;

  return (
    <View>
      <MaintStatCards tickets={tickets} />

      {/* Sub-tab row + Log Ticket button */}
      <View className="mb-1 flex-row items-center gap-3">
        <View className="flex-1">
          <SubTabBar
            tabs={[
              { key: 'board', label: 'Board' },
              { key: 'vendors', label: 'Vendors' },
              { key: 'log', label: 'Resolution Log' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </View>
        <Pressable
          onPress={openLogTicket}
          className="rounded-[10px] bg-brand px-4 py-2.5 active:bg-brand-hover"
        >
          <Text className="text-sm font-sans-semibold text-[#F4F1E7]">+ Log Ticket</Text>
        </Pressable>
      </View>

      {/* Tab content */}
      {tab === 'board' && <MaintBoard tickets={tickets} onAdvance={onAdvance} />}
      {tab === 'vendors' && (
        <VendorsTab
          vendors={vendors}
          onAdd={openAddVendor}
          onEdit={openEditVendor}
          onCall={(phone) => Linking.openURL('tel:' + phone)}
        />
      )}
      {tab === 'log' && <ResolutionLog tickets={tickets} vendors={vendors} />}

      {/* Modals */}
      <LogTicketModal visible={showLogTicket} onClose={closeLogTicket} onAdd={onAdd} />
      <VendorModal
        visible={vendorModalId !== null}
        editing={editingVendor}
        onClose={closeVendor}
        onSave={(data) => {
          if (!uid) return;
          if (vendorModalId === 'new') {
            addVendor(uid, { ...data, jobs: 0 });
          } else if (vendorModalId) {
            updateVendor(uid, vendorModalId, data);
          }
          closeVendor();
        }}
        onRemove={() => {
          if (uid && vendorModalId && vendorModalId !== 'new') {
            removeVendor(uid, vendorModalId);
            closeVendor();
          }
        }}
      />
    </View>
  );
}
