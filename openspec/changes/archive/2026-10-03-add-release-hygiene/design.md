## Context

See `proposal.md` — Why. Active `add-mvp-ops-release` still owns annotated tag `v1.0.0-mvp` on `main` (task 5.7). This change only adds license + changelog hygiene before that release cut. No runtime modules involved.

## Goals / Non-Goals

**Goals:**

- Ship root MIT `LICENSE`, Keep a Changelog `CHANGELOG.md` with `[1.0.0-mvp]`, `"license": "MIT"` on root `package.json`, and short README pointers.
- Keep content English and evaluator-readable.

**Non-Goals:**

- Creating the git tag or GitHub Release (owned by F3 / ops release).
- Auto-generating changelog from commits (`git-cliff`, semantic-release, etc.).
- Per-file SPDX headers or `NOTICE` files.
- Changing CI, APIs, or product behavior.

## Decisions

### Decision 1: MIT text as a single root `LICENSE`
- **Choice:** Standard MIT license body; copyright `Copyright (c) 2026 Cristian Lara`.
- **Rationale:** Matches portfolio/desafío norms; one file GitHub detects automatically.
- **Alternatives considered:** Apache-2.0 (heavier); proprietary (weaker signal for public challenge). Rejected after product choice.

### Decision 2: Curated Keep a Changelog for `1.0.0-mvp`
- **Choice:** Manual English section under `## [1.0.0-mvp] - <release-date>` with `### Added` (and optional Notes). Date filled at apply time (UTC/local day of the commit). Unreleased section optional; omit if empty.
- **Rationale:** First tag has no prior baseline; curated bullets beat noisy Conventional Commit dumps for evaluators.
- **Alternatives considered:** Auto-generated from all history — noisy for v1. Tag-annotation-only notes — less durable than a file in the clone.

### Decision 3: `package.json` license field
- **Choice:** Add `"license": "MIT"` at the root workspace `package.json`.
- **Rationale:** npm/GitHub metadata consistency; one-line change.
- **Alternatives considered:** License only in `LICENSE` file — incomplete for package tooling.

### Decision 4: README pointer placement
- **Choice:** Short bullet or one-line under existing branching/docs area pointing to `LICENSE` and `CHANGELOG.md` (and that tag `v1.0.0-mvp` is the snapshot name once cut). Do not rewrite the onboarding README.
- **Rationale:** Ponytail — smallest edit that satisfies the requirement.
- **Alternatives considered:** New “Legal” section page — YAGNI.

### Decision 5: Sequencing vs F3 tag
- **Choice:** Implement and merge this change to `develop` first; then release PR `develop` → `main`; then F3 annotated tag on that `main` commit. Changelog section may land slightly before the tag exists; heading still names `1.0.0-mvp`.
- **Rationale:** Tag remains last acceptance of ops release; hygiene files should be on the tagged commit.
- **Alternatives considered:** Bundle into `add-mvp-ops-release` — mixes closed F3 waves with new scope.

## Risks / Trade-offs

- [Changelog drifts from actual tag date] → Fill date at apply; if tag slips a day, amend in a tiny follow-up or accept off-by-one date.
- [F3 README already mentions tag] → Hygiene pointers must not reintroduce conflicting tag instructions; only add LICENSE/CHANGELOG links.
- [Duplicate license fields in workspace packages] → Only root `package.json` required; nested packages stay private/unlicensed unless already set (YAGNI).

## Migration Plan

1. Apply files on a feature branch → PR → `develop`.
2. Include them in the release PR to `main`.
3. Create `v1.0.0-mvp` annotated tag (F3 task 5.7) on the release commit that contains these files.
4. Rollback: revert the PR; no data migration.

## Open Questions

None — license holder, MIT choice, and curated changelog approach confirmed with the user.
