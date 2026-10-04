# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses a tagged MVP snapshot (`v1.0.0-mvp`).

## [1.0.0-mvp] - 2026-10-03

Initial Milestone-3 MVP snapshot for evaluators.

### Added

- Monorepo BFF (`NestJS`) + React SPA + shared Zod contracts (`@repo/shared-types`)
- Hacker News scrape (Cheerio adapter), first-30 entries, word-count filters
- JWT demo auth, usage persistence (SQLite), Swagger-documented thin controllers
- Saved filter results API and UI save/list flows
- Structured JSON logs with `x-request-id` / `requestId`; optional Sentry
- Local observability Compose stack (OTel, Loki, Tempo, Grafana dashboards)
- Polite HN fetch with OpenTelemetry outcome attributes (`hn.fetch.*`)
- GitHub Actions CI (Vitest, Bruno live API, lint) and Makefile targets
- English README onboarding and C4 architecture diagrams

### Notes

- Sentry DSN is optional; empty DSN keeps SDKs off (including CI)
- Git tag `v1.0.0-mvp` marks this snapshot on `main` after the release merge
