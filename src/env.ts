// Environment + capability detection. Keeps the render logic free of scattered
// `process.stdout.isTTY` checks and guarantees CI / piped output never hangs.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Flags {
  help: boolean;
  version: boolean;
  view: boolean;
  download: boolean;
  email: boolean;
  qr: boolean;
  vcard: boolean;
  noPrompt: boolean;
  noAnimation: boolean;
}

// Every accepted token, grouped by the flag it sets. Also drives unknown-flag
// detection below, so adding a flag here is the only edit needed.
const FLAG_ALIASES = {
  help: ['--help', '-h'],
  version: ['--version', '-v', '-V'],
  view: ['--view', '--resume', '-r'],
  download: ['--download', '-d'],
  email: ['--email', '-e'],
  qr: ['--qr'],
  vcard: ['--vcard', '--save-contact'],
  noPrompt: ['--no-prompt', '--quiet'],
  noAnimation: ['--no-animation'],
} as const satisfies Record<keyof Flags, readonly string[]>;

const KNOWN_TOKENS = new Set<string>(Object.values(FLAG_ALIASES).flat());

export function hasFlag(argv: string[], names: readonly string[]): boolean {
  return names.some((n) => argv.includes(n));
}

export function parseFlags(argv: string[]): Flags {
  return {
    help: hasFlag(argv, FLAG_ALIASES.help),
    version: hasFlag(argv, FLAG_ALIASES.version),
    view: hasFlag(argv, FLAG_ALIASES.view),
    download: hasFlag(argv, FLAG_ALIASES.download),
    email: hasFlag(argv, FLAG_ALIASES.email),
    qr: hasFlag(argv, FLAG_ALIASES.qr),
    vcard: hasFlag(argv, FLAG_ALIASES.vcard),
    noPrompt: hasFlag(argv, FLAG_ALIASES.noPrompt),
    noAnimation: hasFlag(argv, FLAG_ALIASES.noAnimation),
  };
}

// Anything that looks like a flag but isn't one we accept. Returned rather than
// thrown so the caller decides how loudly to complain.
export function unknownFlags(argv: string[]): string[] {
  return argv.filter((arg) => arg.startsWith('-') && !KNOWN_TOKENS.has(arg));
}

// Read the version straight from the published package.json. It isn't in the
// `files` list, but npm always ships package.json, and it sits one level above
// the compiled dist/ directory.
export function readVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const raw = readFileSync(join(here, '..', 'package.json'), 'utf8');
    const pkg = JSON.parse(raw) as { version?: unknown };
    return typeof pkg.version === 'string' ? pkg.version : 'unknown';
  } catch {
    return 'unknown';
  }
}

const isCI = (): boolean => Boolean(process.env.CI);

// True only when we can safely show an interactive prompt.
export function isInteractive(flags: Flags): boolean {
  return Boolean(
    process.stdout.isTTY && process.stdin.isTTY && !isCI() && !flags.noPrompt,
  );
}

// True only when the reveal animation should play.
export function shouldAnimate(flags: Flags): boolean {
  return Boolean(
    process.stdout.isTTY &&
      !isCI() &&
      !flags.noPrompt &&
      !flags.noAnimation &&
      !process.env.NO_COLOR,
  );
}

// True only when we should spend time on a live network fetch.
export function shouldFetchLive(flags: Flags): boolean {
  return isInteractive(flags);
}

export function clearConsole(): void {
  const out = process.stdout as NodeJS.WriteStream & { clear?: () => void };
  if (typeof out.clear === 'function') {
    try {
      out.clear();
    } catch {
      /* ignore */
    }
  }
  if (process.stdout.isTTY) {
    process.stdout.write('\u001b[2J\u001b[0f');
  }
}
