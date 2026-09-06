/**
 * Crash-proof SoundManager for Expo Go & Web
 * Safe synth tone player with zero missing-native-module risk.
 */

let isMuted = false;
let bgMusicInterval = null;
let bgNoteIndex = 0;

const ambientChords = [
  [261.63, 329.63, 392.00], // C Major
  [220.00, 261.63, 329.63], // A Minor
  [174.61, 220.00, 261.63], // F Major
  [196.00, 246.94, 293.66], // G Major
];

const playTone = (frequency, durationMs = 150, type = 'sine') => {
  if (isMuted) return;
  try {
    if (
      typeof window !== 'undefined' &&
      window !== null &&
      (typeof window.AudioContext !== 'undefined' ||
        typeof window.webkitAudioContext !== 'undefined')
    ) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + durationMs / 1000
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durationMs / 1000);
      }
    }
  } catch (e) {
    // Silent fallback to prevent any runtime crash on mobile runtime
  }
};

export const SoundManager = {
  isMuted: () => isMuted,

  toggleMute: () => {
    isMuted = !isMuted;
    if (isMuted && bgMusicInterval) {
      // Temporarily pause loop
    }
    return isMuted;
  },

  startBackgroundMusic: () => {
    if (bgMusicInterval) return;
    bgMusicInterval = setInterval(() => {
      if (isMuted) return;
      try {
        const chord = ambientChords[bgNoteIndex % ambientChords.length];
        bgNoteIndex++;
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            playTone(freq, 450, 'sine');
          }, idx * 140);
        });
      } catch (e) {}
    }, 3200);
  },

  stopBackgroundMusic: () => {
    if (bgMusicInterval) {
      clearInterval(bgMusicInterval);
      bgMusicInterval = null;
    }
  },

  playDiceRoll: () => {
    try {
      playTone(320, 60, 'square');
      setTimeout(() => playTone(450, 60, 'square'), 70);
      setTimeout(() => playTone(380, 80, 'square'), 140);
    } catch (e) {}
  },

  playStep: () => {
    try {
      playTone(580, 40, 'triangle');
    } catch (e) {}
  },

  playCash: () => {
    try {
      playTone(987.77, 100, 'sine');
      setTimeout(() => playTone(1318.51, 180, 'sine'), 90);
    } catch (e) {}
  },

  playBuild: () => {
    try {
      playTone(220, 70, 'sawtooth');
      setTimeout(() => playTone(330, 90, 'sawtooth'), 80);
    } catch (e) {}
  },

  playFine: () => {
    try {
      playTone(200, 150, 'sawtooth');
      setTimeout(() => playTone(150, 200, 'sawtooth'), 120);
    } catch (e) {}
  },

  playOrigin: () => {
    try {
      playTone(523.25, 100, 'sine');
      setTimeout(() => playTone(659.25, 100, 'sine'), 100);
      setTimeout(() => playTone(783.99, 100, 'sine'), 200);
      setTimeout(() => playTone(1046.5, 250, 'sine'), 300);
    } catch (e) {}
  },

  playVictory: () => {
    try {
      playTone(523.25, 120, 'triangle');
      setTimeout(() => playTone(659.25, 120, 'triangle'), 120);
      setTimeout(() => playTone(783.99, 120, 'triangle'), 240);
      setTimeout(() => playTone(1046.5, 400, 'triangle'), 360);
    } catch (e) {}
  },
};
