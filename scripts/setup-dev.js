#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const yargs = require('yargs')

const argv = yargs
    .option('vm',
        {
            description: 'path to scratch-vm',
            demandOption: true
        })
    .option('gui',
        {
            description: 'path to scratch-gui',
            default: './'
        })
    .version(false)
    .help()
    .argv

const VmRoot = path.resolve(process.cwd(), argv.vm);
const GuiRoot = path.resolve(process.cwd(), argv.gui);

// Make symbolic link.
// Uses a 'junction' (not 'dir'): on Windows a directory symlink needs admin /
// Developer Mode, but a junction does not; on POSIX the type arg is ignored and
// a normal symlink is created either way. Synchronous unlink/rename so the old
// entry is gone before we re-create it (the previous async fs.unlink raced the
// symlink call → EEXIST). NOTE: if node_modules/scratch-vm is locked (e.g. the
// webpack dev server is running), rename/unlink fails with EPERM/EACCES — stop
// the dev server first, then re-run.
function makeSymbolicLink(to, from) {
    try {
        const stats = fs.lstatSync(from);
        if (stats.isSymbolicLink()) {
            if (fs.readlinkSync(from) === to) {
                console.log(`Already exists link: ${from} -> ${fs.readlinkSync(from)}`);
                return;
            }
            fs.unlinkSync(from);
        } else {
            const backup = `${from}~`;
            if (fs.existsSync(backup)) {
                fs.rmSync(backup, {recursive: true, force: true});
            }
            fs.renameSync(from, backup);
        }
    } catch (err) {
        if (err && (err.code === 'EPERM' || err.code === 'EACCES' || err.code === 'EBUSY')) {
            throw new Error(
                `Cannot replace ${from} (${err.code}) — it is locked. Stop the webpack dev server and re-run \`npm run setup-dev\`.`
            );
        }
        // Otherwise: path does not exist yet — fine, fall through to create it.
    }
    fs.symlinkSync(to, from, 'junction');
    console.log(`Make link: ${from} -> ${fs.readlinkSync(from)}`);
}

// Use local scratch-vm in scratch-gui
try {
    const VmModulePath = path.resolve(GuiRoot, './node_modules/scratch-vm');
    makeSymbolicLink(VmRoot, VmModulePath);
} catch (err) {
    console.error(err);
}
