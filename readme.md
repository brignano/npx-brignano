# npx_brignano <a href="#"><img src="https://img.shields.io/badge/-npx%20brignano-white?style=flat-square&logo=npm&logoColor=grey" align="right" alt="npm Badge"></img></a>

An interactive shell experience that renders my business card in your terminal.

👇 just hit 
```bash
npx brignano
```

### DEMO

# npx-brignano <a href="#"><img src="https://img.shields.io/badge/-npx%20brignano-white?style=flat-square&logo=npm&logoColor=grey" align="right" alt="npm Badge"></img></a>

An interactive terminal business card for Anthony Brignano. Run it with `npx` to view a styled card in your terminal and choose quick actions like emailing or downloading a resume.

Quick start

```bash
npx brignano
```

Demo

![](https://raw.githubusercontent.com/brignano/npx_brignano/main/demo.gif)

What it does

- Renders a boxed, colored business card in the terminal using `boxen` and `chalk`.
- Presents a small interactive menu (via `inquirer`) with actions:
	- Send an email (opens your mail client with `mailto:`)
	- Download the resume (fetches a resume HTML and opens it locally)
	- Quit

Files

- `card.js` — main CLI script: prints the card and runs the interactive menu.
- `package.json` — project metadata and `bin` entry used by `npx`.

Usage

- Run directly with `npx brignano` (no install required).
- Or clone and run locally:

```bash
git clone https://github.com/brignano/npx_brignano.git
cd npx-brignano
npm install
node card.js
```

Prerequisites

- Node.js (tested with Node 14+). `npx` is included with npm.

Notes

- When you choose "Download my Resume" the script requests the resume URL and writes `anthony-brignano.html` into the current working directory, then opens it.
- Links printed in the card may be cmd/ctrl+clickable in supported terminals.

Credits

This project is inspired by and credited to [anmol098/npx_card](https://github.com/anmol098/npx_card).

License

See `package.json` for license information.