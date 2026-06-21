import { useMemo, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useRooms, useTenants, useDues, useExpenses, useUserDoc } from '../../lib/db/hooks';
import { useUiStore } from '../../store/ui';
import { ManagePropertyModal } from '../../components/property/ManagePropertyModal';
import { occupancyStats, collectionStats, marginStats } from '../../lib/domain/stats';
import { monthKey } from '../../lib/domain/format';
import { groupByFloor, messCounts, statusCounts } from '../../lib/domain/dashboard';
import { StatCard, ProgressBar } from '../../components/dashboard/StatCard';
import { FilterBar, type StatusFilter } from '../../components/dashboard/FilterBar';
import { BuildingElevation } from '../../components/dashboard/BuildingElevation';
import { SidePanel } from '../../components/dashboard/SidePanel';
import { MoneyText } from '../../components/ui/MoneyText';

export default function Rooms() {
  const mk = monthKey(new Date());
  const { rooms } = useRooms();
  const { tenants } = useTenants();
  const { dues } = useDues(mk);
  const { expenses } = useExpenses();
  const { userDoc } = useUserDoc();
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const dueDay = userDoc?.property?.rentDueDay ?? 5;

  const showManage = useUiStore((s) => s.showManage);
  const openManage = useUiStore((s) => s.openManage);
  const closeManage = useUiStore((s) => s.closeManage);

  const [status, setStatus] = useState<StatusFilter>('all');
  const [floor, setFloor] = useState<number | 'all'>('all');

  const occ = occupancyStats(rooms);
  const col = collectionStats(dues, new Date(), dueDay);
  const monthExpenses = useMemo(() => expenses.filter((e) => e.date.startsWith(mk)).reduce((s, e) => s + e.amount, 0), [expenses, mk]);
  const margin = marginStats(col.collected, monthExpenses);
  const mess = messCounts(tenants);
  const sc = statusCounts(rooms);

  const tenantByRoom = useMemo(() => { const m = new Map<string, (typeof tenants)[0]>(); tenants.filter((t) => t.status === 'active' && t.roomId).forEach((t) => m.set(t.roomId!, t)); return m; }, [tenants]);
  const dueByTenant = useMemo(() => { const m = new Map<string, (typeof dues)[0]>(); dues.forEach((d) => m.set(d.tenantId, d)); return m; }, [dues]);

  const filtered = useMemo(() => rooms.filter((r) =>
    (status === 'all' || r.status === status || (status === 'pending' && r.status === 'reserved')) &&
    (floor === 'all' || r.floor === floor)), [rooms, status, floor]);
  const floorGroups = groupByFloor(filtered);
  const floors = useMemo(() => [...new Set(rooms.map((r) => r.floor))].sort((a, b) => b - a), [rooms]);

  return (
    <View className="gap-[18px]">
      <View className={wide ? 'flex-row gap-4' : 'flex-row flex-wrap gap-3'}>
        <StatCard dot="bg-brand" title="Occupancy">
          <View className="mt-3 flex-row items-baseline gap-1.5">
            <Text className="font-mono-semibold text-[30px] text-ink">{occ.occupied}</Text>
            <Text className="font-mono text-[15px] text-soft">/ {occ.total}</Text>
            <Text className="ml-auto font-mono-semibold text-sm text-ok">{occ.percent}%</Text>
          </View>
          <ProgressBar pct={occ.percent} fill="bg-accent" />
        </StatCard>
        <StatCard dot="bg-accent" title={`Collected · ${mk}`}>
          <MoneyText amount={col.collected} className="mt-3 text-[25px]" />
          <Text className="mt-0.5 font-mono text-xs text-soft">of {col.billed ? `₹${col.billed}` : '—'} billed</Text>
          <ProgressBar pct={col.billed ? (col.collected / col.billed) * 100 : 0} />
        </StatCard>
        <StatCard dot="bg-bad" title="Pending Dues">
          <MoneyText amount={col.pending} className="mt-3 text-[25px] text-bad" />
          <Text className="mt-0.5 text-xs text-soft">{col.overdueCount} tenants overdue</Text>
        </StatCard>
        <StatCard dot="bg-warn" title="Availability">
          <View className="mt-3 flex-row items-baseline gap-3.5">
            <Text className="font-mono-semibold text-[25px] text-ink">{occ.vacant}<Text className="text-xs text-soft"> vacant</Text></Text>
            <Text className="font-mono-semibold text-[25px] text-warn">{occ.pending}<Text className="text-xs text-soft"> pending</Text></Text>
          </View>
        </StatCard>
      </View>

      <FilterBar status={status} floor={floor} floors={floors} onStatus={setStatus} onFloor={setFloor} />

      <View className={wide ? 'flex-row items-start gap-4' : 'gap-4'}>
        <BuildingElevation floors={floorGroups} tenantByRoom={tenantByRoom} dueByTenant={dueByTenant}
          subtitle={`${userDoc?.property?.name ?? 'Your PG'} · ${rooms.length} rooms`}
          onManage={openManage} />
        <View className={wide ? 'w-[270px]' : ''}>
          <SidePanel collected={col.collected} potential={col.billed} outstanding={col.pending} net={margin.profit}
            status={sc} mess={mess} />
        </View>
      </View>
      <ManagePropertyModal visible={showManage} onClose={closeManage} />
    </View>
  );
}
