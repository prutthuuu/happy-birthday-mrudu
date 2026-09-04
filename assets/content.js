/* ============================================================
   CONTENT.JS  —  EDIT THIS FILE, NOTHING ELSE.
   Every word she sees lives here.  // TODO = replace with your real stuff
   ============================================================ */

const CONFIG = {
  name: "Mrudu",
  birthday: { year: 2026, month: 9, day: 30 },
  timezoneOffsetMinutes: 330,        // IST
  age: null,                         // TODO: her age, e.g. 21
  yourName: "prutthu",               // what she calls you — signs the prescription
  signature: "with love, your favourite prutthu ❤️",   // the line at the bottom of every screen
  song: null                         // TODO: drop an mp3 in assets/ and put "assets/song.mp3"
};

const NICKNAMES = ["Mrudu","Mrudu Muddu","Mrudu Baby","Mrudu Putta","Dr. Mrudu","Mrudula"];

/* ---------- literary quotes ---------- */
/* These fade in through the countdown, one per visit. Real books, real authors. */
const QUOTES = [
  { t:"She walks in beauty, like the night<br>Of cloudless climes and starry skies;<br>And all that's best of dark and bright<br>Meet in her aspect and her eyes.", a:"Lord Byron", w:"She Walks in Beauty, 1814" },
  { t:"Shall I compare thee to a summer's day?<br>Thou art more lovely and more temperate.", a:"William Shakespeare", w:"Sonnet 18" },
  { t:"A thing of beauty is a joy for ever:<br>Its loveliness increases; it will never<br>Pass into nothingness.", a:"John Keats", w:"Endymion" },
  { t:"I love you as certain dark things are to be loved,<br>in secret, between the shadow and the soul.", a:"Pablo Neruda", w:"Sonnet XVII" },
  { t:"You pierce my soul. I am half agony, half hope.", a:"Jane Austen", w:"Persuasion" },
  { t:"Whatever our souls are made of, his and mine are the same.", a:"Emily Brontë", w:"Wuthering Heights" },
  { t:"We loved with a love that was more than love —<br>I and my Annabel Lee —<br>with a love that the winged seraphs of Heaven<br>coveted her and me.", a:"Edgar Allan Poe", w:"Annabel Lee" },
  { t:"She seems a creature come down from heaven to earth<br>to show forth a miracle.", a:"Dante Alighieri", w:"La Vita Nuova" },
  { t:"You who suffer because you love, love still more.<br>To die of love, is to live by it.", a:"Victor Hugo", w:"Les Misérables" },
  { t:"Let the beauty of what you love be what you do.", a:"Rumi", w:"" },
  { t:"You are the evening cloud floating in the sky of my dreams.", a:"Rabindranath Tagore", w:"The Gardener" },
  { t:"He is more myself than I am.<br>Whatever our souls are made of, his and mine are the same.", a:"Emily Brontë", w:"Wuthering Heights" }
];

/* ---------- PHASE 1 : THE GAME ---------- */

const GAME = {
  gate: {
    lines: ["Wait.", "Where do you think you're going, Mrudu? 👀", "You don't get in that easily."],
    button: "okay fine 😭"
  },

  catchCat: {
    title: "LEVEL 01", prompt: "Catch the cat.", sub: "Should be easier than getting you to reply.",
    misses: ["nope.","Mrudu. seriously?","the cat is faster than you.","okay it's letting you win now."],
    win: "Meow. Fine. You may pass.", points: 10
  },

  sides: {
    title: "LEVEL 02", prompt: "Pick a side.",
    options: [
      { label:"Team Cat", art:"cat", reply:"Correct. The cat council has approved you." },
      { label:"Team Dog", art:"dog", reply:"Acceptable. But the cats are watching you now." }
    ], points: 15
  },

  questions: [
    { title:"LEVEL 03", q:"What do I call you the most?",
      options:[
        {label:"Mrudula", reply:"Only when you're in trouble."},
        {label:"Mrudu", reply:"The default. The classic."},
        {label:"Mrudu Putta", reply:"Reserved for when you're being unbearably cute."},
        {label:"everything except Mrudula", reply:"Correct answer. Obviously."}
      ], points:15 },

    { title:"LEVEL 04", q:"Where did this whole disaster start?",
      options:[{label:"Snapchat"},{label:"Instagram"},{label:"a phone call"},{label:"I refuse to answer"}],
      reveal:"Snapchat. One snap. That was genuinely all it took for me to decide I needed to talk to this person. Anyway. Don't read too much into that. →",
      points:20 },

    { title:"LEVEL 05", q:"In a few years, what do I have to start calling you?",
      options:[
        {label:"Doctor Mrudu", reply:"Correct. And I will say it insufferably often."},
        {label:"Dr. Mrudula, MBBS", reply:"The full government name. Terrifying."},
        {label:"still Mrudu Putta", reply:"Also correct. The degree changes nothing."},
        {label:"ma'am", reply:"Absolutely not. Never. Don't push it."}
      ], points:15 },

    { title:"LEVEL 06", q:"Be honest — who talks more?",
      options:[
        {label:"me", reply:"Finally. Some honesty on this website."},
        {label:"you", reply:"Bold. Incorrect. But bold."},
        {label:"both equally", reply:"Diplomatic. Cowardly. Noted."},
        {label:"the cat", reply:"...okay, fair."}
      ], points:15 }
  ],

  bubbles: {
    title:"LEVEL 07", prompt:"Open all six.", sub:"No skipping. I'll know.",
    items:[
      { art:"heart", text:"You genuinely made these six months better. That one isn't a joke." },
      { art:"cat",   text:"The cat has been assigned to protect you. It takes this extremely seriously." },
      { art:"dog",   text:"The dog says you're cute. The dog has no reason to lie." },
      { art:"star",  text:"Certified opinion: you look like someone drew an angel and got it slightly too accurate." },
      { art:"stetho",text:"Future doctor. Saving lives. Meanwhile I can't even save this conversation when you go quiet." },
      { art:"heart", text:"We've never even met. Not once. And you still somehow know me better than people who've had years." }
    ], points:25 },

  box: {
    score:"115 / 115 Mrudu Points", unlocked:"SECRET UNLOCKED", button:"open it",
    after:"Congratulations, Mrudu. You've successfully wasted several minutes of your life on a website I built specifically to waste several minutes of your life. ❤️",
    next:"but wait —"
  }
};

/* ---------- PHASE 2 : COUNTDOWN ---------- */

const COUNTDOWN_MESSAGES = {
  26:"26 days to go. That's 26 days of me pretending this website doesn't exist. Please act surprised later.",
  25:"25 days. Clinical update: cuteness rising. Age, unfortunately, doing the same thing.",
  24:"24 days. The cat has started planning. The dog is emotionally unprepared.",
  23:"23 days. Reminder: you're lovely. Don't let it go to your head.",
  22:"22 days. Somewhere out there a cake has no idea what's coming.",
  21:"21 days. Three weeks. That's 21 more days of you leaving me on read. Historic.",
  20:"20 days. Two zero. I'm running out of ways to make numbers exciting.",
  19:"19 days. Six months of knowing you and I already can't imagine the day without the notification.",
  18:"18 days. The cat says hi. The cat also says you're pretty. I'm just the messenger.",
  17:"17 days. Status: still cute, still chaotic, still my problem.",
  16:"16 days. MBBS — Mrudu's Beauty Beyond Standards. I'll see myself out.",
  15:"15 days. Halfway. Performance so far: satisfactory. Continue.",
  14:"14 days. Two weeks. The birthday department has moved to yellow alert.",
  13:"13 days. Unlucky for everyone except you, obviously.",
  12:"12 days. I'd tell you what I'm planning, but you'd get excited too early and ruin it.",
  11:"11 days. You're going to spend your life making people feel better. You already started early, for the record.",
  10:"10 DAYS. Double digits for the last time. Savour it.",
  9:"9 days. The dog has been rehearsing. It's not going well.",
  8:"8 days. Genuinely cannot wait. That's the whole message.",
  7:"7 days. One week until Dr. Mrudu officially levels up.",
  6:"6 days. Six months of you, six days to go. Someone up there is doing symmetry.",
  5:"5 days. Reminder: you're beautiful. That's not a birthday thing, that's just a Tuesday fact.",
  4:"4 days. I'm nervous and I don't know why. Somehow this is your fault.",
  3:"3 DAYS. I'm running out of ways to tell you how pretty you are. Actually — no I'm not.",
  2:"2 days. Tomorrow is almost tomorrow. Sleep is now optional.",
  1:"TOMORROW. It's tomorrow, Mrudu. Sleep well. You're going to need it."
};
const COUNTDOWN_FALLBACK = "Still counting. Still thinking about it. Still not telling you.";

const CRITTER_LINES = [
  { art:"cat",  t:"Mrudu says hi. (The cat is lying. I said hi.)" },
  { art:"dog",  t:"Your birthday is coming. The dog is aware." },
  { art:"heart",t:"Someone thinks you're pretty." },
  { art:"star", t:"You're glowing today. Yes, today specifically." },
  { art:"cat",  t:"The cat requests that you stop looking like that. It's distracting." },
  { art:"dog",  t:"10/10 would be your friend again." },
  { art:"heart",t:"Hey. Just checking you're okay. That's all." },
  { art:"star", t:"Somewhere a patient is lucky you exist and doesn't know it yet." }
];

/* the beauty detector, but make it medical */
const MEDICAL_REPORT = {
  button:"run diagnostics",
  scanning:"EXAMINING PATIENT...",
  header:[["PATIENT","Mrudula"],["PHYSICIAN","Dr. Mrudu (conflict of interest noted)"]],
  rows:[
    ["Pulse","racing (mine, not hers)"],
    ["Cuteness","99.8% — above reportable limit"],
    ["Smile","category 5"],
    ["Sleep","critically deficient (MBBS-related)"],
    ["Attitude","questionable"],
    ["Reply speed","under investigation"],
    ["Lovability","∞"]
  ],
  diagnosis:"DIAGNOSIS: Terminal adorability.",
  prognosis:"PROGNOSIS: No known cure. Do not seek treatment.",
  rx:{ title:"℞", lines:["One (1) Mrudu","Sig: once daily, preferably at 2am","Refills: unlimited"] }
};

/* ---------- PHASE 3 : THE BIRTHDAY ---------- */

const BIRTHDAY_MODE = {
  date:"September 30",
  headline:"TODAY IS ABOUT YOU.",
  greeting:"Happy Birthday, Mrudu Muddu.",
  cake:{ prompt:"blow out the candles", sub:"use your mic, or just tap them", done:"make a wish. a real one." },
  wishButton:"another one 💌",
  wishes:[
    "Happy birthday to the only person alive who can be cute, chaotic, annoying and lovable in the same sentence. Genuinely impressive.",
    "Another year older. Still cute. Still irritating. Balance maintained. The universe remains stable.",
    "Happy birthday, Mrudu Putta. The cat sends its regards. The dog is inconsolable.",
    "One day soon people are going to call you Doctor and trust you with their lives. I've seen you argue about which cat video is funnier for forty minutes. Both things are true. Both things are you.",
    "If birthdays were handed out based on cuteness you'd get one monthly. The system is clearly broken.",
    "Six months ago you were a random snap. Now you're the person I want to tell things to first. Wild how that happens.",
    "I hope this year is soft with you. I hope it quietly hands you every single thing you stopped asking for out loud.",
    "You have this way of making an ordinary day better just by turning up in it. I don't think you actually know that.",
    "We have never met. Not once. And you still somehow know me better than people who've had years."
  ],
  finale:[
    "Mrudu...",
    "out of everything I could have given you today —",
    "I wanted to give you something that cost me time.",
    "because you're worth it.",
    "and one day I'd really like to say all of this to your face instead of a screen."
  ],
  finalLine:"Happy Birthday, Mrudu Putta. ❤️"
};
