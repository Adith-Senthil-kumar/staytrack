import { formatINR } from '../domain/format';
import type { SSStay } from '../../types';

function nightlyRate(stay: SSStay) {
  return stay.rate ?? (stay.nights > 0 ? Math.round(stay.total / stay.nights) : stay.total);
}

// A self-contained, printable HTML receipt. Pure string builder (no DOM), so it
// is safe to import on every platform; the web print helper renders it in a
// hidden iframe, and on native it can be shared as a fallback.
export function receiptHtml(stay: SSStay, propertyName: string): string {
  const advance = stay.advance ?? 0;
  const balance = stay.balance ?? Math.max(0, stay.total - advance);
  const paid = stay.paymentMethod ? `Paid in full via ${stay.paymentMethod.toUpperCase()}` : 'Paid in full';
  const row = (label: string, value: string) =>
    `<tr><td style="padding:9px 0;color:#71776A;font-size:13px;border-bottom:1px solid #ECE6DA">${label}</td>
      <td style="padding:9px 0;text-align:right;font-family:'SF Mono',ui-monospace,Menlo,monospace;font-size:13px;color:#41463C;border-bottom:1px solid #ECE6DA">${value}</td></tr>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<title>Receipt · ${stay.guestName}</title>
<style>
  @media print { @page { margin: 16mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #23291F; margin: 0; background: #fff; }
  .sheet { max-width: 460px; margin: 0 auto; padding: 0; }
</style></head>
<body>
  <div class="sheet">
    <div style="background:#C7842A;color:#FBF8F0;padding:24px 26px;border-radius:14px 14px 0 0">
      <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,0.8)">Receipt · ${propertyName}</div>
      <div style="font-size:22px;margin-top:4px;font-weight:600">${stay.guestName}</div>
      <div style="font-size:12.5px;color:rgba(255,255,255,0.85)">Room ${stay.roomNumber} · short-stay</div>
    </div>
    <div style="border:1px solid #E7E1D4;border-top:none;border-radius:0 0 14px 14px;padding:22px 26px">
      <table style="width:100%;border-collapse:collapse">
        ${row('Check-in', stay.checkIn)}
        ${row('Check-out', stay.checkOut)}
        ${row('Nights × rate', `${stay.nights} × ${formatINR(nightlyRate(stay))}`)}
        ${row('Advance', formatINR(advance))}
        ${balance > 0 ? row('Balance collected', formatINR(balance)) : ''}
      </table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
        <div style="font-size:14px;font-weight:700;color:#13352C">Total Paid</div>
        <div style="font-size:24px;font-weight:700;font-family:'SF Mono',ui-monospace,Menlo,monospace;color:#13352C">${formatINR(stay.total)}</div>
      </div>
      <div style="margin-top:10px;font-size:12px;color:#1E6F5C">✓ ${paid}</div>
      <div style="margin-top:24px;padding-top:14px;border-top:1px dashed #DED8C8;font-size:11px;color:#9A9A8A;text-align:center">
        Thank you for staying with ${propertyName}.
      </div>
    </div>
  </div>
</body></html>`;
}
