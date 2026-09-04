/* engine — you shouldn't need to edit this. all words live in content.js */
(() => {
const $ = (h) => { const d=document.createElement('div'); d.innerHTML=h.trim(); return d.firstElementChild; };
const stage = document.getElementById('stage');
const rand = (a) => a[Math.floor(Math.random()*a.length)];
const save = (k,v)=>{ try{localStorage.setItem('mrudu_'+k,JSON.stringify(v))}catch(e){} };
const load = (k,d)=>{ try{const v=localStorage.getItem('mrudu_'+k); return v?JSON.parse(v):d}catch(e){return d} };

/* ---------- time (locked to IST, never the device) ---------- */
function nowIST(){
  const d = new Date();
  return new Date(d.getTime() + (CONFIG.timezoneOffsetMinutes + d.getTimezoneOffset())*60000);
}
function bdayStartIST(){ return new Date(CONFIG.birthday.year, CONFIG.birthday.month-1, CONFIG.birthday.day, 0,0,0); }
function bdayEndIST(){ const s=bdayStartIST(); return new Date(s.getTime()+86400000); }
function msLeft(){ return bdayStartIST() - nowIST(); }
function daysLeft(){ return Math.max(0, Math.ceil(msLeft()/86400000)); }
function phase(){
  const n = nowIST();
  if (n >= bdayEndIST()) return 'after';
  if (n >= bdayStartIST()) return 'birthday';
  return 'pre';
}

/* ---------- confetti / fx ---------- */
const cv = document.getElementById('fx'), ctx = cv.getContext('2d');
let parts = [], raf = null;
function size(){ cv.width=innerWidth*devicePixelRatio; cv.height=innerHeight*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
size(); addEventListener('resize', size);
const COLORS = ['#ff9ec7','#c6a8ff','#ffd67e','#8fe0c4','#fff'];
function burst(n=90, y=0.35){
  for(let i=0;i<n;i++) parts.push({
    x: innerWidth/2 + (Math.random()-.5)*innerWidth*.7, y: innerHeight*y,
    vx:(Math.random()-.5)*9, vy:Math.random()*-11-3, g:.28,
    s:Math.random()*7+4, r:Math.random()*6, vr:(Math.random()-.5)*.3,
    c:rand(COLORS), life:1
  });
  if(!raf) tick();
}
function tick(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  parts = parts.filter(p=>p.life>0);
  parts.forEach(p=>{
    p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.life-=.006;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.globalAlpha=Math.max(0,p.life);
    ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6); ctx.restore();
  });
  raf = parts.length ? requestAnimationFrame(tick) : (ctx.clearRect(0,0,innerWidth,innerHeight), null);
}

/* ---------- toast ---------- */
const toastEl = document.getElementById('toast'); let tTimer;
function toast(msg){
  toastEl.textContent = msg; toastEl.classList.add('show');
  clearTimeout(tTimer); tTimer = setTimeout(()=>toastEl.classList.remove('show'), 4200);
}

/* ---------- roaming critters ---------- */
const critterBox = document.getElementById('critters');
function spawnCritter(){
  const c = rand(CRITTER_LINES);
  const el = $(`<div class="critter">${c.e}</div>`);
  const fromLeft = Math.random()>.5;
  el.style.top = (18 + Math.random()*64) + 'vh';
  el.style.left = fromLeft ? '-14vw' : '110vw';
  critterBox.appendChild(el);
  const dur = 11000 + Math.random()*7000;
  el.animate([{transform:`translateX(0)`},{transform:`translateX(${fromLeft?125:-125}vw)`}],
             {duration:dur, easing:'linear'}).onfinish = ()=>el.remove();
  el.addEventListener('click', ()=>{ toast(c.t); burst(24,.5); el.remove(); });
}
let critterTimer;
function startCritters(){ clearInterval(critterTimer); critterTimer = setInterval(()=>{ if(Math.random()>.35) spawnCritter(); }, 6500); setTimeout(spawnCritter, 2200); }
function stopCritters(){ clearInterval(critterTimer); critterBox.innerHTML=''; }

/* ---------- typewriter ---------- */
function type(el, text, speed=42){
  return new Promise(res=>{
    el.innerHTML=''; let i=0;
    const cur = $('<span class="cursor"></span>'); el.appendChild(cur);
    const iv = setInterval(()=>{
      if(i>=text.length){ clearInterval(iv); cur.remove(); res(); return; }
      cur.insertAdjacentText('beforebegin', text[i++]);
    }, speed);
  });
}

function show(html){ stage.innerHTML=''; const s=$(`<section class="scene">${html}</section>`); stage.appendChild(s); return s; }

/* ============================================================
   PHASE 1 — THE GAME
   ============================================================ */
let points = 0;
function addPoints(n){ points += n; }

function sceneGate(){
  const s = show(`
    <div class="kicker">🐱 access denied</div>
    <h1 id="gl"></h1>
    <p class="dim" id="gs"></p>
    <div class="stack"><button class="btn primary" id="go" style="opacity:0">${GAME.gate.button}</button></div>`);
  const l = s.querySelector('#gl');
  (async()=>{
    await type(l, GAME.gate.lines[0], 70);
    await new Promise(r=>setTimeout(r,450));
    await type(l, GAME.gate.lines[1], 38);
    s.querySelector('#gs').textContent = GAME.gate.lines[2];
    const b = s.querySelector('#go'); b.style.transition='opacity .6s'; b.style.opacity='1';
  })();
  s.querySelector('#go').onclick = sceneCat;
}

function sceneCat(){
  const g = GAME.catchCat;
  const s = show(`
    <div class="kicker">${g.title}</div>
    <h2>${g.prompt}</h2>
    <p class="dim">${g.sub}</p>
    <div id="arena" style="position:relative;height:44vh;width:100%;margin-top:10px"></div>
    <p class="dim" id="msg" style="min-height:1.5em"></p>`);
  const arena = s.querySelector('#arena'), msg = s.querySelector('#msg');
  const cat = $(`<div class="critter" style="position:absolute;font-size:2.6rem">🐱</div>`);
  arena.appendChild(cat);
  let misses = 0;
  const move = ()=>{
    // shrink the escape range as she misses — it always ends in a win
    const ease = Math.min(misses*0.18, 0.7);
    cat.style.left = (10 + Math.random()*(70*(1-ease))) + '%';
    cat.style.top  = (10 + Math.random()*(70*(1-ease))) + '%';
  };
  move();
  arena.addEventListener('pointerdown', e=>{
    if(e.target===cat) return;
    misses++; msg.textContent = g.misses[Math.min(misses-1, g.misses.length-1)]; move();
  });
  cat.addEventListener('pointerdown', e=>{
    e.stopPropagation(); addPoints(g.points); burst(70,.45);
    show(`<div class="cake">🐱</div><h2>${g.win}</h2>
          <div class="score">+${g.points} mrudu points</div>
          <div class="stack"><button class="btn primary" id="n">continue →</button></div>`)
      .querySelector('#n').onclick = sceneSides;
  });
}

function sceneSides(){
  const g = GAME.sides;
  const s = show(`
    <div class="kicker">${g.title}</div>
    <h2>${g.prompt}</h2>
    <div class="stack">${g.options.map((o,i)=>`<button class="btn" data-i="${i}">${o.label}</button>`).join('')}</div>`);
  s.querySelectorAll('.btn').forEach(b=> b.onclick = ()=>{
    const o = g.options[+b.dataset.i]; addPoints(g.points); burst(40,.5);
    save('side', o.label);
    show(`<h2 class="serif">${o.reply}</h2><div class="score">+${g.points} mrudu points</div>
          <div class="stack"><button class="btn primary" id="n">okay →</button></div>`)
      .querySelector('#n').onclick = ()=>sceneQuestion(0);
  });
}

function sceneQuestion(idx){
  if(idx >= GAME.questions.length) return sceneBubbles();
  const q = GAME.questions[idx];
  const s = show(`
    <div class="kicker">${q.title}</div>
    <h2>${q.q}</h2>
    <div class="stack">${q.options.map((o,i)=>`<button class="btn" data-i="${i}">${o.label}</button>`).join('')}</div>`);
  s.querySelectorAll('.btn').forEach(b=> b.onclick = ()=>{
    const o = q.options[+b.dataset.i]; addPoints(q.points); burst(34,.5);
    const reply = q.reveal || o.reply;  // reveal = same answer whatever she picks
    show(`<div class="reveal serif big">${reply}</div>
          <div class="score">+${q.points} mrudu points</div>
          <div class="stack"><button class="btn primary" id="n">next →</button></div>`)
      .querySelector('#n').onclick = ()=>sceneQuestion(idx+1);
  });
}

function sceneBubbles(){
  const g = GAME.bubbles;
  const s = show(`
    <div class="kicker">${g.title}</div>
    <h2>${g.prompt}</h2>
    <p class="dim">${g.sub}</p>
    <div class="reveal serif" id="rv">tap one 👇</div>
    <div class="bubbles">${g.items.map((it,i)=>`<button class="bub" data-i="${i}">${it.emoji}</button>`).join('')}</div>
    <p class="dim" id="left"></p>`);
  const rv = s.querySelector('#rv'), leftEl = s.querySelector('#left');
  let opened = 0;
  const refresh = ()=> leftEl.textContent = opened < g.items.length ? `${g.items.length-opened} left` : '';
  refresh();
  s.querySelectorAll('.bub').forEach(b=> b.onclick = ()=>{
    if(b.classList.contains('open')) return;
    b.classList.add('open'); opened++; refresh();
    rv.textContent = g.items[+b.dataset.i].text;
    burst(20,.55);
    if(opened === g.items.length){
      addPoints(g.points);
      setTimeout(()=>{
        const n = $(`<div class="stack"><button class="btn primary">🎁 something appeared →</button></div>`);
        s.appendChild(n); n.querySelector('button').onclick = sceneBox;
      }, 1400);
    }
  });
}

function sceneBox(){
  const g = GAME.box;
  const s = show(`
    <div class="kicker">final level</div>
    <div class="cake">🎁</div>
    <h2>${g.score}</h2>
    <p class="dim">${g.unlocked}</p>
    <div class="stack"><button class="btn primary" id="o">${g.button}</button></div>`);
  s.querySelector('#o').onclick = ()=>{
    burst(190,.4); setTimeout(()=>burst(120,.5),350); setTimeout(()=>burst(90,.6),700);
    const t = show(`<div class="cake">🎉</div><p class="big serif" id="a"></p>
                    <div class="stack"><button class="btn primary" id="n" style="opacity:0">${g.next}</button></div>`);
    (async()=>{
      await type(t.querySelector('#a'), g.after, 30);
      const b=t.querySelector('#n'); b.style.transition='opacity .8s'; b.style.opacity='1';
      b.onclick = ()=>{ save('done', true); sceneCountdown(true); };
    })();
  };
}

/* ============================================================
   PHASE 2 — COUNTDOWN
   ============================================================ */
let clockTimer;
function sceneCountdown(justUnlocked){
  const d = daysLeft();
  const msg = COUNTDOWN_MESSAGES[d] || COUNTDOWN_FALLBACK;
  const s = show(`
    ${justUnlocked ? '<div class="kicker">🔓 you unlocked the next part</div>' : `<div class="kicker">for <span class="nick">${CONFIG.name}</span></div>`}
    <h1 style="margin-bottom:.15em">${d === 1 ? 'tomorrow.' : d + (d===1?' day':' days')}</h1>
    <div class="clock">
      <div class="unit"><b id="dd">--</b><span>days</span></div>
      <div class="unit"><b id="hh">--</b><span>hrs</span></div>
      <div class="unit"><b id="mm">--</b><span>min</span></div>
      <div class="unit"><b id="ss">--</b><span>sec</span></div>
    </div>
    <div class="daily serif">${msg}</div>
    <div class="stack"><button class="btn" id="scan">${BEAUTY_REPORT.button}</button></div>
    <p class="dim" style="margin-top:24px;font-size:.82rem">come back tomorrow. it changes. 🐱</p>`);

  const pad = n => String(n).padStart(2,'0');
  const upd = ()=>{
    let ms = msLeft(); if(ms<0){ location.reload(); return; }
    const dv=Math.floor(ms/86400000); ms-=dv*86400000;
    const h=Math.floor(ms/3600000); ms-=h*3600000;
    const m=Math.floor(ms/60000); const sec=Math.floor((ms-m*60000)/1000);
    s.querySelector('#dd').textContent=pad(dv); s.querySelector('#hh').textContent=pad(h);
    s.querySelector('#mm').textContent=pad(m);  s.querySelector('#ss').textContent=pad(sec);
  };
  upd(); clearInterval(clockTimer); clockTimer = setInterval(upd, 1000);
  if(justUnlocked) burst(120,.3);
  s.querySelector('#scan').onclick = sceneReport;
  startCritters();
}

function sceneReport(){
  clearInterval(clockTimer);
  const R = BEAUTY_REPORT;
  const s = show(`
    <div class="kicker">${R.scanning}</div>
    <div class="meter"><i id="m"></i></div>
    <div class="report" id="rows" style="opacity:0;transition:opacity .5s"></div>
    <p class="reveal serif" id="err" style="opacity:0;transition:opacity .6s">${R.error}</p>
    <div class="stack"><button class="btn" id="back">← back to the countdown</button></div>`);
  const bar = s.querySelector('#m'); let p=0;
  const iv = setInterval(()=>{
    p += Math.random()*7; bar.style.width = Math.min(p,100)+'%';
    if(p>=100){
      clearInterval(iv);
      s.querySelector('#rows').innerHTML = R.rows.map(r=>`<div class="row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
      s.querySelector('#rows').style.opacity='1';
      setTimeout(()=>{ s.querySelector('#err').style.opacity='1'; burst(50,.5); }, 900);
    }
  }, 120);
  s.querySelector('#back').onclick = ()=>sceneCountdown(false);
}

/* ============================================================
   PHASE 3 — BIRTHDAY
   ============================================================ */
function sceneBirthday(){
  stopCritters();
  const B = BIRTHDAY_MODE;
  const s = show(`
    <div class="kicker">${B.date}</div>
    <h1>${B.headline}</h1>
    <p class="big serif">${B.greeting}</p>
    <div class="stack"><button class="btn primary" id="go">🎂 there's a cake →</button></div>`);
  burst(200,.35); setTimeout(()=>burst(140,.5),420); setTimeout(()=>burst(110,.6),840);
  s.querySelector('#go').onclick = sceneCake;
  startCritters();
}

function sceneCake(){
  const C = BIRTHDAY_MODE.cake;
  const s = show(`
    <div class="kicker">${C.prompt}</div>
    <div class="flames" id="f">${'<span class="flame">🔥</span>'.repeat(5)}</div>
    <div class="cake">🎂</div>
    <p class="dim">${C.sub}</p>
    <div class="meter"><i id="lvl"></i></div>
    <div class="stack"><button class="btn" id="mic">🎤 use my mic</button></div>`);
  const flames = [...s.querySelectorAll('.flame')];
  let out = 0;
  const blow = ()=>{
    if(out >= flames.length) return;
    flames[out++].classList.add('out');
    if(out === flames.length){
      burst(170,.4);
      setTimeout(()=>{
        show(`<div class="cake">✨</div><h2 class="serif">${C.done}</h2>
              <div class="stack"><button class="btn primary" id="n">done ❤️</button></div>`)
          .querySelector('#n').onclick = ()=>sceneWishes(0);
      }, 1100);
    }
  };
  flames.forEach(f=> f.addEventListener('pointerdown', blow));
  s.querySelector('.cake').addEventListener('pointerdown', blow);
  // mic is a bonus — taps always work, so it can never trap her
  s.querySelector('#mic').onclick = async (e)=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      e.target.textContent = 'blow! 🎤'; e.target.disabled = true;
      const ac = new (window.AudioContext||window.webkitAudioContext)();
      const an = ac.createAnalyser(); an.fftSize = 512;
      ac.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const bar = s.querySelector('#lvl');
      const loop = ()=>{
        an.getByteFrequencyData(buf);
        const v = buf.reduce((a,b)=>a+b,0)/buf.length;
        bar.style.width = Math.min(v*2.2,100)+'%';
        if(v > 42) blow();
        if(out < flames.length) requestAnimationFrame(loop);
        else { stream.getTracks().forEach(t=>t.stop()); ac.close(); }
      };
      loop();
    }catch(err){ toast("mic said no. just tap the candles 🕯️"); }
  };
}

function sceneWishes(i){
  const B = BIRTHDAY_MODE;
  if(i >= B.wishes.length) return sceneFinale();
  const s = show(`
    <div class="kicker">wish ${String(i+1).padStart(2,'0')} / ${String(B.wishes.length).padStart(2,'0')}</div>
    <p class="typed serif" id="w"></p>
    <div class="stack"><button class="btn primary" id="n" style="opacity:0">${i===B.wishes.length-1?'…one more thing →':B.wishButton}</button></div>`);
  (async()=>{
    await type(s.querySelector('#w'), B.wishes[i], 26);
    burst(22,.55);
    const b = s.querySelector('#n'); b.style.transition='opacity .6s'; b.style.opacity='1';
    b.onclick = ()=>sceneWishes(i+1);
  })();
}

function sceneFinale(){
  stopCritters();
  const B = BIRTHDAY_MODE;
  document.body.style.transition='background 2.5s';
  document.body.style.background='radial-gradient(120% 90% at 50% 20%,#191033 0%,#07040f 70%)';
  const s = show(`<p class="typed serif" id="l" style="min-height:5em"></p>
                  <div class="stack"><button class="btn primary" id="n" style="opacity:0">❤️</button></div>`);
  const l = s.querySelector('#l');
  (async()=>{
    for(const line of B.finale){
      await type(l, line, 55);
      await new Promise(r=>setTimeout(r, 1500));
    }
    l.innerHTML = '';
    const h = $(`<h1 class="serif">${B.finalLine}</h1>`); l.appendChild(h);
    burst(240,.35); setTimeout(()=>burst(180,.5),500); setTimeout(()=>burst(140,.65),1000);
    const b=s.querySelector('#n'); b.style.transition='opacity 1s'; b.style.opacity='1';
    b.onclick = ()=>{ burst(120,.5); };
  })();
}

/* ---------- router ---------- */
function boot(){
  const p = phase();
  if(p === 'birthday' || p === 'after'){ sceneBirthday(); return; }
  if(load('done', false)) sceneCountdown(false);
  else sceneGate();
}
boot();
})();
