/* ========================================================
   ROMANTIC DATE PROPOSAL INTERACTIVE LOGIC
   ======================================================== */

// DOM Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionCard = document.getElementById('questionCard');
const successCard = document.getElementById('successCard');
const subMessage = document.getElementById('subMessage');
const characterImg = document.getElementById('characterImg');
const replayBtn = document.getElementById('replayBtn');
const whatsappShareBtn = document.getElementById('whatsappShareBtn');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

// State
let noClickCount = 0;
let yesScale = 1;
let noScale = 1;
let isAudioPlaying = false;
let audioCtx = null;
let melodyInterval = null;

// Cute dynamic texts for "No" button
const noTexts = [
  "No 😢",
  "Are you sure? 🥺",
  "Really sure?? 💔",
  "Think again! 🌹",
  "Ek baar aur soch lo! 🧐",
  "Don't do this to me! 😭",
  "Pakka no?! 😿",
  "You're breaking my heart! 💔",
  "Look how big YES is getting! 👉",
  "You have no escape hehe 😏",
  "Just click YES already! 🥰",
  "Pleaseee Rani? 🥺❤️"
];

// Cute subtitle reactions
const subReactions = [
  "Think carefully before you answer... 😉",
  "Wait, did your finger slip? Try again! 😯",
  "Hey! Why are you clicking that side?! 🙈",
  "Look at the YES button, it's begging for your love! ✨",
  "Aww don't be so stubborn, just say yes! 🥹",
  "Bhagwan ji is watching, choose wisely! 😂",
  "The No button is disappearing soon! 🏃‍♂️💨",
  "There is only ONE true answer in your heart! 💖"
];

// Sad/pleading GIFs to switch when No is pressed
const pleadingGifs = [
  "https://media.tenor.com/efb3WjWn_vAAAAAj/cute-panda-hearts.gif",
  "https://media.tenor.com/T0b_x84c4_AAAAAj/bear-crying.gif",
  "https://media.tenor.com/3zYVpS4kS4cAAAAj/peach-goma-crying.gif",
  "https://media.tenor.com/8QzX3y8w3cAAAAAj/bubududu-crying.gif"
];

// Offline Cute SVG Bear Fallback in case internet connection is slow/offline
const fallbackCuteBear = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="65" r="40" fill="%23ffd5dc"/><circle cx="35" cy="35" r="15" fill="%23ffd5dc"/><circle cx="85" cy="35" r="15" fill="%23ffd5dc"/><circle cx="35" cy="35" r="9" fill="%23ff9ebb"/><circle cx="85" cy="35" r="9" fill="%23ff9ebb"/><circle cx="48" cy="58" r="5" fill="%2333202a"/><circle cx="72" cy="58" r="5" fill="%2333202a"/><circle cx="50" cy="56" r="1.5" fill="%23fff"/><circle cx="74" cy="56" r="1.5" fill="%23fff"/><ellipse cx="60" cy="72" rx="9" ry="6" fill="%23fff"/><ellipse cx="60" cy="70" rx="5" ry="3.5" fill="%2333202a"/><path d="M60 20 C60 20 48 6 36 18 C26 28 36 40 60 55 C84 40 94 28 84 18 C72 6 60 20 60 20 Z" fill="%23ff4b72"/></svg>`;

characterImg.addEventListener('error', () => {
  characterImg.src = fallbackCuteBear;
});

const celebrateImg = document.getElementById('celebrateImg');
if (celebrateImg) {
  celebrateImg.addEventListener('error', () => {
    celebrateImg.src = fallbackCuteBear;
  });
}

// Happy celebration GIF
const happyGif = "https://media.tenor.com/gUiu1zyxfzYAAAAj/bear-kiss-bear-kisses.gif";

/* ========================================================
   WEB AUDIO API SYNTHESIZER (No external audio file needed!)
   ======================================================== */
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Playful "boing / click" sound for "No" button
function playCuteBoop() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Frequency slide down
    const startFreq = 340 - (noClickCount * 15);
    osc.frequency.setValueAtTime(Math.max(160, startFreq), ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {
    console.log("Audio play error:", e);
  }
}

// Romantic Celebration Chime Harp for "Yes" button
function playCelebrationChime() {
  try {
    const ctx = getAudioContext();
    // Beautiful romantic pentatonic chord notes (C5, E5, G5, A5, C6, D6, E6, G6)
    const notes = [523.25, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];

    notes.forEach((freq, index) => {
      const startTime = ctx.currentTime + (index * 0.08);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.9);
    });
  } catch (e) {
    console.log("Celebration sound error:", e);
  }
}

// Gentle Romantic Music Box Melody
const melodyNotes = [
  261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
  329.63, 392.00, 523.25, 659.25, // E4, G4, C5, E5
  349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
  392.00, 493.88, 587.33, 783.99  // G4, B4, D5, G5
];
let currentNoteIndex = 0;

function playMelodyNote() {
  if (!isAudioPlaying) return;
  try {
    const ctx = getAudioContext();
    const freq = melodyNotes[currentNoteIndex % melodyNotes.length];
    currentNoteIndex++;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch (e) {}
}

function toggleRomanticMusic() {
  if (!isAudioPlaying) {
    getAudioContext();
    isAudioPlaying = true;
    soundIcon.textContent = '💖';
    soundToggle.style.background = '#ffe5ec';
    soundToggle.style.borderColor = '#ff4b72';
    melodyInterval = setInterval(playMelodyNote, 420);
  } else {
    isAudioPlaying = false;
    soundIcon.textContent = '🎵';
    soundToggle.style.background = 'rgba(255, 255, 255, 0.9)';
    soundToggle.style.borderColor = 'rgba(255, 75, 114, 0.3)';
    clearInterval(melodyInterval);
  }
}

soundToggle.addEventListener('click', toggleRomanticMusic);

/* ========================================================
   "NO" BUTTON LOGIC: Shrink No, Enlarge Yes
   ======================================================== */
noBtn.addEventListener('click', () => {
  noClickCount++;
  playCuteBoop();

  // 1. Shake animation on No button
  noBtn.classList.remove('shake');
  void noBtn.offsetWidth; // Trigger reflow
  noBtn.classList.add('shake');

  // 2. Change text of "No" button
  const textIndex = Math.min(noClickCount, noTexts.length - 1);
  noBtn.textContent = noTexts[textIndex];

  // 3. Change subtitle
  const subIndex = Math.min(noClickCount, subReactions.length - 1);
  subMessage.textContent = subReactions[subIndex];

  // 4. Shrink "No" button
  noScale = Math.max(0.3, 1 - noClickCount * 0.08);
  noBtn.style.transform = `scale(${noScale})`;
  noBtn.style.opacity = Math.max(0.4, 1 - noClickCount * 0.06);

  // 5. Enlarge "Yes" button progressively
  yesScale += 0.24;
  yesBtn.style.transform = `scale(${yesScale})`;
  
  // Also adjust padding for physical responsiveness
  const extraPadding = Math.min(noClickCount * 3, 20);
  yesBtn.style.padding = `${14 + extraPadding}px ${34 + extraPadding * 1.5}px`;

  // 6. Switch character gif to sad/pleading if she keeps pressing No
  if (noClickCount === 2) {
    characterImg.src = pleadingGifs[1];
  } else if (noClickCount === 4) {
    characterImg.src = pleadingGifs[2];
  } else if (noClickCount >= 6) {
    characterImg.src = pleadingGifs[3];
  }

  // 7. If clicked a lot, move No slightly away playfully
  if (noClickCount > 4) {
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 40;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${noScale})`;
  }
});

/* ========================================================
   "YES" BUTTON LOGIC: Show Celebration & Heartfelt Letter
   ======================================================== */
yesBtn.addEventListener('click', () => {
  // Sound
  playCelebrationChime();
  if (!isAudioPlaying) {
    // Start background music if not playing
    toggleRomanticMusic();
  }

  // Switch views
  questionCard.classList.add('hidden');
  successCard.classList.remove('hidden');
  successCard.classList.add('pop-in');

  // Update celebration gif
  document.getElementById('celebrateImg').src = happyGif;

  // Trigger celebration explosion
  triggerConfettiExplosion();

  // Setup WhatsApp share button message
  const loveMessage = encodeURIComponent(
    "Yessss! 🥰 I said YES to our date! Chaloo milte hai date prrr jb bhagwan ji ka date apna fix krwa de 😂😂😂 Lots of love ❤️"
  );
  whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${loveMessage}`;
});

// Replay functionality
replayBtn.addEventListener('click', () => {
  noClickCount = 0;
  yesScale = 1;
  noScale = 1;

  yesBtn.style.transform = 'scale(1)';
  yesBtn.style.padding = '14px 34px';
  noBtn.style.transform = 'scale(1)';
  noBtn.style.opacity = '1';
  noBtn.textContent = 'No 😢';
  subMessage.textContent = 'Think carefully before you answer... 😉';
  characterImg.src = pleadingGifs[0];

  successCard.classList.add('hidden');
  questionCard.classList.remove('hidden');
  questionCard.classList.add('pop-in');
});

/* ========================================================
   HEART CANVAS & CONFETTI PARTICLE SYSTEM
   ======================================================== */
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Floating Background Hearts
class FloatingHeart {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 20;
    this.size = Math.random() * 14 + 10;
    this.speedY = Math.random() * 0.8 + 0.4;
    this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.4;
    this.opacity = Math.random() * 0.45 + 0.2;
    this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    this.wobbleAngle = Math.random() * Math.PI * 2;
    // Romantic colors: pink, rose, peach, crimson
    const colors = [
      'rgba(255, 105, 180, ',
      'rgba(255, 75, 114, ',
      'rgba(255, 182, 193, ',
      'rgba(255, 133, 162, ',
      'rgba(255, 92, 141, '
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y -= this.speedY;
    this.wobbleAngle += this.wobbleSpeed;
    this.x += Math.sin(this.wobbleAngle) * 0.6;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.colorBase + this.opacity + ')';

    // Draw heart path
    const s = this.size / 15;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, -15 * s, 5 * s);
    ctx.bezierCurveTo(-15 * s, 15 * s, 0, 22 * s, 0, 26 * s);
    ctx.bezierCurveTo(0, 22 * s, 15 * s, 15 * s, 15 * s, 5 * s);
    ctx.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

// Celebration Explosion Particles
class ExplosionParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 4; // pop upwards
    this.gravity = 0.22;
    this.size = Math.random() * 16 + 8;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.2;
    this.opacity = 1;
    this.decay = Math.random() * 0.015 + 0.008;
    this.isHeart = Math.random() > 0.4;

    const colors = [
      '#ff4b72', '#ff758f', '#ff85a2', '#ffb3c1',
      '#ffd166', '#ff0054', '#9d0208', '#ffffff'
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.rotation += this.rotSpeed;
    this.opacity -= this.decay;
  }

  draw() {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;

    if (this.isHeart) {
      const s = this.size / 15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, -15 * s, 5 * s);
      ctx.bezierCurveTo(-15 * s, 15 * s, 0, 22 * s, 0, 26 * s);
      ctx.bezierCurveTo(0, 22 * s, 15 * s, 15 * s, 15 * s, 5 * s);
      ctx.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
      ctx.fill();
    } else {
      // Confetti rectangle
      ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size / 1.5);
    }
    ctx.restore();
  }
}

// Particle lists
const floatingHearts = Array.from({ length: 32 }, () => new FloatingHeart());
let explosionParticles = [];

function triggerConfettiExplosion() {
  const centerX = width / 2;
  const centerY = height / 2.2;
  for (let i = 0; i < 140; i++) {
    explosionParticles.push(new ExplosionParticle(centerX, centerY));
  }
  // Secondary bursts left and right
  setTimeout(() => {
    for (let i = 0; i < 70; i++) {
      explosionParticles.push(new ExplosionParticle(width * 0.25, height * 0.35));
      explosionParticles.push(new ExplosionParticle(width * 0.75, height * 0.35));
    }
  }, 250);
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Draw floating hearts
  floatingHearts.forEach(heart => {
    heart.update();
    heart.draw();
  });

  // Draw explosion particles
  for (let i = explosionParticles.length - 1; i >= 0; i--) {
    const p = explosionParticles[i];
    p.update();
    p.draw();
    if (p.opacity <= 0 || p.y > height + 50) {
      explosionParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
