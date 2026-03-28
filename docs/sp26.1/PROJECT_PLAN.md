# PulseCheck — Project Plan

> **Version:** 2.0.0
> **Date:** 2026-03-25
> **Author:** Michael Campos
> **Timeline:** 8 weeks (2026-03-11 → 2026-05-06)
> **Methodology:** Scrum (1–2 week sprints)

Also see: [SRS](SRS.md) | [Architecture](ARCHITECTURE.md) | [Roadmap](ROADMAP.md) | [Features](SPECS.md)

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Goals & Success Criteria](#2-goals--success-criteria)
- [3. Sprint Schedule](#3-sprint-schedule)
  - [S1 — Foundation (Mar 11–17)](#s1--foundation-mar-1117)
  - [S2 — UI Modernization (Mar 18–24)](#s2--ui-modernization-mar-1824)
  - [S3 — Core Differentiators (Apr 1–14)](#s3--core-differentiators-apr-114)
  - [S4 — AI & Instructor Tools (Apr 15–28)](#s4--ai--instructor-tools-apr-1528)
  - [S5 — Polish & Delivery (Apr 29 – May 6)](#s5--polish--delivery-apr-29--may-6)
- [4. Risk Register](#4-risk-register)
- [5. Dependencies](#5-dependencies)
- [6. Definition of Done](#6-definition-of-done)

---

## 1. Project Overview

PulseCheck is a real-time in-class polling web application. The SP26 semester focuses on transforming PulseCheck from a functional prototype (SP25) into a polished, differentiated product with:

- **Backend migration** — move AI and grading from client-side to Cloud Functions
- **UI modernization** — adopt MUI v7 template design language
- **Core differentiators** — confidence ratings, leaderboards, async results
- **AI expansion** — post-session summaries, templates, analytics

The project follows a single-developer Scrum workflow with 1–2 week sprints. Implementation progress is tracked in the [Roadmap](ROADMAP.md). Feature specifications are in [SPECS.md](SPECS.md).

## 2. Goals & Success Criteria

### Semester Goals

| # | Goal | Measure of Success |
|---|------|-------------------|
| G1 | **Secure AI pipeline** | All AI inference runs server-side via Cloud Functions. Zero client-side Vertex AI SDK usage. |
| G2 | **Production-ready backend** | Cloud Functions deployed. Grading runs via Firestore triggers. Emulator suite configured. |
| G3 | **Polished, cohesive UI** | MUI v7 design language adopted. Glass-morphism AppBars, bordered cards, responsive drawers. |
| G4 | **Competitive differentiation** | At least 2 features no competitor offers (Knowledge Pulse, AI Summaries, or Peer Pulse). |
| G5 | **Data-rich analytics** | Enhanced poll history with sort, filter, export. Instructor dashboard with engagement trends. |
| G6 | **Stability** | Critical and high-severity bugs resolved. No NaN/Infinity in score displays. No listener leaks. |

### Priority Features

| Priority | Features |
|----------|---------|
| **Must ship** (P0) | F11 Fat Finger, F17 Poll History, F16 Backend Migration, F31 UI Improvements |
| **Should ship** (P1) | F1 Knowledge Pulse, F2 Peer Pulse, F14 Async Results, F32–F34 UI Modernization |
| **Nice to have** (P2) | F3 AI Summaries, F13a Poll Templates, F10 Instructor Dashboard |

---

## 3. Sprint Schedule

### S1 — Foundation (Mar 11–17)

**Theme:** Stabilize core functionality, migrate backend, fix critical UX gaps.

| Deliverable | Features | Estimate |
|------------|----------|----------|
| Fat finger rejoin | F11 | 1–2 days |
| Enhanced poll history | F17 (11 sub-items) | 3–5 days |
| Responsive UI improvements | F31 (6 sub-items) | 1–2 days |
| Cloud Functions — AI generation | F16 Phase 1 (7 sub-items) | 5–6 days |
| Cloud Functions — grading trigger | F16 Phase 2 | 3–4 days |

---

### S2 — UI Modernization (Mar 18–24)

**Theme:** Adopt MUI v7 design patterns, modernize all major surfaces.

| Deliverable | Features | Estimate |
|------------|----------|----------|
| Glass-morphism + bordered cards | F32 (8 sub-items) | 2–3 days |
| Dashboard card redesign + PulseGauge | F33 (6 sub-items) | 1 day |
| Auto-fill prompts | F12 | 1–2 days |
| Additional history features | F4 | 1–2 days |

---

### S3 — Core Differentiators (Apr 1–14)

**Theme:** Build the features that set PulseCheck apart from competitors.

| Deliverable | Features | Estimate |
|------------|----------|----------|
| Deploy Cloud Functions | F16.8 | 1 day |
| Auto-fill prompts | F12 | 1–2 days |
| Additional history features | F4 | 1–2 days |
| Confidence ratings + heatmap | F1 | 3–5 days |
| Leaderboard | F2 | 2–3 days |
| Async result display | F14 | 3–5 days |

---

### S4 — AI & Instructor Tools (Apr 15–28)

**Theme:** Expand AI capabilities and instructor workflow tools.

| Deliverable | Features | Estimate |
|------------|----------|----------|
| Post-session AI summary | F3 | 3–4 days |
| Poll templates | F13a | 3–5 days |

---

### S5 — Polish & Delivery (Apr 29 – May 6)

**Theme:** Bug fixes, design system completion, final polish for capstone presentation.

| Deliverable | Features | Estimate |
|------------|----------|----------|
| Design system overhaul | F34 | 5–8 days |
| Critical bug fixes | See BUGS.md | 2–3 days |
| Instructor dashboard | F10 (if time permits) | 4–6 days |

---

## 4. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | **Cloud Functions cold start latency** — 1–3s delay on first AI call | Medium | Medium | Configure min instances (1) for `generateQuestions`. Accept cold start for grading trigger (not user-facing). |
| R2 | **Gemini 2.0 Flash EOL** — retires June 1, 2026 | Low | High | Plan migration to `gemini-2.5-flash` in S4/S5. API is compatible; update model string. |
| R3 | **Scope creep on F1 (Knowledge Pulse)** — heatmap complexity | Medium | Medium | Ship confidence slider first (MVP), heatmap as follow-up. |
| R4 | **F34 (Design System) touches every component** — risk of regression | High | Medium | Apply incrementally. Test each surface after migration. Ship in S5 with buffer. |
| R5 | **Firebase Blaze billing surprises** — Vertex AI costs | Low | Low | Cache AI responses. Set budget alerts at $10, $25, $50. Vertex AI ~$0.01–0.03/call. |
| R6 | **Single developer** — no code review, bus factor = 1 | High | High | Maintain comprehensive docs (SRS, Architecture). Use TypeScript strict mode as safety net. Commit early and often. |
| R7 | **Carried items accumulate** — sprint overflow pushes work forward | Medium | Medium | Track carry-overs in Roadmap. Re-prioritize at sprint boundary. Cut scope if needed. |

---

## 5. Dependencies

### Internal Dependencies

```
F3 (AI Summaries) ──────────► F16 (Backend Migration)
F19 (Testing/CI) ───────────► F16 (Backend Migration)
F20 (Build Security) ───────► F16 (Backend Migration)
F5 (Student Dashboard) ─────► F8 (Topics Struggled With)
F6 (Weekly Reflection) ──────► F5 (Student Dashboard)
F8 (Topics Struggled With) ─► F5 (Student Dashboard)
F9 (Study Resources) ───────► F8 + F16
F21 (Word Clouds) ──────────► F22 (Open-Ended Questions)
F30 (Exit Tickets) ─────────► F13a (Poll Templates)
F35 (Guest Upgrade) ────────► F11 (Fat Finger)
```

### External Dependencies

| Dependency | Owner | Notes |
|-----------|-------|-------|
| Firebase Blaze plan | Google Cloud | Required for Cloud Functions |
| Gemini 2.0 Flash API | Google Cloud | EOL June 2026 — plan migration to `gemini-2.5-flash` |
| MUI v7 templates | MUI team | Reference only (cloned locally) |
| `@fontsource/inter` | npm | — |

---

## 6. Definition of Done

A feature is **Done** when all of the following are true:

- [ ] Implementation matches the acceptance criteria in SPECS.md
- [ ] TypeScript compiles with zero errors (`yarn build` passes)
- [ ] ESLint passes with zero warnings (`yarn lint` passes)
- [ ] No `any` types introduced (unless explicitly justified)
- [ ] No hardcoded colors/spacing — uses MUI theme system
- [ ] Tested manually on desktop (Chrome) and mobile (Safari/Chrome responsive)
- [ ] NaN/Infinity guards on all numeric displays
- [ ] Firestore listeners cleaned up in `useEffect` return
- [ ] Feature marked as Done in [Roadmap](ROADMAP.md)
- [ ] Commit follows Angular Conventional Commits format

---

*For task-level progress tracking see [Roadmap](ROADMAP.md). For detailed feature specs see [SPECS.md](SPECS.md). For requirement definitions see [SRS](SRS.md).*
