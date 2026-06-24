// Capture real StayTrack screens (demo build, desktop width, retina) into public/
// for the portfolio video. Uses system Chrome via puppeteer-core. Demo build is the
// source because the hosted app is login-gated — same code + components, realistic
// seeded data. Run with the demo server up on :8090.
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:8090';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
});
const page = await browser.newPage();

async function go(path, firstWait = 4000) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(firstWait);
  try { await page.evaluateHandle('document.fonts.ready'); } catch {}
  await sleep(600);
}
async function shot(name) { await page.screenshot({ path: `public/${name}`, type: 'png' }); console.log('saved', name); }
async function clickText(txt, nth = 0) {
  await page.evaluate((t, n) => {
    const els = [...document.querySelectorAll('*')].filter((e) => (e.textContent || '').trim() === t && e.children.length === 0);
    const el = els[n]; if (!el) return;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    ['pointerover', 'pointerdown', 'pointerup', 'click'].forEach((k) => {
      const C = k.startsWith('pointer') ? PointerEvent : MouseEvent;
      el.dispatchEvent(new C(k, { bubbles: true, cancelable: true, clientX: cx, clientY: cy, pointerId: 1, button: 0, isPrimary: true, view: window }));
    });
  }, txt, nth);
  await sleep(1300);
}

// 1) Rooms & occupancy dashboard (first load → wait for bundle)
await go('/rooms', 16000);
await shot('product-1.png');

// 2) Rent collection (dues + receipt)
await go('/rent');
await shot('product-2.png');

// 3) Staff payroll
await go('/staff');
await clickText('Payroll', 1); // skip a possible header match
await shot('product-3.png');

// 4) Maintenance ticket board (Board is the default tab)
await go('/maintenance');
await shot('product-4.png');

// 5) Dark-theme dashboard (persist pref, reload so the store hydrates it)
await go('/rooms');
await page.evaluate(() => { try { localStorage.setItem('staytrack.theme', 'dark'); } catch {} });
await page.reload({ waitUntil: 'domcontentloaded' });
await sleep(5000);
try { await page.evaluateHandle('document.fonts.ready'); } catch {}
await shot('product-5.png');

await browser.close();
console.log('done');
