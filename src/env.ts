// Environment + capability detection. Keeps the render logic free of scattered
// `process.stdout.isTTY` checks and guarantees CI / piped output never hangs.

export interface Flags {
  help: boolean;
  view: boolean;
  download: boolean;
  email: boolean;
  qr: boolean;
  vcard: boolean;
  noPrompt: boolean;
  noAnimation: boolean;
}

export function hasFlag(argv: string[], names: string[]): boolean {
  return names.some((n) => argv.includes(n));
}

export function parseFlags(argv: string[]): Flags {
  return {
    help: hasFlag(argv, ['--help', '-h']),
    view: hasFlag(argv, ['--view', '-v']),
    download: hasFlag(argv, ['--download', '-d']),
    email: hasFlag(argv, ['--email', '-e']),
    qr: hasFlag(argv, ['--qr']),
    vcard: hasFlag(argv, ['--vcard', '--save-contact']),
    noPrompt: hasFlag(argv, ['--no-prompt', '--quiet']),
    noAnimation: hasFlag(argv, ['--no-animation']),
  };
}

const isCI = (): boolean => Boolean(process.env.CI);

// True only when we can safely show an interactive inquirer prompt.
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
