/* ============================================================
   CONTENT.JS  —  EDIT THIS FILE, NOTHING ELSE.
   Every word Mrudu sees lives here. Change freely.
   Lines marked  // TODO  are placeholders — replace them.
   ============================================================ */

const CONFIG = {
  name: "Mrudu",
  birthday: { year: 2026, month: 9, day: 30 }, // Sep 30
  timezoneOffsetMinutes: 330,                  // IST (UTC+5:30)
  age: null,                                   // TODO: e.g. 21 — shows "levels up to 21"
};

const NICKNAMES = ["Mrudu", "Mrudu Muddu", "Mrudu Baby", "Mrudu Putta", "Mrudula"];

/* ---------- PHASE 1 : THE GAME ---------- */

const GAME = {
  gate: {
    lines: [
      "Wait.",
      "Where do you think you're going, Mrudu? 👀",
      "You don't get in that easily."
    ],
    button: "okay fine 😭"
  },

  catchCat: {
    title: "LEVEL 01",
    prompt: "Catch the cat. 🐱",
    sub: "Should be easier than getting you to reply.",
    misses: ["nope.", "Mrudu. seriously?", "the cat is faster than you.", "okay it's letting you win now."],
    win: "Meow. Fine. You may continue. 🐱",
    points: 10
  },

  sides: {
    title: "LEVEL 02",
    prompt: "Pick a side.",
    options: [
      { label: "🐱 Team Cat", reply: "Correct. The cat council has approved you." },
      { label: "🐶 Team Dog", reply: "Acceptable. But the cats are watching you now." }
    ],
    points: 15
  },

  // No wrong answers anywhere. Every option gets its own reply.
  questions: [
    {
      title: "LEVEL 03",
      q: "What do I call you the most?",
      options: [
        { label: "Mrudula", reply: "Only when you're in trouble." },
        { label: "Mrudu", reply: "The default. The classic." },
        { label: "Mrudu Putta", reply: "This one's reserved for when you're being unbearably cute." },
        { label: "everything except Mrudula", reply: "Correct answer. Obviously." }
      ],
      points: 15
    },
    {
      title: "LEVEL 04",
      q: "Where did this whole disaster start?",
      options: [
        { label: "Snapchat", reply: "" },
        { label: "Instagram", reply: "" },
        { label: "a phone call", reply: "" },
        { label: "I refuse to answer", reply: "" }
      ],
      // same reveal no matter what she picks — this is the beat that matters
      reveal: "Snapchat. One snap. That was genuinely all it took for me to decide I needed to talk to this person. Anyway. Don't read too much into that. →",
      points: 20
    },
    {
      title: "LEVEL 05",
      q: "Be honest. Who talks more?",
      options: [
        { label: "me", reply: "Finally. Some honesty on this website." },
        { label: "you", reply: "Bold. Incorrect. But bold." },
        { label: "both equally", reply: "Diplomatic. Cowardly. Noted." },
        { label: "the cat", reply: "...actually yeah, fair." }
      ],
      points: 15
    }
  ],

  bubbles: {
    title: "LEVEL 06",
    prompt: "Open all six.",
    sub: "No skipping. I'll know.",
    items: [
      { emoji: "💗", text: "You genuinely made these six months better. That's not a joke one." },
      { emoji: "🐱", text: "The cat has been assigned to protect you. It takes this extremely seriously." },
      { emoji: "🐶", text: "The dog says you're cute. The dog has no reason to lie." },
      { emoji: "😂", text: "You are also, at times, deeply irritating. Balance must exist." },
      { emoji: "👀", text: "There's something I'm not going to say today. Ask me later. Or don't." },
      { emoji: "💌", text: "We've never even met. Not once. And you still somehow know me better than people who've known me for years." }
    ],
    points: 25
  },

  box: {
    score: "100 / 100 Mrudu Points",
    unlocked: "🔓 SECRET UNLOCKED",
    button: "open it",
    after: "Congratulations, Mrudu. You have successfully wasted several minutes of your life on a website I built specifically to waste several minutes of your life. ❤️",
    next: "but wait —"
  }
};

/* ---------- PHASE 2 : COUNTDOWN ---------- */
/* keyed by days remaining. add/edit freely. */

const COUNTDOWN_MESSAGES = {
  26: "26 days to go. That's 26 days of me pretending this website doesn't exist. Please act surprised later.",
  25: "25 days. Scientific update: your cuteness continues to rise. Your age, unfortunately, is doing the same thing.",
  24: "24 days. The cat has started planning. The dog is emotionally unprepared.",
  23: "23 days. Reminder: you're lovely. Don't let it go to your head.",
  22: "22 days. Somewhere out there a cake has no idea what's coming.",
  21: "21 days. Three weeks. That's 21 more days of you leaving me on read. Historic.",
  20: "20 days. Two zero. I'm running out of ways to make numbers exciting.",
  19: "19 days. Six months of knowing you and I already can't imagine my day without the notification.",
  18: "18 days. The cat says hi. The cat also says you're pretty. I'm just the messenger.",
  17: "17 days. Status report: still cute, still chaotic, still my problem.",
  16: "16 days. If cuteness were a crime you'd be serving a life sentence.",
  15: "15 days. Halfway. Performance so far: satisfactory. Continue.",
  14: "14 days. Two weeks. The birthday department has moved to yellow alert. 🚨",
  13: "13 days. Unlucky for everyone except you, obviously.",
  12: "12 days. I'd tell you what I'm planning, but you'd get excited too early and ruin it.",
  11: "11 days. Six months. Feels longer. In a good way. Mostly.",
  10: "10 DAYS. Double digits for the last time. Savour it.",
  9:  "9 days. The dog has been rehearsing. It's not going well.",
  8:  "8 days. Genuinely cannot wait. That's it, that's the whole message.",
  7:  "7 days. One week until Mrudu officially levels up. 🎮",
  6:  "6 days. Six months of you, six days to go. Someone up there is doing symmetry.",
  5:  "5 days. Reminder: you're beautiful. That's not a birthday thing, that's just a Tuesday fact.",
  4:  "4 days. I'm nervous and I genuinely don't know why. This is somehow your fault.",
  3:  "3 DAYS. I'm running out of ways to tell you how cute you are. Actually — no I'm not.",
  2:  "2 days. Tomorrow is almost tomorrow. Sleep is now optional.",
  1:  "TOMORROW. It's tomorrow, Mrudu. Sleep well. You're going to need it."
};

const COUNTDOWN_FALLBACK = "Still counting. Still thinking about it. Still not telling you.";

/* little things that walk across the screen — click them */
const CRITTER_LINES = [
  { e: "🐱", t: "Mrudu says hi. (The cat is lying, I said hi.)" },
  { e: "🐶", t: "Your birthday is coming. The dog is aware." },
  { e: "💗", t: "Someone thinks you're cute." },
  { e: "⭐", t: "You're glowing today. Yes, today specifically." },
  { e: "🐱", t: "The cat requests that you stop being this pretty. It's distracting." },
  { e: "🐶", t: "10/10 would be your friend again." },
  { e: "💭", t: "Hey. Just checking you're okay. That's all." }
];

const BEAUTY_REPORT = {
  button: "run diagnostics 🔍",
  scanning: "SCANNING MRUDU...",
  rows: [
    ["Cuteness", "99.8%"],
    ["Smile", "Dangerous"],
    ["Attitude", "Questionable"],
    ["Sleepiness", "Critical"],
    ["Reply speed", "Under investigation"],
    ["Lovability", "∞"]
  ],
  error: "ERROR — beauty level exceeds measurable limit. Please stop. Some of us are trying to function normally."
};

/* ---------- PHASE 3 : THE BIRTHDAY ---------- */

const BIRTHDAY_MODE = {
  date: "September 30",
  headline: "TODAY IS ABOUT YOU. ❤️",
  greeting: "Happy Birthday, Mrudu Muddu.",
  cake: {
    prompt: "blow out the candles 🎂",
    sub: "use your mic, or just tap them",
    done: "make a wish. a real one."
  },
  wishButton: "give me another wish 💌",
  // escalates: funny → cute → warm → real
  wishes: [
    "Happy birthday to the only person alive who can be cute, chaotic, annoying and lovable in the same sentence. Genuinely impressive.",
    "Another year older. Still cute. Still irritating. Balance maintained. The universe remains stable.",
    "Happy birthday, Mrudu Putta. The cat sends its regards. The dog is inconsolable.",
    "If birthdays were handed out based on cuteness you'd get one monthly. The system is clearly broken.",
    "Six months ago you were a random snap. Now you're the person I want to tell things to first. Wild how that happens.",
    "I hope this year is soft with you. I hope it quietly hands you every single thing you've stopped asking for out loud.",
    "You have this way of making an ordinary day better just by turning up in it. I don't think you actually know that.",
    "We have never met. Not once. And you still somehow know me better than people who've had years."
  ],
  finale: [
    "Mrudu...",
    "out of everything I could have given you today —",
    "I wanted to give you something that cost me time.",
    "because you're worth it.",
    "and one day I'd really like to say all of this to your face instead of a screen."
  ],
  finalLine: "Happy Birthday, Mrudu Putta. ❤️"
};
