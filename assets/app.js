/* engine — all words live in content.js, all drawings in art.js, all sound in audio.js */
(() => {
const $ = h => { const d=document.createElement('div'); d.innerHTML=h.trim(); return d.firstElementChild; };
const stage = document.getElementById('stage');
const rand = a => a[Math.floor(Math.random()*a.length)];
const save = (k,v)=>{ try{localStorage.setItem('mrudu_'+k,JSON.stringify(v))}catch(e){} };
const load = (k,d)=>{ try{const v=localStorage.getItem('mrudu_'+k); return v?JSON.parse(v):d}catch(e){return d} };
const S = k => Sound.play(k);

/* ---------- time: locked to IST, never the device ---------- */
const nowIST = () => { const d=new Date(); return new Date(d.getTime()+(CONFIG.timezoneOffsetMinutes+d.getTimezoneOffset())*60000); };
const bStart = () => new Date(CONFIG.birthday.year, CONFIG.birthday.month-1, CONFIG.birthday.day,0,0,0);
const bEnd   = () => new Date(bStart().getTime()+86400000);
const msLeft = () => bStart()-nowIST();
const daysLeft = () => Math.max(0, Math.ceil(msLeft()/86400000));
const phase = () => { const n=nowIST(); return n>=bEnd() ? 'after' : n>=bStart() ? 'birthday' : 'pre'; };

/* ---------- confetti ---------- */
const cv=document.getElementById('fx'), ctx=cv.getContext('2d');
let parts=[], raf=null;
const size=()=>{cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
size(); addEventListener('resize',size);
const COLORS=['#ff8fb1','#ffc2d4','#ffd9a0','#9fe3cb','#fff4ee'];
function burst(n=90,y=.35){
  for(let i=0;i<n;i++) parts.push({x:innerWidth/2+(Math.random()-.5)*innerWidth*.75,y:innerHeight*y,
    vx:(Math.random()-.5)*9,vy:Math.random()*-11-3,g:.28,s:Math.random()*7+4,
    r:Math.random()*6,vr:(Math.random()-.5)*.3,c:rand(COLORS),life:1, heart:Math.random()<.3});
  if(!raf) tick();
}
function tick(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  parts=parts.filter(p=>p.life>0);
  parts.forEach(p=>{
    p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.life-=.0058;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.c;
    if(p.heart){ const s=p.s*.75; ctx.beginPath();
      ctx.moveTo(0,s*.9); ctx.bezierCurveTo(-s*1.3,-s*.1,-s*.5,-s*1.1,0,-s*.45);
      ctx.bezierCurveTo(s*.5,-s*1.1,s*1.3,-s*.1,0,s*.9); ctx.fill(); }
    else ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);
    ctx.restore();
  });
  raf = parts.length ? requestAnimationFrame(tick) : (ctx.clearRect(0,0,innerWidth,innerHeight),null);
}

/* ---------- drifting hearts & petals ---------- */
const drift = document.getElementById('drift');
function spawnDrift(){
  const isHeart = Math.random()<.45;
  const el = $(`<div class="drifter">${isHeart?Art.heart(rand(['#ff8fb1','#ffc2d4','#ff6f9c']),Math.random()*14+10)
                                            :Art.petal(rand(['#ffb3d1','#ffd9a0','#ffc2d4']),Math.random()*14+10)}</div>`);
  el.style.left = Math.random()*100+'vw';
  el.style.setProperty('--r',(Math.random()*720-360)+'deg');
  el.style.animationDuration = (13+Math.random()*12)+'s';
  drift.appendChild(el);
  setTimeout(()=>el.remove(), 26000);
}
setInterval(spawnDrift, 1400); for(let i=0;i<6;i++) setTimeout(spawnDrift,i*500);

/* ---------- toast ---------- */
const toastEl=document.getElementById('toast'); let tT;
function toast(m){ toastEl.textContent=m; toastEl.classList.add('show'); clearTimeout(tT); tT=setTimeout(()=>toastEl.classList.remove('show'),4400); }

/* ---------- sound toggle ---------- */
const sndBtn = document.getElementById('snd');
const paintSnd = ()=>{ sndBtn.textContent = Sound.enabled?'🔊':'🔇'; sndBtn.classList.toggle('off',!Sound.enabled); };
paintSnd();
sndBtn.onclick = ()=>{ const on=Sound.toggle(); paintSnd(); if(on){ Sound.pad(true); S('chime'); } else Sound.pad(false); };

/* ---------- start over ---------- */
const rstBtn = document.getElementById('rst');
let armed = null;
function restart(){
  try{ localStorage.removeItem('mrudu_done'); localStorage.removeItem('mrudu_side'); }catch(e){}
  clearInterval(clockT); clearInterval(quoteT); stopCritters(); points = 0;
  document.querySelectorAll('.storm').forEach(e=>e.remove());
  parts = [];                                   // clear any confetti mid-flight
  document.body.style.transition = 'background 1.2s';
  document.body.style.background = '';          // undo the finale fade
  S('whoosh');
  sceneGate();
}
rstBtn.onclick = ()=>{
  if(armed){ clearTimeout(armed); armed=null; rstBtn.classList.remove('armed'); restart(); return; }
  rstBtn.classList.add('armed'); S('tap');
  toast('tap again to start from the beginning');
  armed = setTimeout(()=>{ armed=null; rstBtn.classList.remove('armed'); }, 4000);
};

let clockT;

/* ---------- roaming critters ---------- */
const box=document.getElementById('critters'); let cTimer;
function spawnCritter(){
  const c=rand(CRITTER_LINES);
  const draw = { cat:()=>Art.cat('#ffc2d4',64), dog:()=>Art.dog('#f6c98d',64),
                 heart:()=>Art.heart('#ff8fb1',34), star:()=>Art.star(30), stetho:()=>Art.stetho(46) };
  const el=$(`<div class="critter">${(draw[c.art]||draw.heart)()}</div>`);
  const L=Math.random()>.5;
  el.style.top=(16+Math.random()*66)+'vh'; el.style.left=L?'-20vw':'112vw';
  if(!L) el.style.transform='scaleX(-1)';
  box.appendChild(el);
  el.animate([{translate:'0'},{translate:`${L?132:-132}vw`}],{duration:12000+Math.random()*8000,easing:'linear'}).onfinish=()=>el.remove();
  el.onclick=()=>{ toast(c.t); S(c.art==='cat'?'meow':c.art==='dog'?'woof':'sparkle'); burst(26,.5); el.remove(); };
}
function startCritters(){ clearInterval(cTimer); cTimer=setInterval(()=>{if(Math.random()>.35)spawnCritter()},7000); setTimeout(spawnCritter,2400); }
function stopCritters(){ clearInterval(cTimer); box.innerHTML=''; }

/* ---------- typewriter ---------- */
function type(el,text,speed=40){
  const chars=[...text];                       // splits by code point, keeps emoji whole
  return new Promise(res=>{
    el.innerHTML=''; let i=0;
    const cur=$('<span class="cursor"></span>'); el.appendChild(cur);
    const iv=setInterval(()=>{
      if(i>=chars.length){
        clearInterval(iv); cur.remove();
        el.normalize();                        // merge the per-char text nodes back into one
        wrapEmojiIn(el); res(); return;
      }
      cur.insertAdjacentText('beforebegin',chars[i++]);
      if(i%3===0) S('tap');
    },speed);
  });
}
if(CONFIG.signature) document.getElementById('sig').innerHTML = CONFIG.signature;

/* ---------- rotating literary quotes ---------- */
let quoteT=null, quoteIdx=0;
const quoteHTML = q => `<q>${q.t}</q><cite>&mdash; ${q.a}${q.w?`<i>${q.w}</i>`:''}</cite>`;
function mountQuote(el, start=0){
  if(!el) return;
  quoteIdx = ((start % QUOTES.length) + QUOTES.length) % QUOTES.length;
  el.innerHTML = quoteHTML(QUOTES[quoteIdx]);
  clearInterval(quoteT);
  quoteT = setInterval(()=>{
    el.style.opacity = '0';
    setTimeout(()=>{
      quoteIdx = (quoteIdx+1) % QUOTES.length;
      el.innerHTML = quoteHTML(QUOTES[quoteIdx]);
      el.style.opacity = '1';
    }, 520);
  }, 7500);
}

/* ---------- the storm: every cat and dog at once ---------- */
function critterStorm(n=36){
  const box=$('<div class="storm"></div>'); document.body.appendChild(box);
  for(let i=0;i<n;i++){
    setTimeout(()=>{
      const isCat = Math.random()<.5, size = 46+Math.random()*56;
      const el=$(`<div class="s">${isCat?Art.cat('#ffc2d4',size):Art.dog('#f6c98d',size)}</div>`);
      el.style.left = (Math.random()*86)+'vw';
      el.style.top  = (Math.random()*80)+'vh';
      el.style.setProperty('--sr',(Math.random()*44-22)+'deg');
      box.appendChild(el);
      if(i%5===0) S(isCat?'meow':'woof');
    }, i*65);
  }
  setTimeout(()=>box.remove(), n*65+3200);
}

/* gradient-clipped headings turn emoji into blank shapes — opt them out */
const EMO_RE  = /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;
const EMO_HAS = /\p{Extended_Pictographic}/u;
function wrapEmojiIn(el){
  if(!el) return;
  el.normalize();
  [...el.childNodes].forEach(n=>{
    if(n.nodeType!==3 || !EMO_HAS.test(n.nodeValue)) return;
    const frag=document.createDocumentFragment();
    n.nodeValue.split(EMO_RE).forEach((part,i)=>{
      if(!part) return;
      if(i%2===1){ const sp=document.createElement('span'); sp.className='emo'; sp.textContent=part; frag.appendChild(sp); }
      else frag.appendChild(document.createTextNode(part));
    });
    n.replaceWith(frag);
  });
}
const fixEmoji = root => root.querySelectorAll('h1,h2').forEach(wrapEmojiIn);

const show = html => {
  stage.innerHTML=''; clearInterval(quoteT); quoteT=null;
  const s=$(`<section class="scene">${html}</section>`);
  stage.appendChild(s); fixEmoji(s); return s;
};
const nextBtn = (s,fn)=>{ const b=s.querySelector('#n'); b.style.transition='opacity .7s'; b.style.opacity='1'; b.onclick=()=>{S('whoosh');fn()}; };

/* ============================================================ PHASE 1 */
let points=0;

function sceneGate(){
  const s=show(`
    <div class="kicker">access denied</div>
    ${Art.cat('#ffc2d4',150)}
    <h1 id="gl"></h1><p class="dim" id="gs"></p>
    <div class="stack"><button class="btn primary" id="n" style="opacity:0">${GAME.gate.button}</button></div>`);
  (async()=>{
    Sound.boot(); Sound.pad(true);
    const l=s.querySelector('#gl');
    await type(l,GAME.gate.lines[0],75); S('meow');
    await new Promise(r=>setTimeout(r,500));
    await type(l,GAME.gate.lines[1],36);
    s.querySelector('#gs').textContent=GAME.gate.lines[2];
    nextBtn(s,sceneCat);
  })();
}

function sceneCat(){
  const g=GAME.catchCat;
  const s=show(`
    <div class="kicker">${g.title}</div><h2>${g.prompt}</h2><p class="dim">${g.sub}</p>
    <div id="arena" style="position:relative;height:46vh;width:100%"></div>
    <p class="dim" id="msg" style="min-height:1.6em"></p>`);
  const arena=s.querySelector('#arena'), msg=s.querySelector('#msg');
  const cat=$(`<div class="critter" style="position:absolute">${Art.cat('#ffc2d4',88)}</div>`);
  arena.appendChild(cat);
  let miss=0;
  const move=()=>{ const e=Math.min(miss*.18,.7);
    cat.style.left=(6+Math.random()*(68*(1-e)))+'%'; cat.style.top=(4+Math.random()*(62*(1-e)))+'%'; };
  move();
  arena.addEventListener('pointerdown',e=>{ if(cat.contains(e.target))return;
    miss++; S('tap'); msg.textContent=g.misses[Math.min(miss-1,g.misses.length-1)]; move(); });
  cat.addEventListener('pointerdown',e=>{
    e.stopPropagation(); points+=g.points; S('meow'); burst(80,.45);
    const w=show(`${Art.cat('#ffc2d4',150)}<h2>${g.win}</h2><div class="score">+${g.points} mrudu points</div>
      <div class="stack"><button class="btn primary" id="n" style="opacity:1">continue →</button></div>`);
    w.querySelector('#n').onclick=()=>{S('whoosh');sceneSides()};
  });
}

function sceneSides(){
  const g=GAME.sides;
  const s=show(`<div class="kicker">${g.title}</div><h2>${g.prompt}</h2>
    <div class="row2">${g.options.map((o,i)=>`<button class="btn art-btn" data-i="${i}">
      ${o.art==='cat'?Art.cat('#ffc2d4',86):Art.dog('#f6c98d',86)}<span>${o.label}</span></button>`).join('')}</div>`);
  s.querySelectorAll('.btn').forEach(b=>b.onclick=()=>{
    const o=g.options[+b.dataset.i]; points+=g.points; S(o.art==='cat'?'meow':'woof'); burst(46,.5); save('side',o.label);
    const w=show(`${o.art==='cat'?Art.cat('#ffc2d4',130):Art.dog('#f6c98d',130)}
      <h2 class="serif">${o.reply}</h2><div class="score">+${g.points} mrudu points</div>
      <div class="stack"><button class="btn primary" id="n" style="opacity:1">okay →</button></div>`);
    w.querySelector('#n').onclick=()=>{S('whoosh');sceneQ(0)};
  });
}

function sceneQ(i){
  if(i>=GAME.questions.length) return sceneBubbles();
  const q=GAME.questions[i];
  const s=show(`<div class="kicker">${q.title}</div><h2>${q.q}</h2>
    <div class="stack">${q.options.map((o,k)=>`<button class="btn" data-i="${k}">${o.label}</button>`).join('')}</div>`);
  s.querySelectorAll('.btn').forEach(b=>b.onclick=()=>{
    const o=q.options[+b.dataset.i]; points+=q.points; S('pop'); burst(36,.5);
    const w=show(`<div class="reveal serif big">${q.reveal||o.reply}</div>
      <div class="score">+${q.points} mrudu points</div>
      <div class="stack"><button class="btn primary" id="n" style="opacity:1">next →</button></div>`);
    w.querySelector('#n').onclick=()=>{S('whoosh');sceneQ(i+1)};
  });
}

function sceneBubbles(){
  const g=GAME.bubbles;
  const artOf = a => a==='cat'?Art.cat('#ffc2d4',54):a==='dog'?Art.dog('#f6c98d',54)
                : a==='stetho'?Art.stetho(46):a==='star'?Art.star(38):Art.heart('#ff8fb1',40);
  const s=show(`<div class="kicker">${g.title}</div><h2>${g.prompt}</h2><p class="dim">${g.sub}</p>
    <div class="reveal serif" id="rv">tap one 👇</div>
    <div class="bubbles">${g.items.map((it,i)=>`<button class="bub" data-i="${i}">${artOf(it.art)}</button>`).join('')}</div>
    <p class="dim" id="left"></p>`);
  const rv=s.querySelector('#rv'), lf=s.querySelector('#left'); let n=0;
  const refresh=()=>lf.textContent = n<g.items.length ? `${g.items.length-n} left` : '';
  refresh();
  s.querySelectorAll('.bub').forEach(b=>b.onclick=()=>{
    if(b.classList.contains('open'))return;
    b.classList.add('open'); n++; refresh(); S('sparkle'); burst(22,.55);
    rv.textContent=g.items[+b.dataset.i].text;
    if(n===g.items.length){ points+=g.points;
      setTimeout(()=>{ const w=$(`<div class="stack"><button class="btn primary">🎁 something appeared →</button></div>`);
        const sig=s.querySelector('.sig'); sig ? s.insertBefore(w,sig) : s.appendChild(w);
        S('chime'); w.querySelector('button').onclick=()=>{S('whoosh');sceneBox()}; },1500); }
  });
}

function sceneBox(){
  const g=GAME.box;
  const s=show(`<div class="kicker">final level</div>${Art.heart('#ff6f9c',110)}
    <h2>${g.score}</h2><p class="dim">🔓 ${g.unlocked}</p>
    <div class="stack"><button class="btn primary" id="o">${g.button}</button></div>`);
  s.querySelector('#o').onclick=()=>{
    S('success'); burst(200,.4); setTimeout(()=>burst(130,.5),380); setTimeout(()=>burst(100,.6),760);
    critterStorm(36);
    const t=show(`${Art.ecg(340)}<p class="big serif" id="a"></p>
      <div class="stack"><button class="btn primary" id="n" style="opacity:0">${g.next}</button></div>`);
    (async()=>{ await type(t.querySelector('#a'),g.after,28);
      nextBtn(t,()=>{ save('done',true); sceneCountdown(true); }); })();
  };
}

/* ============================================================ PHASE 2 */
function sceneCountdown(justUnlocked){
  const d=daysLeft(), msg=COUNTDOWN_MESSAGES[d]||COUNTDOWN_FALLBACK;
  const s=show(`
    ${justUnlocked?'<div class="kicker">🔓 you unlocked the next part</div>'
                  :`<div class="kicker">for <span class="nick">${CONFIG.name}</span></div>`}
    <h1 style="margin-bottom:.1em">${d===1?'tomorrow.':d+(d===1?' day':' days')}</h1>
    ${Art.ecg(300)}
    <div class="clock">
      <div class="unit"><b id="dd">--</b><span>days</span></div>
      <div class="unit"><b id="hh">--</b><span>hrs</span></div>
      <div class="unit"><b id="mm">--</b><span>min</span></div>
      <div class="unit"><b id="ss">--</b><span>sec</span></div>
    </div>
    <div class="daily serif">${msg}</div>
    <div class="quote" id="qc"></div>
    <div class="stack"><button class="btn" id="scan">🩺 ${MEDICAL_REPORT.button}</button></div>
    <p class="dim" style="margin-top:22px;font-size:.82rem">come back tomorrow. it changes.</p>`);
  mountQuote(s.querySelector('#qc'), new Date().getDate()+d);
  const pad=n=>String(n).padStart(2,'0');
  const upd=()=>{ let ms=msLeft(); if(ms<0){location.reload();return}
    const dv=Math.floor(ms/86400000); ms-=dv*86400000;
    const h=Math.floor(ms/3600000); ms-=h*3600000;
    const m=Math.floor(ms/60000), sec=Math.floor((ms-m*60000)/1000);
    s.querySelector('#dd').textContent=pad(dv); s.querySelector('#hh').textContent=pad(h);
    s.querySelector('#mm').textContent=pad(m);  s.querySelector('#ss').textContent=pad(sec);
    if(sec%10===0) S('beep');
  };
  upd(); clearInterval(clockT); clockT=setInterval(upd,1000);
  if(justUnlocked){ burst(140,.3); S('success'); }
  Sound.pad(true);
  s.querySelector('#scan').onclick=()=>{S('whoosh');sceneReport()};
  startCritters();
}

function sceneReport(){
  clearInterval(clockT);
  const R=MEDICAL_REPORT;
  const s=show(`<div class="kicker">${R.scanning}</div>${Art.stetho(70)}
    <div class="meter"><i id="m"></i></div>
    <div class="report" id="rep" style="opacity:0;transition:opacity .6s">
      <div class="hd">${R.header.map(h=>`${h[0]}: ${h[1]}`).join('<br>')}</div>
      ${R.rows.map(r=>`<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}
      <div class="dx">${R.diagnosis}<br>${R.prognosis}</div>
    </div>
    <div class="rx" id="rx" style="opacity:0;transition:opacity .6s">
      <h3>${R.rx.title}</h3>${R.rx.lines.join('<br>')}
      <div style="margin-top:12px;border-top:1px dashed var(--line);padding-top:8px;color:var(--dim)">— ${CONFIG.yourName}</div>
    </div>
    <div class="stack"><button class="btn" id="back">← back to the countdown</button></div>`);
  const bar=s.querySelector('#m'); let p=0;
  const iv=setInterval(()=>{
    p+=Math.random()*7; bar.style.width=Math.min(p,100)+'%'; S('beep');
    if(p>=100){ clearInterval(iv); s.querySelector('#rep').style.opacity='1';
      setTimeout(()=>{ s.querySelector('#rx').style.opacity='1'; S('chime'); burst(50,.5); },1000); }
  },130);
  s.querySelector('#back').onclick=()=>{S('whoosh');sceneCountdown(false)};
}

/* ============================================================ PHASE 3 */
function sceneBirthday(){
  stopCritters();
  const B=BIRTHDAY_MODE;
  const s=show(`<div class="kicker">${B.date}</div><h1>${B.headline}</h1>
    ${Art.ecg(320)}<p class="big serif">${B.greeting}</p>
    <div class="stack"><button class="btn primary" id="go">🎂 there's a cake →</button></div>`);
  Sound.boot(); Sound.pad(true);
  burst(220,.35); setTimeout(()=>burst(150,.5),420); setTimeout(()=>burst(120,.6),840);
  setTimeout(()=>Sound.birthdaySong(), 600);
  s.querySelector('#go').onclick=()=>{S('whoosh');sceneCake()};
  startCritters();
}

function sceneCake(){
  const C=BIRTHDAY_MODE.cake;
  const s=show(`<div class="kicker">${C.prompt}</div>${Art.cake(230)}
    <p class="dim">${C.sub}</p><div class="meter"><i id="lvl"></i></div>
    <div class="stack"><button class="btn" id="mic">🎤 use my mic</button></div>`);
  const candles=[...s.querySelectorAll('.candle')]; let out=0;
  const blow=()=>{
    if(out>=candles.length) return;
    candles[out++].classList.add('out'); S('pop');
    if(out===candles.length){
      burst(180,.4); S('success');
      setTimeout(()=>{ const w=show(`${Art.heart('#ff6f9c',110)}<h2 class="serif">${C.done}</h2>
        <div class="stack"><button class="btn primary" id="n" style="opacity:1">done ❤️</button></div>`);
        w.querySelector('#n').onclick=()=>{S('whoosh');sceneWish(0)}; },1200);
    }
  };
  candles.forEach(c=>c.addEventListener('pointerdown',blow));
  s.querySelector('.cakeart').addEventListener('pointerdown',blow);
  s.querySelector('#mic').onclick=async e=>{
    try{
      const st=await navigator.mediaDevices.getUserMedia({audio:true});
      e.target.textContent='blow! 🎤'; e.target.disabled=true;
      const ac=new (window.AudioContext||window.webkitAudioContext)();
      const an=ac.createAnalyser(); an.fftSize=512; ac.createMediaStreamSource(st).connect(an);
      const buf=new Uint8Array(an.frequencyBinCount), bar=s.querySelector('#lvl');
      const loop=()=>{ an.getByteFrequencyData(buf);
        const v=buf.reduce((a,b)=>a+b,0)/buf.length;
        bar.style.width=Math.min(v*2.2,100)+'%';
        if(v>42) blow();
        if(out<candles.length) requestAnimationFrame(loop);
        else { st.getTracks().forEach(t=>t.stop()); ac.close(); } };
      loop();
    }catch(err){ toast("mic said no. just tap the candles 🕯️"); }
  };
}

function sceneWish(i){
  const B=BIRTHDAY_MODE;
  if(i>=B.wishes.length) return sceneFinale();
  const s=show(`<div class="kicker">wish ${String(i+1).padStart(2,'0')} / ${String(B.wishes.length).padStart(2,'0')}</div>
    <p class="typed serif" id="w"></p>
    ${i%3===2?`<div class="quote" id="qc"></div>`:''}
    <div class="stack"><button class="btn primary" id="n" style="opacity:0">${i===B.wishes.length-1?'…one more thing →':B.wishButton}</button></div>`);
  mountQuote(s.querySelector('#qc'), i);
  (async()=>{ await type(s.querySelector('#w'),B.wishes[i],25); S('sparkle'); burst(24,.55);
    nextBtn(s,()=>sceneWish(i+1)); })();
}

function sceneFinale(){
  stopCritters();
  const B=BIRTHDAY_MODE;
  document.body.style.transition='background 3s';
  document.body.style.background='radial-gradient(120% 90% at 50% 20%,#3a0f22 0%,#0d0308 72%)';
  const s=show(`<p class="typed serif" id="l" style="min-height:5.5em"></p>
    <div class="stack"><button class="btn primary" id="n" style="opacity:0">❤️</button></div>`);
  const l=s.querySelector('#l');
  (async()=>{
    for(const line of B.finale){ await type(l,line,55); await new Promise(r=>setTimeout(r,1600)); }
    l.innerHTML=''; const fh=$(`<h1 class="serif">${B.finalLine}</h1>`); l.appendChild(fh); wrapEmojiIn(fh);
    l.appendChild($(`<div>${Art.heart('#ff6f9c',70)}</div>`));
    Sound.birthdaySong(); S('success');
    burst(260,.35); setTimeout(()=>burst(190,.5),520); setTimeout(()=>burst(150,.65),1040);
    nextBtn(s,()=>{ burst(160,.5); S('sparkle');
      if(!s.querySelector('#again')){
        s.querySelector('.stack').appendChild($(`<button class="btn" id="again">↻ play it again</button>`));
        s.querySelector('#again').onclick = restart;
      }
    });
  })();
}

/* ---------- router ---------- */
/* preview overrides for testing:  ?stage=game | countdown | birthday | cake | wishes | finale */
const forced = new URLSearchParams(location.search).get('stage');
const STAGES = { game:()=>sceneGate(), countdown:()=>sceneCountdown(false), birthday:()=>sceneBirthday(),
                 cake:()=>sceneCake(), wishes:()=>sceneWish(0), finale:()=>sceneFinale(), report:()=>sceneReport(),
                 storm:()=>{ sceneCountdown(false); critterStorm(36); } };
if(forced && STAGES[forced]) STAGES[forced]();
else {
  const p=phase();
  if(p==='birthday'||p==='after') sceneBirthday();
  else if(load('done',false)) sceneCountdown(false);
  else sceneGate();
}
})();
