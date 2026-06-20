import { Text, type TextProps } from 'react-native';
import { formatINR } from '../../lib/domain/format';

export function MoneyText({
  amount, className = '', ...rest
}: TextProps & { amount: number; className?: string }) {
  return <Text className={`font-mono-semibold text-ink ${className}`} {...rest}>{formatINR(amount)}</Text>;
}
