// main.js — boots Twin Panels: wires the canvases, HUD and buttons to game.js,
// runs the render loop, and honours the ?shot= URL used to stage screenshots.

import {
  state, startGame, startScene, clickAt, useHint, nextScene, backToTitle,
  canvasPoint, renderPanels, renderMissMarks, tickAnimations, onStateChange,
  presetForShot, currentScene, foundCount, diffsTotal, TIME_PER_SCENE,
} from './game.js';
import { SCENES } from './scenes.js';

const $ = (id) => document.getElementById(id);
const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function refreshHud() {
  $('hud-scene').textContent = `Scene ${state.sceneIndex + 1} of ${SCENES.length} — ${currentScene().name}`;
  $('hud-found').textContent = `Found ${foundCount()} / ${diffsTotal()}`;
  $('hud-score').textContent = `Score ${state.score}`;
  $('hud-mistakes').textContent = `Misses ${state.mistakes}`;
  $('hud-timer').textContent = fmtTime(state.timeLeft);
  $('hud-hints').textContent = `Hints ${state.hintsLeft}`;
  $('timer-fill').style.width = `${(state.timeLeft / TIME_PER_SCENE) * 100}%`;
  $('timer-fill').classList.toggle('low', state.timeLeft <= 30);
  $('hint-btn').disabled = state.screen !== 'playing' || state.hintsLeft <= 0;
  $('found-dots').innerHTML = currentScene().diffs
    .map((d) => `<span class="dot${state.found.has(d.id) ? ' found' : ''}" title="${d.name}"></span>`)
    .join('');
  $('toast').textContent = state.message;
  $('toast').classList.toggle('show', state.message !== '');
  document.querySelectorAll('.screen').forEach((el) => el.classList.add('hidden'));
  if (state.screen === 'title') $('screen-title').classList.remove('hidden');
  if (state.screen === 'sceneDone') {
    $('scene-done-title').textContent = `${currentScene().name} — cleared!`;
    $('scene-done-sub').textContent = `All ${diffsTotal()} differences found. Score so far: ${state.score}.`;
    $('next-btn').textContent = state.sceneIndex + 1 >= SCENES.length ? 'See your results' : 'Next scene →';
    $('screen-scene-done').classList.remove('hidden');
  }
  if (state.screen === 'won') {
    $('win-score').textContent = state.score;
    $('win-found').textContent = `${state.totalFound} / ${SCENES.length * 7}`;
    $('win-mistakes').textContent = state.mistakes;
    $('screen-win').classList.remove('hidden');
  }
  if (state.screen === 'timeUp') {
    $('timeup-sub').textContent = `You found ${foundCount()} of ${diffsTotal()} in ${currentScene().name}.`;
    $('screen-timeup').classList.remove('hidden');
  }
}

function frame(now) {
  renderPanels(leftCtx, rightCtx, now);
  renderMissMarks(leftCtx, now);
  renderMissMarks(rightCtx, now);
  tickAnimations(now);
  requestAnimationFrame(frame);
}

function bindPanel(canvas) {
  canvas.addEventListener('click', (event) => {
    const p = canvasPoint(canvas, event.clientX, event.clientY);
    const before = state.pops.length;
    const result = clickAt(p.x, p.y);
    if (result === 'found') state.pops[state.pops.length - 1].t = performance.now();
    if (result === 'miss') state.misses[state.misses.length - 1].t = performance.now();
    void before;
  });
}

bindPanel(leftCanvas);
bindPanel(rightCanvas);

$('hint-btn').addEventListener('click', useHint);
$('restart-btn').addEventListener('click', () => startGame(0));
$('play-btn').addEventListener('click', () => startGame(0));
$('next-btn').addEventListener('click', nextScene);
$('again-btn').addEventListener('click', () => startGame(0));
$('title-btn').addEventListener('click', backToTitle);
$('retry-btn').addEventListener('click', () => startScene(state.sceneIndex));
$('timeup-title-btn').addEventListener('click', backToTitle);
document.querySelectorAll('.scene-pick').forEach((btn) => {
  btn.addEventListener('click', () => startGame(Number(btn.dataset.scene)));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') useHint();
  if (event.key === 'r' || event.key === 'R') startGame(0);
  if (event.key === 'Enter') {
    if (state.screen === 'title') startGame(0);
    else if (state.screen === 'sceneDone') nextScene();
    else if (state.screen === 'won' || state.screen === 'timeUp') startGame(0);
  }
  if (event.key >= '1' && event.key <= '3' && state.screen === 'title') {
    startGame(Number(event.key) - 1);
  }
});

onStateChange(refreshHud);

// Stage a screenshot: ?shot=play&scene=0&found=bird,shades,flower
const params = new URLSearchParams(location.search);
if (params.get('shot') === 'play') {
  const scene = Math.min(SCENES.length - 1, Math.max(0, Number(params.get('scene') ?? 0)));
  const found = (params.get('found') ?? '').split(',').filter(Boolean);
  presetForShot(scene, found);
  document.body.classList.add('shot-mode');
} else {
  state.screen = 'title';
}

refreshHud();
requestAnimationFrame(frame);
