// Generate StayTrack app icons from the brand mark (LogoMark): a green diagonal
// gradient rounded-square with a gold "building" glyph (roof triangle + 3 columns).
// Pure pngjs (no SVG rasterizer needed). Run: node scripts/gen-icons.mjs
import { PNG } from 'pngjs';
import fs from 'fs';

const GOLD = [231, 180, 90];   // #E7B45A
const TEAL = [127, 187, 168];  // #7FBBA8
const WHITE = [255, 255, 255];
const G1 = [30, 111, 92];      // #1E6F5C
const G2 = [14, 46, 39];       // #0E2E27
const OUT = 'assets/images';

const lerp = (a, b, t) => a + (b - a) * t;

function inTri(px, py, a, b, c) {
  const d1 = (px - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (py - b[1]);
  const d2 = (px - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (py - c[1]);
  const d3 = (px - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (py - a[1]);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

// glyph color in 24-unit space, or null
function glyphAt(u, v) {
  if (inTri(u, v, [12, 3], [17, 9], [7, 9])) return GOLD;
  if (v >= 11 && v <= 20) {
    if (u >= 7.5 && u <= 10.1) return GOLD;
    if (u >= 10.7 && u <= 13.3) return TEAL;
    if (u >= 13.9 && u <= 16.5) return GOLD;
  }
  return null;
}

function gen(file, { size, bg, rounded = false, glyph = true, scale = 0.52, white = false }) {
  const png = new PNG({ width: size, height: size });
  const r = size * 0.22;
  const gSide = size * scale, gx = (size - gSide) / 2, gy = (size - gSide) / 2;
  const SS = 3, n = SS * SS;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cr = 0, cg = 0, cb = 0, cov = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const px = x + (sx + 0.5) / SS, py = y + (sy + 0.5) / SS;
        let col = null;
        // base background (respecting rounded mask)
        if (bg !== 'none') {
          let inside = true;
          if (rounded) {
            const ex = Math.min(Math.max(px, r), size - r), ey = Math.min(Math.max(py, r), size - r);
            inside = (px - ex) ** 2 + (py - ey) ** 2 <= r * r;
          }
          if (inside) { const t = (px / size + py / size) / 2; col = [lerp(G1[0], G2[0], t), lerp(G1[1], G2[1], t), lerp(G1[2], G2[2], t)]; }
        }
        // glyph on top
        if (glyph) {
          const u = (px - gx) / gSide * 24, v = (py - gy) / gSide * 24;
          if (u >= 0 && u <= 24 && v >= 0 && v <= 24) {
            const gc = glyphAt(u, v);
            if (gc) col = white ? WHITE : gc;
          }
        }
        if (col) { cr += col[0]; cg += col[1]; cb += col[2]; cov++; }
      }
      const idx = (size * y + x) << 2;
      png.data[idx] = cov ? Math.round(cr / cov) : 0;
      png.data[idx + 1] = cov ? Math.round(cg / cov) : 0;
      png.data[idx + 2] = cov ? Math.round(cb / cov) : 0;
      png.data[idx + 3] = Math.round((cov / n) * 255);
    }
  }
  fs.writeFileSync(`${OUT}/${file}`, PNG.sync.write(png));
  console.log(`wrote ${OUT}/${file} (${size}px)`);
}

gen('icon.png', { size: 1024, bg: 'gradient', rounded: true, scale: 0.52 });
gen('favicon.png', { size: 64, bg: 'gradient', rounded: true, scale: 0.52 });
gen('splash-icon.png', { size: 288, bg: 'none', scale: 0.7 });
gen('android-icon-foreground.png', { size: 1024, bg: 'none', scale: 0.42 });
gen('android-icon-background.png', { size: 1024, bg: 'gradient', rounded: false, glyph: false });
gen('android-icon-monochrome.png', { size: 1024, bg: 'none', scale: 0.42, white: true });
