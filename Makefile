.PHONY: install dev test test-e2e test-coverage lint up down logs

install:
	pnpm install --frozen-lockfile

dev:
	pnpm dev

test:
	pnpm test

test-e2e:
	pnpm test:e2e

test-coverage:
	pnpm test:coverage

lint:
	pnpm lint

# Local Docker stack: API :3000, UI :5173, Grafana :3001 (requires Docker Desktop).
up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f backend
