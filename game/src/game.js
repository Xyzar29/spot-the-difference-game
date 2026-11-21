// game.js — state, input, timer, scoring and the play loop of Twin Panels.
// One scene at a time: two canvases show the same picture with seven differences.
// Click a difference on either panel and it is ringed on both; find all seven
// before the timer runs out to clear the scene. Three scenes, then the win screen.

import { SCENES, PANEL_W, PANEL_H, drawPanel } from './scenes.js';

export const TIME_PER_SCENE = 150;
export const HINTS_PER_SCENE = 3;
export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_PENALTY = 5;
export const HINT_COST = 25;

export const state = {
  screen: 'title', // title | playing | sceneDone | won | timeUp
  sceneIndex: 0,
  found: new Set(), // difference ids found in the current scene
  score: 0,
  mistakes: 0,
  hintsLeft: HINTS_PER_SCENE,
  timeLeft: TIME_PER_SCENE,
  totalFound: 0,
  totalTimeUsed: 0,
  pops: [], // {x, y, t} expanding rings on a find
  misses: [], // {x, y, side, t} red X marks on a wrong click
  hintPulse: null, // {x, y, t} pulsing ring on a hinted difference
  message: '',
  messageUntil: 0,
};

let audioCtx = null;
let timerId = null;
let onChange = () => {};

function beep(freq, dur, type = 'sine', gain = 0.12) {
  try {
    audioCtx = audioCtx ?? new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) { /* sound is a garnish; silence is fine */ }
}
export function soundFound() { beep(880, 0.12); setTimeout(() => beep(1320, 0.18), 70); }
export function soundWrong() { beep(160, 0.2, 'square', 0.06); }
export function soundWin() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22), i * 110)); }

export function currentScene() { return SCENES[state.sceneIndex]; }
export function foundCount() { return state.found.size; }
export function diffsTotal() { return currentScene().diffs.length; }
export function allFound() { return state.found.size >= currentScene().diffs.length; }

export function startGame(sceneIndex = 0) {
  state.sceneIndex = sceneIndex;
  state.score = 0;
  state.mistakes = 0;
  state.totalFound = 0;
  state.totalTimeUsed = 0;
  startScene(sceneIndex);
}

export function startScene(index) {
  state.sceneIndex = index;
  state.found = new Set();
  state.hintsLeft = HINTS_PER_SCENE;
  state.timeLeft = TIME_PER_SCENE;
  state.pops = [];
  state.misses = [];
  state.hintPulse = null;
  state.screen = 'playing';
  startTimer();
  onChange();
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (state.screen !== 'playing') return;
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      stopTimer();
      state.screen = 'timeUp';
      soundWrong();
    }
    onChange();
  }, 1000);
}
function stopTimer() {
  if (timerId !== null) { clearInterval(timerId); timerId = null; }
}

export function stopClock() { stopTimer(); }

// Map a click on a canvas element to scene coordinates (640x400 space).
export function canvasPoint(canvas, clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * PANEL_W,
    y: ((clientY - r.top) / r.height) * PANEL_H,
  };
}

// A click on either panel. Returns 'found' | 'already' | 'miss'.
export function clickAt(x, y) {
  if (state.screen !== 'playing') return 'idle';
  const scene = currentScene();
  for (const d of scene.diffs) {
    if (state.found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      state.found.add(d.id);
      state.totalFound += 1;
      state.pops.push({ x: d.x, y: d.y, t: 0 });
      const timeBonus = Math.max(0, Math.round(state.timeLeft / 5));
      state.score += POINTS_PER_FIND + timeBonus;
      soundFound();
      flashMessage(`Found: ${d.name}!  +${POINTS_PER_FIND + timeBonus}`);
      if (allFound()) {
        state.totalTimeUsed += TIME_PER_SCENE - state.timeLeft;
        stopTimer();
        state.screen = 'sceneDone';
        soundWin();
      }
      onChange();
      return 'found';
    }
  }
  state.mistakes += 1;
  state.score = Math.max(0, state.score - WRONG_CLICK_PENALTY);
  state.misses.push({ x, y, t: 0 });
  soundWrong();
  flashMessage('Not a difference — −5 points');
  onChange();
  return 'miss';
}

export function useHint() {
  if (state.screen !== 'playing' || state.hintsLeft <= 0) return false;
  const remaining = currentScene().diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return false;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hintPulse = { x: pick.x, y: pick.y, t: 0 };
  flashMessage(`Hint: look near "${pick.name}"  (−${HINT_COST} points)`);
  onChange();
  return true;
}

export function nextScene() {
  if (state.sceneIndex + 1 >= SCENES.length) {
    state.screen = 'won';
    onChange();
    return;
  }
  startScene(state.sceneIndex + 1);
}

export function backToTitle() {
  stopTimer();
  state.screen = 'title';
  onChange();
}

function flashMessage(text) {
  state.message = text;
  state.messageUntil = performance.now() + 2200;
}

// ---------- rendering ----------

// Draw both panels plus found markers, pop rings, miss marks and hint pulse.
export function renderPanels(leftCtx, rightCtx, now) {
  const scene = currentScene();
  drawPanel(leftCtx, scene, false);
  drawPanel(rightCtx, scene, true);
  for (const d of scene.diffs) {
    if (!state.found.has(d.id)) continue;
    ringMarker(leftCtx, d.x, d.y, '#2f9e44');
    ringMarker(rightCtx, d.x, d.y, '#2f9e44');
  }
  for (const p of state.pops) {
    const age = (now - p.t) / 600;
    if (age >= 1) continue;
    const r = 14 + age * 26;
    for (const ctx of [leftCtx, rightCtx]) {
      ctx.strokeStyle = `rgba(47,158,68,${1 - age})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // Miss marks are drawn on the clicked canvas only, by renderMissMarks.
  if (state.hintPulse) {
    const age = ((now - state.hintPulse.t) % 700) / 700;
    const r = 16 + age * 12;
    for (const ctx of [leftCtx, rightCtx]) {
      ctx.strokeStyle = `rgba(255,212,59,${1 - age * 0.6})`;
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(state.hintPulse.x, state.hintPulse.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

function ringMarker(ctx, x, y, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

// Miss marks are drawn on the clicked canvas only; the caller passes it.
export function renderMissMarks(ctx, now) {
  for (const m of state.misses) {
    const age = (now - m.t) / 900;
    if (age >= 1) continue;
    ctx.strokeStyle = `rgba(224,49,49,${1 - age})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x - 10, m.y - 10);
    ctx.lineTo(m.x + 10, m.y + 10);
    ctx.moveTo(m.x + 10, m.y - 10);
    ctx.lineTo(m.x - 10, m.y + 10);
    ctx.stroke();
  }
}

// Prune finished animations; returns true when anything is still animating.
export function tickAnimations(now) {
  state.pops = state.pops.filter((p) => now - p.t < 600);
  state.misses = state.misses.filter((m) => now - m.t < 900);
  if (state.hintPulse && now - state.hintPulse.t > 2600) state.hintPulse = null;
  if (state.message && now > state.messageUntil) state.message = '';
  return state.pops.length > 0 || state.misses.length > 0 || state.hintPulse !== null;
}

export function onStateChange(fn) { onChange = fn; }

// Test/shot helper: jump straight into a scene with some differences found,
// timer held still, for screenshots. Not a cheat: it only presets the view.
export function presetForShot(sceneIndex, foundIds) {
  stopTimer();
  state.sceneIndex = sceneIndex;
  state.found = new Set(foundIds);
  state.hintsLeft = HINTS_PER_SCENE;
  state.timeLeft = 118;
  state.score = foundIds.length * 100 + 340;
  state.mistakes = 1;
  state.totalFound = foundIds.length;
  state.pops = [];
  state.misses = [];
  state.hintPulse = null;
  state.screen = 'playing';
}
