import { useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type SelectOption = { value: string; label: string };

// Floating dropdown that matches the design's native <select> controls.
// Same anchoring pattern as the Add Tenant room picker (measureInWindow +
// a nested transparent Modal), so it renders correctly over parent modals.
export function SelectField({
  value, options, placeholder, onChange, disabled,
}: {
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<View>(null);
  const selected = options.find((o) => o.value === value);

  const toggle = () => {
    if (disabled) return;
    if (open) { setOpen(false); return; }
    ref.current?.measureInWindow((x, y, w, h) => {
      setRect({ top: y + h + 4, left: x, width: w });
      setOpen(true);
    });
  };

  return (
    <>
      <Pressable
        ref={ref}
        onPress={toggle}
        className="flex-row items-center rounded-[9px] border border-border bg-field px-[13px] py-[11px]"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <Text numberOfLines={1} className={`flex-1 text-sm ${selected ? 'text-text' : 'text-soft'}`}>
          {selected ? selected.label : placeholder}
        </Text>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#9A9A8A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Path d="m6 9 6 6 6-6" />
        </Svg>
      </Pressable>

      <RNModal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={{ flex: 1 }}>
          {rect && (
            <View
              style={{ position: 'absolute', top: rect.top, left: rect.left, width: rect.width, maxHeight: 240, elevation: 12, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } }}
              className="overflow-hidden rounded-[10px] border border-border bg-surface"
            >
              {options.length === 0 ? (
                <Text className="px-3.5 py-3 text-[13px] text-soft">No options</Text>
              ) : (
                <ScrollView nestedScrollEnabled>
                  {options.map((o, i) => (
                    <Pressable
                      key={o.value}
                      onPress={() => { onChange(o.value); setOpen(false); }}
                      className={`px-3.5 py-3 active:bg-surface-2 ${i < options.length - 1 ? 'border-b border-border-3' : ''} ${o.value === value ? 'bg-surface-2' : ''}`}
                    >
                      <Text className="text-[13.5px] text-text">{o.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </Pressable>
      </RNModal>
    </>
  );
}
