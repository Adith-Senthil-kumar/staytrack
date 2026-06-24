import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, MONO, SANS, SERIF } from '../theme';
import { Backdrop, useFade } from '../ui';

// Code-token colors (kept within the brand palette).
const TK: Record<string, string> = {
  k: C.gold,       // keyword
  s: '#8ED0BB',    // string
  c: C.muted2,     // comment
  f: C.teal,       // function / method
  t: '#D7E0DA',    // default identifier / punctuation
};
type Tok = [string, keyof typeof TK];

type Callout = {
  idx: string;
  title: string;
  desc: string;
  file: string;
  code: Tok[][];
  badge?: string;
};

// Every snippet below is transcribed verbatim from the repo (no invented code).
const CALLOUTS: Callout[] = [
  {
    idx: '01',
    title: 'Real-time sync',
    desc: 'Firestore onSnapshot streams straight into state — the UI is always live.',
    file: 'lib/db/hooks.ts',
    code: [
      [['const', 'k'], [' unsub = ', 't'], ['onSnapshot', 'f'], ['(makeRef(uid), (snap) => {', 't']],
      [['  setData(snap.docs.', 't'], ['map', 'f'], ['((d) => d.', 't'], ['data', 'f'], ['()));', 't']],
      [['  setLoading(', 't'], ['false', 'k'], [');', 't']],
      [['});', 't']],
      [['return', 'k'], [' unsub;', 't'], ['            // live · auto-cleanup', 'c']],
    ],
  },
  {
    idx: '02',
    title: 'Owner-scoped security',
    desc: 'Every read and write is locked to the signed-in user at the database layer.',
    file: 'firebase/firestore.rules',
    code: [
      [['match', 'k'], [' /users/{uid}/{document=**} {', 't']],
      [['  allow', 'k'], [' read, write:', 't']],
      [['    if', 'k'], [' request.auth.uid == uid;', 't']],
      [['}', 't']],
    ],
  },
  {
    idx: '03',
    title: 'Tested domain layer',
    desc: '44 passing Jest unit tests cover money, dates and dues math.',
    file: '__tests__/domain/format.test.ts',
    badge: '44 passed',
    code: [
      [['expect', 'f'], ['(', 't'], ['formatINR', 'f'], ['(10280000)).', 't'], ['toBe', 'f'], ['(', 't'], ["'₹1,02,800'", 's'], [');', 't']],
      [['expect', 'f'], ['(', 't'], ['toPaise', 'f'], ['(6000)).', 't'], ['toBe', 'f'], ['(600000);', 't']],
    ],
  },
  {
    idx: '04',
    title: 'Exact money handling',
    desc: 'Amounts are stored as integer paise, so rupee math never drifts.',
    file: 'lib/domain/format.ts',
    code: [
      [['// integer paise → amounts stay exact', 'c']],
      [['export const', 'k'], [' toPaise = (rupees) => Math.', 't'], ['round', 'f'], ['(rupees * 100);', 't']],
      [['export function', 'k'], [' formatINR', 'f'], ['(paise) {', 't']],
      [['  const rupees = Math.', 't'], ['round', 'f'], ['(paise / 100);', 't']],
      [['  return', 'k'], ["  '₹' + ", 't'], ['groupIndian', 'f'], ['(rupees);', 't']],
      [['}', 't']],
    ],
  },
  {
    idx: '05',
    title: 'Idempotent dues',
    desc: 'Deterministic IDs mean a re-run can never charge a tenant twice.',
    file: 'lib/db/dues.ts',
    code: [
      [['// deterministic id per tenant + month', 'c']],
      [['batch.', 't'], ['set', 'f'], ['(', 't']],
      [['  ', 't'], ['doc', 'f'], ['(duesRef(uid), ', 't'], ['`${d.tenantId}_${d.monthKey}`', 's'], ['),', 't']],
      [['  due,', 't']],
      [[');', 't']],
    ],
  },
];

const PER = 60; // 5 × 60 = 300

const CodeLine: React.FC<{ toks: Tok[] }> = ({ toks }) => (
  <div style={{ minHeight: 45, whiteSpace: 'pre' }}>
    {toks.map(([txt, k], i) => (
      <span key={i} style={{ color: TK[k] }}>{txt}</span>
    ))}
  </div>
);

export const UnderHood = () => {
  const f = useCurrentFrame();
  const fade = useFade(300, 10, 14);
  const active = Math.min(CALLOUTS.length - 1, Math.floor(f / PER));
  const t = f - active * PER;
  const c = CALLOUTS[active];

  const contentOp = interpolate(t, [0, 9, PER - 8, PER], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const codeX = interpolate(t, [0, 13], [44, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textY = interpolate(t, [0, 13], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity: fade, padding: '84px 96px', flexDirection: 'row', alignItems: 'center', gap: 64 }}>
      <Backdrop />

      {/* LEFT — persistent shell + swapping headline */}
      <div style={{ position: 'relative', width: 560, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: C.gold }}>UNDER THE HOOD</div>

        <div style={{ opacity: contentOp, transform: `translateY(${textY}px)`, marginTop: 30 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 150, lineHeight: 1, color: 'rgba(255,255,255,0.07)' }}>{c.idx}</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: C.cream, marginTop: -6 }}>{c.title}</div>
          <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 32, lineHeight: 1.42, color: C.muted, marginTop: 20, maxWidth: 520 }}>{c.desc}</div>
          {c.badge && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 26, padding: '12px 22px', borderRadius: 999, background: 'rgba(30,111,92,0.18)', border: `1px solid ${C.green}` }}>
              <div style={{ width: 13, height: 13, borderRadius: 99, background: C.greenLt }} />
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.teal }}>{c.badge}</span>
            </div>
          )}
        </div>

        {/* progress rail */}
        <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>
          {CALLOUTS.map((_, i) => {
            const fillPct = i < active ? 1 : i > active ? 0 : interpolate(t, [4, PER], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{ width: 64, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div style={{ width: `${fillPct * 100}%`, height: '100%', background: C.gold }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — code card */}
      <div style={{ flex: 1, opacity: contentOp, transform: `translateX(${codeX}px)` }}>
        <div style={{ borderRadius: 20, background: C.surface, border: `1px solid ${C.surfaceLine}`, boxShadow: '0 30px 80px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 28px', borderBottom: `1px solid ${C.surfaceLine}` }}>
            <div style={{ width: 14, height: 14, borderRadius: 99, background: '#E06C5A' }} />
            <div style={{ width: 14, height: 14, borderRadius: 99, background: C.gold }} />
            <div style={{ width: 14, height: 14, borderRadius: 99, background: C.greenLt }} />
            <div style={{ marginLeft: 14, fontFamily: MONO, fontWeight: 500, fontSize: 24, color: C.muted }}>{c.file}</div>
          </div>
          <div style={{ padding: '34px 38px', fontFamily: MONO, fontWeight: 500, fontSize: 29, lineHeight: 1.55 }}>
            {c.code.map((line, i) => <CodeLine key={i} toks={line} />)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
