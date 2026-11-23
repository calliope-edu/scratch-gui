# CLAUDE.md

Calliope's fork of scratch-gui: the Calliope mini Blocks editor. It runs on its
own at blocks.calliope.cc and inside Calliope Campus at `/editors/blocks/`
(built with `CAMPUS_DIST=1 PUBLIC_PATH=/editors/blocks/`, webpack.config.js).
Its VM is the fork calliope-edu/scratch-vm.

## Branches

- Work on `calliope-main`: branch off it and merge back into it. `xcratch`,
  `calliope`, `develop`, `gh-pages` and the other older branches are history.
- A tag `calliope-vX.Y.Z` on `calliope-main` goes live: the `calliope-build`
  workflow builds it onto `build-live` (blocks.calliope.cc; Campus pins it).
  Every push to `calliope-main` builds onto `build-dev`
  (blocks-dev.calliope.cc, campus-dev).
- Never commit to `build-live` or `build-dev` by hand; only the workflow
  writes them, and they only ever grow (Campus release tags pin old commits).
- scratch-vm comes from its `calliope-main` over https; `package-lock.json`
  pins the commit (docs/build-info.md, "Bumping scratch-vm").

## Version

- `BUILD.json` and the settings menu's version line follow docs/build-info.md,
  which follows the shared format in calliope-mini-python-editor
  `docs/build-info.md`. Change the format there first.

## Running it

- `npm ci` (with its install scripts: prepublish fetches the micro:bit hex the
  build imports; `CHROMEDRIVER_SKIP_DOWNLOAD=true` skips chromedriver).
- `npm start` serves on port 8601 (`PORT=…` for another).
- Unit tests: `npx jest test/unit`; lint: `npm run test:lint`.
