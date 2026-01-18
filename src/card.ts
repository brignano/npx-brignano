#!/usr/bin/env node

import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import open from 'open';

function clearConsole(): void {
  if (typeof (process.stdout as any).clear === 'function') {
    try { (process.stdout as any).clear(); } catch (e) { /* ignore */ }
  }
  if (process.stdout.isTTY) {
    process.stdout.write('\u001b[2J\u001b[0f');
  }
}

clearConsole();

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What you want to do?',
    choices: [
      {
        name: `Send me an ${chalk.green.bold('Email')}.`,
        value: () => sendEmail(),
      },
      {
        name: `View my ${chalk.magentaBright.bold('Resume')}.`,
        value: () => viewResume(),
      },
      {
        name: 'Just quit.',
        value: () => {
          console.log('Have a good day!\n');
        },
      },
    ],
  },
];

function sendEmail(): void {
  open('mailto:hi@brignano.io')
    .then(() => {
      console.log('\nDone, see you soon at inbox.\n');
    })
    .catch((err: any) => {
      console.error('Failed to open mail client:', err && err.message ? err.message : err);
    });
}

function viewResume(): void {
  const resumeUrl = 'https://brignano.io/resume';
  open(resumeUrl)
    .then(() => {
      console.log(`\nOpened resume: ${resumeUrl}\n`);
    })
    .catch((err: any) => {
      console.error('Failed to open resume URL:', err && err.message ? err.message : err);
    });
}

const data = {
  name: chalk.bold.green('             Anthony Brignano'),
  handle: chalk.white('@brignano'),
  work: `Senior Staff Software Engineer ${chalk.white('at')} ${chalk.hex('#3A5A78').bold('The Hartford')}`,
  github: chalk.gray('https://github.com/') + chalk.green('brignano'),
  linkedin: chalk.gray('https://linkedin.com/in/') + chalk.blue('brignano'),
  web: chalk.cyan('https://brignano.io'),
  npx: chalk.red('npx') + ' ' + chalk.white('brignano'),

  labelWork: chalk.white.bold('       Work:'),
  labelGitHub: chalk.white.bold('     GitHub:'),
  labelLinkedIn: chalk.white.bold('   LinkedIn:'),
  labelWeb: chalk.white.bold('        Website:'),
  labelCard: chalk.white.bold('       Card:'),
};

const me = boxen(
  [
    `${data.name}`,
    '',
    `${data.labelWork}  ${data.work}`,
    '',
    `${data.labelGitHub}  ${data.github}`,
    `${data.labelLinkedIn}  ${data.linkedin}`,
    `${data.labelWeb}  ${data.web}`,
    '',
    `${data.labelCard}  ${data.npx}`,
    '',
    `${chalk.italic("My inbox is always open. Whether you have a")}`,
    `${chalk.italic("question or just want to say hi, I will try")}`,
    `${chalk.italic("my best to get back to you! :)")}`,
  ].join('\n'),
  {
    margin: 1,
    float: 'center' as const,
    padding: 1,
    borderStyle: 'single',
    borderColor: 'green',
  }
);

console.log(me);
const tip = [`Tip: Try ${chalk.cyanBright.bold('cmd/ctrl + click')} on the links above`, ''].join('\n');
console.log(tip);

// Simple argument parsing
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('\nUsage: npx brignano [options]\n');
  console.log('Options:');
  console.log('  -h, --help       Show this help');
  console.log('  -v, --view       Open resume in browser (https://brignano.io/resume)');
  console.log('  -d, --download   Deprecated: previously downloaded resume — now opens resume in browser');
  console.log('  -e, --email      Open mail client to email me');
  console.log('  --no-prompt      Show card only (non-interactive)\n');
} else if (argv.includes('--view') || argv.includes('-v')) {
  viewResume();
} else if (argv.includes('--download') || argv.includes('-d')) {
  console.warn('Warning: `--download` is deprecated and now opens the resume in your browser.');
  viewResume();
} else if (argv.includes('--email') || argv.includes('-e')) {
  sendEmail();
} else if (argv.includes('--no-prompt') || argv.includes('--quiet')) {
  console.log('\nExiting in non-interactive mode (--no-prompt).');
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prompt(questions as any).then((answer: any) => answer.action());
}
