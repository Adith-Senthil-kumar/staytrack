import { TextInput } from 'react-native';

// Native fallback: a plain text field with the same API as the web picker. The
// web build (DateTimeField.web.tsx) renders the real OS date/time picker; a
// future enhancement could swap in @react-native-community/datetimepicker here.
export function DateTimeField({ mode, value, onChange, placeholder }: {
  mode: 'date' | 'time';
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder ?? (mode === 'time' ? 'HH:MM' : 'YYYY-MM-DD')}
      placeholderTextColor="#9A9A8A"
      keyboardType={mode === 'time' ? 'numbers-and-punctuation' : 'numbers-and-punctuation'}
      className="rounded-[9px] border border-border bg-field px-[13px] py-[11px] text-sm text-text"
    />
  );
}
