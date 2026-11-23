#!/usr/bin/env node
// The build's version as BUILD.json holds it (docs/build-info.md), in the format
// the Calliope editors share (calliope-mini-python-editor docs/build-info.md).
//
// The calliope-build workflow sets BUILD_CHANNEL, BUILD_VERSION, BUILD_COMMIT
// and BUILD_AT once per job; webpack.config.js compiles the same values into
// the BUILD_INFO constant both builds carry, and the workflow writes BUILD.json
// next to each build with `node scripts/build-info.js`. Without those variables
// (a local `npm start` or `npm run build`) the channel is "local" and version
// and commit come from git.
//
// Compared with the Python editor's copy only `libs` differs: Blocks pins its
// scratch-vm fork in package-lock.json.
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const CHANNELS = ['live', 'dev', 'local'];

const git = args => {
    try {
        return execSync(`git ${args}`, {
            cwd: __dirname,
            stdio: ['ignore', 'pipe', 'ignore']
        })
            .toString()
            .trim();
    } catch {
        return '';
    }
};

/**
 * The scratch-vm commit package-lock.json pins: the part after `#` of
 * `git+https://github.com/calliope-edu/scratch-vm.git#<commit>`.
 * @param {object} lock - package-lock.json
 * @returns {string} the commit, or '' if the lockfile pins none
 */
const scratchVmCommit = lock => {
    const entry = lock && lock.packages && lock.packages['node_modules/scratch-vm'];
    const resolved = (entry && entry.resolved) || '';
    const hash = resolved.indexOf('#');
    return hash === -1 ? '' : resolved.slice(hash + 1);
};

const readLock = () => {
    try {
        return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package-lock.json'), 'utf8'));
    } catch {
        return null;
    }
};

/**
 * @param {Record<string, string | undefined>} env - the environment
 * @param {object} lock - package-lock.json
 * @returns {object} the build info (docs/build-info.md)
 */
const buildInfo = (env = process.env, lock = readLock()) => {
    const channel = env.BUILD_CHANNEL || 'local';
    if (!CHANNELS.includes(channel)) {
        throw new Error(`BUILD_CHANNEL must be one of ${CHANNELS.join(', ')}, not "${channel}"`);
    }
    const vm = scratchVmCommit(lock);
    return {
        channel,
        // live: the tag (calliope-vX.Y.Z); dev: the branch (calliope-main).
        version: env.BUILD_VERSION || git('rev-parse --abbrev-ref HEAD') || 'local',
        commit: env.BUILD_COMMIT || git('rev-parse HEAD'),
        builtAt: env.BUILD_AT || new Date().toISOString()
            .replace(/\.\d+Z$/, 'Z'),
        // Blocks carries neither calliope-ui nor the connection widget yet;
        // editors that do give {tag, commit} here (tag "" on dev).
        ui: null,
        widget: null,
        // Pinned library forks, name → commit.
        libs: vm ? {'scratch-vm': vm} : {}
    };
};

module.exports = {buildInfo, scratchVmCommit};

if (require.main === module) {
    process.stdout.write(`${JSON.stringify(buildInfo(), null, 2)}\n`);
}
