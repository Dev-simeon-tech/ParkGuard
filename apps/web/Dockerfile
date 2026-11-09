FROM node:22-alpine AS base
RUN npm install -g pnpm@10.16.1

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/authorization/package.json ./packages/authorization/package.json
COPY packages/constants/package.json ./packages/constants/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app .

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages

# Vite inlines VITE_* into the bundle at build time, unlike apps/api's
# runtime env vars — they must be passed as build args. No defaults: a
# missing build arg must fail the build loudly. The port the container
# serves on is a runtime concern instead — see PORT in the runner stage
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "VITE_API_URL build arg is required" >&2 && exit 1)
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm --filter=@parkguard/web... build

# ── Stage 3: Production runner — static SPA, no Node server needed ──────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN npm install -g serve@14

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 web

COPY --from=builder --chown=web:nodejs /app/apps/web/build ./build

USER web

ENV PORT=9000
EXPOSE $PORT

# -s enables SPA fallback (unknown routes → index.html) for React Router
CMD ["sh", "-c", "serve -s build -l $PORT"]
