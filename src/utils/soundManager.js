import { Audio } from 'expo-av';

// Audio state
let isMuted = false;
let bgmSound = null;

// Clean base64 audio clips or synthesized tone helpers
const playTone = async (frequency, durationMs = 150, type = 'sine') => {
  if (isMuted) return;
  try {
    // Generate clean audio tone using Expo AV Sound or Web Audio API fallback
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    }
  } catch (e) {
    // Fallback silent handle
  }
};

export const SoundManager = {
  isMuted: () => isMuted,

  toggleMute: () => {
    isMuted = !isMuted;
    return isMuted;
  },

  playDiceRoll: () => {
    if (isMuted) return;
    // Rapid pitch sequence simulating rolling dice
    playTone(320, 60, 'square');
    setTimeout(() => playTone(450, 60, 'square'), 70);
    setTimeout(() => playTone(380, 80, 'square'), 140);
  },

  playStep: () => {
    if (isMuted) return;
    playTone(580, 40, 'triangle');
  },

  playCash: () => {
    if (isMuted) return;
    // High coin chime double tone
    playTone(987.77, 100, 'sine'); // B5
    setTimeout(() => playTone(1318.51, 180, 'sine'), 90); // E6
  },

  playBuild: () => {
    if (isMuted) return;
    // Hammer impact sounds
    playTone(220, 70, 'sawtooth');
    setTimeout(() => playTone(330, 90, 'sawtooth'), 80);
  },

  playFine: () => {
    if (isMuted) return;
    // Warning low double tone
    playTone(200, 150, 'sawtooth');
    setTimeout(() => playTone(150, 200, 'sawtooth'), 120);
  },

  playOrigin: () => {
    if (isMuted) return;
    // Arpeggio fanfare
    playTone(523.25, 100, 'sine'); // C5
    setTimeout(() => playTone(659.25, 100, 'sine'), 100); // E5
    setTimeout(() => playTone(783.99, 100, 'sine'), 200); // G5
    setTimeout(() => playTone(1046.5, 250, 'sine'), 300); // C6
  },

  playVictory: () => {
    if (isMuted) return;
    // Celebration fanfare
    playTone(523.25, 120, 'triangle');
    setTimeout(() => playTone(659.25, 120, 'triangle'), 120);
    setTimeout(() => playTone(783.99, 120, 'triangle'), 240);
    setTimeout(() => playTone(1046.5, 400, 'triangle'), 360);
  },
};
