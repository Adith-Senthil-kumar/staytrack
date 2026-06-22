import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRooms, useTenants, useDues, useUserDoc } from '../../lib/db/hooks';
import { recordPayment } from '../../lib/db/dues';
import { vacateTenant, removeTenant, updateTenant, setTenantDocument, removeTenantDocument } from '../../lib/db/tenants';
import { pickAndUploadPhoto } from '../../lib/storage/photos';
import { monthKey } from '../../lib/domain/format';
import { tenantRentLabel } from '../../lib/domain/tenants';
import { useUiStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { confirmAction } from '../../store/confirm';
import { TenantsTable } from '../../components/tenants/TenantsTable';
import { TenantRow } from '../../components/tenants/TenantRow';
import { TenantDetailPanel } from '../../components/tenants/TenantDetailPanel';
import { EditTenantModal } from '../../components/tenants/EditTenantModal';
import type { Tenant } from '../../types';

export default function Tenants() {
  const mk = monthKey(new Date());
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const { tenants } = useTenants();
  const { dues } = useDues(mk);
  const { userDoc } = useUserDoc();
  const dueDay = userDoc?.property?.rentDueDay ?? 5;
  const selectedTenantId = useUiStore((s) => s.selectedTenantId);
  const selectTenant = useUiStore((s) => s.selectTenant);
  const clearSelection = useUiStore((s) => s.clearSelection);
  const searchTerm = useUiStore((s) => s.searchTerm);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);

  const roomById = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
  const dueByTenant = useMemo(() => new Map(dues.map((d) => [d.tenantId, d])), [dues]);
  const term = searchTerm.trim().toLowerCase();
  // Show everyone (active + vacated) so vacating doesn't make a tenant disappear;
  // active first, then vacated (shown with a muted pill). Deleting is the only
  // thing that removes a record.
  const list = tenants
    .filter((t) => !term || t.name.toLowerCase().includes(term) || t.phone.toLowerCase().includes(term) ||
      (t.roomId ? roomById.get(t.roomId)?.number ?? '' : '').toLowerCase().includes(term))
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'active' ? -1 : 1));

  const selected = tenants.find((t) => t.id === selectedTenantId) ?? null;
  const selRoom = selected?.roomId ? roomById.get(selected.roomId) : undefined;
  const selDue = selected ? dueByTenant.get(selected.id) : undefined;

  return (
    <View>
      <TenantsTable empty={list.length === 0}>
        {list.map((t) => (
          <TenantRow key={t.id} tenant={t} roomNumber={t.roomId ? roomById.get(t.roomId)?.number ?? '—' : '—'}
            sharing={t.roomId ? roomById.get(t.roomId)?.type ?? '—' : '—'}
            rent={tenantRentLabel(dueByTenant.get(t.id), new Date(), dueDay)} onPress={() => selectTenant(t.id)} />
        ))}
      </TenantsTable>

      <TenantDetailPanel tenant={selected} roomNumber={selRoom?.number ?? '—'} roomType={selRoom?.type ?? 'single'}
        due={selDue} rentDueDay={dueDay} onClose={clearSelection}
        onEdit={() => { if (selected) setEditTenant(selected); }}
        onRecordPayment={() => { if (uid && selDue) recordPayment(uid, selDue.id, selDue.amountDue); }}
        onAddDoc={async (t, label) => {
          if (!uid) return;
          const url = await pickAndUploadPhoto(uid, `tenants/${t.id}/${label.replace(/\s+/g, '_')}`);
          if (url) await setTenantDocument(uid, t, label, url);
        }}
        onRemoveDoc={(t, label) => { if (uid) removeTenantDocument(uid, t, label); }}
        onVacate={() => {
          if (!uid || !selected) return;
          const others = tenants.some((x) => x.id !== selected.id && x.status === 'active' && x.roomId === selected.roomId);
          vacateTenant(uid, selected, !others);
          clearSelection();
        }}
        onDelete={() => {
          if (!uid || !selected) return;
          const t = selected;
          const others = tenants.some((x) => x.id !== t.id && x.status === 'active' && x.roomId === t.roomId);
          confirmAction({
            title: 'Delete tenant permanently?',
            message: `${t.name} and their records will be removed for good. This can't be undone — use "Vacate Room" instead if they're just moving out.`,
            confirmLabel: 'Delete',
            danger: true,
            onConfirm: () => { removeTenant(uid, t, !others); clearSelection(); },
          });
        }} />

      <EditTenantModal tenant={editTenant} onClose={() => setEditTenant(null)}
        onSave={(id, data) => { if (uid) updateTenant(uid, id, data); }} />
    </View>
  );
}
