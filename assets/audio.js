/* Web Audio — everything synthesised, no files to load.
   Mobile browsers require a user gesture first; we boot on her first tap. */
const Sound = (() => {
  let ac=null, master=null, padGain=null, on=load('sound',true), started=false;
  function load(k,d){ try{const v=localStorage.getItem('mrudu_'+k);return v?JSON.parse(v):d}catch(e){return d} }
  function save(k,v){ try{localStorage.setItem('mrudu_'+k,JSON.stringify(v))}catch(e){} }

  function boot(){
    if(started) return; started=true;
    ac = new (window.AudioContext||window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = on?0.9:0; master.connect(ac.destination);
  }
  const N = n => 440*Math.pow(2,(n-69)/12);           // midi -> hz
  const NAMES = {C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
  const note = s => { const m=s.match(/^([A-G]#?)(\d)$/); return N(NAMES[m[1]] + (+m[2]+1)*12); };

  function tone({freq, dur=.3, type='sine', vol=.25, at=.01, dec=null, when=0, detune=0}){
    if(!ac) return;
    const t = ac.currentTime + when;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type=type; o.frequency.value=freq; o.detune.value=detune;
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(vol,t+at);
    g.gain.exponentialRampToValueAtTime(.0001,t+(dec||dur));
    o.connect(g); g.connect(master); o.start(t); o.stop(t+(dec||dur)+.05);
  }

  /* --- ui sounds --- */
  const sfx = {
    tap:   ()=>tone({freq:660,dur:.09,type:'triangle',vol:.16}),
    pop:   ()=>{tone({freq:520,dur:.12,type:'sine',vol:.22});tone({freq:1040,dur:.09,type:'sine',vol:.1,when:.03})},
    chime: ()=>[0,.08,.16].forEach((w,i)=>tone({freq:note(['C6','E6','G6'][i]),dur:.5,type:'sine',vol:.15,when:w})),
    success:()=>['C5','E5','G5','C6'].forEach((n,i)=>tone({freq:note(n),dur:.45,type:'triangle',vol:.16,when:i*.09})),
    meow:  ()=>{ if(!ac)return; const o=ac.createOscillator(),g=ac.createGain();
             o.type='sawtooth'; const t=ac.currentTime;
             o.frequency.setValueAtTime(700,t); o.frequency.exponentialRampToValueAtTime(1100,t+.12);
             o.frequency.exponentialRampToValueAtTime(500,t+.34);
             g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.13,t+.05);
             g.gain.exponentialRampToValueAtTime(.0001,t+.4);
             const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=1800;
             o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t+.45); },
    woof:  ()=>{ if(!ac)return; const o=ac.createOscillator(),g=ac.createGain(); const t=ac.currentTime;
             o.type='square'; o.frequency.setValueAtTime(220,t); o.frequency.exponentialRampToValueAtTime(120,t+.16);
             g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.12,t+.02);
             g.gain.exponentialRampToValueAtTime(.0001,t+.22);
             const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=900;
             o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t+.3); },
    beep:  ()=>tone({freq:880,dur:.08,type:'square',vol:.09}),   // the ECG monitor
    whoosh:()=>{ if(!ac)return; const b=ac.createBuffer(1,ac.sampleRate*.4,ac.sampleRate); const d=b.getChannelData(0);
             for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
             const s=ac.createBufferSource(); s.buffer=b; const f=ac.createBiquadFilter();
             f.type='bandpass'; f.frequency.value=900; const g=ac.createGain(); g.gain.value=.14;
             s.connect(f); f.connect(g); g.connect(master); s.start(); },
    sparkle:()=>[0,.05,.11,.18].forEach((w,i)=>tone({freq:note(['G5','B5','D6','G6'][i]),dur:.6,type:'sine',vol:.1,when:w}))
  };

  /* --- ambient pad, very quiet, sits under everything --- */
  function pad(start=true){
    if(!ac) return;
    if(!start){ if(padGain){padGain.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+1.4);} return; }
    if(padGain) return;
    padGain = ac.createGain(); padGain.gain.value=.0001; padGain.connect(master);
    padGain.gain.exponentialRampToValueAtTime(.075, ac.currentTime+3);
    const f = ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=800; f.connect(padGain);
    ['C3','G3','C4','E4','G4'].forEach((n,i)=>{
      const o=ac.createOscillator(); o.type= i>2?'sine':'triangle'; o.frequency.value=note(n);
      o.detune.value=(Math.random()-.5)*9;
      const g=ac.createGain(); g.gain.value=[.3,.22,.18,.13,.1][i];
      const lfo=ac.createOscillator(), la=ac.createGain();
      lfo.frequency.value=.05+Math.random()*.09; la.gain.value=g.gain.value*.55;
      lfo.connect(la); la.connect(g.gain); lfo.start();
      o.connect(g); g.connect(f); o.start();
    });
  }

  /* --- Happy Birthday (public domain) --- */
  const HB = [['G4',.5],['G4',.25],['A4',.75],['G4',.75],['C5',.75],['B4',1.5],
              ['G4',.5],['G4',.25],['A4',.75],['G4',.75],['D5',.75],['C5',1.5],
              ['G4',.5],['G4',.25],['G5',.75],['E5',.75],['C5',.75],['B4',.75],['A4',1.5],
              ['F5',.5],['F5',.25],['E5',.75],['C5',.75],['D5',.75],['C5',1.75]];
  function birthdaySong(){
    if(!ac) return; let t=0; const bpm=.42;
    HB.forEach(([n,d])=>{
      tone({freq:note(n),dur:d*bpm*.95,type:'triangle',vol:.19,when:t,at:.02});
      tone({freq:note(n)/2,dur:d*bpm*.95,type:'sine',vol:.08,when:t,at:.02});
      t += d*bpm;
    });
    return t*1000;
  }

  document.addEventListener('pointerdown', ()=>{
    boot(); if(ac&&ac.state==='suspended') ac.resume(); if(on) pad(true);
  }, {once:false});

  return {
    boot, sfx, pad, birthdaySong,
    get enabled(){ return on; },
    toggle(){ on=!on; save('sound',on); if(master) master.gain.linearRampToValueAtTime(on?0.9:0, ac.currentTime+.2); return on; },
    play(k){ if(!on) return; boot(); if(ac&&ac.state==='suspended')ac.resume(); sfx[k] && sfx[k](); }
  };
})();
