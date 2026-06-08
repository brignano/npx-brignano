import figlet from 'figlet';
import gradient from 'gradient-string';
import { sleep } from './reveal.js';

// Brand palette — matches brignano.io's electric indigo/violet accent
// (violet-700 → violet-500 → violet-400). Reads well on a dark terminal.
const BRAND = ['#6d28d9', '#8b5cf6', '#a78bfa'];

// A longer ramp with a bright crest (violet-300) used for the shimmer sweep.
const SHIMMER = [
  '#5b21b6',
  '#6d28d9',
  '#7c3aed',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#a78bfa',
  '#8b5cf6',
  '#7c3aed',
  '#6d28d9',
];

function bannerArt(text: string): string {
  try {
    return figlet.textSync(text, { font: 'ANSI Shadow' });
  } catch {
    return text.toUpperCase();
  }
}

function paint(colors: string[], art: string): string {
  try {
    return gradient(colors).multiline(art);
  } catch {
    return art;
  }
}

// Static gradient banner (used for the non-animated path).
export function renderBanner(text = 'brignano'): string {
  return paint(BRAND, bannerArt(text));
}

// Animated splash: a violet highlight sweeps across the letters, then settles on
// the static brand gradient. Redraws in place via ANSI cursor moves, so it must
// only be called on a TTY (the caller gates this behind `shouldAnimate`).
export async function animateBanner(
  text = 'brignano',
  frames = 14,
  frameMs = 70,
): Promise<void> {
  const art = bannerArt(text);
  const lineCount = art.split('\n').length;

  for (let i = 0; i < frames; i++) {
    const offset = i % SHIMMER.length;
    const rotated = SHIMMER.slice(offset).concat(SHIMMER.slice(0, offset));
    if (i > 0) process.stdout.write(`\u001b[${lineCount}A`);
    process.stdout.write(`\r${paint(rotated, art)}\n`);
    await sleep(frameMs);
  }

  // Settle on the canonical brand gradient.
  process.stdout.write(`\u001b[${lineCount}A`);
  process.stdout.write(`${renderBanner(text)}\n`);
}
