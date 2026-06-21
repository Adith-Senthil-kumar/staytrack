import { View, Text, Pressable } from 'react-native';
import { useAuthStore } from '../../store/auth';
import { useUiStore } from '../../store/ui';
import { useSSRooms, useSSStays } from '../../lib/db/hooks';
import { addSSRoom, bookSSRoom, checkoutSSRoom, cleanSSRoom } from '../../lib/db/shortstay';
import { SSStatCards } from '../../components/shortstay/SSStatCards';
import { SSRoomCard } from '../../components/shortstay/SSRoomCard';
import { AddSSRoomModal } from '../../components/shortstay/AddSSRoomModal';
import { BookingModal } from '../../components/shortstay/BookingModal';
import { GuestHistoryTable } from '../../components/shortstay/GuestHistoryTable';

export default function ShortStay() {
  const uid = useAuthStore((s) => s.user?.uid);
  const { rooms } = useSSRooms();
  const { stays } = useSSStays();

  const ssAddRoomOpen = useUiStore((s) => s.ssAddRoomOpen);
  const openSSAddRoom = useUiStore((s) => s.openSSAddRoom);
  const closeSSAddRoom = useUiStore((s) => s.closeSSAddRoom);
  const bookingRoomId = useUiStore((s) => s.bookingRoomId);
  const openBooking = useUiStore((s) => s.openBooking);
  const closeBooking = useUiStore((s) => s.closeBooking);

  const today = new Date().toISOString().slice(0, 10);

  const bookingRoom = bookingRoomId ? rooms.find((r) => r.id === bookingRoomId) : null;

  const handleAddRoom = (data: { number: string; dailyRate: number }) => {
    if (!uid) return;
    addSSRoom(uid, data.number, data.dailyRate);
  };

  const handleConfirmBooking = (data: { guestName: string; checkOut: string }) => {
    if (!uid || !bookingRoomId) return;
    bookSSRoom(uid, bookingRoomId, data.guestName, today, data.checkOut);
  };

  const handleNewWalkin = () => {
    const first = rooms.find((r) => r.status === 'available');
    if (first) openBooking(first.id);
  };

  return (
    <View>
      <SSStatCards rooms={rooms} stays={stays} />

      {/* Rooms header */}
      <View className="mb-4 flex-row items-center gap-3">
        <Text className="flex-1 text-[17px] font-sans-semibold text-text">Short-Stay Rooms</Text>
        <Pressable
          onPress={openSSAddRoom}
          className="rounded-[10px] border border-border bg-surface px-4 py-2.5 active:bg-surface-2"
        >
          <Text className="text-sm font-sans-semibold text-label">Add Room</Text>
        </Pressable>
        <Pressable
          onPress={handleNewWalkin}
          className="rounded-[10px] px-4 py-2.5 active:opacity-80"
          style={{ backgroundColor: '#C7842A' }}
        >
          <Text className="text-sm font-sans-semibold text-[#FBF8F0]">New Walk-in Booking</Text>
        </Pressable>
      </View>

      {/* Room board */}
      {rooms.length === 0 ? (
        <View className="mb-6 rounded-[14px] border border-border bg-surface px-6 py-10">
          <Text className="text-center text-[13.5px] text-soft">No short-stay rooms yet — add one above.</Text>
        </View>
      ) : (
        <View className="mb-6 flex-row flex-wrap gap-4">
          {rooms.map((room) => (
            <View key={room.id} className="grow basis-[47%] lg:basis-[23%]">
              <SSRoomCard
                room={room}
                onBook={() => openBooking(room.id)}
                onCheckout={() => { if (uid) checkoutSSRoom(uid, room); }}
                onClean={() => { if (uid) cleanSSRoom(uid, room.id); }}
              />
            </View>
          ))}
        </View>
      )}

      {/* Guest history */}
      <Text className="mb-3 text-[15px] font-sans-semibold text-text">Guest History</Text>
      <GuestHistoryTable stays={stays} />

      {/* Modals */}
      <AddSSRoomModal
        visible={ssAddRoomOpen}
        onClose={closeSSAddRoom}
        onAdd={handleAddRoom}
      />
      <BookingModal
        visible={!!bookingRoomId}
        roomNumber={bookingRoom?.number ?? ''}
        onClose={closeBooking}
        onConfirm={handleConfirmBooking}
      />
    </View>
  );
}
