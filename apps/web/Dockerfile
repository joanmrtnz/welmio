# -----------------------------
# Base
# -----------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable

# -----------------------------
# Prune monorepo
# -----------------------------
FROM base AS pruner

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=web --docker

# -----------------------------
# Install dependencies
# -----------------------------
FROM base AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN pnpm turbo run build --filter=web

# -----------------------------
# Production image
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]