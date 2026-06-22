import { useState } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { useMaintenance, useVendors, useRooms } from '../../lib/db/hooks';
import { addTicket, startTicket, resolveTicket, reopenTicket, removeTicket, setTicketPhoto } from '../../lib/db/maintenance';
import { pickAndUploadPhoto, uploadPhoto } from '../../lib/storage/photos';
import { addVendor, updateVendor, removeVendor } from '../../lib/db/vendors';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { MaintStatCards } from '../../components/maintenance/MaintStatCards';
import { MaintBoard } from '../../components/maintenance/MaintBoard';
import { LogTicketModal } from '../../components/maintenance/LogTicketModal';
import { TicketDetailPanel } from '../../components/maintenance/TicketDetailPanel';
import { VendorsTab } from '../../components/maintenance/VendorsTab';
import { VendorModal } from '../../components/maintenance/VendorModal';
import { ResolutionLog } from '../../components/maintenance/ResolutionLog';
import { SubTabBar } from '../../components/ui/SubTabBar';
import type { MaintCategory, MaintPriority, MaintTicket } from '../../types';

type MainTab = 'board' | 'vendors' | 'log';

export default function Maintenance() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { tickets } = useMaintenance();
  const { vendors } = useVendors();
  const { rooms } = useRooms();

  const showLogTicket = useUiStore((s) => s.showLogTicket);
  const openLogTicket = useUiStore((s) => s.openLogTicket);
  const closeLogTicket = useUiStore((s) => s.closeLogTicket);

  const vendorModalId = useUiStore((s) => s.vendorModalId);
  const openAddVendor = useUiStore((s) => s.openAddVendor);
  const openEditVendor = useUiStore((s) => s.openEditVendor);
  const closeVendor = useUiStore((s) => s.closeVendor);

  const selectedTicketId = useUiStore((s) => s.selectedTicketId);
  const selectTicket = useUiStore((s) => s.selectTicket);
  const clearTicketSelection = useUiStore((s) => s.clearTicketSelection);

  const [tab, setTab] = useState<MainTab>('board');

  const onAdd = async (data: {
    roomNumber: string;
    category: MaintCategory;
    issue: string;
    priority: MaintPriority;
    vendorId: string | null;
    photoUri: string | null;
  }) => {
    if (!uid) return;
    const { photoUri, ...rest } = data;
    const ref = await addTicket(uid, {
      ...rest,
      status: 'open',
      createdDate: new Date().toISOString().slice(0, 10),
      cost: 0,
      resolvedDate: null,
      photoUrl: null,
    });
    // Upload the picked image now that the ticket has an id, then link it.
    if (photoUri) {
      try {
        const url = await uploadPhoto(uid, `maintenance/${ref.id}`, photoUri);
        await setTicketPhoto(uid, ref.id, url);
      } catch { /* leave the ticket without a photo if upload fails */ }
    }
  };

  const editingVendor =
    vendorModalId && vendorModalId !== 'new'
      ? vendors.find((v) => v.id === vendorModalId) ?? null
      : null;

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

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
          <Text className="font-sans-semibold text-sm text-[#F4F1E7]">+ Log Ticket</Text>
        </Pressable>
      </View>

      {/* Tab content */}
      {tab === 'board' && (
        <MaintBoard
          tickets={tickets}
          onSelect={(t) => selectTicket(t.id)}
        />
      )}
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
      <LogTicketModal
        visible={showLogTicket}
        onClose={closeLogTicket}
        onAdd={onAdd}
        vendors={vendors}
        rooms={rooms}
      />
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

      {/* Ticket Detail Panel */}
      <TicketDetailPanel
        ticket={selectedTicket}
        vendors={vendors}
        onClose={clearTicketSelection}
        onStart={(id) => {
          if (uid) startTicket(uid, id);
        }}
        onResolve={(t, cost, vn) => {
          if (uid) resolveTicket(uid, t, cost, vn);
        }}
        onReopen={(id) => {
          if (uid) reopenTicket(uid, id);
        }}
        onDelete={(id) => { if (uid) { removeTicket(uid, id); clearTicketSelection(); } }}
        onAttachPhoto={async (t) => {
          if (!uid) return;
          const url = await pickAndUploadPhoto(uid, `maintenance/${t.id}`);
          if (url) setTicketPhoto(uid, t.id, url);
        }}
        onRemovePhoto={(id) => { if (uid) setTicketPhoto(uid, id, null); }}
        onCallVendor={(phone) => Linking.openURL('tel:' + phone)}
      />
    </View>
  );
}
