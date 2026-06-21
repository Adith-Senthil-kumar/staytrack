import { useMemo } from 'react';
import { View } from 'react-native';
import { useRooms, useTenants, useDues, useUserDoc } from '../../lib/db/hooks';
import { recordPayment } from '../../lib/db/dues';
import { vacateTenant } from '../../lib/db/tenants';
import { monthKey } from '../../lib/domain/format';
import { tenantRentLabel } from '../../lib/domain/tenants';
import { useUiStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { TenantsTable } from '../../components/tenants/TenantsTable';
import { TenantRow } from '../../components/tenants/TenantRow';
import { TenantDetailPanel } from '../../components/tenants/TenantDetailPanel';

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

  const roomById = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
  const dueByTenant = useMemo(() => new Map(dues.map((d) => [d.tenantId, d])), [dues]);
  const active = tenants.filter((t) => t.status === 'active');

  const selected = tenants.find((t) => t.id === selectedTenantId) ?? null;
  const selRoom = selected?.roomId ? roomById.get(selected.roomId) : undefined;
  const selDue = selected ? dueByTenant.get(selected.id) : undefined;

  return (
    <View>
      <TenantsTable empty={active.length === 0}>
        {active.map((t) => (
          <TenantRow key={t.id} tenant={t} roomNumber={t.roomId ? roomById.get(t.roomId)?.number ?? '—' : '—'}
            sharing={t.roomId ? roomById.get(t.roomId)?.type ?? '—' : '—'}
            rent={tenantRentLabel(dueByTenant.get(t.id), new Date(), dueDay)} onPress={() => selectTenant(t.id)} />
        ))}
      </TenantsTable>

      <TenantDetailPanel tenant={selected} roomNumber={selRoom?.number ?? '—'} roomType={selRoom?.type ?? 'single'}
        due={selDue} rentDueDay={dueDay} onClose={clearSelection}
        onRecordPayment={() => { if (uid && selDue) recordPayment(uid, selDue.id, selDue.amountDue); }}
        onVacate={() => { if (uid && selected) { vacateTenant(uid, selected); clearSelection(); } }} />
    </View>
  );
}
