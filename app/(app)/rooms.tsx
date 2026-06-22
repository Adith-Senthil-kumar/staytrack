import { useMemo, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useRooms, useTenants, useDues, useExpenses, useUserDoc } from '../../lib/db/hooks';
import { useUiStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { addRoom, removeRoom, setRoomType, setRoomStatus } from '../../lib/db/rooms';
import { vacateTenant, setTenantDocument, removeTenantDocument } from '../../lib/db/tenants';
import { pickAndUploadPhoto } from '../../lib/storage/photos';
import { recordPayment } from '../../lib/db/dues';
import { occupancyStats, collectionStats, marginStats } from '../../lib/domain/stats';
import { monthKey, monthName, formatINR } from '../../lib/domain/format';
import { groupByFloor, messCounts, statusCounts } from '../../lib/domain/dashboard';
import { StatCard, ProgressBar } from '../../components/dashboard/StatCard';
import { FilterBar, type StatusFilter } from '../../components/dashboard/FilterBar';
import { BuildingElevation } from '../../components/dashboard/BuildingElevation';
import { SidePanel } from '../../components/dashboard/SidePanel';
import { RoomDetailPanel } from '../../components/dashboard/RoomDetailPanel';
import { ManageRoomsModal } from '../../components/dashboard/ManageRoomsModal';
import { MoneyText } from '../../components/ui/MoneyText';

export default function Rooms() {
  const mk = monthKey(new Date());
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useRooms();
  const { tenants } = useTenants();
  const { dues } = useDues(mk);
  const { expenses } = useExpenses();
  const { userDoc } = useUserDoc();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const wide = width >= 1000;
  const dueDay = userDoc?.property?.rentDueDay ?? 5;

  const showManageRooms = useUiStore((s) => s.showManageRooms);
  const openManageRooms = useUiStore((s) => s.openManageRooms);
  const closeManageRooms = useUiStore((s) => s.closeManageRooms);
  const selectedRoomId = useUiStore((s) => s.selectedRoomId);
  const selectRoom = useUiStore((s) => s.selectRoom);
  const clearRoomSelection = useUiStore((s) => s.clearRoomSelection);
  const openAddTenant = useUiStore((s) => s.openAddTenant);
  const searchTerm = useUiStore((s) => s.searchTerm);

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

  const term = searchTerm.trim().toLowerCase();
  const filtered = useMemo(() => rooms.filter((r) =>
    (status === 'all' || r.status === status || (status === 'pending' && r.status === 'reserved')) &&
    (floor === 'all' || r.floor === floor) &&
    (!term || r.number.toLowerCase().includes(term) || (tenantByRoom.get(r.id)?.name ?? '').toLowerCase().includes(term))),
    [rooms, status, floor, term, tenantByRoom]);
  const floorGroups = groupByFloor(filtered);
  const floors = useMemo(() => [...new Set(rooms.map((r) => r.floor))].sort((a, b) => b - a), [rooms]);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;
  const tenantsInRoom = selectedRoom ? tenants.filter((t) => t.status === 'active' && t.roomId === selectedRoom.id) : [];

  const nextRoomNumber = (f: number) => {
    const onFloor = rooms.filter((r) => r.floor === f);
    return `${f}${String(onFloor.length + 1).padStart(2, '0')}`;
  };

  return (
    <View className="gap-[18px]">
      <View className={wide ? 'flex-row gap-4' : 'flex-row flex-wrap gap-4'}>
        <StatCard dot="bg-brand" title="Occupancy">
          <View className="mt-3 flex-row items-baseline gap-1.5">
            <Text className="font-mono-semibold text-[30px] text-ink">{occ.occupied}</Text>
            <Text className="font-mono text-[15px] text-soft">/ {occ.total}</Text>
            <Text className="ml-auto font-mono-semibold text-sm text-ok">{occ.percent}%</Text>
          </View>
          <ProgressBar pct={occ.percent} gradient={['#1E6F5C', '#13352C']} />
        </StatCard>
        <StatCard dot="bg-accent" title={`Collected · ${monthName(mk)}`}>
          <MoneyText amount={col.collected} className="mt-3 text-[25px]" />
          <Text className="mt-0.5 font-mono text-xs text-soft">of {col.billed ? formatINR(col.billed) : '—'} billed</Text>
          <ProgressBar pct={col.billed ? (col.collected / col.billed) * 100 : 0} />
        </StatCard>
        <StatCard dot="bg-bad" title="Pending Dues">
          <MoneyText amount={col.pending} className="mt-3 text-[25px] text-bad" />
          <Text className="mt-0.5 text-xs text-soft">{col.overdueCount} tenants overdue</Text>
          <Pressable onPress={() => router.push('/rent')}><Text className="mt-[9px] text-bad text-[12px] font-sans-semibold">Collect now →</Text></Pressable>
        </StatCard>
        <StatCard dot="bg-warn" title="Availability">
          <View className="mt-3 flex-row items-baseline gap-3.5">
            <Text className="font-mono-semibold text-[25px] text-ink">{occ.vacant}<Text className="text-xs text-soft"> vacant</Text></Text>
            <View className="h-6 w-px bg-border" />
            <Text className="font-mono-semibold text-[25px] text-warn">{occ.pending}<Text className="text-xs text-soft"> pending</Text></Text>
          </View>
          <Text className="mt-[9px] text-xs text-soft">Ready to assign</Text>
        </StatCard>
      </View>

      <FilterBar status={status} floor={floor} floors={floors} onStatus={setStatus} onFloor={setFloor} />

      <View className={wide ? 'flex-row items-start gap-4' : 'gap-4'}>
        <BuildingElevation floors={floorGroups} tenantByRoom={tenantByRoom} dueByTenant={dueByTenant}
          subtitle={`${userDoc?.property?.name ?? 'Your PG'} · ${floors.length} floors · ${rooms.length} rooms — click any room`}
          onManage={openManageRooms} onSelectRoom={(r) => selectRoom(r.id)} />
        <View className={wide ? 'w-[270px]' : ''}>
          <SidePanel collected={col.collected} potential={col.billed} outstanding={col.pending} net={margin.profit}
            status={sc} mess={mess} />
        </View>
      </View>

      <RoomDetailPanel
        room={selectedRoom}
        tenants={tenantsInRoom}
        dueByTenant={dueByTenant}
        rentDueDay={dueDay}
        onClose={clearRoomSelection}
        onAssign={(roomId) => { clearRoomSelection(); openAddTenant(roomId); }}
        onRecordPayment={(due) => { if (uid) recordPayment(uid, due.id, due.amountDue); }}
        onVacate={(t) => {
          if (!uid) return;
          const others = tenantsInRoom.some((x) => x.id !== t.id && x.status === 'active');
          vacateTenant(uid, t, !others);
          if (!others) clearRoomSelection();
        }}
        onToggleDoc={async (t, label) => {
          if (!uid) return;
          if ((t.documents ?? []).includes(label)) {
            await removeTenantDocument(uid, t, label);
          } else {
            const url = await pickAndUploadPhoto(uid, `tenants/${t.id}/${label.replace(/\s+/g, '_')}`);
            if (url) await setTenantDocument(uid, t, label, url);
          }
        }}
      />

      <ManageRoomsModal
        visible={showManageRooms}
        rooms={rooms}
        onClose={closeManageRooms}
        onAddRoom={(f) => { if (uid) addRoom(uid, { number: nextRoomNumber(f), floor: f, type: 'single', baseRent: 8000, status: 'vacant' }); }}
        onAddFloor={() => { if (uid) { const top = rooms.length ? Math.max(...rooms.map((r) => r.floor)) + 1 : 1; addRoom(uid, { number: `${top}01`, floor: top, type: 'single', baseRent: 8000, status: 'vacant' }); } }}
        onRemoveRoom={(id) => { if (uid) removeRoom(uid, id); }}
        onSetSharing={(id, sharing) => { if (uid) setRoomType(uid, id, sharing); }}
        onToggleStatus={(r) => { if (uid && r.status !== 'occupied') setRoomStatus(uid, r.id, r.status === 'repair' ? 'vacant' : 'repair'); }}
      />
    </View>
  );
}
