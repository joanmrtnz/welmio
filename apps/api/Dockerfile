FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable

# -----------------------------
# Prune monorepo
# -----------------------------
FROM base AS pruner

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=api --docker

# -----------------------------
# Install deps
# -----------------------------
FROM base AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# Generate Prisma client (dummy DB url)
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm --filter api exec prisma generate


RUN pnpm turbo run build --filter=api

# -----------------------------
# Production image
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app/apps/api/dist ./apps/api/dist
COPY --from=installer /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 3000

CMD ["node", "apps/api/dist/src/main.js"]