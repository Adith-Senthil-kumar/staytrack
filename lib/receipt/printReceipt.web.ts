// Web: print a specific HTML receipt via a hidden same-origin iframe, then invoke
// the browser print dialog (which offers "Save as PDF"). An iframe is used rather
// than window.open so popup blockers don't interfere, and so we print ONLY the
// receipt — note expo-print's printAsync prints the whole current page on web.
export async function printReceipt({ html }: { html: string; text?: string }): Promise<void> {
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = win?.document;
  if (!win || !doc) { document.body.removeChild(iframe); return; }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => { try { document.body.removeChild(iframe); } catch { /* already gone */ } };
  win.onafterprint = cleanup;

  // Let the iframe lay out before printing.
  await new Promise((r) => setTimeout(r, 250));
  win.focus();
  win.print();
  // Fallback cleanup for browsers that don't fire onafterprint.
  setTimeout(cleanup, 1500);
}
