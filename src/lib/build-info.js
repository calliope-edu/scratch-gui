// Which version this build is: the same values as the BUILD.json next to it
// (docs/build-info.md). webpack.config.js compiles them in from
// scripts/build-info.js as process.env.BUILD_INFO.

const fallback = {
    channel: 'local',
    version: 'local',
    commit: '',
    builtAt: '',
    ui: null,
    widget: null,
    libs: {}
};

/**
 * @param {string|undefined} json - the compiled-in BUILD_INFO
 * @returns {object} the build info, the local fallback where there is none
 */
const parseBuildInfo = json => {
    if (!json) return fallback;
    try {
        return Object.assign({}, fallback, JSON.parse(json));
    } catch (e) {
        return fallback;
    }
};

const buildInfo = parseBuildInfo(process.env.BUILD_INFO);

const shortCommit = commit => (commit || '').slice(0, 7);

const joined = (...parts) => parts.filter(Boolean).join(' · ');

/**
 * @param {object} info - the build info
 * @returns {string} "calliope-v1.0.0 · 7ea9962" (live), "calliope-main · a1b2c3d" (dev)
 */
const versionLine = info => joined(info.version, shortCommit(info.commit));

const packageState = (label, state) => (state ? `${label} ${state.tag || shortCommit(state.commit)}` : '');

/**
 * @param {object} info - the build info
 * @returns {?string} "UI v0.3.0 · Widget v0.4.1" (live), "UI 6faa0c1 · Widget 9e8d7c6"
 * (dev), or null without calliope-ui and the widget (Blocks today)
 */
const packagesLine = info =>
    joined(packageState('UI', info.ui), packageState('Widget', info.widget)) || null;

/**
 * The embedded Campus variant (/editors/blocks/, or any page in a frame) shows
 * no version line to its host, so it names its build in the console once.
 * @param {object} info - the build info
 * @param {string} pathname - the page's path
 * @param {boolean} framed - whether the page runs in a frame
 * @returns {boolean} whether it logged
 */
const logBuildInfoWhenEmbedded = (
    info = buildInfo,
    pathname = window.location.pathname,
    framed = window.self !== window.top
) => {
    if (!framed && !pathname.startsWith('/editors/')) return false;
    // eslint-disable-next-line no-console
    console.info(`[blocks-editor] ${info.channel} ${versionLine(info)}`, info);
    return true;
};

export {
    buildInfo,
    logBuildInfoWhenEmbedded,
    packagesLine,
    parseBuildInfo,
    shortCommit,
    versionLine
};
