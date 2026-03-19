export interface SoundPreset {
  id: number;
  name: string;
  category: string;
  play: (ctx: AudioContext, t: number, noiseBuffer: AudioBuffer) => void;
}

const playTone = (
  ctx: AudioContext,
  t: number,
  noiseBuffer: AudioBuffer,
  opts: {
    osc?: { type: OscillatorType; f1: number; f2?: number; dur: number; vol: number };
    noise?: { filter: BiquadFilterType; freq: number; Q?: number; dur: number; vol: number };
  }
) => {
  if (opts.osc) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.osc.type;
    osc.frequency.setValueAtTime(opts.osc.f1, t);
    if (opts.osc.f2) {
      osc.frequency.exponentialRampToValueAtTime(opts.osc.f2, t + opts.osc.dur);
    }
    gain.gain.setValueAtTime(opts.osc.vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + opts.osc.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + opts.osc.dur);
  }
  if (opts.noise) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.noise.filter;
    filter.frequency.value = opts.noise.freq;
    if (opts.noise.Q) filter.Q.value = opts.noise.Q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(opts.noise.vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + opts.noise.dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
    src.stop(t + opts.noise.dur);
  }
};

export const SOUND_PRESETS: SoundPreset[] = [
  // --- Minimalist & Modern ---
  { id: 1, name: "Soft Glass Tap", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 2000, f2: 1000, dur: 0.02, vol: 0.05 } }) },
  { id: 2, name: "Muted Thud", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 100, f2: 50, dur: 0.03, vol: 0.1 } }) },
  { id: 3, name: "Crisp Tick", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { noise: { filter: 'highpass', freq: 4000, dur: 0.01, vol: 0.05 } }) },
  { id: 4, name: "Silicone Button", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'triangle', f1: 200, f2: 50, dur: 0.03, vol: 0.08 } }) },
  { id: 5, name: "Minimalist Pop", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 500, f2: 300, dur: 0.02, vol: 0.08 } }) },
  { id: 6, name: "Chalk Tap", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { noise: { filter: 'bandpass', freq: 1500, dur: 0.015, vol: 0.1 } }) },
  { id: 7, name: "Soft Wood Knock", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 300, f2: 100, dur: 0.03, vol: 0.05 }, noise: { filter: 'lowpass', freq: 600, dur: 0.02, vol: 0.05 } }) },
  { id: 8, name: "Velvet Brush", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { noise: { filter: 'lowpass', freq: 400, dur: 0.05, vol: 0.1 } }) },
  { id: 9, name: "Water Drop", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 600, f2: 1200, dur: 0.04, vol: 0.1 } }) },
  { id: 10, name: "Haptic Buzz", category: "Minimalist & Modern", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'square', f1: 100, f2: 100, dur: 0.02, vol: 0.05 } }) },

  // --- Sci-Fi & Encrypted Terminal ---
  { id: 11, name: "Optical Relay", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'square', f1: 2500, f2: 2500, dur: 0.01, vol: 0.03 } }) },
  { id: 12, name: "Data Blip", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 1800, f2: 1800, dur: 0.015, vol: 0.05 } }) },
  { id: 13, name: "Cybernetic Click", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sawtooth', f1: 1200, f2: 800, dur: 0.01, vol: 0.05 } }) },
  { id: 14, name: "Holographic Chime", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 2500, f2: 2000, dur: 0.1, vol: 0.03 } }) },
  { id: 15, name: "Quantum Tick", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 1500, f2: 1000, dur: 0.02, vol: 0.05 }, noise: { filter: 'highpass', freq: 2000, dur: 0.01, vol: 0.02 } }) },
  { id: 16, name: "Retro CRT Blip", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'square', f1: 600, f2: 600, dur: 0.03, vol: 0.05 } }) },
  { id: 17, name: "Laser Pulse", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sawtooth', f1: 3000, f2: 500, dur: 0.03, vol: 0.04 } }) },
  { id: 18, name: "Magnetic Latch", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'square', f1: 150, f2: 100, dur: 0.03, vol: 0.05 }, noise: { filter: 'bandpass', freq: 800, dur: 0.03, vol: 0.05 } }) },
  { id: 19, name: "Fiber Optic Ping", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 3500, f2: 3500, dur: 0.06, vol: 0.04 } }) },
  { id: 20, name: "Radio Static", category: "Sci-Fi & Encrypted Terminal", play: (c, t, n) => playTone(c, t, n, { noise: { filter: 'bandpass', freq: 2500, dur: 0.02, vol: 0.08 } }) },

  // --- Tactile & Mechanical ---
  { id: 21, name: "Laptop Scissor", category: "Tactile & Mechanical", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 300, f2: 200, dur: 0.02, vol: 0.05 }, noise: { filter: 'bandpass', freq: 1200, dur: 0.015, vol: 0.05 } }) },
  { id: 22, name: "Deep Thock", category: "Tactile & Mechanical", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 150, f2: 50, dur: 0.04, vol: 0.1 } }) },
  { id: 23, name: "Cherry MX Blue", category: "Tactile & Mechanical", play: (c, t, n) => {
      playTone(c, t, n, { noise: { filter: 'highpass', freq: 3000, dur: 0.01, vol: 0.08 } });
      playTone(c, t + 0.015, n, { osc: { type: 'sine', f1: 200, f2: 100, dur: 0.02, vol: 0.05 } });
    }
  },
  { id: 24, name: "Cherry MX Red", category: "Tactile & Mechanical", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 150, f2: 100, dur: 0.03, vol: 0.05 }, noise: { filter: 'lowpass', freq: 800, dur: 0.02, vol: 0.05 } }) },
  { id: 25, name: "Vintage Typewriter", category: "Tactile & Mechanical", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sine', f1: 800, f2: 800, dur: 0.05, vol: 0.02 }, noise: { filter: 'highpass', freq: 2000, dur: 0.02, vol: 0.08 } }) },
  { id: 26, name: "Metallic Snap", category: "Tactile & Mechanical", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'sawtooth', f1: 800, f2: 400, dur: 0.02, vol: 0.03 }, noise: { filter: 'highpass', freq: 3000, dur: 0.02, vol: 0.05 } }) },
  { id: 27, name: "Heavy Relay", category: "Tactile & Mechanical", play: (c, t, n) => playTone(c, t, n, { osc: { type: 'square', f1: 100, f2: 50, dur: 0.04, vol: 0.05 }, noise: { filter: 'lowpass', freq: 500, dur: 0.03, vol: 0.05 } }) },
  { id: 28, name: "Camera Shutter", category: "Tactile & Mechanical", play: (c, t, n) => {
      playTone(c, t, n, { noise: { filter: 'bandpass', freq: 1500, dur: 0.01, vol: 0.08 } });
      playTone(c, t + 0.02, n, { noise: { filter: 'bandpass', freq: 1200, dur: 0.015, vol: 0.06 } });
    }
  },
  { id: 29, name: "Pen Click", category: "Tactile & Mechanical", play: (c, t, n) => {
      playTone(c, t, n, { noise: { filter: 'highpass', freq: 2000, dur: 0.01, vol: 0.06 } });
      playTone(c, t + 0.03, n, { noise: { filter: 'highpass', freq: 1500, dur: 0.015, vol: 0.04 } });
    }
  },
  { id: 30, name: "Rotary Dial", category: "Tactile & Mechanical", play: (c, t, n) => {
      playTone(c, t, n, { noise: { filter: 'bandpass', freq: 1000, dur: 0.005, vol: 0.05 } });
      playTone(c, t + 0.01, n, { noise: { filter: 'bandpass', freq: 1000, dur: 0.005, vol: 0.05 } });
      playTone(c, t + 0.02, n, { noise: { filter: 'bandpass', freq: 1000, dur: 0.005, vol: 0.05 } });
    }
  }
];
