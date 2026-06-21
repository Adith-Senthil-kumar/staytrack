import { View, Text, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MAINT_CATEGORY } from '../../constants/maintenance';
import { formatINR } from '../../lib/domain/format';
import { AlertTriangleIcon } from '../icons';
import type { MaintTicket, Vendor } from '../../types';

export function ResolutionLog({
  tickets,
  vendors,
}: {
  tickets: MaintTicket[];
  vendors: Vendor[];
}) {
  const resolved = tickets.filter((t) => t.status === 'done');

  // Compute repeat trouble spots: rooms with ≥2 tickets across ALL tickets
  const roomCounts = new Map<string, number>();
  for (const t of tickets) {
    roomCounts.set(t.roomNumber, (roomCounts.get(t.roomNumber) ?? 0) + 1);
  }
  const troubleRooms = [...roomCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  return (
    <View className="flex-col gap-4 lg:flex-row lg:items-start">
      {/* LEFT — resolved tickets table */}
      <View className="lg:flex-1">
        <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
          <View className="border-b border-border px-[22px] py-3.5">
            <Text className="font-serif text-base text-ink">Resolved Tickets</Text>
          </View>

          {resolved.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-[13px] text-soft">No resolved tickets yet.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ minWidth: 620 }}>
                {/* Table header */}
                <View className="flex-row gap-3.5 items-center border-b border-border bg-surface-2 px-[22px] py-3">
                  <Text
                    className="text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2"
                    style={{ width: 56 }}
                  >
                    Room
                  </Text>
                  <Text className="flex-1 text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">
                    Issue
                  </Text>
                  <Text
                    className="text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2"
                    style={{ width: 96 }}
                  >
                    Vendor
                  </Text>
                  <Text
                    className="text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2"
                    style={{ width: 80 }}
                  >
                    Resolved
                  </Text>
                  <Text
                    className="text-right text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2"
                    style={{ width: 64 }}
                  >
                    Cost
                  </Text>
                </View>

                {/* Rows */}
                {resolved.map((t) => {
                  const vendorName = vendors.find((v) => v.id === t.vendorId)?.name ?? '—';
                  return (
                    <View
                      key={t.id}
                      className="flex-row gap-3.5 items-center border-b border-border-3 px-[22px] py-3"
                    >
                      <Text
                        className="font-mono-semibold text-[13px] text-ink"
                        style={{ width: 56 }}
                      >
                        {t.roomNumber}
                      </Text>
                      <View className="flex-1">
                        <Text numberOfLines={1} className="text-[13px] text-text-2">
                          {t.issue}
                        </Text>
                        <Text className="text-[11.5px] text-muted-2">
                          {MAINT_CATEGORY[t.category]}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-[12.5px] text-text-2"
                        style={{ width: 96 }}
                      >
                        {vendorName}
                      </Text>
                      <Text
                        className="font-mono text-[12.5px] text-muted-2"
                        style={{ width: 80 }}
                      >
                        {t.resolvedDate ?? '—'}
                      </Text>
                      <Text
                        className="font-mono-semibold text-right text-[13px] text-ink"
                        style={{ width: 64 }}
                      >
                        {formatINR(t.cost)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      {/* RIGHT — repeat trouble spots */}
      <View className="lg:w-[270px]">
        <View className="rounded-[14px] border border-border bg-surface px-5 py-[18px]">
          {/* Header */}
          <View className="mb-3 flex-row items-center gap-2">
            <AlertTriangleIcon size={14} color="#B5462F" />
            <Text className="text-[11.5px] font-sans-semibold uppercase tracking-wide text-muted-2">
              REPEAT TROUBLE SPOTS
            </Text>
          </View>

          {troubleRooms.map(([room, count]) => (
            <View key={room} className="mb-2.5 flex-row items-center gap-2.5">
              <View className="rounded-[7px] border border-maint-bd bg-maint-bg px-2.5 py-[3px]">
                <Text className="font-mono-semibold text-[13px] text-ink">{room}</Text>
              </View>
              <Text className="flex-1 text-[12.5px] text-text-2">{count} tickets logged</Text>
            </View>
          ))}

          <Text className="mt-1.5 text-[11.5px] text-soft">
            Rooms with recurring issues — consider a deeper fix or replacement.
          </Text>
        </View>
      </View>
    </View>
  );
}
