## 1. License and package metadata

- [x] 1.1 Add root `LICENSE` with standard MIT text, copyright `Copyright (c) 2026 Cristian Lara` — verify: file exists; copyright line matches
- [x] 1.2 Set root `package.json` `"license": "MIT"` — verify: field equals `MIT`
- [x] 1.5 **Slice review:** LICENSE MIT + package.json license — verify: both paths present and consistent
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before group 2 — verify: note in `SLICE-AUDIT.md` or inline table in this file

## 2. Changelog and README pointers

- [x] 2.1 Add root `CHANGELOG.md` (Keep a Changelog) with `## [1.0.0-mvp] - <YYYY-MM-DD>` and curated English `### Added` (MVP capabilities; not a commit dump) — verify: section names `1.0.0-mvp`; English only
- [x] 2.2 Add brief README pointers to `LICENSE` and `CHANGELOG.md` without rewriting onboarding — verify: both filenames appear in root `README.md`
- [x] 2.5 **Slice review:** CHANGELOG section + README pointers — verify: scenarios for changelog and README from `specs/release-hygiene/spec.md`
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS before close — verify: audit evidence recorded

## 3. Close

- [x] 3.1 Run `openspec validate add-release-hygiene --strict` — verify: exit 0
- [x] 3.2 READY FOR PR note: feature branch → `develop` (then release path to `main` + F3 tag `v1.0.0-mvp`) — verify: note recorded
