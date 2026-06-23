import { View, Text, Pressable, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNarrow } from '../../lib/ui/useNarrow';
import type { RoomStatus } from '../../types';

export type StatusFilter = 'all' | RoomStatus;
const STATUS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'occupied', label: 'Occupied' }, { key: 'vacant', label: 'Vacant' },
  { key: 'pending', label: 'Pending' }, { key: 'repair', label: 'Repair' },
];

export function FilterBar({ status, floor, floors, onStatus, onFloor }: {
  status: StatusFilter; floor: number | 'all'; floors: number[];
  onStatus: (s: StatusFilter) => void; onFloor: (f: number | 'all') => void;
}) {
  const narrow = useNarrow();
  const pill = (active: boolean) => `rounded-full border px-3 py-1.5 ${active ? 'border-brand bg-brand' : 'border-border bg-surface'}`;
  const ptxt = (active: boolean) => `text-[12.5px] font-sans-semibold ${active ? 'text-[#F4F1E7]' : 'text-label'}`;
  const showClear = status !== 'all' || floor !== 'all';

  const chips = (
    <>
      <Text className="mr-1 self-center text-[11px] font-sans-semibold uppercase tracking-wider text-soft">Status</Text>
      {STATUS.map((s) => (
        <Pressable key={s.key} onPress={() => onStatus(s.key)} className={pill(status === s.key)}><Text className={ptxt(status === s.key)}>{s.label}</Text></Pressable>
      ))}
      {!narrow && <View className="mx-1.5 h-5 w-px self-center bg-border" />}
      <Pressable onPress={() => onFloor('all')} className={pill(floor === 'all')}><Text className={ptxt(floor === 'all')}>All floors</Text></Pressable>
      {floors.map((f) => (
        <Pressable key={f} onPress={() => onFloor(f)} className={pill(floor === f)}><Text className={ptxt(floor === f)}>{f}F</Text></Pressable>
      ))}
      {showClear && (
        <Pressable onPress={() => { onStatus('all'); onFloor('all'); }} className={`flex-row items-center gap-1 ${narrow ? '' : 'ml-auto'} self-center pl-2`}>
          <Text className="text-bad text-[12px] font-sans-semibold">Clear</Text>
          <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#B5462F" strokeWidth={2.4} strokeLinecap="round"><Path d="M18 6 6 18M6 6l12 12" /></Svg>
        </Pressable>
      )}
    </>
  );

  // Mobile: wrap chips onto multiple lines (no sideways scrolling). Desktop: single
  // horizontally-scrollable row, unchanged.
  if (narrow) {
    return <View className="mb-4 flex-row flex-wrap items-center gap-2">{chips}</View>;
  }
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row items-center gap-2">{chips}</View>
    </ScrollView>
  );
}
