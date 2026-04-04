FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api

WORKDIR /app/apps/api

RUN pnpm exec prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm run start:prod"]