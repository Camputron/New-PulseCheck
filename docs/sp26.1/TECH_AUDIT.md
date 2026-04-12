# PulseCheck Technology Audit

**Date:** 2026-03-25
**Scope:** Full stack
**Codebase health:** 7/10

---

## Table of Contents

1. [Core](#1-core)
2. [UI](#2-ui)
3. [Backend (Firebase)](#3-backend-firebase)
4. [State Management](#4-state-management)
5. [Architecture](#5-architecture)
6. [Testing](#6-testing)
7. [DevOps & CI/CD](#7-devops--cicd)
8. [Monitoring & Observability](#8-monitoring--observability)
9. [Not Recommended](#9-not-recommended-considered-but-rejected)
10. [Priority Summary](#10-priority-summary)

---

## 1. Core

### KEEP

| Technology | Why | Notes |
|---|---|---|
| React 19 + TypeScript 5.7 | Latest stable, strict mode enabled, excellent DX | No action needed |
| Vite 6.1 | Fast builds, HMR, ESM-native | Solid choice |
| React Router DOM 7.1 | Current, well-integrated SPA routing | No action needed |
| Yarn 4.6 (Corepack) | Deterministic installs, node-modules linker is compatible | No action needed |
| ESLint 9 flat config + Prettier | Comprehensive, aligned with CLAUDE.md, strict rules | Well-configured |
| TypeScript strict mode | `noUnusedLocals`, `noUnusedParameters`, all strict checks | Excellent |

### ADD

| Technology | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| React Error Boundaries | Zero crash protection today. Any render error kills the entire app. Wrap at app root + route level | **Critical** | Small | High |
| `vite-plugin-compression` (gzip/brotli) | No compression configured. Firebase Hosting serves gzip automatically but pre-compressing static assets improves TTFB | Low | Small | Medium |

### REPLACE

| Old | New | Why | Priority | Effort | Impact |
|---|---|---|---|---|---|
| `@types/react-router-dom` ^5.3.3 | Remove entirely | v7 ships its own types. The v5 types are wrong for the v7 runtime and actively harmful to type safety | **Critical** | Small | High |

### REMOVE

| Technology | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| `react-query-firestore` ^0.3.2 | Zero imports anywhere in codebase. Dead dependency, abandoned package | **High** | Small | Low |
| `react-card-memory-game` ^1.1.6 | Niche package, low maintenance. Verify if actually used; if only for an easter egg, consider removing | Medium | Small | Low |
| `"privite": true` in package.json | Typo duplicate of `"private": true` on line 3 | Low | Small | None |

---

## 2. UI

### KEEP

| Technology | Why |
|---|---|
| MUI 6.4 + Emotion | Committed UI library, well-customized, theme-compliant. Only 3 hardcoded color instances (all justified: Google branding, debug, easter egg) |
| Custom HSL theme system | Excellent 10-step scales for all palette colors, proper dark mode via `data-mui-color-scheme`, comprehensive component customizations |
| @fontsource/inter | Self-hosted, no external requests, good typography |
| qrcode.react | Essential for session join URLs. 2 files, minimal footprint |
| react-awesome-reveal | 13 files, confined to splash/auth pages. Consistent `Fade` + `triggerOnce` pattern. Lightweight, adds polish |
| react-confetti | 2 files, intentional celebration moments. Tiny footprint |
| @mui/x-charts | Essential for poll results (BarChart, PieChart). Theme-aware colors |

### REPLACE

| Old | New | Why | Priority | Effort | Impact |
|---|---|---|---|---|---|
| `@mui/x-charts` 8.0.0-beta.3 | Stable v7.x or pin beta | Beta in production deps. Either downgrade to stable v7 or explicitly pin the beta (remove `^`) so a breaking beta bump doesn't surprise you | Medium | Small | Medium |
| `mui-image` | Native `<Box component="img" />` | Only 2 usage sites (AppTitle favicon, ResponseDialog image). MUI's Box already handles image rendering. Eliminates a dependency | Low | Small | Low |

---

## 3. Backend (Firebase)

### KEEP

| Technology | Why |
|---|---|
| Firebase 11.3 (Auth, Firestore, Hosting, Storage) | Committed backend, well-integrated, emulator suite configured |
| Cloud Functions v2 | Modern runtime, properly configured (max 10 instances, appropriate memory/timeout per function) |
| Gemini 2.5 Flash via Vertex AI | AI question generation with 3-retry logic, proper error handling |
| Anonymous + Email + Google Auth | Good auth flexibility for classroom use |
| Firebase Emulator Suite | All 5 emulators configured, local dev is solid |

### ADD

| Technology | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| Production Firestore security rules | Current rules: blanket read/write with **expiry April 10, 2026 (16 days away)**. After expiry, ALL Firestore access denied = total outage. Need per-collection rules with auth checks | **CRITICAL** | Medium | Catastrophic if missed |
| Production Storage security rules | Same issue: blanket permissions expiring **April 21, 2026**. Need path-based rules with auth validation and file type restrictions | **CRITICAL** | Medium | Catastrophic if missed |
| Security headers in firebase.json | No CSP, X-Frame-Options, X-Content-Type-Options, or Cache-Control headers. Add to hosting config | **High** | Small | High |
| Rate limiting on Cloud Functions | `generateQuestions` (AI call) has no rate limit. A bad actor could run up the Vertex AI bill | High | Small | Medium |
| `.env.example` | No documentation of environment variables. Only `VITE_USE_EMULATORS` exists. Document all env vars for team onboarding | Medium | Small | Medium |
| Cloud Functions unit tests | `firebase-functions-test` v3.4.1 is already in devDeps but zero tests exist. `finishSession` has scoring logic that should be tested | High | Medium | High |

### REPLACE

| Old | New | Why | Priority | Effort | Impact |
|---|---|---|---|---|---|
| Functions ESLint legacy config | Flat config | App uses ESLint v9 flat config; functions use legacy `.eslintrc.js` with `ESLINT_USE_FLAT_CONFIG=false` workaround. Unify for consistency | Low | Small | Low |

---

## 4. State Management

### KEEP

| Technology | Why |
|---|---|
| React Context (Theme, Snackbar) | Appropriate for global UI state. Well-implemented providers with proper error boundaries on missing context |
| Store pattern (APIStore singleton) | Clean inheritance from BaseStore, composed sub-stores, proper encapsulation. Good architecture |
| react-firebase-hooks | Used in 9 files for declarative Firestore subscriptions. Auto-cleanup, consistent pattern |

### ADD

| Technology | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| Domain hooks for store operations | Components call `api.*` directly in 10+ files, bypassing the hook abstraction layer. Create hooks like `useSession(id)`, `usePoll(id)` that encapsulate store calls + loading/error states | **High** | Medium | High |
| AuthStore methods for email/Google auth | `AuthStore` only has `loginAsGuest()` and `logout()`. GoogleAuthButton, LoginForm, RegisterForm all call Firebase Auth SDK directly. Move auth logic into AuthStore | **High** | Medium | High |
| StorageStore for uploads | UploadImageBox and UploadPDFDialog call `uploadBytes`, `getDownloadURL` directly. Create a store method | Medium | Small | Medium |

### REMOVE

| Technology | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| PollSessionContext + PollSessionProvider | Defined but never mounted in AppProviders. Zero usage across codebase (only definition files reference it) | Medium | Small | Low |

---

## 5. Architecture

### Findings

| # | Issue | Severity |
|---|---|---|
| 1 | No React Error Boundaries — crashes are unhandled | Critical |
| 2 | Business logic scattered in page components (violates SRP) | High |
| 3 | Inconsistent real-time patterns (manual onSnapshot mixed with react-firebase-hooks) | Medium |
| 4 | Limited error handling (catch blocks often just console.debug) | High |
| 5 | 10+ component files import directly from firebase/ SDKs, bypassing the store layer | High |
| 6 | PollSessionContext defined but never used | Low |

### ADD

| What | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| Consolidate direct Firebase SDK imports | 10+ component files import directly from `firebase/firestore`, `firebase/auth`, `firebase/storage` — bypassing the store layer. Route all SDK calls through `src/api/firebase/` | **High** | Medium | High |
| Standardize real-time pattern | Mix of `react-firebase-hooks` (9 files) and manual `onSnapshot` (PollHost.tsx). Pick one convention. Recommendation: use `react-firebase-hooks` for read subscriptions, manual `onSnapshot` only when you need side-effects on changes | Medium | Small | Medium |
| Extract business logic from pages | Poll scoring, session state transitions, validation logic scattered in page components. Move to store methods or utility functions | Medium | Large | High |

### Architecture Violations — Files Requiring Refactoring

These component files bypass the store layer and import directly from Firebase SDKs:

| File | Violation |
|---|---|
| `src/components/auth/GoogleAuthButton.tsx` | Calls `getAuth`, `GoogleAuthProvider`, `signInWithPopup` directly |
| `src/components/auth/LoginForm.tsx` | Calls `signInWithEmailAndPassword` directly |
| `src/components/auth/RegisterForm.tsx` | Calls `createUserWithEmailAndPassword` directly |
| `src/components/auth/SignOutButton.tsx` | Calls `getAuth` directly |
| `src/components/poll/edit/question/UploadImageBox.tsx` | Calls `uploadBytes`, `getDownloadURL`, `updateDoc` directly |
| `src/components/poll/edit/UploadPDFDialog.tsx` | Calls `ref`, `uploadBytes` directly |
| `src/components/graphs/MostRecentGaugeCard.tsx` | Calls `getDoc` directly |
| `src/components/poll/join/RejoinBanner.tsx` | Calls `getDoc` directly |
| `src/pages/poll/PollParticipate.tsx` | Calls `deleteDoc`, `doc` directly |
| `src/pages/poll/PollSubmissionResults.tsx` | Calls `getDoc` directly |

---

## 6. Testing

### KEEP

| Technology | Why |
|---|---|
| Vitest 3.0 | Configured, globals enabled, 13 test suites covering utility functions. Good foundation |
| Playwright 1.50 | Installed, CI installs browsers. Ready when needed |

### ADD

| What | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| Vitest coverage config | No coverage reporter or thresholds configured. Add `@vitest/coverage-v8` with reporter and minimum thresholds | High | Small | Medium |
| Cloud Functions tests | `finishSession` scoring logic and `generateQuestions` validation are untested. Use `firebase-functions-test` (already installed) | High | Medium | High |
| Store/API layer tests | Test store methods against Firebase emulators for critical paths (session creation, submission grading) | Medium | Medium | High |
| Playwright config + smoke tests | Installed but no `playwright.config.ts`. Create config and add 3-5 smoke tests (login, create poll, join session) | Medium | Medium | Medium |

### Current Test Coverage

| Area | Status |
|---|---|
| Utility functions (`src/utils/`) | 13 test suites (good) |
| Components | None (intentional per project guidelines) |
| Store/API layer | None |
| Cloud Functions | None (despite `firebase-functions-test` in devDeps) |
| E2E | None (Playwright installed but unconfigured) |

---

## 7. DevOps & CI/CD

### KEEP

| Technology | Why |
|---|---|
| 4 GitHub Actions workflows | Well-structured: validate (PR), test (push/PR), preview (labeled PRs), deploy (main). Proper concurrency handling |
| Firebase Hosting preview channels | Preview deploys on PRs with 7-day expiry. Good review workflow |
| Auto-deploy on main | Streamlined delivery pipeline |

### ADD

| What | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| Tests before production deploy | `cd-deploy.yml` builds and deploys without running tests first. Add test job as prerequisite | **High** | Small | High |
| Bundle size check in CI | No visibility into bundle growth. Add `rollup-plugin-visualizer` or `size-limit` to CI | Medium | Small | Medium |
| Post-deploy smoke test | No verification after deploy. Add a simple health check (fetch homepage, check 200) | Medium | Small | Medium |

### CI/CD Workflow Summary

| Workflow | Trigger | What It Does | Gap |
|---|---|---|---|
| `ci-validate.yml` | PRs to main | Lint + build app and functions | No tests run |
| `ci-test.yml` | Push to main/dev, PRs | Installs Playwright, runs Vitest | No coverage reporting |
| `cd-preview.yml` | PR labeled `preview` | Firebase Hosting preview channel | No tests before preview |
| `cd-deploy.yml` | Push to main | Build + deploy everything | No tests before deploy, no post-deploy verification |

---

## 8. Monitoring & Observability

### Current State: None

No error tracking, analytics, or performance monitoring is configured.

### ADD

| What | Why | Priority | Effort | Impact |
|---|---|---|---|---|
| Sentry (free tier) | Zero error tracking today. Sentry's free tier (5K events/month) covers a capstone project. Catches errors in production you'd never see otherwise | **High** | Small | Very High |
| Firebase Performance Monitoring | Free, already part of Firebase SDK. Add `firebase/performance` import for automatic page load + network metrics | Medium | Small | Medium |
| Firebase Analytics (basic) | Free, already part of Firebase SDK. Track session joins, poll completions, AI generation usage | Medium | Small | Medium |

---

## 9. Not Recommended (Considered but rejected)

| Technology | Why NOT |
|---|---|
| Form library (react-hook-form / formik) | Only 2-3 forms in the app. Manual useState + validation is adequate for this scope. Adding a form library is over-engineering |
| Date library (dayjs / date-fns) | Only using `Timestamp.toDate().toLocaleDateString()` and custom timer formatters. Native APIs are sufficient |
| State library (Zustand / Redux) | Context API is appropriate for this app's state complexity. Adding Zustand would be premature |
| TanStack Query | Would replace react-firebase-hooks but adds migration cost with marginal benefit. Current real-time patterns work |
| PWA / Service Worker | Nice-to-have but not essential for an in-class tool where connectivity is assumed |
| Docker | Firebase handles all hosting/functions. No containerization needed |

---

## 10. Priority Summary

### Do immediately (this week)

| # | Action | Why |
|---|---|---|
| 1 | Write production Firestore rules | Blanket rules expire April 10 |
| 2 | Write production Storage rules | Blanket rules expire April 21 |
| 3 | Remove `@types/react-router-dom` | v7 ships its own types; v5 types cause type errors |
| 4 | Add React Error Boundary at app root | Zero crash protection today |

### Do soon (next 2 weeks)

| # | Action | Why |
|---|---|---|
| 5 | Add security headers to `firebase.json` | Prevents XSS, clickjacking |
| 6 | Remove `react-query-firestore` | Dead dependency |
| 7 | Add Sentry free tier | Zero error visibility in production |
| 8 | Add test gate before production deploy in CI | Prevents broken deploys |
| 9 | Write Cloud Functions tests for `finishSession` scoring | Grading accuracy is critical |
| 10 | Add Vitest coverage configuration | Visibility into test gaps |

### Do when touching related code

| # | Action | Why |
|---|---|---|
| 11 | Move direct Firebase SDK calls to stores (10+ files) | Architecture consistency |
| 12 | Create domain hooks (`useSession`, `usePoll`) | Enforce hook abstraction layer |
| 13 | Move auth methods into AuthStore | Complete the store pattern |
| 14 | Standardize real-time listener pattern | Consistency |
| 15 | Clean up PollSessionContext (dead code) | Remove unused code |
| 16 | Pin or downgrade `@mui/x-charts` beta | Prevent surprise breakage |
