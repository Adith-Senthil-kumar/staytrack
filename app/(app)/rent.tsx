import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRooms, useTenants, useDues, useUserDoc } from '../../lib/db/hooks';
import { recordPayment } from '../../lib/db/dues';
import { collectionStats } from '../../lib/domain/stats';
import { monthKey, monthName } from '../../lib/domain/format';
import { tenantRentLabel } from '../../lib/domain/tenants';
import { useUiStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { RentStatCards } from '../../components/rent/RentStatCards';
import { RentTable } from '../../components/rent/RentTable';
import { RentRow } from '../../components/rent/RentRow';
import { RecordPaymentModal } from '../../components/rent/RecordPaymentModal';
import { RentReceiptModal } from '../../components/rent/RentReceiptModal';
import type { PaymentMethod } from '../../types';

export default function Rent() {
  const mk = monthKey(new Date());
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const { tenants } = useTenants();
  const { dues } = useDues(mk);
  const { userDoc } = useUserDoc();
  const dueDay = userDoc?.property?.rentDueDay ?? 5;
  const payDueId = useUiStore((s) => s.payDueId);
  const openPay = useUiStore((s) => s.openPay);
  const closePay = useUiStore((s) => s.closePay);

  const roomById = useMemo(() => new Map<string, (typeof rooms)[number]>(rooms.map((r) => [r.id, r])), [rooms]);
  const dueByTenant = useMemo(() => new Map<string, (typeof dues)[number]>(dues.map((d) => [d.tenantId, d])), [dues]);
  const active = tenants.filter((t) => t.status === 'active');
  const col = collectionStats(dues, new Date(), dueDay);

  const payDue = dues.find((d) => d.id === payDueId) ?? null;
  const payTenant = payDue ? tenants.find((t) => t.id === payDue.tenantId) ?? null : null;
  const payRoom = payTenant?.roomId ? roomById.get(payTenant.roomId) : undefined;

  // Rent-receipt modal (paid tenants only)
  const [receiptTenantId, setReceiptTenantId] = useState<string | null>(null);
  const rcptTenant = receiptTenantId ? tenants.find((t) => t.id === receiptTenantId) ?? null : null;
  const rcptDue = rcptTenant ? dueByTenant.get(rcptTenant.id) ?? null : null;
  const rcptRoom = rcptTenant?.roomId ? roomById.get(rcptTenant.roomId) : undefined;

  const confirm = (method: PaymentMethod) => {
    if (uid && payDue) recordPayment(uid, payDue.id, payDue.amountDue, method);
    closePay();
  };

  return (
    <View>
      <RentStatCards collected={col.collected} outstanding={col.pending} billed={col.billed} overdueCount={col.overdueCount} monthLabel={monthName(mk)} />
      <RentTable empty={active.length === 0}>
        {active.map((t) => {
          const due = dueByTenant.get(t.id);
          const isDue = !!due && due.amountPaid < due.amountDue;
          return (
            <RentRow key={t.id} tenant={t} roomNumber={t.roomId ? roomById.get(t.roomId)?.number ?? '—' : '—'}
              rent={tenantRentLabel(due, new Date(), dueDay)} isDue={isDue}
              onCollect={() => due && openPay(due.id)}
              onReceipt={due && due.amountPaid > 0 ? () => setReceiptTenantId(t.id) : undefined} />
          );
        })}
      </RentTable>

      <RecordPaymentModal tenant={payTenant} roomNumber={payRoom?.number ?? '—'} due={payDue} monthLabel={mk}
        onClose={closePay} onConfirm={confirm} />

      <RentReceiptModal tenant={rcptTenant} roomNumber={rcptRoom?.number ?? '—'} due={rcptDue}
        monthLabel={monthName(mk)} propertyName={userDoc?.property?.name ?? 'PG'}
        onClose={() => setReceiptTenantId(null)} />
    </View>
  );
}
