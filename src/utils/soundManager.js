// Expo-compatible Sound & Music Manager
// Supports Web Audio synthesis fallback & custom audio file triggers

let isSfxMuted = false;
let isMusicMuted = false;
let bgMusicInterval = null;
let bgNoteIndex = 0;
let audioContextInstance = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioContextInstance) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContextInstance = new AudioCtx();
    }
  }
  if (audioContextInstance && audioContextInstance.state === 'suspended') {
    audioContextInstance.resume().catch(() => {});
  }
  return audioContextInstance;
};

const playTone = (frequency, durationMs = 150, type = 'sine', volume = 0.15, freqRampTo = null) => {
  if (isSfxMuted) return;
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      if (freqRampTo) {
        osc.frequency.exponentialRampToValueAtTime(freqRampTo, ctx.currentTime + durationMs / 1000);
      }
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    }
  } catch (e) {}
};

const luxuryChords = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [174.61, 220.00, 261.63, 329.63], // Fmaj7
  [196.00, 246.94, 293.66, 349.23], // G7
];

export const SoundManager = {
  isSfxMuted: () => isSfxMuted,
  isMusicMuted: () => isMusicMuted,

  toggleSfx: () => {
    isSfxMuted = !isSfxMuted;
    return isSfxMuted;
  },

  toggleMusic: () => {
    isMusicMuted = !isMusicMuted;
    if (isMusicMuted) {
      SoundManager.stopBackgroundMusic();
    } else {
      SoundManager.startBackgroundMusic();
    }
    return isMusicMuted;
  },

  unlockAudio: () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch (e) {}
  },

  startBackgroundMusic: () => {
    if (bgMusicInterval || isMusicMuted) return;
    bgMusicInterval = setInterval(() => {
      if (isMusicMuted) return;
      try {
        const chord = luxuryChords[bgNoteIndex % luxuryChords.length];
        bgNoteIndex++;
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            if (!isMusicMuted) {
              playTone(freq, 600, 'sine', 0.05);
            }
          }, idx * 220);
        });
      } catch (e) {}
    }, 4000);
  },

  stopBackgroundMusic: () => {
    if (bgMusicInterval) {
      clearInterval(bgMusicInterval);
      bgMusicInterval = null;
    }
  },

  // 1. Dice rolling sound
  playDiceRoll: () => {
    if (isSfxMuted) return;
    try {
      playTone(260, 40, 'triangle', 0.18);
      setTimeout(() => playTone(340, 40, 'triangle', 0.18), 50);
      setTimeout(() => playTone(420, 40, 'triangle', 0.18), 100);
      setTimeout(() => playTone(500, 50, 'triangle', 0.2), 150);
    } catch (e) {}
  },

  // 2. Dice landing / click sound
  playDiceLanding: () => {
    if (isSfxMuted) return;
    try {
      playTone(180, 80, 'sine', 0.25, 60);
    } catch (e) {}
  },

  // 3. Player movement / step sound
  playStep: () => {
    if (isSfxMuted) return;
    try {
      playTone(650, 35, 'triangle', 0.12);
    } catch (e) {}
  },

  // 4. Token landing sound
  playTokenLanding: () => {
    if (isSfxMuted) return;
    try {
      playTone(523.25, 70, 'sine', 0.15);
      setTimeout(() => playTone(659.25, 100, 'sine', 0.18), 70);
    } catch (e) {}
  },

  // 5. Button click sound
  playButtonClick: () => {
    if (isSfxMuted) return;
    try {
      playTone(440, 40, 'sine', 0.15);
    } catch (e) {}
  },

  // 6. Property purchase sound
  playPurchase: () => {
    if (isSfxMuted) return;
    try {
      playTone(523.25, 90, 'sine', 0.2);
      setTimeout(() => playTone(659.25, 90, 'sine', 0.2), 80);
      setTimeout(() => playTone(783.99, 140, 'sine', 0.25), 160);
    } catch (e) {}
  },

  // 7. Money received sound (Origin bonus / income)
  playMoneyReceived: () => {
    if (isSfxMuted) return;
    try {
      playTone(987.77, 80, 'sine', 0.2);
      setTimeout(() => playTone(1318.51, 180, 'sine', 0.25), 80);
    } catch (e) {}
  },

  // 8. Money spent / payment sound (Rent / Fine)
  playMoneySpent: () => {
    if (isSfxMuted) return;
    try {
      playTone(280, 100, 'sawtooth', 0.2);
      setTimeout(() => playTone(200, 140, 'sawtooth', 0.2), 90);
    } catch (e) {}
  },

  // 9. Card draw sound
  playCardDraw: () => {
    if (isSfxMuted) return;
    try {
      playTone(700, 60, 'triangle', 0.15, 300);
    } catch (e) {}
  },

  // 10. Notification / alert sound
  playNotification: () => {
    if (isSfxMuted) return;
    try {
      playTone(659.25, 90, 'sine', 0.18);
      setTimeout(() => playTone(880.00, 120, 'sine', 0.2), 90);
    } catch (e) {}
  },

  // 11. Turn-change sound
  playTurnChange: () => {
    if (isSfxMuted) return;
    try {
      playTone(440.00, 70, 'sine', 0.15);
      setTimeout(() => playTone(554.37, 70, 'sine', 0.15), 70);
      setTimeout(() => playTone(659.25, 100, 'sine', 0.18), 140);
    } catch (e) {}
  },

  // 12. Victory / win sound
  playVictory: () => {
    if (isSfxMuted) return;
    try {
      playTone(523.25, 120, 'triangle', 0.25);
      setTimeout(() => playTone(659.25, 120, 'triangle', 0.25), 120);
      setTimeout(() => playTone(783.99, 120, 'triangle', 0.25), 240);
      setTimeout(() => playTone(1046.50, 450, 'triangle', 0.3), 360);
    } catch (e) {}
  },
};
