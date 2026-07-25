<h1>
  <img
    src="apps/app/assets/images/ios-icon.png"
    alt="Welmio app icon"
    height="35"
  />
  Welmio
</h1>

**A full-stack, cross-platform personal finance product built as a portfolio
case study.**

Welmio helps users track income and expenses, organize transactions, monitor
savings goals, and understand their financial activity through analytics. The
project demonstrates how I design and ship a complete product across mobile,
web, backend, database, shared contracts, testing, and deployment.

<p align="center">
  <img
    src="apps/web/public/welmio_mockup_desktop.png"
    alt="Welmio running on desktop"
    width="650"
  />
  <img
    src="apps/web/public/welmio-mockup.png"
    alt="Welmio running on mobile"
    height="420"
  />
</p>

## What this project demonstrates

- A single Expo + React Native codebase targeting iOS, Android, and web
- A separate SEO-friendly Next.js marketing website
- A modular NestJS REST API backed by PostgreSQL and Prisma
- Secure authentication with password hashing, short-lived JWT access tokens,
  hashed refresh tokens, token rotation, and email verification
- Shared TypeScript contracts between the client and API
- Responsive, localized interfaces in English, Spanish, and Catalan
- Jest unit tests and a Supertest end-to-end test setup
- Docker images and GitHub Actions pipelines for pre-production and production
- Monorepo orchestration with pnpm workspaces and Turborepo

## Product features

- User registration, email verification, login, logout, and password recovery
- Income and expense tracking
- Custom categories and financial accounts
- Transaction filtering by date and category
- Savings goals and goal contributions
- Income, expense, category, and goal analytics
- Profile, avatar, language, password, and account management
- Admin-only development tools for loading demo data

## Architecture

```mermaid
flowchart LR
    User["User"]
    Marketing["Next.js marketing site<br/>apps/web"]
    App["Expo + React Native app<br/>apps/app"]
    API["NestJS REST API<br/>apps/api"]
    DB[("PostgreSQL")]
    Mail["Resend email service"]
    Types["Shared TypeScript contracts<br/>@repo/shared-types"]

    User --> Marketing
    User --> App
    App -->|"JSON over HTTPS + JWT"| API
    API -->|"Prisma"| DB
    API -->|"Verification and recovery emails"| Mail
    Types -.-> App
    Types -.-> API
```

The product UI lives in `apps/app`. Expo Router provides file-based navigation,
React Native renders the native applications, and React Native Web provides the
browser version from the same feature code.

`apps/web` is intentionally a separate Next.js application. It owns the public
landing page, product presentation, screenshots, and legal pages; it does not
duplicate the authenticated finance experience.

`apps/api` is organized into NestJS feature modules for authentication, users,
accounts, categories, transactions, goals, analytics, mail, and development
tools. Prisma maps those modules to PostgreSQL.

The reasoning behind the UI split is recorded in
[ADR 001](docs/adr/001-ui-layer-migration.md).

## Repository structure

```text
welmio/
├── apps/
│   ├── api/                 # NestJS REST API and Prisma schema
│   ├── app/                 # Expo / React Native product app
│   ├── web/                 # Next.js marketing website
│   └── docs/                # Next.js documentation workspace scaffold
├── packages/
│   ├── shared-types/        # Contracts shared by the app and API
│   ├── core/                # Framework-agnostic shared code
│   ├── ui/                  # Shared React components for Next.js apps
│   ├── eslint-config/       # Shared lint configuration
│   └── typescript-config/   # Shared TypeScript configuration
├── docs/adr/                # Architecture decision records
├── pnpm-workspace.yaml
└── turbo.json
```

## Tech stack

| Area | Technology |
| --- | --- |
| Cross-platform app | Expo 54, React Native 0.81, Expo Router |
| Marketing website | Next.js 16, React 19, CSS Modules |
| API | NestJS 11, REST, class-validator |
| Data | PostgreSQL, Prisma 7 |
| Authentication | JWT, rotating refresh tokens, bcrypt |
| Email | Resend |
| Monorepo | pnpm workspaces, Turborepo |
| Quality | TypeScript, ESLint, Jest, Supertest |
| Delivery | Docker, GitHub Actions, EAS configuration |

## Getting started

### Prerequisites

- Node.js 22 recommended (`>=18` is declared by the workspace)
- pnpm 10.28.1
- PostgreSQL
- Expo Go, Xcode, or Android Studio if you want to run a native target
- A Resend API key and verified sender to exercise registration and recovery
  emails

### 1. Install dependencies

Run pnpm from the **repository root**, where `pnpm-workspace.yaml` is located:

```bash
cd welmio
corepack enable
pnpm install
```

This one command installs dependencies for every application and package.
Do not run a separate `pnpm install` inside `apps/app`, `apps/web`, or
`apps/api`.

### 2. Configure the API

```bash
cp apps/api/.env.example apps/api/.env
```

Update `apps/api/.env` with your PostgreSQL connection, JWT secret, and Resend
credentials. The provided local port is `4000`, which avoids a conflict with
the Next.js marketing site on `3000`.

At minimum, review these values:

```dotenv
PORT="4000"
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/welmio_db?schema=public"
JWT_SECRET="replace-with-a-random-secret-at-least-32-characters-long"
RESEND_API_KEY="re_your_key"
MAIL_FROM="Welmio <noreply@your-verified-domain.com>"
APP_URL="http://localhost:8081"
CORS_ORIGIN="http://localhost:8081"
```

Welmio does not currently include a local PostgreSQL container, so create the
database with your preferred local or hosted PostgreSQL setup.

Generate the Prisma client and create/apply development migrations:

```bash
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
```

### 3. Configure the product app

Create `apps/app/.env.local`:

```dotenv
EXPO_PUBLIC_API_URL="http://localhost:4000"
EXPO_PUBLIC_WELMIO_APP_URL="http://localhost:8081"
EXPO_PUBLIC_APP_VERSION="local"
```

When testing on a physical phone, replace `localhost` in
`EXPO_PUBLIC_API_URL` with your computer's LAN IP address, and add the
corresponding Expo origin to `CORS_ORIGIN` when required.

### 4. Configure the marketing site (optional)

The marketing site has safe local fallbacks. To make its calls to action open
the local Expo web app, create `apps/web/.env.local`:

```dotenv
NEXT_PUBLIC_WELMIO_WEB_APP_URL="http://localhost:8081"
NEXT_PUBLIC_WELMIO_GITHUB_URL="https://github.com/your-user/your-repository"
NEXT_PUBLIC_WELMIO_LINKEDIN_URL="https://www.linkedin.com/in/your-profile"
NEXT_PUBLIC_WELMIO_TWITTER_URL="https://x.com/your-profile"
NEXT_PUBLIC_WELMIO_CONTACT_EMAIL="you@example.com"
```

### 5. Run the project

Start all development tasks from the root:

```bash
pnpm turbo run dev
```

The local services use:

| Service | URL |
| --- | --- |
| Marketing website | `http://localhost:3000` |
| Internal docs | `http://localhost:3001` |
| API | `http://localhost:4000` |
| Expo development server / web app | `http://localhost:8081` |

You can also run only the workspace you are working on:

```bash
# NestJS API
pnpm turbo run dev --filter=api

# Expo development server
pnpm turbo run dev --filter=app

# Open a specific Expo target
pnpm --filter app ios
pnpm --filter app android
pnpm --filter app web

# Next.js marketing website
pnpm turbo run dev --filter=web
```

All of these commands should still be executed from the repository root.

## Quality checks

```bash
# Lint all workspaces that define a lint task
pnpm lint

# Type-check all workspaces that define a check-types task
pnpm check-types

# Build the Next.js workspaces through Turborepo
pnpm build

# Export the Expo app for web
pnpm --filter app build-web

# Run API unit tests
pnpm --filter api test

# Run API end-to-end tests
pnpm --filter api test:e2e
```

## How the monorepo works

- `pnpm-workspace.yaml` discovers every package under `apps/*` and
  `packages/*`.
- Workspace dependencies such as `@repo/shared-types` use `workspace:*`, so
  pnpm links local packages instead of downloading them.
- Turborepo runs shared tasks from the root and respects dependency order.
- The Expo app calls the NestJS API through `EXPO_PUBLIC_API_URL`.
- The app stores access and refresh tokens through a platform-aware storage
  layer and retries a request once after a successful token refresh.
- The API validates request DTOs globally, applies Helmet and CORS, and
  rate-limits requests.
- Prisma migrations in `apps/api/prisma/migrations` version the PostgreSQL
  schema.

## Delivery

The repository contains separate Dockerfiles for the API, marketing site, and
Expo web export. GitHub Actions builds and deploys pre-production from the
`pre` branch and production from version tags:

- `api-v*` for the API
- `app-v*` for the Expo web application
- `web-v*` for the marketing website

Native release metadata is configured in `apps/app/eas.json`.

## Project status

Welmio is under active development:

- The web experience is available.
- The native iOS app is available on the Apple App Store.
- The Android app is in the process of being published on Google Play.

<a href="https://apps.apple.com/es/app/welmio/id6783388398">
  <img
    src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/es-es?size=250x83"
    alt="Descargar Welmio en el App Store"
    height="54"
  />
</a>
