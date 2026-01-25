# ADR 001 — UI layer unification with React Native

## Context
The product was initially implemented as a web-first application using Next.js.
This allowed fast iteration on authentication flows, UI structure and infrastructure.

As the product evolved, it became clear that:
- The user experience is app-like
- SEO is not a requirement
- Mobile is a first-class platform

## Decision
The UI layer will be unified using React Native (Expo),
targeting iOS, Android and Web via React Native Web.

## Consequences
- The existing Next.js implementation is considered complete for the initial validation phase
- No further core product features will be developed in the Next.js app
- New core feature development will happen in the Expo application

## Scope clarification
This decision applies exclusively to the core application UI.

The existing Next.js application will remain active and continue
to be developed for:
- Marketing pages
- Pricing and content
- Basic account-related pages

The core product experience (finance features)
will live exclusively in the React Native application.
