// Single source of truth for everything the card, vCard, QR and live modules need.
// Plain (uncolored) values live here; chalk styling is applied at render time.

export const profile = {
  firstName: 'Anthony',
  lastName: 'Brignano',
  fullName: 'Anthony Brignano',
  handle: '@brignano',
  username: 'brignano',
  title: 'Senior Staff Software Engineer',
  org: 'The Hartford',
  email: 'hi@brignano.io',
  website: 'https://brignano.io',
  resume: 'https://brignano.io/resume',
  github: 'https://github.com/brignano',
  linkedin: 'https://linkedin.com/in/brignano',
} as const;

// Rotating taglines — one is picked per run so repeat visitors see variety.
export const taglines: string[] = [
  'My inbox is always open. Ask a question or just say hi — I read everything.',
  'Building reliable systems, mentoring engineers, and shipping things that last.',
  "If it's worth automating, it's worth a clean abstraction. Let's build.",
  'Self-hoster, spec-driven, and unreasonably fond of a tidy terminal.',
  'Good engineering is mostly good taste applied consistently. Say hello.',
];

// Small easter-egg facts, shown occasionally below the card.
export const funFacts: string[] = [
  'This card is open source — `npx brignano --help` shows every trick.',
  'Tip: scan the QR with your phone to save my contact instantly.',
  'The live stats above are pulled fresh from GitHub (with a strict timeout).',
];

// Deterministic-enough pick without Math.random (kept simple + dependency-free).
export function pick<T>(items: readonly T[], seed = Date.now()): T {
  return items[Math.floor(seed / 1000) % items.length];
}
