import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-color-profile=srgb','--hide-scrollbars'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:2}});
const p=await b.newPage();
// ensure light theme for the tour shot
await p.goto('http://localhost:8090/short-stay',{waitUntil:'domcontentloaded',timeout:120000}); await sleep(9000);
await p.evaluate(()=>{try{localStorage.setItem('staytrack.theme','light')}catch{}});
await p.reload({waitUntil:'domcontentloaded'}); await sleep(6000);
try{await p.evaluateHandle('document.fonts.ready')}catch{}
await p.screenshot({path:'public/product-6.png',type:'png'});
console.log('saved product-6 (short-stay)');
await b.close();
