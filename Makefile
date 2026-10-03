.PHONY: install dev test test-e2e lint

install:
	pnpm install --frozen-lockfile

dev:
	pnpm dev

test:
	pnpm test

test-e2e:
	pnpm test:e2e

lint:
	pnpm lint
