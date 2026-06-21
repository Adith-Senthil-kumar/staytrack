import { View, Text, type DimensionValue } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import { STATUS_UI } from '../../constants/roomStatus';

export function SidePanel({ collected, potential, outstanding, net, status, mess }: {
  collected: number; potential: number; outstanding: number; net: number;
  status: { occupied: number; pending: number; vacant: number; repair: number };
  mess: { veg: number; nonveg: number; total: number };
}) {
  const totalRooms = status.occupied + status.pending + status.vacant + status.repair || 1;
  const pct = (n: number): DimensionValue => `${(n / totalRooms) * 100}%` as DimensionValue;
  const messTotal = mess.total || 1;
  const rows: { key: keyof typeof STATUS_UI; count: number; label: string }[] = [
    { key: 'occupied', count: status.occupied, label: STATUS_UI.occupied.label },
    { key: 'pending', count: status.pending, label: 'Pending check-in' },
    { key: 'vacant', count: status.vacant, label: STATUS_UI.vacant.label },
    { key: 'repair', count: status.repair, label: 'Under maintenance' },
  ];
  return (
    <View className="gap-4">
      <View className="rounded-[14px] bg-brand p-5">
        <Text className="text-[11.5px] font-sans-semibold uppercase tracking-wider text-[#6F9588]">This Month</Text>
        <Text className="mt-2 font-mono-semibold text-[30px]" style={{ color: '#FBF8F0' }}>{formatINR(collected)}</Text>
        <Text className="mt-0.5 text-[12.5px] text-[#8FB0A5]">collected of {potential ? formatINR(potential) : '—'}</Text>
        <View className="my-4 h-px bg-[#ffffff1a]" />
        <View className="mb-2 flex-row justify-between"><Text className="text-[13px] text-[#8FB0A5]">Outstanding</Text><Text className="font-mono-semibold text-[13px]" style={{ color: '#E7B45A' }}>{formatINR(outstanding)}</Text></View>
        <View className="flex-row justify-between"><Text className="text-[13px] text-[#8FB0A5]">Net after expenses</Text><Text className="font-mono-semibold text-[13px]" style={{ color: '#FBF8F0' }}>{formatINR(net)}</Text></View>
      </View>

      <View className="rounded-[14px] border border-border bg-surface px-5 py-[18px]">
        <Text className="mb-3.5 text-[11.5px] font-sans-semibold uppercase tracking-wider text-muted-2">Room Status</Text>
        {rows.map(({ key, count, label }) => (
          <View key={key} className="mb-3 flex-row items-center gap-2.5">
            <View className={`h-2.5 w-2.5 rounded-[3px] ${STATUS_UI[key].dot}`} />
            <Text className="flex-1 text-[13px] text-text-2">{label}</Text>
            <Text className="font-mono-semibold text-sm text-ink">{count}</Text>
          </View>
        ))}
        <View className="mt-1 h-[9px] flex-row overflow-hidden rounded-md border border-border-2">
          <View className="bg-brand" style={{ width: pct(status.occupied) }} />
          <View className="bg-warn" style={{ width: pct(status.pending) }} />
          <View className="bg-st-vac" style={{ width: pct(status.vacant) }} />
          <View className="bg-bad" style={{ width: pct(status.repair) }} />
        </View>
      </View>

      <View className="rounded-[14px] border border-border bg-surface px-5 py-[18px]">
        <Text className="mb-3.5 text-[11.5px] font-sans-semibold uppercase tracking-wider text-muted-2">Mess Planning</Text>
        <View className="mb-3 flex-row gap-3">
          <View className="flex-1 rounded-[10px] bg-occ-bg p-3"><View className="flex-row items-center gap-1.5"><View className="h-2 w-2 rounded-full bg-veg" /><Text className="text-[11.5px] font-sans-medium text-label">Veg</Text></View><Text className="mt-1 font-mono-semibold text-[22px] text-veg">{mess.veg}</Text></View>
          <View className="flex-1 rounded-[10px] bg-bad-bg p-3"><View className="flex-row items-center gap-1.5"><View className="h-2 w-2 rounded-full bg-nonveg" /><Text className="text-[11.5px] font-sans-medium text-label">Non-veg</Text></View><Text className="mt-1 font-mono-semibold text-[22px] text-nonveg">{mess.nonveg}</Text></View>
        </View>
        <View className="h-2 flex-row overflow-hidden rounded-md border border-border-2">
          <View className="bg-veg" style={{ width: `${(mess.veg / messTotal) * 100}%` as DimensionValue }} />
          <View className="bg-nonveg" style={{ width: `${(mess.nonveg / messTotal) * 100}%` as DimensionValue }} />
        </View>
        <Text className="mt-2 text-[11.5px] text-soft">{mess.total} residents dining daily</Text>
      </View>
    </View>
  );
}
