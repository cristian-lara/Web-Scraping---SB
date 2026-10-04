# Architecture diagrams (C4)

Mermaid sources (C1–C3) and rendered PNGs for the HN Scraper MVP. No C4 Code level.

## Files

| Level | Source | PNG |
|-------|--------|-----|
| Context | `c1-context.mmd` | `c1-context.png` |
| Containers | `c2-containers.mmd` | `c2-containers.png` |
| Components | `c3-components.mmd` | `c3-components.png` |

Linked from the root [README.md](../../README.md) Architecture section.

## Regenerate PNGs

Requires Node/npx (no permanent workspace dependency). From repo root:

```bash
npx -y @mermaid-js/mermaid-cli -i docs/architecture/c1-context.mmd -o docs/architecture/c1-context.png -b transparent --size 1600
npx -y @mermaid-js/mermaid-cli -i docs/architecture/c2-containers.mmd -o docs/architecture/c2-containers.png -b transparent --size 1600
npx -y @mermaid-js/mermaid-cli -i docs/architecture/c3-components.mmd -o docs/architecture/c3-components.png -b transparent --size 1600
```

If labels clip, raise `--size` (e.g. `2000`) or `-s 2` (scale) and re-run.

Re-render whenever a `.mmd` file changes so PNGs stay in sync.
