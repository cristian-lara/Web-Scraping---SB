.PHONY: install dev test test-e2e test-coverage lint

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
