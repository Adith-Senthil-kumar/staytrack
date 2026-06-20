# StayTrack

Cross-platform PG (Paying Guest) manager — Expo + Firebase. UI is a 1:1 native
re-implementation of the design in `reference/StayTrack-PG-Manager-design/`.

## Setup
1. `npm install`
2. Copy `.env.example` → `.env` and fill in your Firebase web config
   (Firebase console → Project settings → Your apps → Web).
3. In Firebase console: enable **Authentication → Email/Password** and create a
   **Firestore** database.
4. Create the owner's account under **Authentication → Users** (email + password).
   The app is login-only — there is no in-app sign-up.
5. `npx expo start`

## Scripts
- `npx expo start` — run dev (press `w` web, `i` iOS, `a` Android)
- `npm test` — run unit tests
- `npx tsc --noEmit` — typecheck

## Architecture
See `docs/superpowers/specs/2026-06-20-staytrack-mobile-app-design.md` and the
plans in `docs/superpowers/plans/`.

## Status
Foundation + auth & app shell complete. Sign in (email/password) → responsive
sidebar/drawer shell with the 4 core nav sections (placeholder screens). Onboarding,
feature screens, and the Firestore data layer follow in later plans.
