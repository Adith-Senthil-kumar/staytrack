import { Text, type TextProps } from 'react-native';

type Variant = 'title' | 'heading' | 'body' | 'label' | 'mono';

const styles: Record<Variant, string> = {
  title: 'font-serif-bold text-2xl text-ink',
  heading: 'font-serif text-lg text-ink',
  body: 'font-sans text-base text-text',
  label: 'font-sans-semibold text-xs uppercase tracking-wider text-label',
  mono: 'font-mono-semibold text-base text-ink',
};

export function ThemedText({
  variant = 'body', className = '', ...rest
}: TextProps & { variant?: Variant; className?: string }) {
  return <Text className={`${styles[variant]} ${className}`} {...rest} />;
}
