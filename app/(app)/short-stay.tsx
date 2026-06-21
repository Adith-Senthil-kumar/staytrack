import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { useSSRooms, useSSStays, useUserDoc } from '../../lib/db/hooks';
import { addSSRoom, bookSSRoom, checkoutSSRoom, cleanSSRoom } from '../../lib/db/shortstay';
import { SSStatCards } from '../../components/shortstay/SSStatCards';
import { SSRoomCard } from '../../components/shortstay/SSRoomCard';
import { AddSSRoomModal } from '../../components/shortstay/AddSSRoomModal';
import { BookingModal } from '../../components/shortstay/BookingModal';
import { CheckoutModal } from '../../components/shortstay/CheckoutModal';
import { GuestHistoryTable } from '../../components/shortstay/GuestHistoryTable';
import { ReceiptModal } from '../../components/shortstay/ReceiptModal';
import type { SSRoom } from '../../types';

export default function ShortStay() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useSSRooms();
  const { stays } = useSSStays();
  const { userDoc } = useUserDoc();
  const propertyName = userDoc?.property?.name ?? 'PG';

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

  // Local state: walk-in modal open + checkout modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkoutRoom, setCheckoutRoom] = useState<SSRoom | null>(null);

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

  const handleConfirmBooking = (data: { roomId: string; guestName: string; checkIn: string; checkOut: string }) => {
    if (!uid) return;
    bookSSRoom(uid, data.roomId, data.guestName, data.checkIn, data.checkOut);
  };

  const handleCheckout = (room: SSRoom) => {
    if (!uid) return;
    checkoutSSRoom(uid, room);
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
      <View className="mb-[14px] flex-row items-center justify-between">
        <View className="flex-row items-center gap-[9px]">
          <View className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: '#C7842A' }} />
          <Text className="font-serif text-[17px] font-semibold text-ink">Short-Stay Rooms</Text>
          <Text className="text-[12.5px] text-muted-2">walk-in, day-by-day</Text>
        </View>
        <View className="flex-row items-center gap-[10px]">
          {/* Add Room — surface/border per design line 806 */}
          <Pressable
            onPress={openSSAddRoom}
            className="flex-row items-center gap-[7px] rounded-[9px] border border-border bg-surface px-[14px] py-[9px] active:bg-surface-2"
          >
            <Text className="text-[13px] font-sans-semibold text-ink">Add Room</Text>
          </Pressable>
          {/* New Walk-in Booking — amber per design line 810 */}
          <Pressable
            onPress={() => setBookingOpen(true)}
            className="flex-row items-center gap-[7px] rounded-[9px] px-[15px] py-[9px] active:opacity-90"
            style={{ backgroundColor: '#C7842A' }}
          >
            <Text className="text-[13px] font-sans-semibold text-[#FBF8F0]">New Walk-in Booking</Text>
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
            <View key={room.id} className="grow basis-[47%] lg:basis-[23%]">
              <SSRoomCard
                room={room}
                onBook={() => openBooking(room.id)}
                onCheckout={() => setCheckoutRoom(room)}
                onClean={() => { if (uid) cleanSSRoom(uid, room.id); }}
              />
            </View>
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
