import puppeteer from 'puppeteer-core';
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--force-color-profile=srgb','--hide-scrollbars'],defaultViewport:{width:1920,height:1080,deviceScaleFactor:2}});
const p=await b.newPage();
await p.goto('http://localhost:8090/staff',{waitUntil:'domcontentloaded',timeout:120000}); await sleep(9000);
try{await p.evaluateHandle('document.fonts.ready')}catch{}
// click the Payroll tab (first/only exact match)
await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>(x.textContent||'').trim()==='Payroll'&&x.children.length===0); if(e){const r=e.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;['pointerover','pointerdown','pointerup','click'].forEach(k=>{const C=k.startsWith('pointer')?PointerEvent:MouseEvent;e.dispatchEvent(new C(k,{bubbles:true,cancelable:true,clientX:cx,clientY:cy,pointerId:1,button:0,isPrimary:true,view:window}))})}});
await sleep(1600);
const ok=await p.evaluate(()=>document.body.innerText.includes('Total monthly payroll')||document.body.innerText.includes('Net Pay'));
await p.screenshot({path:'public/product-3.png',type:'png'});
console.log('payroll tab active:',ok);
await b.close();
