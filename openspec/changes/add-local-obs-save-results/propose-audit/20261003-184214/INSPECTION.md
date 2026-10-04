# INSPECTION (propose-audit written — no ticket-audit cite)

- run_id: 20261003-184214
- change: add-local-obs-save-results
- packs: happy-path, edges, ui-surfaces (FE), observability

## A — Happy paths

| ID | WHEN | THEN |
|----|------|------|
| HP-UP | Operator runs `make up` with Docker | API :3000, UI :5173, Grafana :3001 up; tests not auto-run |
| HP-FILTER-TEL | Authenticated Filter A/B succeeds with OTel on | Trace has scrape + persist; `requestId` on telemetry + UsageLog |
| HP-SAVE | User clicks Save after successful filter | Snapshot persisted; list shows new row |
| HP-LIST | Authenticated GET/list in UI or Bruno | Only caller’s saves; id/savedAt/filter/entryCount |
| HP-BRUNO | Bruno HP-SAVE + HP-LIST after login | CLI green against local BFF |
| HP-LOGS | Operator runs `make logs` or Grafana Explore | Backend logs / traces by requestId visible |

## B — Edges

| ID | WHEN | THEN |
|----|------|------|
| EC-SAVE-401 | Save without Bearer | 401; no row |
| EC-SAVE-400 | Invalid body / bad entries | 400; no row |
| EC-OTEL-OFF | `OTEL_EXPORTER_OTLP_ENDPOINT` unset | Boot + Vitest green; no collector required |
| EC-CI-NOCOMPOSE | CI runs | No Grafana/Compose required for green |
| EC-EMPTY-SAVES | User has zero saves | Explicit empty UI state |
| EC-USAGE-NO-ENTRIES | Filter success | UsageLog has requestId + scrape_duration_ms; **no** entry arrays |

## C — UI surfaces (delta)

| Surface | Decision in plan |
|---------|------------------|
| Filters page | Add Save control after success; busy/error; no white screen |
| Saved list | Same page region; columns savedAt/filter/entryCount; empty state |
| Pagination | Forbidden for filter results and saved list (this change) |
| Diff two saves | Out of scope |
| New routes | Not required (embed in Filters); 404 unchanged |
)