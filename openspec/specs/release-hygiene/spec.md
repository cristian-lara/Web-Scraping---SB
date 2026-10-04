## Purpose

Makes the MVP snapshot legally clear and historically readable via a root MIT license, a Keep a Changelog file for the first tagged version, and matching workspace metadata pointers.

## Requirements

### Requirement: Root MIT license file
The repository root MUST contain a `LICENSE` file with the standard MIT license text. The copyright line MUST name **Cristian Lara** and year **2026**.

#### Scenario: Evaluator finds MIT license
- **WHEN** an evaluator opens the repository root
- **THEN** a `LICENSE` file MUST be present
- **AND** the file MUST identify the MIT license with copyright holder Cristian Lara and year 2026

### Requirement: Workspace package license field matches MIT
The root `package.json` MUST declare `"license": "MIT"` so package metadata matches the root `LICENSE` file.

#### Scenario: package.json license is MIT
- **WHEN** a consumer reads the root `package.json` `license` field
- **THEN** the value MUST be exactly `MIT`

### Requirement: Keep a Changelog with first MVP section
The repository root MUST contain a `CHANGELOG.md` that follows Keep a Changelog structure and MUST include a section for version `1.0.0-mvp` summarizing the shipped MVP capabilities in English (curated Added/Changed/Fixed/Notes style as applicable—not a raw commit dump).

#### Scenario: First version section exists
- **WHEN** an evaluator opens `CHANGELOG.md`
- **THEN** the file MUST contain a section headed for `1.0.0-mvp` (or equivalent Keep a Changelog heading that names that version)
- **AND** the section MUST describe the initial MVP snapshot in English

### Requirement: README points to license and changelog
The root English `README.md` MUST briefly point readers to `LICENSE` and `CHANGELOG.md`.

#### Scenario: README links hygiene files
- **WHEN** an evaluator reads the root README
- **THEN** they MUST find explicit references to both `LICENSE` and `CHANGELOG.md`
