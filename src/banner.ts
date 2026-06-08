import figlet from 'figlet';
import gradient from 'gradient-string';

// Renders a gradient ASCII-art name banner. Uses figlet.textSync (no callback,
// instant + local) and applies a brand-colored gradient across the output.
// Falls back to a plain bold-ish string if figlet/gradient throw for any reason.
export function renderBanner(text = 'brignano'): string {
  try {
    const art = figlet.textSync(text, { font: 'ANSI Shadow' });
    // Version-stable call form: gradient([colors])(text) works across v2/v3.
    return gradient(['#43e97b', '#38f9d7', '#3a8dde'])(art);
  } catch {
    return text.toUpperCase();
  }
}
