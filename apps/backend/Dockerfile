# Build from repository root: docker build -f apps/backend/Dockerfile .
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY packages/shared-types/package.json packages/shared-types/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @repo/shared-types build \
  && pnpm --filter @repo/backend exec prisma generate \
  && pnpm --filter @repo/backend build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable
COPY --from=build /app /app
WORKDIR /app/apps/backend
EXPOSE 3000
# Secrets (JWT_SECRET, DEMO_USER_PASSWORD, etc.) MUST come from env / Compose env_file — never bake into layers.
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm exec tsx src/main.ts"]
