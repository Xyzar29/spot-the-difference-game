# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Xyzar29/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Xyzar29/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Panels** — an original spot-the-difference game. Two near-identical pictures side by side, seven differences hiding in each scene, a counter of how many remain, markers on every difference you find, a timer, hints, and a score. Three hand-drawn scenes — Sunny Park, Beach Day, Lantern Night Market — all art drawn procedurally in code, no images, no network, no libraries. Click a difference on either picture; find all seven before the clock runs out.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Or serve `game/` with any static server and open `game/index.html` — the game plays fully offline from its own files.

## How to play

- Click a difference on either panel — it is ringed in green on both.
- `Found 3 / 7` in the top bar and the dots underneath track what is left.
- **H** spends a hint (25 points, 3 per scene) and pulses a difference you have not found yet.
- **R** restarts, **Enter** continues, **1**–**3** pick a scene from the title screen.
- Wrong clicks cost 5 points. Clearing a scene banks a time bonus; clear all three scenes for the win screen.

## Layout

- `game/index.html` — page shell and HUD
- `game/style.css` — the whole look
- `game/src/scenes.js` — the three scenes: every picture drawn in code, each difference defined as a left/right pair
- `game/src/game.js` — state, timer, scoring, hints, clicks, markers
- `game/src/main.js` — boot, input wiring, render loop, screenshot staging (`?shot=play&scene=N&found=a,b`)
- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to the output and writes `dossier.json`
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged
- `screenshots/` — real renders of the game in a browser

---

<sub>Entered on [make.fun](https://make.fun/?ref=86zc8pnt&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
