import boxen from 'boxen';
import chalk from 'chalk';
import { profile } from './data.js';
import type { LiveData } from './live.js';

// Right-aligns labels to a common width so the values line up cleanly.
const LABEL_WIDTH = 10;
function label(text: string): string {
  return chalk.white.bold(text.padStart(LABEL_WIDTH) + ':');
}

interface CardOptions {
  live?: LiveData | null;
  tagline: string;
}

// Builds the boxen business card. `live` is optional — when absent the live
// line is simply omitted, so the card looks intentional with or without network.
export function renderCard({ live, tagline }: CardOptions): string {
  const lines = [
    chalk.bold.green(profile.fullName) + '  ' + chalk.gray(profile.handle),
    '',
    `${label('Work')}  ${profile.title} ${chalk.gray('at')} ${chalk
      .hex('#3A5A78')
      .bold(profile.org)}`,
    '',
    `${label('GitHub')}  ${chalk.gray('https://github.com/')}${chalk.green(
      profile.username,
    )}`,
    `${label('LinkedIn')}  ${chalk.gray('https://linkedin.com/in/')}${chalk.blue(
      profile.username,
    )}`,
    `${label('Website')}  ${chalk.cyan(profile.website)}`,
  ];

  if (live) {
    lines.push('');
    const parts = [
      `${chalk.yellow('★')} ${chalk.bold(live.followers)} followers`,
      `${chalk.bold(live.publicRepos)} repos`,
    ];
    if (live.latestRepo) {
      parts.push(`latest: ${chalk.green(live.latestRepo.name)}`);
    }
    lines.push(`${label('Live')}  ${chalk.gray(parts.join(' · '))}`);
  }

  lines.push(
    '',
    `${label('Card')}  ${chalk.red('npx')} ${chalk.white('brignano')}`,
    '',
    chalk.italic(tagline),
  );

  return boxen(lines.join('\n'), {
    margin: 1,
    float: 'center',
    padding: 1,
    borderStyle: 'round',
    borderColor: 'green',
  });
}
