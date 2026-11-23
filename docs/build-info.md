# Build info: `BUILD.json` and the version line

Every Blocks build says which version it is, in the format all Calliope
editors share. The format is defined in calliope-mini-python-editor
`docs/build-info.md`; this page names only what Blocks does differently. The
plan behind it is calliope-campus `docs/design/2026-editor-channels.md`
("Version display").

## Channels

| Channel | Built from                   | Build branch | Served at                                    |
| ------- | ---------------------------- | ------------ | -------------------------------------------- |
| `live`  | a tag `calliope-vX.Y.Z`      | `build-live` | `blocks.calliope.cc`, Campus pins it         |
| `dev`   | a push to calliope-main      | `build-dev`  | `blocks-dev.calliope.cc`, campus-dev proxies |
| `local` | `npm start`, `npm run build` | none         | your machine                                 |

## `BUILD.json`

Next to both variants of a build: the site root (`/BUILD.json`) and the Campus
variant (`/editors/blocks/BUILD.json`), with the same values.

```json
{
    "channel": "live",
    "version": "calliope-v1.1.0",
    "commit": "464d7bd77…",
    "builtAt": "2026-11-23T17:00:00Z",
    "ui": null,
    "widget": null,
    "libs": { "scratch-vm": "9115be5e796b…" }
}
```

- `libs["scratch-vm"]` is the scratch-vm commit `package-lock.json` pins
  (calliope-edu/scratch-vm, branch `calliope-main`, over https).
- `ui` and `widget` are `null`: Blocks carries neither calliope-ui nor the
  connection widget yet.

Builds before this format (up to `calliope-v1.0.0`) carry the older shape
(`name`, `ref`, `source`, `scratchVm`, `base`, `built`); Campus' version
overview reads both.

## Where the values come from

[`scripts/build-info.js`](../scripts/build-info.js) turns `BUILD_CHANNEL`,
`BUILD_VERSION`, `BUILD_COMMIT` and `BUILD_AT` (without them: `local`, the git
branch and commit, now) and the lockfile's scratch-vm pin into the object.

- `webpack.config.js` compiles it in as `process.env.BUILD_INFO`, which the GUI
  reads as `buildInfo` ([`src/lib/build-info.js`](../src/lib/build-info.js)).
- The `calliope-build` workflow sets the four variables once in its step
  "Build info", builds both variants with them and writes
  `node scripts/build-info.js` to both `BUILD.json`.

## The version line

At the bottom of the settings menu (the gear), below a separator, in the
menu's white text:

- live: `calliope-v1.1.0 · 464d7bd`
- dev: a framed `dev` mark, then `calliope-main · a1b2c3d`
- local: a framed `local` mark, then the branch and commit

Blocks has no second line (calliope-ui and widget states) until it carries
them.

## In Campus

The Campus variant (`/editors/blocks/`, or any page in a frame) logs the build
once to the console at startup:

```
[blocks-editor] live calliope-v1.1.0 · 464d7bd {channel: "live", …}
```

Campus shows the build in `/admin/versions`, from
`/editors/blocks/BUILD.json`.

## Bumping scratch-vm

`package.json` follows scratch-vm's `calliope-main` over https. To take its
newest commit, `npm install scratch-vm` and commit `package-lock.json`; check
that `resolved` still starts with `git+https://` (a git setting that rewrites
https to ssh would put `git+ssh://` there, which CI cannot fetch).
