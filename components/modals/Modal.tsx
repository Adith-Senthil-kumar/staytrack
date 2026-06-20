import { View, Text, Pressable, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function Modal({ eyebrow, title, subtitle, onClose, children, footer }: {
  eyebrow: string; title: string; subtitle?: string; onClose?: () => void;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-overlay p-6">
      <View className="max-h-[92%] w-full max-w-[560px] overflow-hidden rounded-[18px] bg-surface">
        <View className="bg-brand px-[26px] py-[22px]">
          {onClose && (
            <Pressable onPress={onClose} className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14]">
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#DCE7E1" strokeWidth={2.2} strokeLinecap="round"><Path d="M18 6 6 18M6 6l12 12" /></Svg>
            </Pressable>
          )}
          <Text className="text-[11.5px] font-sans-semibold uppercase tracking-[1.4px] text-[#6F9588]">{eyebrow}</Text>
          <Text className="mt-1 font-serif text-[22px] text-[#FBF8F0]">{title}</Text>
          {subtitle ? <Text className="mt-1 text-[12.5px] text-[#8FB0A5]">{subtitle}</Text> : null}
        </View>
        <ScrollView className="px-[26px] py-6">{children}</ScrollView>
        {footer ? <View className="flex-row gap-3 border-t border-border px-[26px] py-3.5">{footer}</View> : null}
      </View>
    </View>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-xs font-sans-semibold text-label">{label}</Text>
      {children}
    </View>
  );
}
