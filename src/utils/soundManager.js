import { Audio } from 'expo-av';

let isMuted = false;
let bgMusicInterval = null;
let bgNoteIndex = 0;
let audioContextInstance = null;

// Initialize Expo Native Audio mode so audio plays even in silent mode on mobile
try {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    stayActiveInBackground: false,
  });
} catch (e) {}

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

const playTone = (frequency, durationMs = 150, type = 'sine', volume = 0.15) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
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

const ambientChords = [
  [261.63, 329.63, 392.00], // C Major
  [220.00, 261.63, 329.63], // A Minor
  [174.61, 220.00, 261.63], // F Major
  [196.00, 246.94, 293.66], // G Major
];

export const SoundManager = {
  isMuted: () => isMuted,

  toggleMute: () => {
    isMuted = !isMuted;
    if (isMuted) {
      SoundManager.stopBackgroundMusic();
    } else {
      SoundManager.startBackgroundMusic();
    }
    return isMuted;
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
    if (bgMusicInterval || isMuted) return;
    bgMusicInterval = setInterval(() => {
      if (isMuted) return;
      try {
        const chord = ambientChords[bgNoteIndex % ambientChords.length];
        bgNoteIndex++;
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            playTone(freq, 500, 'sine', 0.08);
          }, idx * 160);
        });
      } catch (e) {}
    }, 3000);
  },

  stopBackgroundMusic: () => {
    if (bgMusicInterval) {
      clearInterval(bgMusicInterval);
      bgMusicInterval = null;
    }
  },

  playDiceRoll: () => {
    try {
      playTone(280, 50, 'square', 0.2);
      setTimeout(() => playTone(360, 50, 'square', 0.2), 60);
      setTimeout(() => playTone(440, 50, 'square', 0.2), 120);
      setTimeout(() => playTone(520, 80, 'square', 0.2), 180);
    } catch (e) {}
  },

  playStep: () => {
    try {
      playTone(600, 30, 'triangle', 0.15);
    } catch (e) {}
  },

  playCash: () => {
    try {
      playTone(987.77, 80, 'sine', 0.2);
      setTimeout(() => playTone(1318.51, 160, 'sine', 0.25), 80);
    } catch (e) {}
  },

  playBuild: () => {
    try {
      playTone(180, 60, 'sawtooth', 0.2);
      setTimeout(() => playTone(280, 80, 'sawtooth', 0.2), 70);
    } catch (e) {}
  },

  playFine: () => {
    try {
      playTone(220, 120, 'sawtooth', 0.25);
      setTimeout(() => playTone(160, 180, 'sawtooth', 0.25), 100);
    } catch (e) {}
  },

  playOrigin: () => {
    try {
      playTone(523.25, 90, 'sine', 0.2);
      setTimeout(() => playTone(659.25, 90, 'sine', 0.2), 90);
      setTimeout(() => playTone(783.99, 90, 'sine', 0.2), 180);
      setTimeout(() => playTone(1046.5, 220, 'sine', 0.25), 270);
    } catch (e) {}
  },

  playVictory: () => {
    try {
      playTone(523.25, 120, 'triangle', 0.25);
      setTimeout(() => playTone(659.25, 120, 'triangle', 0.25), 120);
      setTimeout(() => playTone(783.99, 120, 'triangle', 0.25), 240);
      setTimeout(() => playTone(1046.5, 400, 'triangle', 0.3), 360);
    } catch (e) {}
  },
};
