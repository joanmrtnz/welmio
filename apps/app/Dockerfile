# -----------------------------
# Base
# -----------------------------
FROM node:20-alpine AS base

WORKDIR /app
RUN corepack enable

# -----------------------------
# Prune monorepo
# -----------------------------
FROM base AS pruner

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=app --docker

# -----------------------------
# Install dependencies
# -----------------------------
FROM base AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

RUN pnpm --filter app run build-web

# -----------------------------
# Production image
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=installer /app/apps/app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]