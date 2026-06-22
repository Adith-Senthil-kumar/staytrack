import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { useConfirmStore } from '../../store/confirm';

// Host for the app-wide confirm/notice dialog. Mounted once in (app)/_layout.
export function ConfirmDialog() {
  const request = useConfirmStore((s) => s.request);
  const close = useConfirmStore((s) => s.close);
  if (!request) return null;
  const isConfirm = !!request.onConfirm;

  return (
    <RNModal visible transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-overlay p-6">
        <View className="w-[400px] max-w-full overflow-hidden rounded-[16px] bg-surface">
          <View className="px-[26px] pb-5 pt-[22px]">
            <Text className="font-serif text-[19px] text-text">{request.title}</Text>
            {request.message && <Text className="mt-2 text-[13.5px] leading-[1.5] text-muted-2">{request.message}</Text>}
          </View>
          <View className="flex-row gap-2.5 border-t border-border px-[26px] py-3.5">
            {isConfirm && (
              <Pressable onPress={close} className="flex-1 items-center rounded-[10px] border border-border bg-surface py-3 active:bg-surface-2">
                <Text className="text-[13.5px] font-sans-semibold text-label">{request.cancelLabel ?? 'Cancel'}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => { request.onConfirm?.(); close(); }}
              className={`flex-1 items-center rounded-[10px] py-3 ${request.danger ? 'bg-bad active:opacity-90' : 'bg-brand active:bg-brand-hover'}`}
            >
              <Text className="text-[13.5px] font-sans-semibold text-[#F4F1E7]">{request.confirmLabel ?? (isConfirm ? 'Confirm' : 'OK')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
