// scenes.js — the three hand-drawn scenes of Twin Panels.
// Every scene is drawn procedurally on a 640x400 canvas: a shared base picture,
// then seven "difference" elements. Each difference knows how to draw itself on
// the left panel and how to draw its altered twin on the right panel, so the two
// panels are identical except for exactly those seven spots. All art is original,
// drawn in code; no images are loaded anywhere.

export const PANEL_W = 640;
export const PANEL_H = 400;

// ---------- small drawing helpers ----------
function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}
function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 40 * s, y, 17 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}
function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#2b3a4a';
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 8 * s, x + 10 * s, y);
  ctx.stroke();
}
function flower(ctx, x, y, petal, center) {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 7, y + Math.sin(a) * 7, 5, petal);
  }
  circle(ctx, x, y, 5, center);
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x, y + 18);
  ctx.stroke();
}
function tree(ctx, x, y, s) {
  rect(ctx, x - 6 * s, y, 12 * s, 46 * s, '#7a4a21');
  circle(ctx, x, y - 12 * s, 30 * s, '#2f9e44');
  circle(ctx, x - 22 * s, y + 2 * s, 20 * s, '#37b24d');
  circle(ctx, x + 22 * s, y + 2 * s, 20 * s, '#2b8a3e');
}

// =====================================================================
// SCENE 0 — Sunny Park
// =====================================================================
function drawParkBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#6ec1f5');
  sky.addColorStop(0.6, '#bfe6fb');
  sky.addColorStop(1, '#e8f7e3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 400);
  // sun
  circle(ctx, 82, 72, 34, '#ffd93b');
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(82 + Math.cos(a) * 42, 72 + Math.sin(a) * 42);
    ctx.lineTo(82 + Math.cos(a) * 54, 72 + Math.sin(a) * 54);
    ctx.stroke();
  }
  cloud(ctx, 190, 58, 1);
  cloud(ctx, 540, 96, 0.8);
  bird(ctx, 330, 66, 1);
  // kite (body in base; tail is a difference)
  poly(ctx, [[500, 118], [532, 138], [500, 162], [468, 138]], '#e64980');
  poly(ctx, [[500, 118], [516, 138], [500, 150], [484, 138]], '#ffa94d');
  ctx.strokeStyle = '#495057';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(500, 162);
  ctx.quadraticCurveTo(480, 260, 430, 330);
  ctx.stroke();
  // hills and grass
  ellipse(ctx, 140, 430, 340, 110, '#69b34c');
  ellipse(ctx, 540, 440, 360, 120, '#57a047');
  rect(ctx, 0, 330, 640, 70, '#5aa843');
  // path
  ctx.fillStyle = '#e9c893';
  ctx.beginPath();
  ctx.moveTo(290, 400);
  ctx.quadraticCurveTo(300, 330, 330, 300);
  ctx.lineTo(360, 300);
  ctx.quadraticCurveTo(350, 340, 370, 400);
  ctx.closePath();
  ctx.fill();
  // pond
  ellipse(ctx, 520, 368, 95, 26, '#4dabf7');
  ellipse(ctx, 520, 366, 78, 19, '#74c0fc');
  // trees
  tree(ctx, 96, 268, 1.1);
  tree(ctx, 588, 276, 0.9);
  // bench (frame in base; slats are a difference)
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(268, 296, 92, 8);
  ctx.fillRect(272, 304, 8, 34);
  ctx.fillRect(348, 304, 8, 34);
  ctx.fillRect(268, 330, 92, 6);
  // dog (body in base; spot is a difference)
  ellipse(ctx, 182, 330, 34, 20, '#f1c27d');
  circle(ctx, 214, 306, 15, '#f1c27d');
  poly(ctx, [[206, 294], [212, 282], [218, 294]], '#f1c27d');
  circle(ctx, 219, 303, 2.5, '#212529');
  ellipse(ctx, 152, 328, 12, 7, '#f1c27d');
  ctx.strokeStyle = '#8d5a2b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(166, 348);
  ctx.lineTo(166, 358);
  ctx.moveTo(198, 348);
  ctx.lineTo(198, 358);
  ctx.stroke();
  // flowers along the bottom
  flower(ctx, 60, 372, '#ff6b9d', '#ffd43b');
  flower(ctx, 250, 380, '#ff6b9d', '#ffd43b');
  flower(ctx, 420, 378, '#ff6b9d', '#ffd43b');
  flower(ctx, 600, 372, '#ff6b9d', '#ffd43b');
}

const PARK_DIFFS = [
  {
    id: 'bird', name: 'A bird in the sky', x: 470, y: 62, r: 18,
    draw(ctx, right) { if (!right) bird(ctx, 470, 62, 1.1); },
  },
  {
    id: 'shades', name: 'The sun wears sunglasses', x: 82, y: 72, r: 30,
    draw(ctx, right) {
      if (!right) return;
      ctx.fillStyle = '#212529';
      ctx.beginPath();
      ctx.roundRect(56, 62, 20, 13, 5);
      ctx.roundRect(84, 62, 20, 13, 5);
      ctx.fill();
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(76, 68);
      ctx.lineTo(84, 68);
      ctx.stroke();
    },
  },
  {
    id: 'flower', name: 'One flower changes colour', x: 140, y: 360, r: 16,
    draw(ctx, right) { flower(ctx, 140, 360, right ? '#9775fa' : '#ff6b9d', '#ffd43b'); },
  },
  {
    id: 'slat', name: 'A slat is missing from the bench', x: 314, y: 312, r: 22,
    draw(ctx, right) {
      ctx.fillStyle = '#8d5a2b';
      ctx.fillRect(268, 308, 92, 6);
      if (!right) ctx.fillRect(268, 318, 92, 6);
    },
  },
  {
    id: 'cloud', name: 'A cloud drifts away', x: 420, y: 44, r: 28,
    draw(ctx, right) { if (!right) cloud(ctx, 420, 44, 0.9); },
  },
  {
    id: 'kite-tail', name: 'The kite tail grows longer', x: 505, y: 205, r: 24,
    draw(ctx, right) {
      ctx.strokeStyle = '#495057';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(500, 162);
      ctx.quadraticCurveTo(495, 190, 505, 215);
      if (right) ctx.quadraticCurveTo(515, 240, 505, 262);
      ctx.stroke();
      const bows = right ? [[502, 178], [508, 205], [502, 232], [508, 256]] : [[502, 178], [508, 205]];
      for (const [bx, by] of bows) poly(ctx, [[bx - 7, by], [bx, by - 7], [bx + 7, by], [bx, by + 7]], '#e64980');
    },
  },
  {
    id: 'dog-spot', name: 'The dog loses its spot', x: 182, y: 328, r: 18,
    draw(ctx, right) { if (!right) ellipse(ctx, 182, 328, 13, 9, '#a06a2c'); },
  },
];

// =====================================================================
// SCENE 1 — Beach Day
// =====================================================================
function drawBeachBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#74c0fc');
  sky.addColorStop(0.55, '#d0ebff');
  sky.addColorStop(0.56, '#4dabf7');
  sky.addColorStop(1, '#ffe8a3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 400);
  circle(ctx, 566, 62, 30, '#ffd93b');
  cloud(ctx, 120, 52, 0.9);
  cloud(ctx, 380, 78, 0.7);
  // sea
  rect(ctx, 0, 150, 640, 112, '#339af0');
  rect(ctx, 0, 150, 640, 10, '#74c0fc');
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const [wx, wy, wl] of [[80, 190, 60], [200, 210, 80], [430, 195, 70], [540, 225, 60]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 8, wx + wl, wy);
    ctx.stroke();
  }
  // sailboat (hull and sail in base; flag is a difference)
  poly(ctx, [[300, 150], [300, 205], [352, 205]], '#ffffff');
  poly(ctx, [[294, 155], [294, 205], [252, 205]], '#ffe8a3');
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(298, 148);
  ctx.lineTo(298, 208);
  ctx.stroke();
  poly(ctx, [[240, 205], [364, 205], [348, 222], [256, 222]], '#c2255c');
  // sand
  rect(ctx, 0, 262, 640, 138, '#ffd88a');
  ellipse(ctx, 320, 268, 640, 14, '#ffe1a1');
  // palm tree (trunk and fronds in base; coconuts are a difference)
  ctx.strokeStyle = '#8d5a2b';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(84, 300);
  ctx.quadraticCurveTo(70, 230, 92, 176);
  ctx.stroke();
  ctx.strokeStyle = '#2f9e44';
  ctx.lineWidth = 7;
  for (const [fx, fy, cx, cy] of [[92, 176, 40, 150], [92, 176, 150, 150], [92, 176, 60, 210], [92, 176, 140, 205], [92, 176, 95, 130]]) {
    ctx.beginPath();
    ctx.moveTo(92, 176);
    ctx.quadraticCurveTo(cx, cy, fx, fy);
    ctx.stroke();
  }
  // umbrella (canopy in base; one stripe is a difference)
  ctx.strokeStyle = '#868e96';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(150, 300);
  ctx.lineTo(150, 196);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(150, 200, 62, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  poly(ctx, [[150, 138], [118, 200], [182, 200]], '#ffffff');
  // towel
  poly(ctx, [[282, 330], [372, 330], [382, 372], [272, 372]], '#4dabf7');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(300, 330, 14, 42);
  ctx.fillRect(338, 330, 14, 42);
  // bucket (spade is a difference)
  poly(ctx, [[408, 322], [448, 322], [442, 362], [414, 362]], '#e8590c');
  rect(ctx, 404, 318, 48, 8, '#d9480f');
  // crab (body in base)
  ellipse(ctx, 520, 336, 26, 17, '#fa5252');
  circle(ctx, 500, 318, 6, '#fa5252');
  circle(ctx, 540, 318, 6, '#fa5252');
  circle(ctx, 500, 316, 2.5, '#212529');
  circle(ctx, 540, 316, 2.5, '#212529');
  ctx.strokeStyle = '#fa5252';
  ctx.lineWidth = 4;
  for (const [lx, ly] of [[494, 348], [504, 352], [516, 354], [528, 354], [538, 350]]) {
    ctx.beginPath();
    ctx.moveTo(520, 344);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  }
  // crab claws
  circle(ctx, 488, 322, 8, '#e03131');
  circle(ctx, 552, 322, 8, '#e03131');
  // beach ball (bands in base; one band colour is a difference)
  circle(ctx, 362, 306, 24, '#ffffff');
  ctx.save();
  ctx.beginPath();
  ctx.arc(362, 306, 24, 0, Math.PI * 2);
  ctx.clip();
  poly(ctx, [[338, 290], [362, 282], [362, 330], [338, 322]], '#1971c2');
  poly(ctx, [[386, 290], [362, 282], [362, 330], [386, 322]], '#1971c2');
  ctx.restore();
}

const BEACH_DIFFS = [
  {
    id: 'flag', name: 'The sailboat flag vanishes', x: 312, y: 152, r: 16,
    draw(ctx, right) { if (!right) poly(ctx, [[298, 148], [322, 154], [298, 162]], '#e03131'); },
  },
  {
    id: 'starfish', name: 'A starfish washes away', x: 240, y: 366, r: 18,
    draw(ctx, right) {
      if (right) return;
      ctx.fillStyle = '#f08c00';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const a2 = a + Math.PI / 5;
        ctx.lineTo(240 + Math.cos(a) * 14, 366 + Math.sin(a) * 14);
        ctx.lineTo(240 + Math.cos(a2) * 6, 366 + Math.sin(a2) * 6);
      }
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'stripe', name: 'An umbrella stripe changes colour', x: 150, y: 176, r: 20,
    draw(ctx, right) {
      poly(ctx, [[150, 138], [118, 200], [182, 200]], right ? '#1971c2' : '#e03131');
      poly(ctx, [[150, 138], [136, 200], [164, 200]], '#ffffff');
    },
  },
  {
    id: 'coconuts', name: 'A coconut falls from the palm', x: 96, y: 196, r: 16,
    draw(ctx, right) {
      circle(ctx, 84, 192, 8, '#7a4a21');
      circle(ctx, 100, 198, 8, '#7a4a21');
      if (!right) circle(ctx, 92, 208, 8, '#7a4a21');
    },
  },
  {
    id: 'spade', name: 'The spade by the bucket is gone', x: 458, y: 330, r: 18,
    draw(ctx, right) {
      if (right) return;
      ctx.strokeStyle = '#2b8a3e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(452, 306);
      ctx.lineTo(466, 342);
      ctx.stroke();
      poly(ctx, [[458, 338], [472, 340], [468, 354], [456, 352]], '#2b8a3e');
    },
  },
  {
    id: 'wave', name: 'An extra wave rolls in', x: 350, y: 238, r: 22,
    draw(ctx, right) {
      if (!right) return;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(320, 238);
      ctx.quadraticCurveTo(350, 230, 380, 238);
      ctx.stroke();
    },
  },
  {
    id: 'ball', name: 'The beach ball swaps a colour', x: 362, y: 306, r: 18,
    draw(ctx, right) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(362, 306, 24, 0, Math.PI * 2);
      ctx.clip();
      poly(ctx, [[338, 290], [362, 282], [362, 330], [338, 322]], right ? '#2f9e44' : '#e03131');
      ctx.restore();
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(362, 306, 24, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
];

// =====================================================================
// SCENE 2 — Lantern Night Market
// =====================================================================
function drawMarketBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#2b2a6b');
  sky.addColorStop(0.55, '#7048a0');
  sky.addColorStop(1, '#f783ac');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 640, 400);
  // stars
  ctx.fillStyle = '#ffffff';
  for (const [sx, sy, sr] of [[40, 30, 2], [140, 60, 1.6], [240, 28, 2], [330, 70, 1.6], [430, 36, 2], [600, 40, 1.8], [500, 90, 1.5], [90, 100, 1.5]]) {
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  // moon (craters are a difference)
  circle(ctx, 548, 72, 30, '#fff9db');
  circle(ctx, 538, 62, 6, '#e9d8a6');
  // string lights (bulbs are a difference for one of them)
  ctx.strokeStyle = '#343a40';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.quadraticCurveTo(320, 66, 640, 24);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const bx = t * 640;
    const by = 24 + Math.sin(t * Math.PI) * 20 + 8;
    ctx.strokeStyle = '#343a40';
    ctx.beginPath();
    ctx.moveTo(bx, by - 2);
    ctx.lineTo(bx, by + 4);
    ctx.stroke();
  }
  // ground
  rect(ctx, 0, 330, 640, 70, '#3b2d5c');
  // balloons (count is a difference)
  ctx.strokeStyle = '#dee2e6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, 150);
  ctx.lineTo(52, 210);
  ctx.moveTo(60, 150);
  ctx.lineTo(74, 208);
  ctx.stroke();
  // stalls
  stall(ctx, 96, 250, '#e03131', '#ffd43b');
  stall(ctx, 296, 250, '#0ca678', '#fff3bf');
  stall(ctx, 496, 250, '#f59f00', '#fff3bf');
  // lanterns (one colour is a difference)
  lantern(ctx, 120, 186, '#e03131');
  lantern(ctx, 320, 186, '#e03131');
  lantern(ctx, 520, 186, '#e03131');
  // cat on the middle stall roof (tail is a difference)
  ellipse(ctx, 316, 216, 22, 12, '#343a40');
  circle(ctx, 334, 204, 10, '#343a40');
  poly(ctx, [[328, 196], [332, 186], [336, 196]], '#343a40');
  poly(ctx, [[338, 196], [342, 186], [344, 196]], '#343a40');
  // cart (wheel spokes are a difference)
  rect(ctx, 420, 322, 90, 26, '#8d5a2b');
  rect(ctx, 420, 314, 90, 10, '#a06a2c');
  circle(ctx, 438, 352, 12, '#343a40');
  circle(ctx, 492, 352, 12, '#343a40');
  circle(ctx, 438, 352, 4, '#adb5bd');
  circle(ctx, 492, 352, 4, '#adb5bd');
  // market goods
  for (const [gx, gy, gc] of [[116, 300, '#ff8787'], [136, 300, '#ffa94d'], [156, 300, '#9775fa'], [316, 300, '#69db7c'], [336, 300, '#ff8787'], [516, 300, '#ffa94d'], [536, 300, '#69db7c']]) {
    circle(ctx, gx, gy, 7, gc);
  }
}
function stall(ctx, x, y, awning, sign) {
  rect(ctx, x - 4, y, 8, 84, '#6b4423');
  rect(ctx, x + 76, y, 8, 84, '#6b4423');
  rect(ctx, x, y, 80, 84, '#8d5a2b');
  rect(ctx, x, y + 44, 80, 40, '#a06a2c');
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? awning : '#fff3bf';
    ctx.beginPath();
    ctx.moveTo(x - 8 + i * 20, y);
    ctx.lineTo(x + 8 + i * 20, y);
    ctx.lineTo(x + 4 + i * 20, y - 26);
    ctx.lineTo(x - 12 + i * 20, y - 26);
    ctx.closePath();
    ctx.fill();
  }
  rect(ctx, x + 14, y + 52, 52, 20, sign);
}
function lantern(ctx, x, y, colour) {
  ctx.strokeStyle = '#ffd43b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 22);
  ctx.lineTo(x, y - 8);
  ctx.stroke();
  ellipse(ctx, x, y, 12, 16, colour);
  rect(ctx, x - 5, y - 19, 10, 4, '#ffd43b');
  rect(ctx, x - 5, y + 14, 10, 4, '#ffd43b');
}

const MARKET_DIFFS = [
  {
    id: 'crater', name: 'A new crater on the moon', x: 560, y: 82, r: 16,
    draw(ctx, right) { if (right) circle(ctx, 560, 82, 5, '#e9d8a6'); },
  },
  {
    id: 'lantern', name: 'A lantern turns gold', x: 120, y: 186, r: 18,
    draw(ctx, right) { lantern(ctx, 120, 186, right ? '#ffd43b' : '#e03131'); },
  },
  {
    id: 'balloons', name: 'A balloon floats away', x: 66, y: 122, r: 20,
    draw(ctx, right) {
      ellipse(ctx, 52, 122, 13, 17, '#e64980');
      ellipse(ctx, 78, 128, 13, 17, '#4dabf7');
      if (!right) ellipse(ctx, 64, 100, 13, 17, '#ffd43b');
    },
  },
  {
    id: 'tail', name: 'The cat lowers its tail', x: 296, y: 208, r: 18,
    draw(ctx, right) {
      ctx.strokeStyle = '#343a40';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (right) {
        ctx.moveTo(296, 212);
        ctx.quadraticCurveTo(288, 224, 292, 232);
      } else {
        ctx.moveTo(296, 212);
        ctx.quadraticCurveTo(284, 196, 290, 182);
      }
      ctx.stroke();
    },
  },
  {
    id: 'bulb', name: 'A string-light bulb goes dark', x: 300, y: 46, r: 14,
    draw(ctx, right) {
      const t = 3 / 8;
      const bx = t * 640;
      const by = 24 + Math.sin(t * Math.PI) * 20 + 8;
      circle(ctx, bx, by + 8, 5, right ? '#495057' : '#ffd43b');
    },
  },
  {
    id: 'star', name: 'A new star appears in the sky', x: 322, y: 62, r: 16,
    draw(ctx, right) {
      if (!right) return;
      ctx.fillStyle = '#ffd43b';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const a2 = a + Math.PI / 5;
        ctx.lineTo(322 + Math.cos(a) * 9, 62 + Math.sin(a) * 9);
        ctx.lineTo(322 + Math.cos(a2) * 4, 62 + Math.sin(a2) * 4);
      }
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    id: 'spokes', name: 'A cart wheel gains spokes', x: 492, y: 352, r: 18,
    draw(ctx, right) {
      ctx.strokeStyle = '#adb5bd';
      ctx.lineWidth = 2;
      const spokes = right ? 8 : 4;
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(492, 352);
        ctx.lineTo(492 + Math.cos(a) * 10, 352 + Math.sin(a) * 10);
        ctx.stroke();
      }
    },
  },
];

// =====================================================================
// Public scene list
// =====================================================================
export const SCENES = [
  {
    name: 'Sunny Park',
    tagline: 'A lazy afternoon in the park — 7 things are not the same.',
    difficulty: 'Warm-up',
    base: drawParkBase,
    diffs: PARK_DIFFS,
  },
  {
    name: 'Beach Day',
    tagline: 'Sun, sea and sand — look closer, 7 things changed.',
    difficulty: 'Tricky',
    base: drawBeachBase,
    diffs: BEACH_DIFFS,
  },
  {
    name: 'Lantern Night Market',
    tagline: 'Lanterns, stalls and a cat — 7 differences hide in the glow.',
    difficulty: 'Sharp eyes',
    base: drawMarketBase,
    diffs: MARKET_DIFFS,
  },
];

// Draw one panel: base picture, then every difference in its left/right form.
export function drawPanel(ctx, scene, right) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  scene.base(ctx);
  for (const d of scene.diffs) d.draw(ctx, right);
}
