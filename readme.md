# npx-brignano <a href="#"><img src="https://img.shields.io/badge/-npx%20brignano-white?style=flat-square&logo=npm&logoColor=grey" align="right" alt="npm Badge"></img></a>

An interactive terminal business card for Anthony Brignano. Run it with `npx` to get a gradient ASCII-art intro, a styled card with **live GitHub stats**, and quick actions — copy my email, open my socials, save my contact, or grab a scannable QR code.

## Quick start

```bash
npx brignano
```

![](demo.gif)

## What it does

- **Gradient ASCII banner** (`figlet` + `gradient-string`) with a smooth line-by-line reveal animation.
- **Styled business card** (`boxen` + `chalk`) with name, role, and links.
- **Live GitHub stats** — follower/repo counts and my latest repo, fetched fresh with a strict ~1.5s timeout. If the network is slow or offline, the card renders instantly and just omits the live line. It never hangs.
- **Interactive menu** (`inquirer`) with quick actions:
  - Copy my email to your clipboard
  - Send me an email (`mailto:`)
  - Open my GitHub / LinkedIn
  - View my resume
  - Save my contact as a `.vcf` (opens in Contacts)
  - Show a scannable contact **QR code**
  - Quit

The animation, network fetch, and prompt are all skipped automatically when output isn't a TTY (piped, CI, or `--no-prompt`), so it stays fast and never blocks scripts.

## CLI

Run `npx brignano --help` to see this list.

| Flag | Description |
|------|-------------|
| `-h, --help` | Show help and exit. |
| `-v, --view` | Open my resume in your default browser (`https://brignano.io/resume`). |
| `-e, --email` | Open your mail client with a new message to `hi@brignano.io`. |
| `--qr` | Print a scannable QR code to my website and exit. |
| `--vcard` / `--save-contact` | Save my contact card (`.vcf`) and open it. |
| `--no-animation` | Render the full card instantly, skipping the reveal animation. |
| `--no-prompt` | Show the card only and exit (non-interactive). |
| `-d, --download` | Deprecated alias for `--view`. |

### Examples

```bash
npx brignano              # full interactive experience
npx brignano --view       # jump straight to my resume
npx brignano --qr         # print a QR code to my site
npx brignano --vcard      # save my contact card
npx brignano --no-prompt  # card only (useful in CI/scripts)
```

## Local development

```bash
git clone https://github.com/brignano/npx-brignano.git
cd npx-brignano
npm install
npm run build
node dist/card.js
```

Source lives in `src/` (split into small modules — `card.ts` is the entry/`bin` target) and compiles to `dist/` via `tsc`.

## Prerequisites

- Node.js **>=20** (`npx` ships with npm).

## Notes

- Links printed in the card are cmd/ctrl+clickable in supported terminals.
- The `--download` flag is deprecated and now opens the resume in your browser instead of writing a local file.

## Credits

Inspired by [anmol098/npx_card](https://github.com/anmol098/npx_card).

## License

See `package.json` for license information.
