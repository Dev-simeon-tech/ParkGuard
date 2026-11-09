FROM node:22-alpine AS base
RUN npm install -g pnpm@10.16.1

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/package.json
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
COPY apps/api ./apps/api
COPY packages ./packages

RUN pnpm --filter=@parkguard/api... build


RUN pnpm --filter=@parkguard/api deploy --prod /app/api-deploy

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express

RUN mkdir -p /app/logs && chown express:nodejs /app/logs

COPY --from=builder --chown=express:nodejs /app/api-deploy/node_modules ./node_modules
COPY --from=builder --chown=express:nodejs /app/apps/api/build ./build
COPY --from=builder --chown=express:nodejs /app/api-deploy/package.json ./package.json

USER express

ENV NODE_ENV=production
ENV PORT=9001
EXPOSE $PORT

CMD ["node", "build/index.js"]
