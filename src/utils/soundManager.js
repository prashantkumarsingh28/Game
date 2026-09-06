/**
 * Crash-proof SoundManager for Expo Go & Web
 * Safe synth tone player with zero missing-native-module risk.
 */

let isMuted = false;

const playTone = (frequency, durationMs = 150, type = 'sine') => {
  if (isMuted) return;
  try {
    // Check for Web Audio API context safely
    const AudioCtx =
      typeof window !== 'undefined' &&
      (window.AudioContext || window.webkitAudioContext);

    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    }
  } catch (e) {
    // Silent fallback to prevent any runtime crash on mobile runtime
  }
};

export const SoundManager = {
  isMuted: () => isMuted,

  toggleMute: () => {
    isMuted = !isMuted;
    return isMuted;
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
