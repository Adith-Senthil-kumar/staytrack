// Capture the two Tour pages that were missing — Tenants and Expenses — from the
// demo build (same setup as capture-shots.mjs). Demo server must be up on :8090.
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

// Tenants directory (first load → wait for bundle)
await go('/tenants', 16000);
await shot('product-tenants.png');

// Expenses tracker
await go('/expenses');
await shot('product-expenses.png');

await browser.close();
console.log('done');
