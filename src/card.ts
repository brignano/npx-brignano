#!/usr/bin/env node

import chalk from 'chalk';
import { animateBanner, renderBanner } from './banner.js';
import { renderCard } from './cardBox.js';
import { funFacts, pick, profile, taglines } from './data.js';
import {
  isInteractive,
  parseFlags,
  readVersion,
  shouldAnimate,
  shouldFetchLive,
  unknownFlags,
} from './env.js';
import { fetchLive } from './live.js';
import { promptForAction, sendEmail, viewResume } from './menu.js';
import { renderQr } from './qrcode.js';
import { reveal, sleep } from './reveal.js';
import { writeAndOpenVCard } from './vcard.js';

function printHelp(): void {
  console.log('\nUsage: npx brignano [options]\n');
  console.log('Options:');
  console.log('  -h, --help          Show this help');
  console.log('  -v, --version       Print the version and exit');
  console.log('  -r, --view          Open my resume in your browser');
  console.log('  -e, --email         Open your mail client to email me');
  console.log('      --qr            Print a scannable QR code to my website');
  console.log('      --vcard         Save my contact card (.vcf) and open it');
  console.log('      --no-animation  Render instantly, skip the reveal animation');
  console.log('      --no-prompt     Show the card only (non-interactive)');
  console.log('  -d, --download      Deprecated alias for --view\n');
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  // Reject typos loudly rather than silently rendering the default card.
  const unknown = unknownFlags(argv);
  if (unknown.length > 0) {
    console.error(`Unknown option: ${unknown.join(', ')}`);
    console.error("Run 'npx brignano --help' to see the available options.");
    process.exitCode = 1;
    return;
  }

  const flags = parseFlags(argv);

  // Direct-action flags short-circuit the full experience.
  if (flags.help) return printHelp();
  if (flags.version) {
    console.log(readVersion());
    return;
  }
  if (flags.view || flags.download) {
    if (flags.download) {
      console.warn('Note: --download is deprecated; opening the resume instead.');
    }
    return viewResume();
  }
  if (flags.email) return sendEmail();
  if (flags.qr) {
    console.log(await renderQr(profile.website));
    console.log(chalk.gray(`  ${profile.website}\n`));
    return;
  }
  if (flags.vcard) return writeAndOpenVCard();

  const animate = shouldAnimate(flags);
  const interactive = isInteractive(flags);

  // Kick off the live fetch early (don't await yet) so its timeout budget
  // overlaps the banner render. Skipped entirely when non-interactive/CI.
  const livePromise = shouldFetchLive(flags) ? fetchLive() : Promise.resolve(null);

  // Banner first: an animated violet shimmer when we can animate, otherwise the
  // static gradient.
  if (animate) {
    await animateBanner();
    await sleep(120);
  } else {
    console.log(renderBanner());
  }

  // Card, enriched with whatever the (bounded) live fetch returned.
  const live = await livePromise;
  const tagline = pick(taglines);
  await reveal(renderCard({ live, tagline }), 30, animate);

  console.log(`Tip: ${chalk.cyanBright.bold('cmd/ctrl + click')} the links above.`);
  console.log(chalk.gray(`     ${pick(funFacts)}\n`));

  if (!interactive) return;

  const action = await promptForAction();
  await action();
}

main().catch((err: unknown) => {
  // Ctrl+C / Esc at the menu is a normal way to leave, not a crash.
  if (err instanceof Error && err.name === 'ExitPromptError') {
    console.log('\nHave a great day!\n');
    return;
  }
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Something went wrong: ${message}`);
  process.exitCode = 1;
});
