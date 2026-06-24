import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, SERIF } from '../theme';

const SHOTS = [
  { img: 'product-1.png', cap: 'Floor-by-floor occupancy' },
  { img: 'product-tenants.png', cap: 'Tenant directory' },
  { img: 'product-2.png', cap: 'Rent, dues & printable receipts' },
  { img: 'product-expenses.png', cap: 'Expense ledger & profit' },
  { img: 'product-3.png', cap: 'Staff payroll & payslips' },
  { img: 'product-6.png', cap: 'Walk-in bookings' },
  { img: 'product-4.png', cap: 'Maintenance ticket board' },
];
const PER = 60; // 7 × 60 = 420

const Caption: React.FC<{ text: string; reveal: number }> = ({ text, reveal }) => (
  <>
    {/* soft corner vignette — masks the "Demo" owner chip in the sidebar footer
        without covering any of the main content panels */}
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(820px 560px at 2% 102%, ${C.bg} 0%, ${C.bg} 20%, rgba(10,19,16,0) 56%)` }} />
    {/* self-contained caption pill so the text stays readable over any screen */}
    <div style={{ position: 'absolute', left: 64, bottom: 60, display: 'flex', alignItems: 'center', gap: 20, padding: '20px 30px 20px 24px', borderRadius: 18, background: 'rgba(8,16,13,0.66)', border: `1px solid ${C.surfaceLine}`, backdropFilter: 'blur(6px)', transform: `translateY(${interpolate(reveal, [0, 1], [18, 0])}px)`, opacity: reveal }}>
      <div style={{ width: 8, height: 50, borderRadius: 4, background: C.gold }} />
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: C.cream }}>{text}</div>
    </div>
  </>
);

export const Tour = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {SHOTS.map((s, i) => {
        const start = i * PER;
        const op = interpolate(f, [start, start + 14, start + PER - 12, start + PER], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (op <= 0.001) return null;
        const local = f - start;
        // gentle settle that never exceeds 1.0 → the full 16:9 page is always visible, no crop
        const scale = interpolate(local, [0, PER], [0.992, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const capReveal = interpolate(local, [10, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={i} style={{ opacity: op }}>
            <Img src={staticFile(s.img)} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${scale})` }} />
            <Caption text={s.cap} reveal={capReveal} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
