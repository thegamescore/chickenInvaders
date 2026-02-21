// Retro audio via Web Audio API — no external files required.

let audioCtx = null;
let schedulerTimer = null;
let nextNoteTime = 0;
let currentStep = 0;
let isRunning = false;

const STEP_DURATION = 0.1;      // seconds per beat (100ms → ~10 BPM × 6 = 600 steps/min)
const LOOK_AHEAD_MS = 25;       // scheduler interval
const SCHEDULE_AHEAD_S = 0.12;  // look-ahead window

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (frequency, time, duration, type = 'square', volume = 0.1) => {
  if (!frequency) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.setValueAtTime(volume * 0.75, time + duration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.start(time);
  osc.stop(time + duration + 0.01);
};

// 32-step chiptune loop (~3.2 s per cycle)
// Melody: E3→G3→B3→E4 ascending run, descending mirror, variation
const melody = [
  330, 0, 392, 0, 494, 0, 659, 0,
  659, 0, 494, 0, 392, 0, 330, 0,
  440, 0, 523, 0, 659, 784, 0,   0,
  523, 0, 440, 0, 392, 330, 0,   0,
];

// Bass: root + fifth pattern in A minor
const bass = [
  110, 0, 110, 0, 165, 0, 165, 0,
  220, 0, 220, 0, 165, 0, 110, 0,
  147, 0, 147, 0, 196, 0, 196, 0,
  196, 0, 147, 0, 110, 0, 110, 0,
];

const runScheduler = () => {
  const ctx = getCtx();
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
    const step = currentStep % melody.length;
    playTone(melody[step], nextNoteTime, STEP_DURATION * 0.85, 'square',   0.08);
    playTone(bass[step],   nextNoteTime, STEP_DURATION * 1.7,  'triangle', 0.06);
    currentStep++;
    nextNoteTime += STEP_DURATION;
  }
  schedulerTimer = setTimeout(runScheduler, LOOK_AHEAD_MS);
};

export const startMusic = () => {
  if (isRunning) stopMusic();
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  isRunning = true;
  currentStep = 0;
  nextNoteTime = ctx.currentTime + 0.05;
  runScheduler();
};

export const stopMusic = () => {
  isRunning = false;
  clearTimeout(schedulerTimer);
};

export const pauseMusic = () => {
  isRunning = false;
  clearTimeout(schedulerTimer);
  getCtx().suspend();
};

export const resumeMusic = () => {
  const ctx = getCtx();
  ctx.resume().then(() => {
    isRunning = true;
    nextNoteTime = ctx.currentTime + 0.05;
    runScheduler();
  });
};

// ---- Sound effects ----

export const playShootSound = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.11);
};

export const playInvaderShootSound = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
};

export const playLevelTransitionSound = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') return;
  // Ascending fanfare: G4 → C5 → E5 → G5 → C6 (held)
  const fanfare = [
    { freq: 392,  dur: 0.1  },
    { freq: 523,  dur: 0.1  },
    { freq: 659,  dur: 0.1  },
    { freq: 784,  dur: 0.1  },
    { freq: 1047, dur: 0.4  },
  ];
  let t = ctx.currentTime;
  fanfare.forEach(({ freq, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.01);
    t += dur;
  });
};

export const playPresentCatchSound = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') return;
  // Three-note ascending arpeggio: C5 → E5 → C6
  const notes = [523, 659, 1047];
  const stepDur = 0.075;
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * stepDur;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur);
    osc.start(t);
    osc.stop(t + stepDur + 0.01);
  });
};

export const playDeathSound = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') return;

  // Loud noise burst — longer decay than invader explosion
  const bufferSize = Math.floor(ctx.sampleRate * 0.55);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.4);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.gain.setValueAtTime(0.45, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
  noise.start();

  // Descending tone sweep — 440 Hz down to 50 Hz (ship "powering down")
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.45);
  oscGain.gain.setValueAtTime(0.18, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
};

export const playExplosionSound = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') return;
  const bufferSize = Math.floor(ctx.sampleRate * 0.15);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  source.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  source.start();
};
