import { View, Text, ScrollView, Pressable } from 'react-native';
import { formatINR } from '../../lib/domain/format';
import { initials, avatarColor } from '../../lib/domain/tenants';
import type { SSStay } from '../../types';

export function GuestHistoryTable({ stays }: { stays: SSStay[] }) {
  const head = 'text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2';

  return (
    <View className="overflow-hidden rounded-[14px] border border-border bg-surface">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="grow">
        <View className="min-w-[620px] grow">
          <View className="flex-row gap-3.5 border-b border-border bg-surface-2 px-[22px] py-3">
            <Text className={`flex-1 ${head}`}>Guest</Text>
            <Text className={`w-16 ${head}`}>Room</Text>
            <Text className={`w-[140px] ${head}`}>Stay</Text>
            <Text className={`w-14 ${head}`}>Nights</Text>
            <Text className={`w-24 ${head}`}>Paid</Text>
            <Text className={`w-20 ${head}`}>Receipt</Text>
          </View>
          {stays.length === 0 ? (
            <Text className="px-[22px] py-12 text-center text-[13.5px] text-soft">No guests yet.</Text>
          ) : (
            stays.map((stay) => {
              const bg = avatarColor(stay.guestName);
              const ini = initials(stay.guestName);
              return (
                <View key={stay.id} className="flex-row items-center gap-3.5 border-b border-border px-[22px] py-3.5">
                  <View className="flex-1 flex-row items-center gap-2.5">
                    <View
                      className="h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: bg }}
                    >
                      <Text className="text-[12px] font-sans-bold text-[#FBF8F0]">{ini}</Text>
                    </View>
                    <Text className="text-[13.5px] font-sans-semibold text-text" numberOfLines={1}>{stay.guestName}</Text>
                  </View>
                  <Text className="w-16 font-mono-semibold text-[13px] text-muted">#{stay.roomNumber}</Text>
                  <Text className="w-[140px] text-[12px] text-muted">{stay.checkIn} → {stay.checkOut}</Text>
                  <Text className="w-14 font-mono-semibold text-[13px] text-text">{stay.nights}N</Text>
                  <Text className="w-24 font-mono-semibold text-[13px] text-ok">{formatINR(stay.total)}</Text>
                  <View className="w-20 items-start">
                    <Pressable className="rounded-[7px] border border-border bg-surface-2 px-2.5 py-1.5 active:bg-surface">
                      <Text className="text-[11px] font-sans-semibold text-muted">Receipt</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
