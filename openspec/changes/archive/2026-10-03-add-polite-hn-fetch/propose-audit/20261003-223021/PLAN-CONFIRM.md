# PLAN-CONFIRM — add-polite-hn-fetch

- run_id: 20261003-223021
- at: 2026-10-04T03:30:21Z
- audit: PASS

## Objetivo

Añadir política de fetch educada (cache TTL, intervalo mínimo saliente, 1 retry seguro, stages `hn_fetch_*`) detrás de `HnHtmlFetcher` / Axios live, sin tocar parse Cheerio, filtros, ni multi-sitio.

## In scope

- `PoliteHnHtmlFetcher` decorator + Nest DI (fixture XOR polite(Axios))
- Vitest offline con stub inner (cache / interval / retry 403–429)
- Constants + env `HN_FETCH_CACHE_TTL_MS` / `HN_FETCH_MIN_INTERVAL_MS`
- Docs breves (Bruno README o README scrape)
- Slice gates 1.5/1.6 y 2.5/2.6 + `SLICE-AUDIT.md`

## Out of scope

Proxies, UA rotation, stealth, Redis, segundo sitio, cambios Filter/Entry, inbound Nest throttler.

## Grupos apply

| Grupo | Contenido |
|-------|-----------|
| ##1 | Constants → fail Vitest → impl → Nest DI → 1.5/1.6 |
| ##2 | Docs → validate/vitest → 2.5/2.6 |

Post-apply: R1–R3 una vez al cerrar el change.

## Decisiones clave

- Decorator en port (no mezclar en Axios puro)
- Defaults: TTL 30s, interval 2s, retry ×1 (timeout/5xx only)
- Fixture CI sin envolver

## Top Certainty

| Claim | Nivel |
|-------|-------|
| Cache + interval + retry class | S |
| Fixture bypass | S |
| Live HN flake/403 | E |

## Preguntas outsider

1. ¿2s de wait en cold miss es aceptable en demo, o preferís 0/1s?
2. ¿Stages solo en logs bastan, o querés contador OTel en otro change?
3. ¿Confirmás apply de ##1+##2 en una sola ola?

## Confirmación (humano)

- [ ] A — proceder a apply (`/opsx-apply`)
- [ ] B — editar plan (invalida PASS)
- [ ] C — aclarar
- [ ] D — hotfix explícito (raro; anotar META)
