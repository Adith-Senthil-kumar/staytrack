import { useState } from 'react';
import { View, Text, Pressable, Linking, Modal as RNModal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { formatINR } from '../../lib/domain/format';
import { bookingFinancials } from '../../lib/domain/shortstay';
import { PhoneIcon } from '../icons';
import type { SSRoom } from '../../types';

const ID_LABEL: Record<string, string> = { aadhaar: 'Aadhaar', passport: 'Passport', licence: 'Driving Licence' };

// Read-only view of an occupied short-stay room: full guest + booking details,
// the ID scan (tap to enlarge), and a live balance as of today.
export function SSRoomDetailModal({ room, onClose, onCheckout }: {
  room: SSRoom | null;
  onClose: () => void;
  onCheckout: (room: SSRoom) => void;
}) {
  const [viewId, setViewId] = useState(false);
  if (!room) return null;

  const today = new Date().toISOString().slice(0, 10);
  const { nights, rate, total, advance, balance } = bookingFinancials(room, today);
  // NativeWind doesn't reliably emit arbitrary-% min-width, so size the cells with
  // an inline flexBasis (≈ two per row) and let them grow to fill the gap.
  const cell = (label: string, value: string, mono = false) => (
    <View style={{ flexGrow: 1, flexBasis: 150, minWidth: 150 }} className="rounded-[10px] bg-surface-3 p-3">
      <Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">{label}</Text>
      <Text className={`mt-1 text-[14px] text-text ${mono ? 'font-mono-semibold' : 'font-sans-semibold'}`}>{value}</Text>
    </View>
  );

  return (
    <>
      <RNModal visible transparent animationType="fade" onRequestClose={onClose}>
        <Pressable onPress={onClose} className="flex-1 items-center justify-center bg-overlay p-6">
          <Pressable onPress={() => {}} className="max-h-[92%] w-[440px] max-w-full overflow-hidden rounded-[18px] bg-surface">
            {/* Amber header */}
            <View className="px-[26px] py-[22px]" style={{ backgroundColor: '#C7842A' }}>
              <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#ffffffb3]">Occupied · Room {room.number}</Text>
              <Text className="mt-1 font-serif text-[21px] text-[#FBF8F0]">{room.guestName}</Text>
              <Text className="text-[12.5px] text-[#ffffffc7]">short-stay guest</Text>
              <Pressable onPress={onClose} style={{ zIndex: 10 }} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff40] bg-[#ffffff1f]">
                <Text className="text-[14px] font-sans-semibold text-[#FBF8F0]">✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerClassName="px-[26px] py-[22px]">
              {/* Phone + ID */}
              <View className="flex-row gap-2.5">
                {room.phone ? (
                  <Pressable onPress={() => Linking.openURL(`tel:${room.phone}`)} className="flex-1 flex-row items-center justify-center gap-2 rounded-[9px] bg-brand py-[10px] active:bg-brand-hover">
                    <PhoneIcon size={14} color="#F4F1E7" /><Text className="text-[13px] font-sans-semibold text-[#F4F1E7]">{room.phone}</Text>
                  </Pressable>
                ) : (
                  <View className="flex-1 items-center rounded-[9px] bg-surface-3 py-[10px]"><Text className="text-[13px] text-soft">No phone on file</Text></View>
                )}
              </View>

              {/* ID document */}
              <View className="mt-3 flex-row items-center gap-3 rounded-[10px] border border-border bg-surface p-3">
                <View className="flex-1">
                  <Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-soft">ID Document</Text>
                  <Text className="mt-1 text-[13.5px] font-sans-semibold text-text">{ID_LABEL[room.idType ?? ''] ?? room.idType ?? 'Not recorded'}</Text>
                </View>
                {room.idPhotoUrl ? (
                  <Pressable onPress={() => setViewId(true)} className="active:opacity-70">
                    <Image source={{ uri: room.idPhotoUrl }} style={{ width: 64, height: 44, borderRadius: 6 }} contentFit="cover" />
                  </Pressable>
                ) : (
                  <Text className="text-[12px] text-soft">No scan</Text>
                )}
              </View>

              {/* Booking grid */}
              <View className="mt-3 flex-row flex-wrap gap-2.5">
                {cell('Check-in', room.checkInTime ? `${room.checkIn} · ${room.checkInTime}` : room.checkIn ?? '—', true)}
                {cell('Expected check-out', room.checkOut ?? '—', true)}
                {cell('Rate / day', formatINR(rate), true)}
                {cell('Nights so far', String(nights), true)}
                {cell('Advance paid', formatINR(advance), true)}
                {cell('Balance due', formatINR(balance), true)}
              </View>

              <View className="mt-3 flex-row items-center justify-between rounded-[10px] bg-occ-bg px-3 py-3">
                <Text className="text-[12.5px] text-muted-2">Running total ({nights} night{nights > 1 ? 's' : ''})</Text>
                <Text className="font-mono-semibold text-[18px] text-ink">{formatINR(total)}</Text>
              </View>
              {room.payMethod && (
                <Text className="mt-2 text-[12px] text-muted-2">Advance paid via {room.payMethod.toUpperCase()}</Text>
              )}
            </ScrollView>

            {/* Footer */}
            <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">
              <Pressable onPress={onClose} className="rounded-[10px] border border-border bg-surface px-5 py-3 active:bg-surface-2"><Text className="text-sm font-sans-semibold text-label">Close</Text></Pressable>
              <Pressable onPress={() => onCheckout(room)} className="flex-1 items-center rounded-[10px] bg-brand py-3 active:bg-brand-hover"><Text className="text-sm font-sans-semibold text-[#F4F1E7]">Check Out</Text></Pressable>
            </View>
          </Pressable>
        </Pressable>
      </RNModal>

      {/* Full-screen ID preview */}
      {viewId && room.idPhotoUrl && (
        <RNModal visible transparent animationType="fade" onRequestClose={() => setViewId(false)}>
          <Pressable onPress={() => setViewId(false)} style={{ flex: 1, backgroundColor: 'rgba(10,20,15,0.92)' }} className="items-center justify-center p-6">
            <Image source={{ uri: room.idPhotoUrl }} style={{ width: '100%', height: '82%', borderRadius: 12 }} contentFit="contain" />
            <Text className="mt-4 text-[13px] font-sans-medium text-[#DCE7E1]">Tap anywhere to close</Text>
          </Pressable>
        </RNModal>
      )}
    </>
  );
}
