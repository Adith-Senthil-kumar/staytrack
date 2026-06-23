import { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import { fmtDateShort } from '../../lib/domain/dates';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { useNarrow } from '../../lib/ui/useNarrow';
import { FileTextIcon } from '../icons';
import type { SSStay } from '../../types';

export function GuestHistoryTable({
  stays,
  onReceipt,
}: {
  stays: SSStay[];
  onReceipt: (stay: SSStay) => void;
}) {
  const [search, setSearch] = useState('');
  const narrow = useNarrow();

  const filtered = search.trim()
    ? stays.filter(
        (s) =>
          s.guestName.toLowerCase().includes(search.toLowerCase()) ||
          s.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
          s.checkIn.includes(search) ||
          s.checkOut.includes(search),
      )
    : stays;

  const head = 'text-[11px] font-sans-semibold uppercase tracking-[0.6px] text-muted-2';

  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
      {/* Table header with title + search */}
      <View className="flex-row items-center justify-between gap-3.5 border-b border-border-2 px-5 py-[15px]">
        <Text className="font-serif text-[16px] font-semibold text-ink">Guest History</Text>
        <View className="flex-row items-center gap-2 rounded-[9px] border border-border bg-field px-[11px] py-[7px]" style={{ width: 250 }}>
          {/* Search icon */}
          <Text className="text-[13px] text-soft">🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search guest, room or date…"
            placeholderTextColor="#9A9A8A"
            className="flex-1 text-[13px] text-text"
          />
        </View>
      </View>

      {narrow ? (
        filtered.length === 0 ? (
          <Text className="px-5 py-10 text-center text-[13px] text-soft">{search.trim() ? 'No guests match your search.' : 'No guests yet.'}</Text>
        ) : (
          <View>
            {filtered.map((stay) => (
              <View key={stay.id} className="flex-row items-center gap-3 border-b border-border-3 px-5 py-3.5">
                <View className="h-9 w-9 flex-none items-center justify-center rounded-[9px]" style={{ backgroundColor: avatarColor(stay.guestName) }}>
                  <Text className="text-[12px] font-sans-semibold text-[#FBF8F0]">{initials(stay.guestName)}</Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text numberOfLines={1} className="text-[13.5px] font-sans-semibold text-text">{stay.guestName}</Text>
                  <Text className="mt-0.5 text-[11.5px] text-text-2"><Text className="font-mono" style={{ color: '#C7842A' }}>{stay.roomNumber}</Text> · {fmtDateShort(stay.checkIn)} → {fmtDateShort(stay.checkOut)} · {stay.nights}N</Text>
                  <Text className="mt-0.5 font-mono-semibold text-[12.5px] text-ink">{formatINR(stay.total)}</Text>
                </View>
                <Pressable onPress={() => onReceipt(stay)} className="flex-none flex-row items-center gap-1.5 rounded-[8px] border border-border bg-surface-2 px-3 py-[7px] active:bg-surface-3">
                  <FileTextIcon size={13} color="#13352C" />
                  <Text className="text-[12px] font-sans-semibold text-ink">Receipt</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )
      ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[660px] grow">
          {/* Column headers per design line 867–868 — 2fr 0.7fr 1.5fr 0.8fr 1fr 1fr */}
          <View className="flex-row items-center gap-3.5 border-b border-border bg-surface-2 px-5 py-3">
            <Text className={`${head}`} style={{ flex: 2 }}>Guest</Text>
            <Text className={`${head}`} style={{ flex: 0.7 }}>Room</Text>
            <Text className={`${head}`} style={{ flex: 1.5 }}>Stay</Text>
            <Text className={`${head}`} style={{ flex: 0.8 }}>Nights</Text>
            <Text className={`${head}`} style={{ flex: 1 }}>Paid</Text>
            <Text className={`${head} text-right`} style={{ flex: 1 }}>Receipt</Text>
          </View>

          {filtered.length === 0 ? (
            <Text className="px-5 py-10 text-center text-[13px] text-soft">
              {search.trim() ? 'No guests match your search.' : 'No guests yet.'}
            </Text>
          ) : (
            filtered.map((stay) => {
              const bg = avatarColor(stay.guestName);
              const ini = initials(stay.guestName);
              return (
                <View
                  key={stay.id}
                  className="flex-row items-center gap-3.5 border-b border-border-3 px-5 py-3 active:bg-surface-3"
                >
                  {/* Guest column with avatar — rounded-[9px] per design line 873 */}
                  <View className="flex-row items-center gap-[11px]" style={{ flex: 2, minWidth: 0 }}>
                    <View
                      className="h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                      style={{ backgroundColor: bg }}
                    >
                      <Text className="text-[12px] font-sans-semibold text-[#FBF8F0]">{ini}</Text>
                    </View>
                    <Text className="text-[13.5px] font-sans-semibold text-text" numberOfLines={1}>{stay.guestName}</Text>
                  </View>

                  {/* Room — amber color per design line 876 */}
                  <Text className="font-mono-semibold text-[13px]" style={{ flex: 0.7, color: '#C7842A' }}>
                    {stay.roomNumber}
                  </Text>

                  {/* Stay range — mono, text-2 per design line 877 */}
                  <Text className="font-mono text-[12px] text-text-2" style={{ flex: 1.5 }}>
                    {stay.checkIn} → {stay.checkOut}
                  </Text>

                  {/* Nights — muted-2 per design line 878 */}
                  <Text className="text-[12.5px] text-muted-2" style={{ flex: 0.8 }}>
                    {stay.nights}N
                  </Text>

                  {/* Paid — mono, ink per design line 879 */}
                  <Text className="font-mono-semibold text-[13px] text-ink" style={{ flex: 1 }}>
                    {formatINR(stay.total)}
                  </Text>

                  {/* Receipt button per design line 880 */}
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Pressable
                      onPress={() => onReceipt(stay)}
                      className="rounded-[8px] border border-border bg-surface-2 px-3 py-[6px] active:bg-surface-3"
                    >
                      <Text className="text-[12px] font-sans-semibold text-ink">Receipt</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      )}
    </View>
  );
}
