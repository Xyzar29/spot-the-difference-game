// main.ts — the hand-in program for Twin Panels (Node 22, standard library only).
//
// It assembles the entry the grader reads: it copies the playable game and the
// screenshots out of this repository into the output directory, then writes the
// dossier.json the judge reads, using the kit's vendored library. It never touches
// the network and never writes anywhere but the output directory.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The repository root is the directory this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
// The grader mounts a writable /output; local runs override it with an env var.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(source, target) {
  if (!existsSync(source)) return;
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree(join(repoRoot, 'game'), join(outputDir, 'game'));
copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));

// The dossier is built from the copied files, so what the judge reads is exactly
// what the grader receives. The caps mirror the sealed gate's own limits.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
