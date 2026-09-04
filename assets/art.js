/* hand-drawn SVG art — no emoji. all scale to any size. */
const Art = {

cat(c='#ffc9e0', s=120){ return `
<svg class="art cat" viewBox="0 0 120 124" width="${s}" aria-hidden="true">
  <g class="tail-g"><path class="tail" d="M90 96 q26 2 26 -22 q0 -16 -14 -16" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/></g>
  <ellipse cx="60" cy="94" rx="30" ry="22" fill="${c}"/>
  <ellipse cx="46" cy="112" rx="9" ry="6" fill="#fff" opacity=".55"/>
  <ellipse cx="74" cy="112" rx="9" ry="6" fill="#fff" opacity=".55"/>
  <path d="M37 32 L31 6 L55 24 Z" fill="${c}"/>
  <path d="M83 32 L89 6 L65 24 Z" fill="${c}"/>
  <path d="M39 30 L35 14 L50 25 Z" fill="#ff8fb8" opacity=".6"/>
  <path d="M81 30 L85 14 L70 25 Z" fill="#ff8fb8" opacity=".6"/>
  <circle cx="60" cy="52" r="27" fill="${c}"/>
  <g stroke="#fff0f6" stroke-width="1.8" opacity=".7" stroke-linecap="round">
    <path d="M32 54 H12"/><path d="M33 61 L15 66"/><path d="M88 54 H108"/><path d="M87 61 L105 66"/>
  </g>
  <circle cx="42" cy="60" r="6" fill="#ff8fb8" opacity=".38"/>
  <circle cx="78" cy="60" r="6" fill="#ff8fb8" opacity=".38"/>
  <g class="blink">
    <ellipse cx="50" cy="50" rx="4.6" ry="6" fill="#3a1226"/><ellipse cx="70" cy="50" rx="4.6" ry="6" fill="#3a1226"/>
    <circle cx="51.8" cy="47.6" r="1.8" fill="#fff"/><circle cx="71.8" cy="47.6" r="1.8" fill="#fff"/>
  </g>
  <path d="M60 60 l-3.5 2.6 h7 Z" fill="#ff6f9c"/>
  <path d="M60 63 v3 M60 66 q-5 4 -8 .5 M60 66 q5 4 8 .5" stroke="#3a1226" stroke-width="1.9" fill="none" stroke-linecap="round"/>
</svg>`},

dog(c='#f6c98d', s=120){ return `
<svg class="art dog" viewBox="0 0 120 124" width="${s}" aria-hidden="true">
  <g class="tail-g"><path class="tail" d="M90 94 q24 -4 22 -26" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/></g>
  <ellipse cx="60" cy="94" rx="30" ry="22" fill="${c}"/>
  <ellipse cx="46" cy="112" rx="9" ry="6" fill="#fff5e6" opacity=".7"/>
  <ellipse cx="74" cy="112" rx="9" ry="6" fill="#fff5e6" opacity=".7"/>
  <g class="ear-l"><ellipse cx="31" cy="52" rx="11" ry="24" fill="#d9a463"/></g>
  <g class="ear-r"><ellipse cx="89" cy="52" rx="11" ry="24" fill="#d9a463"/></g>
  <circle cx="60" cy="50" r="27" fill="${c}"/>
  <circle cx="43" cy="58" r="6" fill="#e8a86a" opacity=".45"/>
  <circle cx="77" cy="58" r="6" fill="#e8a86a" opacity=".45"/>
  <g class="blink">
    <ellipse cx="50" cy="45" rx="4.6" ry="5.8" fill="#3a1226"/><ellipse cx="70" cy="45" rx="4.6" ry="5.8" fill="#3a1226"/>
    <circle cx="51.8" cy="42.8" r="1.7" fill="#fff"/><circle cx="71.8" cy="42.8" r="1.7" fill="#fff"/>
  </g>
  <ellipse cx="60" cy="62" rx="15" ry="12" fill="#fbe3c4"/>
  <ellipse cx="60" cy="56" rx="5" ry="3.8" fill="#3a1226"/>
  <path d="M60 60 v4 M60 64 q-6 5 -10 1 M60 64 q6 5 10 1" stroke="#3a1226" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path class="tongue" d="M56 67 q4 11 8 0 Z" fill="#ff7aa8"/>
</svg>`},

/* the signature animation — an ECG that beats into a heart */
ecg(w=320){ return `
<svg class="art ecg" viewBox="0 0 300 80" width="100%" style="max-width:${w}px" aria-hidden="true">
  <path d="M0 40 H70 l8 -26 l9 52 l9 -40 l8 14 H150 l6 -8 l7 16 l6 -8 H300"
        fill="none" stroke="url(#eg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
        class="ecg-line"/>
  <defs><linearGradient id="eg" x1="0" x2="1">
    <stop offset="0" stop-color="#8fe0c4"/><stop offset=".5" stop-color="#ff9ec7"/><stop offset="1" stop-color="#c6a8ff"/>
  </linearGradient></defs>
</svg>`},

cake(s=200){ return `
<svg class="art cakeart" viewBox="0 0 200 190" width="${s}" aria-hidden="true">
  <g class="candles">
    ${[60,85,110,135].map((x,i)=>`
    <g class="candle" data-i="${i}">
      <g class="flame-g"><ellipse class="flame" cx="${x+2.5}" cy="42" rx="5" ry="9" fill="url(#fl)"/>
      <ellipse class="flame-in" cx="${x+2.5}" cy="45" rx="2.2" ry="4.4" fill="#fff6cf"/></g>
      <rect x="${x}" y="54" width="6" height="26" rx="3" fill="${['#ff9ec7','#c6a8ff','#8fe0c4','#ffd67e'][i]}"/>
    </g>`).join('')}
  </g>
  <rect x="34" y="80" width="132" height="34" rx="10" fill="#ffd9ea"/>
  <path d="M34 92 q16 12 26 0 q10 -12 22 0 q12 12 24 0 q12 -12 24 0 q10 12 16 0 v14 q0 8 -8 8 H42 q-8 0 -8 -8 Z" fill="#fff1f7"/>
  <rect x="26" y="112" width="148" height="40" rx="12" fill="#f6b8d6"/>
  <rect x="18" y="150" width="164" height="14" rx="7" fill="#e79ec1"/>
  <g fill="#fff" opacity=".85">
    <circle cx="56" cy="130" r="3"/><circle cx="90" cy="124" r="2.4"/><circle cx="124" cy="132" r="3"/><circle cx="150" cy="126" r="2.4"/>
  </g>
  <defs><radialGradient id="fl"><stop offset="0" stop-color="#fff3b0"/><stop offset="1" stop-color="#ff9d3d"/></radialGradient></defs>
</svg>`},

balloon(c='#ff9ec7', s=60){ return `
<svg class="art" viewBox="0 0 60 90" width="${s}" aria-hidden="true">
  <ellipse cx="30" cy="32" rx="22" ry="28" fill="${c}"/>
  <ellipse cx="22" cy="24" rx="6" ry="9" fill="#fff" opacity=".35"/>
  <path d="M30 60 l-5 7 h10 Z" fill="${c}"/>
  <path d="M30 67 q8 12 0 22" stroke="${c}" stroke-width="1.6" fill="none" opacity=".7"/>
</svg>`},

heart(c='#ff7aa8', s=40){ return `
<svg class="art heart" viewBox="0 0 32 30" width="${s}" aria-hidden="true">
  <path d="M16 28 C4 19 0 13 0 8.4 A8 8 0 0 1 16 6 A8 8 0 0 1 32 8.4 C32 13 28 19 16 28 Z" fill="${c}"/>
</svg>`},

stetho(s=64){ return `
<svg class="art" viewBox="0 0 64 64" width="${s}" aria-hidden="true">
  <path d="M18 8 v16 a14 14 0 0 0 28 0 V8" fill="none" stroke="#c6a8ff" stroke-width="4" stroke-linecap="round"/>
  <circle cx="18" cy="6" r="4" fill="#c6a8ff"/><circle cx="46" cy="6" r="4" fill="#c6a8ff"/>
  <path d="M32 38 v8 a10 10 0 0 0 20 0 v-4" fill="none" stroke="#ff9ec7" stroke-width="4" stroke-linecap="round"/>
  <circle cx="52" cy="38" r="7" fill="none" stroke="#ff9ec7" stroke-width="4"/>
</svg>`},

petal(c='#ffb3d1', s=18){ return `
<svg viewBox="0 0 20 20" width="${s}" aria-hidden="true"><path d="M10 0 C16 6 16 14 10 20 C4 14 4 6 10 0 Z" fill="${c}" opacity=".85"/></svg>`},

star(s=16){ return `
<svg viewBox="0 0 24 24" width="${s}" aria-hidden="true"><path d="M12 0 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 Z" fill="#ffd67e"/></svg>`}
};
