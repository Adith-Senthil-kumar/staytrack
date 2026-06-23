import { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { confirmAction, notify } from '../../store/confirm';
import { useSSRooms, useSSStays, useUserDoc } from '../../lib/db/hooks';
import { addSSRoom, bookSSRoom, checkoutSSRoom, cleanSSRoom, removeSSRoom } from '../../lib/db/shortstay';
import { uploadPhoto } from '../../lib/storage/photos';
import { SSStatCards } from '../../components/shortstay/SSStatCards';
import { SSRoomCard } from '../../components/shortstay/SSRoomCard';
import { SSRoomDetailModal } from '../../components/shortstay/SSRoomDetailModal';
import { AddSSRoomModal } from '../../components/shortstay/AddSSRoomModal';
import { BookingModal } from '../../components/shortstay/BookingModal';
import { CheckoutModal } from '../../components/shortstay/CheckoutModal';
import { GuestHistoryTable } from '../../components/shortstay/GuestHistoryTable';
import { ReceiptModal } from '../../components/shortstay/ReceiptModal';
import type { SSRoom, PaymentMethod } from '../../types';

export default function ShortStay() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useSSRooms();
  const { stays } = useSSStays();
  const { userDoc } = useUserDoc();
  const propertyName = userDoc?.property?.name ?? 'PG';
  const { width } = useWindowDimensions();
  // Pad the last row with invisible fillers so a lone card keeps its column
  // width instead of stretching full-width (flex `grow` would expand it).
  const roomCols = width >= 1024 ? 4 : width >= 640 ? 2 : 1; // 1-per-row on a phone
  const roomFillers = (roomCols - (rooms.length % roomCols)) % roomCols;

  const ssAddRoomOpen = useUiStore((s) => s.ssAddRoomOpen);
  const openSSAddRoom = useUiStore((s) => s.openSSAddRoom);
  const closeSSAddRoom = useUiStore((s) => s.closeSSAddRoom);
  // Use store's bookingRoomId only for preset (card → Book this room)
  const bookingRoomId = useUiStore((s) => s.bookingRoomId);
  const openBooking = useUiStore((s) => s.openBooking);
  const closeBooking = useUiStore((s) => s.closeBooking);
  const ssReceiptStayId = useUiStore((s) => s.ssReceiptStayId);
  const openSSReceipt = useUiStore((s) => s.openSSReceipt);
  const closeSSReceipt = useUiStore((s) => s.closeSSReceipt);

  // Local state: walk-in modal open + checkout modal + detail view
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkoutRoom, setCheckoutRoom] = useState<SSRoom | null>(null);
  const [detailRoom, setDetailRoom] = useState<SSRoom | null>(null);

  // Auto-number: next free S-N
  const nextSSNumber = () => {
    const nums = rooms
      .map((r) => r.number)
      .filter((n) => /^S-\d+$/.test(n))
      .map((n) => parseInt(n.slice(2), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `S-${max + 1}`;
  };

  const handleAddRoom = (data: { number: string; dailyRate: number }) => {
    if (!uid) return;
    const num = data.number.trim() || nextSSNumber();
    addSSRoom(uid, num, data.dailyRate);
  };

  const handleConfirmBooking = async (data: { roomId: string; guestName: string; phone: string; checkIn: string; checkInTime: string; checkOut: string; rate: number; advance: number; payMethod: PaymentMethod; idType: string; idPhotoUri: string | null }) => {
    if (!uid) return;
    const { idPhotoUri, ...rest } = data;
    let idPhotoUrl: string | null = null;
    if (idPhotoUri) {
      try { idPhotoUrl = await uploadPhoto(uid, `shortstay/${data.roomId}/id`, idPhotoUri); } catch { /* book without the ID scan if upload fails */ }
    }
    bookSSRoom(uid, data.roomId, { ...rest, idPhotoUrl });
  };

  const handleCheckout = (room: SSRoom, paymentMethod: PaymentMethod) => {
    if (!uid) return;
    checkoutSSRoom(uid, room, paymentMethod);
  };

  const availableRooms = rooms.filter((r) => r.status === 'available');

  // Booking modal visibility: either local open or store has a preset room
  const showBooking = bookingOpen || !!bookingRoomId;
  const presetId = bookingRoomId ?? null;

  const handleCloseBooking = () => {
    setBookingOpen(false);
    closeBooking();
  };

  return (
    <View>
      <SSStatCards rooms={rooms} stays={stays} />

      {/* Rooms board header — per design lines 799–815 */}
      <View className="mb-[14px] gap-3 sm:flex-row sm:items-center sm:justify-between">
        <View className="flex-row items-center gap-[9px]">
          <View className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: '#C7842A' }} />
          <Text className="font-serif text-[17px] font-semibold text-ink">Short-Stay Rooms</Text>
          <Text className="text-[12.5px] text-muted-2">walk-in, day-by-day</Text>
        </View>
        {/* On mobile these go full-width below the title so the walk-in button is visible */}
        <View className="flex-row items-center gap-2.5">
          <Pressable
            onPress={openSSAddRoom}
            className="flex-1 flex-row items-center justify-center gap-[7px] rounded-[9px] border border-border bg-surface px-[14px] py-[10px] active:bg-surface-2 sm:flex-none"
          >
            <Text className="text-[13px] font-sans-semibold text-ink">Add Room</Text>
          </Pressable>
          <Pressable
            onPress={() => setBookingOpen(true)}
            className="flex-1 flex-row items-center justify-center gap-[7px] rounded-[9px] px-[15px] py-[10px] active:opacity-90 sm:flex-none"
            style={{ backgroundColor: '#C7842A' }}
          >
            <Text numberOfLines={1} className="text-[13px] font-sans-semibold text-[#FBF8F0]">New Walk-in Booking</Text>
          </Pressable>
        </View>
      </View>

      {/* Room board — wrap per design line 816 */}
      {rooms.length === 0 ? (
        <View className="mb-6 rounded-[14px] border border-border bg-surface px-6 py-10">
          <Text className="text-center text-[13.5px] text-soft">No short-stay rooms yet — add one above.</Text>
        </View>
      ) : (
        <View className="mb-[30px] flex-row flex-wrap gap-4">
          {rooms.map((room) => (
            <View key={room.id} className="grow basis-full sm:basis-[47%] lg:basis-[23%]">
              <SSRoomCard
                room={room}
                onBook={() => openBooking(room.id)}
                onCheckout={() => setCheckoutRoom(room)}
                onView={() => setDetailRoom(room)}
                onClean={() => { if (uid) cleanSSRoom(uid, room.id); }}
                onRemove={() => {
                  if (!uid) return;
                  if (room.status === 'occupied') {
                    notify('Room is occupied', `${room.guestName ?? 'A guest'} is checked in. Check them out before removing this room.`);
                    return;
                  }
                  confirmAction({
                    title: 'Remove this room?',
                    message: `Short-stay room ${room.number} will be deleted. Guest history stays intact.`,
                    confirmLabel: 'Remove',
                    danger: true,
                    onConfirm: () => removeSSRoom(uid, room.id),
                  });
                }}
              />
            </View>
          ))}
          {Array.from({ length: roomFillers }).map((_, i) => (
            <View key={`filler-${i}`} className="grow basis-full sm:basis-[47%] lg:basis-[23%]" />
          ))}
        </View>
      )}

      {/* Guest history — per design lines 858–884 */}
      <GuestHistoryTable stays={stays} onReceipt={(stay) => openSSReceipt(stay.id)} />

      {/* Modals */}
      <AddSSRoomModal
        visible={ssAddRoomOpen}
        onClose={closeSSAddRoom}
        onAdd={handleAddRoom}
      />
      <BookingModal
        visible={showBooking}
        availableRooms={availableRooms}
        presetRoomId={presetId}
        onClose={handleCloseBooking}
        onConfirm={handleConfirmBooking}
      />
      <SSRoomDetailModal
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
        onCheckout={(room) => { setDetailRoom(null); setCheckoutRoom(room); }}
      />
      <CheckoutModal
        visible={!!checkoutRoom}
        room={checkoutRoom}
        onClose={() => setCheckoutRoom(null)}
        onConfirm={handleCheckout}
      />
      <ReceiptModal
        visible={!!ssReceiptStayId}
        stay={ssReceiptStayId ? stays.find((s) => s.id === ssReceiptStayId) ?? null : null}
        propertyName={propertyName}
        onClose={closeSSReceipt}
      />
    </View>
  );
}
