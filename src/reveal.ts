// Tiny animation helpers — no dependencies. Line-by-line reveal is immune to the
// ANSI-escape-splitting problem a per-character typewriter would hit, and the
// total budget stays well under a second.

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Prints `text` one line at a time, pausing `perLineMs` between lines.
// When `animate` is false, prints everything at once (CI / piped / --no-animation).
export async function reveal(
  text: string,
  perLineMs = 35,
  animate = true,
): Promise<void> {
  if (!animate) {
    console.log(text);
    return;
  }
  const lines = text.split('\n');
  for (const line of lines) {
    console.log(line);
    await sleep(perLineMs);
  }
}
