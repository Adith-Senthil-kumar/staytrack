import { formatINR } from '../domain/format';
import { WORKDAYS } from '../domain/payroll';
import type { Staff } from '../../types';

type Calc = { perDay: number; worked: number; earned: number; advance: number; net: number };

// A printable HTML payslip — pure string builder, safe to import on any platform.
export function payslipHtml(
  staff: Staff,
  roleLabel: string,
  propertyName: string,
  monthLabel: string,
  year: number,
  c: Calc,
): string {
  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:9px 0;color:#71776A;font-size:13px;border-bottom:1px solid #ECE6DA">${label}</td>
      <td style="padding:9px 0;text-align:right;font-family:'SF Mono',ui-monospace,Menlo,monospace;font-size:13px;color:${strong ? '#1E6F5C' : '#41463C'};border-bottom:1px solid #ECE6DA">${value}</td></tr>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<title>Payslip · ${staff.name} · ${monthLabel} ${year}</title>
<style>
  @media print { @page { margin: 16mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #23291F; margin: 0; background: #fff; }
  .sheet { max-width: 460px; margin: 0 auto; }
</style></head>
<body>
  <div class="sheet">
    <div style="background:#13352C;color:#FBF8F0;padding:24px 26px;border-radius:14px 14px 0 0">
      <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#6F9588">Payslip · ${monthLabel} ${year}</div>
      <div style="font-size:22px;margin-top:4px;font-weight:600">${staff.name}</div>
      <div style="font-size:12.5px;color:#8FB0A5">${roleLabel} · ${propertyName}</div>
    </div>
    <div style="border:1px solid #E7E1D4;border-top:none;border-radius:0 0 14px 14px;padding:22px 26px">
      <table style="width:100%;border-collapse:collapse">
        ${row('Base salary', formatINR(staff.salary))}
        ${row(`Per-day rate (÷ ${WORKDAYS})`, formatINR(Math.round(c.perDay)))}
        ${row('Days worked', `${c.worked} / ${WORKDAYS}`)}
        ${row('Earned', formatINR(c.earned), true)}
        ${row('Advance / deduction', c.advance ? `− ${formatINR(c.advance)}` : '₹0')}
      </table>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
        <div style="font-size:14px;font-weight:700;color:#13352C">Net Payable</div>
        <div style="font-size:24px;font-weight:700;font-family:'SF Mono',ui-monospace,Menlo,monospace;color:#13352C">${formatINR(c.net)}</div>
      </div>
      <div style="margin-top:24px;padding-top:14px;border-top:1px dashed #DED8C8;font-size:11px;color:#9A9A8A;text-align:center">
        ${propertyName} · generated ${monthLabel} ${year}
      </div>
    </div>
  </div>
</body></html>`;
}
