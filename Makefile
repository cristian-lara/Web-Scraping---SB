.PHONY: install dev test test-e2e lint

install:
	pnpm install --frozen-lockfile

dev:
	pnpm dev

test:
	pnpm test

test-e2e:
	npx @usebruno/cli run apps/backend/bruno --env local

lint:
	pnpm lint
