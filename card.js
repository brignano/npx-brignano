#!/usr/bin/env node

'use strict'

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
clear();

const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("Email")}.`,
                value: () => {
                    open("mailto:hi@brignano.io");
                    console.log("\nDone, see you soon at inbox.\n");
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}.`,
                value: () => {
                    // cliSpinners.dots;
                    const loader = ora({
                        text: ' Downloading Resume',
                        spinner: cliSpinners.material,
                    }).start();
                    let pipe = request('https://brignano-io.vercel.app/api/resume').pipe(fs.createWriteStream('./anthony-brignano.html'));
                    pipe.on("finish", function () {
                        let downloadPath = path.join(process.cwd(), 'anthony-brignano.html')
                        console.log(`\nResume Downloaded at ${downloadPath} \n`);
                        open(downloadPath)
                        loader.stop();
                    });
                }
            },
            {
                name: "Just quit.",
                value: () => {
                    console.log("Have a good day!\n");
                }
            }
        ]
    }
];

const data = {
    name: chalk.bold.green("             Anthony Brignano"),
    handle: chalk.white("@brignano"),
    work: `${chalk.white("Sr. Software Engineer at")} ${chalk
        .hex("#3A5A78")
        .bold("The Hartford")}`,
    github: chalk.gray("https://github.com/") + chalk.green("brignano"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("brignano"),
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan("brignano_"),
    web: chalk.cyan("https://brignano.io"),
    npx: chalk.red("npx") + " " + chalk.white("brignano"),

    labelWork: chalk.white.bold("       Work:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelTwitter: chalk.white.bold("    Twitter:"),
    labelWeb: chalk.white.bold("        Web:"),
    labelCard: chalk.white.bold("       Card:")
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelWork}  ${data.work}`,
        ``,
        `${data.labelGitHub}  ${data.github}`,
        `${data.labelLinkedIn}  ${data.linkedin}`,
        `${data.labelTwitter}  ${data.twitter}`,
        `${data.labelWeb}  ${data.web}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `${chalk.italic("My inbox is always open. Whether you have a")}`,
        `${chalk.italic(
            "question or just want to say hi, I will try"
        )}`,
        `${chalk.italic(
            "my best to get back to you! :)"
        )}`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "single",
        borderColor: "green"
    }
);

console.log(me);
const tip = [
    `Tip: Try ${chalk.cyanBright.bold(
        "cmd/ctrl + click"
    )} on the links above`,
    '',
].join("\n");
console.log(tip);

prompt(questions).then(answer => answer.action());
