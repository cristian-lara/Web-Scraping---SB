## Why

The MVP is ready to cut `v1.0.0-mvp` on `main`, but the repo still lacks a durable release history (`CHANGELOG.md`) and an explicit open-source license (`LICENSE`). Evaluators and future maintainers cannot see what the first snapshot includes or under what terms they may use the code.

## What Changes

- Add root `LICENSE` using the MIT text, copyright holder **Cristian Lara**, year **2026**.
- Add root `CHANGELOG.md` in Keep a Changelog style with an initial `[1.0.0-mvp]` section summarizing the shipped MVP (curated, not a raw commit dump).
- Set `package.json` `"license": "MIT"` so the workspace metadata matches the license file.
- Mention the changelog and license briefly in the root `README.md` (where to find them; tag name already covered by F3 docs).

No runtime API, schema, CI, or product behavior changes. **Not BREAKING.**

## Capabilities

### New Capabilities

- `release-hygiene`: Root MIT `LICENSE`, Keep a Changelog `CHANGELOG.md` with `[1.0.0-mvp]`, matching `package.json` license field, and README pointers.

### Modified Capabilities

None. (`docs-makefile-release` lives only inside active `add-mvp-ops-release` and is not yet a main spec; this change stays independent.)

## Impact

- Docs/legal: `LICENSE`, `CHANGELOG.md`, root `README.md`, root `package.json`
- Sequencing: land on `develop` before the release PR `develop` → `main`; annotated tag `v1.0.0-mvp` remains owned by `add-mvp-ops-release` task 5.7 (after merge to `main`)
- Out of scope: GitHub Release assets, automated changelog generators, SPDX headers in every source file
