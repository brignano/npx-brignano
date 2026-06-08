import chalk from 'chalk';
import clipboard from 'clipboardy';
import open from 'open';
import { profile } from './data.js';
import { renderQr } from './qrcode.js';
import { buildVCard, writeAndOpenVCard } from './vcard.js';

// --- Action helpers (kept as named functions so flags and the menu share them) ---

export async function copyEmail(): Promise<void> {
  try {
    await clipboard.write(profile.email);
    console.log(`\n${chalk.green('Copied')} ${profile.email} to your clipboard.\n`);
  } catch {
    // Clipboard access fails in headless/SSH environments — degrade gracefully.
    console.log(`\nMy email is ${chalk.green(profile.email)} — drop me a line!\n`);
  }
}

export async function sendEmail(): Promise<void> {
  try {
    await open(`mailto:${profile.email}`);
    console.log('\nOpened your mail client — see you in the inbox.\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to open mail client: ${message}`);
    console.error(`Reach me directly at ${profile.email}`);
  }
}

export async function openUrl(url: string, label: string): Promise<void> {
  try {
    await open(url);
    console.log(`\nOpened ${label}: ${url}\n`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to open ${label}: ${message}`);
    console.error(`Here it is: ${url}`);
  }
}

export async function viewResume(): Promise<void> {
  await openUrl(profile.resume, 'resume');
}

export async function showContactQr(): Promise<void> {
  const qr = await renderQr(buildVCard());
  console.log('\nScan to save my contact:\n');
  console.log(qr);
}

// --- Menu definition ---

export interface MenuChoice {
  name: string;
  value: () => void | Promise<void>;
}

export function buildChoices(): MenuChoice[] {
  return [
    { name: `Copy my ${chalk.green.bold('email')} to clipboard`, value: copyEmail },
    { name: `Send me an ${chalk.green.bold('email')}`, value: sendEmail },
    {
      name: `Open my ${chalk.green.bold('GitHub')}`,
      value: () => openUrl(profile.github, 'GitHub'),
    },
    {
      name: `Open my ${chalk.blue.bold('LinkedIn')}`,
      value: () => openUrl(profile.linkedin, 'LinkedIn'),
    },
    { name: `View my ${chalk.magentaBright.bold('resume')}`, value: viewResume },
    {
      name: `Save my ${chalk.cyan.bold('contact')} (.vcf)`,
      value: writeAndOpenVCard,
    },
    { name: `Show a ${chalk.yellow.bold('contact QR')} code`, value: showContactQr },
    {
      name: 'Just quit',
      value: () => {
        console.log('\nHave a great day!\n');
      },
    },
  ];
}
