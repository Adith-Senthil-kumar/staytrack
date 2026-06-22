import { Share } from 'react-native';

// Native fallback: there is no print dialog, so share the plain-text receipt.
// (Metro resolves printReceipt.web.ts on web, where a real PDF print is offered.)
export async function printReceipt({ text }: { html: string; text?: string }): Promise<void> {
  if (text) await Share.share({ message: text });
}
