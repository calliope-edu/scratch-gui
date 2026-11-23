import {
    logBuildInfoWhenEmbedded,
    packagesLine,
    parseBuildInfo,
    versionLine
} from '../../../src/lib/build-info';

import repoLock from '../../../package-lock.json';

const {buildInfo, scratchVmCommit} = require('../../../scripts/build-info');

const live = {
    channel: 'live',
    version: 'calliope-v1.0.0',
    commit: '7ea99620f3c4aa',
    builtAt: '2026-11-23T17:00:00Z',
    ui: null,
    widget: null,
    libs: {'scratch-vm': '9115be5e796b340e87cd8ce0df5dc30575213c37'}
};

const lock = {
    packages: {
        'node_modules/scratch-vm': {
            resolved: 'git+https://github.com/calliope-edu/scratch-vm.git#9115be5e796b340e87cd8ce0df5dc30575213c37'
        }
    }
};

describe('scripts/build-info.js', () => {
    test('a tag build is live and names the scratch-vm pin', () => {
        expect(buildInfo({
            BUILD_CHANNEL: 'live',
            BUILD_VERSION: 'calliope-v1.0.0',
            BUILD_COMMIT: '7ea99620f3c4aa',
            BUILD_AT: '2026-11-23T17:00:00Z'
        }, lock)).toEqual(live);
    });

    test('a local build falls back to git and now', () => {
        const info = buildInfo({}, lock);
        expect(info.channel).toBe('local');
        expect(info.builtAt).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/);
    });

    test('an unknown channel fails the build', () => {
        expect(() => buildInfo({BUILD_CHANNEL: 'beta'}, lock)).toThrow(/BUILD_CHANNEL/);
    });

    test('scratchVmCommit reads the commit after #, none without a pin', () => {
        expect(scratchVmCommit(lock)).toBe('9115be5e796b340e87cd8ce0df5dc30575213c37');
        expect(scratchVmCommit({packages: {}})).toBe('');
        expect(buildInfo({}, null).libs).toEqual({});
    });

    test('the repository lockfile pins scratch-vm over https', () => {
        expect(repoLock.packages['node_modules/scratch-vm'].resolved)
            .toMatch(/^git\+https:\/\/github\.com\/calliope-edu\/scratch-vm\.git#[0-9a-f]{40}$/);
    });
});

describe('src/lib/build-info.js', () => {
    test('parses the compiled-in JSON, else falls back to local', () => {
        expect(parseBuildInfo(JSON.stringify(live))).toEqual(live);
        expect(parseBuildInfo('').channel).toBe('local');
        expect(parseBuildInfo('{not json').channel).toBe('local');
    });

    test('version line: version and short commit', () => {
        expect(versionLine(live)).toBe('calliope-v1.0.0 · 7ea9962');
        expect(versionLine({version: 'calliope-main', commit: 'a1b2c3d4e5'})).toBe('calliope-main · a1b2c3d');
    });

    test('packages line: none in Blocks, tags on live, commits on dev', () => {
        expect(packagesLine(live)).toBeNull();
        expect(packagesLine({
            ui: {tag: 'v0.3.0', commit: 'aaa'},
            widget: {tag: 'v0.4.1', commit: 'bbb'}
        })).toBe('UI v0.3.0 · Widget v0.4.1');
        expect(packagesLine({
            ui: {tag: '', commit: '6faa0c1ffff'},
            widget: {tag: '', commit: '9e8d7c6ffff'}
        })).toBe('UI 6faa0c1 · Widget 9e8d7c6');
    });

    test('logs once in the Campus variant or a frame, not on its own address', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => {});
        expect(logBuildInfoWhenEmbedded(live, '/', false)).toBe(false);
        expect(logBuildInfoWhenEmbedded(live, '/editors/blocks/', false)).toBe(true);
        expect(logBuildInfoWhenEmbedded(live, '/', true)).toBe(true);
        expect(info).toHaveBeenCalledWith('[blocks-editor] live calliope-v1.0.0 · 7ea9962', live);
        info.mockRestore();
    });
});
