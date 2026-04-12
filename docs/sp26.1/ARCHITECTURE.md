# PulseCheck — Architecture Document

> **Version:** 2.0.0
> **Date:** 2026-03-25
> **Author:** Michael Campos
> **Status:** Living Document — SP26 Capstone

Also see: [SRS](SRS.md) | [Project Plan](PROJECT_PLAN.md) | [Roadmap](ROADMAP.md)

---

## Table of Contents

- [1. System Overview](#1-system-overview)
- [2. Architectural Goals & Constraints](#2-architectural-goals--constraints)
- [3. High-Level Architecture](#3-high-level-architecture)
- [4. Component Architecture](#4-component-architecture)
- [5. Data Architecture](#5-data-architecture)
- [6. API & Store Layer](#6-api--store-layer)
- [7. State Management](#7-state-management)
- [8. Routing & Navigation](#8-routing--navigation)
- [9. Authentication & Authorization](#9-authentication--authorization)
- [10. Real-Time Communication](#10-real-time-communication)
- [11. AI Pipeline](#11-ai-pipeline)
- [12. Build & Deployment](#12-build--deployment)
- [13. Security Architecture](#13-security-architecture)
- [14. Directory Structure](#14-directory-structure)

---

## 1. System Overview

PulseCheck is a real-time in-class polling application built as a **Single Page Application (SPA)** backed by **Firebase** as a Backend-as-a-Service (BaaS). The architecture prioritizes real-time data synchronization, minimal backend management overhead, and a clean separation between the UI layer and data access layer.

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | React | 19.x |
| **Language** | TypeScript (strict mode) | ~5.7.2 |
| **Build** | Vite | 6.1.0 |
| **UI Framework** | Material UI (MUI) | 6.4.4 |
| **Charts** | MUI X-Charts | 8.0.0-beta.3 |
| **Routing** | React Router | 7.x |
| **Backend** | Firebase (Auth, Firestore, Storage, Functions) | 11.3.1 |
| **AI** | Gemini 2.0 Flash via Vertex AI | — |
| **Package Manager** | Yarn | 4.6.0 |
| **Linting** | ESLint (typescript-eslint strict + stylistic) | — |
| **Formatting** | Prettier | — |
| **Testing** | Vitest | 3.0.7 |

### Path Aliases

```typescript
"@/*" → "./src/*"    // Source imports
"/*"  → "./public/*"  // Static assets
```

---

## 2. Architectural Goals & Constraints

### Goals

| Goal | Approach |
|------|----------|
| **Real-time UX** | Firestore `onSnapshot` listeners push data to clients within ~500ms. No polling. |
| **Zero backend ops** | Firebase manages infrastructure — no servers to provision, scale, or patch. |
| **Type safety** | TypeScript strict mode end-to-end. Centralized type definitions. Generic CRUD interfaces. |
| **Testability** | Store pattern decouples Firestore from UI. Hooks abstract stores from components. |
| **Maintainability** | Feature-based folder structure. SRP at every level (component, hook, store method). |
| **Secure AI** | All AI inference server-side via Cloud Functions. No client-side model access. |

### Constraints

| Constraint | Impact |
|-----------|--------|
| Firebase vendor lock-in | Store pattern provides abstraction layer, but Firestore query semantics leak through. |
| Firestore query limitations | No server-side joins, no full-text search, max 1 `array-contains` per query. |
| Cold start latency | Cloud Functions (Node.js) cold starts 1–3s. Mitigated by keep-alive and min instances. |
| Client-side rendering only | No SSR/SSG. First contentful paint depends on JS bundle size. |
| Blaze plan required | Cloud Functions and Vertex AI require pay-as-you-go billing. |

---

## 3. High-Level Architecture

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                    │
│                                                                         │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐     │
│   │  Desktop  │    │  Tablet   │    │  Mobile   │    │  Mobile   │     │
│   │  Browser  │    │  Browser  │    │  Browser  │    │  (Guest)  │     │
│   └─────┬─────┘    └─────┬─────┘    └─────┬─────┘    └─────┬─────┘     │
│         └────────────────┴───────────────┴───────────────┘             │
│                                  │                                      │
│                           HTTPS / WSS                                   │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                         Firebase Hosting (CDN)                          │
│                          React SPA Bundle                               │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │ Firebase SDK
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                        FIREBASE PLATFORM                                │
│                                                                         │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐              │
│   │  Firebase     │   │   Cloud      │   │   Cloud      │              │
│   │  Auth         │   │   Firestore  │   │   Storage    │              │
│   │              │   │              │   │              │              │
│   │ • Email/Pass │   │ • Documents  │   │ • PDF Upload │              │
│   │ • Google     │   │ • Real-time  │   │ • Images     │              │
│   │ • Anonymous  │   │ • Triggers   │   │ • gs:// URIs │              │
│   └──────────────┘   └───────┬──────┘   └──────┬───────┘              │
│                              │                  │                       │
│   ┌──────────────────────────┴──────────────────┴───────────────┐      │
│   │                    Cloud Functions (Node.js)                 │      │
│   │                                                              │      │
│   │  ┌─────────────────────┐   ┌──────────────────────────┐    │      │
│   │  │  generateQuestions  │   │     finishSession        │    │      │
│   │  │  (httpsCallable)    │   │     (httpsCallable)      │    │      │
│   │  │                     │   │                          │    │      │
│   │  │  Auth check ──►     │   │  Auth + host check ──►  │    │      │
│   │  │  Validate input ──► │   │  Grade responses ──►     │    │      │
│   │  │  Call Vertex AI ──► │   │  Compute summary ──►     │    │      │
│   │  │  Validate output ──►│   │  Create submissions ──►  │    │      │
│   │  │  Return JSON        │   │  Write to Firestore      │    │      │
│   │  └─────────┬───────────┘   └──────────────────────────┘    │      │
│   │            │                                                │      │
│   └────────────┼────────────────────────────────────────────────┘      │
│                │                                                        │
│   ┌────────────┴──────────────┐                                         │
│   │      Vertex AI            │                                         │
│   │   Gemini 2.5 Flash Lite  │                                         │
│   │                           │                                         │
│   │  • Structured JSON output │                                         │
│   │  • Temperature: 0.2       │                                         │
│   │  • System instructions    │                                         │
│   │  • Retry w/ validation    │                                         │
│   └───────────────────────────┘                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Request Flow — Live Session

```
Host clicks "Next Question"
        │
        ▼
┌─────────────────┐
│   PollHost.tsx   │──── api.sessions.nextQuestion(sid) ────┐
└─────────────────┘                                         │
                                                            ▼
                                                  ┌──────────────────┐
                                                  │  Cloud Firestore │
                                                  │  /sessions/{sid} │
                                                  │                  │
                                                  │  question: {...} │
                                                  │  state: "in-     │
                                                  │    progress"     │
                                                  └────────┬─────────┘
                                                           │
                                              onSnapshot (real-time)
                                                           │
                      ┌────────────────────────────────────┼────────────────┐
                      │                                    │                │
                      ▼                                    ▼                ▼
              ┌───────────────┐                   ┌───────────────┐  ┌───────────┐
              │ Participant A │                   │ Participant B │  │  Host UI  │
              │ PollParticipate│                  │ PollParticipate│ │ (updates) │
              └───────────────┘                   └───────────────┘  └───────────┘
```

---

## 4. Component Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                                                         │
│  Pages (route-level)     Components (reusable UI)       │
│  ┌──────────────────┐    ┌──────────────────────────┐   │
│  │ Dashboard.tsx     │    │ components/poll/edit/     │   │
│  │ PollEditor.tsx    │    │ components/poll/session/  │   │
│  │ PollHost.tsx      │    │ components/dashboard/     │   │
│  │ PollParticipate   │    │ components/graphs/        │   │
│  │ SessionResults    │    │ components/header/        │   │
│  │ ...               │    │ ...                       │   │
│  └──────────────────┘    └──────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                       LOGIC LAYER                       │
│                                                         │
│  Hooks (abstraction)      Contexts (global state)       │
│  ┌──────────────────┐    ┌──────────────────────────┐   │
│  │ useAuthContext    │    │ ThemeContext              │   │
│  │ useSnackbar       │    │ SnackbarContext           │   │
│  │ useThemeContext   │    │ PollSessionContext        │   │
│  │ useRequireAuth    │    │                          │   │
│  │ useRedirectIfAuth │    │                          │   │
│  └──────────────────┘    └──────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    DATA ACCESS LAYER                    │
│                                                         │
│  Store Pattern (Firestore abstraction)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │                 APIStore (singleton)                │ │
│  │  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐ │ │
│  │  │AuthStore│ │UserStore│ │PollStore │ │VertexSt.│ │ │
│  │  └─────────┘ └────────┘ └────┬─────┘ └─────────┘ │ │
│  │                              │                    │ │
│  │                        ┌─────┴──────┐             │ │
│  │                        │QuestionStore│            │ │
│  │                        └─────┬──────┘             │ │
│  │                              │                    │ │
│  │                        ┌─────┴──────┐             │ │
│  │                        │OptionStore │             │ │
│  │                        └────────────┘             │ │
│  │                                                   │ │
│  │  ┌───────────────┐  ┌───────────────────────────┐│ │
│  │  │SubmissionStore│  │     SessionStore           ││ │
│  │  └───────────────┘  │  ┌──────────┐ ┌────────┐  ││ │
│  │                     │  │questions │ │responses│  ││ │
│  │                     │  │options   │ │users    │  ││ │
│  │                     │  │waiting   │ │chat     │  ││ │
│  │                     │  │submissions│          │  ││ │
│  │                     │  └──────────┘ └────────┘  ││ │
│  │                     └───────────────────────────┘│ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE LAYER                   │
│                                                         │
│  Firebase SDK → Auth, Firestore, Storage, Functions     │
│  react-firebase-hooks → useAuthState, useDocumentData   │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy (Poll Session Flow)

```
App.tsx
├── AppBar
│   ├── NavItems (desktop: inline text+icon buttons)
│   └── MenuButton → SwipeableDrawer (mobile) / Menu (desktop)
│
├── PollHost (page)                          ← /poll/session/:id/host
│   ├── SessionHostHeader (glass-morphism AppBar)
│   ├── UserSessionGrid                      ← participant cards
│   │   └── UserSessionCard[]                ← avatar, name, status
│   ├── QuestionBox                          ← current question display
│   ├── ResultsChart                         ← bar/pie charts
│   │   ├── ResultsBarChart
│   │   └── ResultsPieChart
│   └── HostControls                         ← next/end/show results
│
├── PollParticipate (page)                   ← /poll/session/:id/participate
│   ├── SessionParticipantHeader
│   ├── QuestionBox                          ← question prompt + image
│   ├── ResponseDialog                       ← answer selection UI
│   │   ├── PromptOptionList (MCQ/multi-select)
│   │   └── RankingPollList (ranking)
│   └── ResultsChart (if async results enabled)
│
├── SessionResults (page)                    ← /poll/session/:id/results
│   ├── SessionResultsHeader
│   ├── PollMetricsCard                      ← 5-number summary
│   ├── ScoreGaugeCard[]                     ← per-participant gauges
│   ├── ScoreHistogram                       ← score distribution
│   └── SessionScatterChart                  ← score vs. time
│
└── SubmissionResults (page)                 ← /poll/submission/:id/results
    ├── SubmissionResultsHeader
    ├── ScoreCard                            ← user's score + gauge
    └── AnswerCard[]                         ← per-question review
```

---

## 5. Data Architecture

### Firestore Data Model

PulseCheck uses Cloud Firestore, a NoSQL document database organized into collections and subcollections. The data model uses **document references** for relationships and **subcollections** for hierarchical data ownership.

All document IDs are auto-generated unless otherwise noted. In Firestore, the document ID is not a stored field — it is the document's key within its collection.

### Firestore Path Reference

```
users/{uid}
polls/{pid}
polls/{pid}/questions/{qid}
polls/{pid}/questions/{qid}/options/{oid}
sessions/{sid}
sessions/{sid}/waiting_users/{uid}
sessions/{sid}/users/{uid}
sessions/{sid}/questions/{qid}
sessions/{sid}/questions/{qid}/options/{oid}
sessions/{sid}/questions/{qid}/responses/{uid}
sessions/{sid}/submissions/{id}
submissions/{subid}
```

### Collection Hierarchy

```
firestore/
│
├── users/                              ← Top-level collection
│   └── {uid}/                          ← Document (Firebase Auth UID)
│       ├── display_name: string
│       ├── email: string
│       ├── photo_url: string | null
│       └── created_at: Timestamp
│
├── polls/                              ← Top-level collection
│   └── {pid}/                          ← Document
│       ├── owner: Reference<User>
│       ├── title: string
│       ├── async: boolean
│       ├── anonymous: boolean | null
│       ├── time: number | null
│       ├── questions: Reference<Question>[]   ← ordered refs
│       ├── created_at: Timestamp
│       ├── updated_at: Timestamp
│       │
│       └── questions/                  ← Subcollection
│           └── {qid}/
│               ├── prompt_type: PromptType
│               ├── prompt: string
│               ├── prompt_img: string | null
│               ├── options: Reference<PromptOption>[]
│               ├── points: number
│               ├── anonymous: boolean
│               ├── time: number | null
│               ├── created_at: Timestamp
│               ├── updated_at: Timestamp
│               │
│               └── options/            ← Subcollection
│                   └── {oid}/
│                       ├── text: string
│                       └── correct: boolean
│
├── sessions/                           ← Top-level collection
│   └── {sid}/                          ← Document
│       ├── host: Reference<User>
│       ├── poll: Reference<Poll>
│       ├── room_code: string           ← 6-char alphanumeric
│       ├── title: string
│       ├── async: boolean
│       ├── anonymous: boolean | null
│       ├── time: number | null
│       ├── question: CurrentQuestion | null
│       ├── results: SessionQuestionResults | null
│       ├── questions_left: Reference<SessionQuestion>[]
│       ├── questions: Reference<SessionQuestion>[]
│       ├── state: SessionState
│       ├── summary: SessionSummary
│       ├── created_at: Timestamp
│       │
│       ├── waiting_users/              ← Subcollection
│       │   └── {uid}/
│       │       ├── display_name: string
│       │       └── photo_url: string | null
│       │
│       ├── users/                      ← Subcollection
│       │   └── {uid}/
│       │       ├── display_name: string
│       │       ├── photo_url: string | null
│       │       ├── joined_at: Timestamp
│       │       └── incorrect: boolean
│       │
│       ├── questions/                  ← Subcollection (copied from poll)
│       │   └── {qid}/
│       │       ├── prompt_type: PromptType
│       │       ├── prompt: string
│       │       ├── prompt_img: string | null
│       │       ├── points: number
│       │       ├── anonymous: boolean | null
│       │       ├── time: number | null
│       │       │
│       │       ├── options/            ← Subcollection (copied from poll)
│       │       │   └── {oid}/
│       │       │       ├── text: string
│       │       │       └── correct: boolean
│       │       │
│       │       └── responses/          ← Subcollection
│       │           └── {uid}/
│       │               ├── user: Reference<User>
│       │               ├── choices: Reference<SessionOption>[]
│       │               ├── correct: boolean
│       │               └── created_at: Timestamp
│       │
│       ├── submissions/                ← Subcollection (refs to top-level)
│       │   └── {id}/
│       │       └── ref: Reference<Submission>
│       │
│       └── chat/                       ← Subcollection
│           └── {msgid}/
│               ├── user: Reference<User>
│               ├── display_name: string
│               ├── photo_url: string | null
│               ├── message: string
│               └── created_at: Timestamp
│
└── submissions/                        ← Top-level collection
    └── {subid}/
        ├── session: Reference<Session>
        ├── user: Reference<User>
        ├── title: string
        ├── display_name: string
        ├── score: number
        ├── max_score: number
        ├── score_100: number
        ├── photo_url: string | null
        ├── email: string | null
        └── submitted_at: Timestamp
```

### Collection Details

#### Users (`users`)

Document ID is the user's Firebase Authentication UID, linking their auth account to all related documents.

| Field | Type | Description |
|-------|------|-------------|
| `display_name` | `string` | Preferred name; auto-fills the display name field when joining a session |
| `email` | `string` | User's email address |
| `photo_url` | `string \| null` | Profile picture URL (from provider or upload) |
| `created_at` | `Timestamp` | Account creation date |

---

#### Polls (`polls`)

A user can own many polls. A poll stores the template used to create live sessions.

| Field | Type | Description |
|-------|------|-------------|
| `owner` | `Reference<User>` | The user who created this poll |
| `title` | `string` | Name of the poll (e.g., "CSC 190 Quiz") |
| `async` | `boolean` | If `true`, participants answer at their own pace; if `false`, all answer in sync |
| `anonymous` | `boolean \| null` | If `true`, all questions are anonymous — overrides per-question `anonymous`. `null` = defer to question-level |
| `time` | `number \| null` | Global timer (ms) — overrides per-question `time`. `null` = no timer |
| `questions` | `Reference<Question>[]` | Ordered array of refs to the `questions` subcollection |
| `created_at` | `Timestamp` | Poll creation date |
| `updated_at` | `Timestamp` | Last modified date |

---

#### Poll Questions (`polls/{pid}/questions`)

Each document is one question within a poll.

| Field | Type | Description |
|-------|------|-------------|
| `prompt_type` | `PromptType` | `"multiple-choice"` \| `"multi-select"` \| `"ranking-poll"` |
| `prompt` | `string` | The question text |
| `prompt_img` | `string \| null` | Optional image URL displayed alongside the question |
| `options` | `Reference<PromptOption>[]` | Ordered array of refs to the `options` subcollection |
| `points` | `number` | How many points the question is worth |
| `anonymous` | `boolean` | Whether responses are hidden from other participants |
| `time` | `number \| null` | Per-question timer (ms). `null` = no timer |
| `created_at` | `Timestamp` | Question creation date |
| `updated_at` | `Timestamp` | Last modified date |

**PromptType values:**
- `"multiple-choice"` — single correct answer
- `"multi-select"` — multiple correct answers
- `"ranking-poll"` — survey-style poll, no correct answer

---

#### Poll Options (`polls/{pid}/questions/{qid}/options`)

Each document is one selectable answer option for a question.

| Field | Type | Description |
|-------|------|-------------|
| `text` | `string` | The option label |
| `correct` | `boolean` | Whether this option is a correct answer |

---

#### Sessions (`sessions`)

A live poll session created from a poll template. Most fields are copied from the source poll at creation time, decoupling the live session from subsequent poll edits.

| Field | Type | Description |
|-------|------|-------------|
| `host` | `Reference<User>` | The user hosting the session |
| `poll` | `Reference<Poll>` | The source poll used to create this session |
| `room_code` | `string` | 6-character alphanumeric code required to join |
| `title` | `string` | Name of the session (copied from poll) |
| `async` | `boolean` | Copied from poll |
| `anonymous` | `boolean \| null` | Copied from poll |
| `time` | `number \| null` | Copied from poll |
| `question` | `CurrentQuestion \| null` | The current question being displayed to all participants. `null` before the first question |
| `results` | `SessionQuestionResults \| null` | Computed results for the current question. `null` while participants are answering |
| `questions_left` | `Reference<SessionQuestion>[]` | Remaining questions to be shown (decrements as questions advance) |
| `questions` | `Reference<SessionQuestion>[]` | All session questions (does not change) |
| `state` | `SessionState` | Current session lifecycle state (see state machine below) |
| `summary` | `SessionSummary` | Aggregate score statistics, populated by grading Cloud Function |
| `created_at` | `Timestamp` | Session creation date |

**SessionState values:**

| State | Joinable? | Description |
|-------|-----------|-------------|
| `OPEN` | Yes | Lobby — anyone with the room code can join |
| `IN_PROGRESS` | With approval | Questions are being presented; late joiners require host approval |
| `DONE` | No | All questions shown; awaiting grading |
| `FINISHED` | No | Grading complete; results available |
| `CLOSED` | No | Host ended early; grading still runs |

**Embedded types:**

`CurrentQuestion` — snapshot of the active question, embedded directly on the session document so a single `onSnapshot` listener receives all state changes:

| Field | Type | Description |
|-------|------|-------------|
| `ref` | `Reference<SessionQuestion>` | Points to the full question in the subcollection |
| `prompt_type` | `PromptType` | Question type |
| `prompt` | `string` | Question text |
| `prompt_img` | `string \| null` | Optional image |
| `options` | `SessionChoice[]` | Array of `{ ref, text }` — option ref + display text |
| `anonymous` | `boolean \| null` | Whether responses are anonymous |
| `time` | `number \| null` | Timer (ms) |

`SessionSummary` — aggregate statistics computed by the grading Cloud Function:

| Field | Type | Description |
|-------|------|-------------|
| `total_participants` | `number` | Number of users who participated |
| `median` / `median_100` | `number` | Median score (raw / normalized to 100) |
| `average` / `average_100` | `number` | Mean score (raw / normalized) |
| `low` / `low_100` | `number` | Lowest score (raw / normalized) |
| `high` / `high_100` | `number` | Highest score (raw / normalized) |
| `lower_quartile` / `lower_quartile_100` | `number` | Q1 (raw / normalized) |
| `upper_quartile` / `upper_quartile_100` | `number` | Q3 (raw / normalized) |
| `max_score` | `number` | Maximum possible score |

---

#### Session Waiting Users (`sessions/{sid}/waiting_users`)

Users waiting for host approval to join an in-progress session.

| Field | Type | Description |
|-------|------|-------------|
| `display_name` | `string` | User's display name |
| `photo_url` | `string \| null` | Profile picture |

Document ID is the user's Firebase Auth UID.

---

#### Session Users (`sessions/{sid}/users`)

Users actively participating in the session.

| Field | Type | Description |
|-------|------|-------------|
| `display_name` | `string` | User's display name |
| `photo_url` | `string \| null` | Profile picture |
| `joined_at` | `Timestamp` | When the user joined the session |
| `incorrect` | `boolean` | Whether the user answered the current question incorrectly |

Document ID is the user's Firebase Auth UID.

---

#### Session Questions (`sessions/{sid}/questions`)

Copies of poll questions for the live session. Copied at session creation to decouple the session from poll edits.

| Field | Type | Description |
|-------|------|-------------|
| `prompt_type` | `PromptType` | Question type |
| `prompt` | `string` | Question text |
| `prompt_img` | `string \| null` | Optional image |
| `points` | `number` | Points the question is worth |
| `anonymous` | `boolean \| null` | Whether responses are anonymous |
| `time` | `number \| null` | Timer (ms) |

---

#### Session Options (`sessions/{sid}/questions/{qid}/options`)

Copies of poll question options for the live session.

| Field | Type | Description |
|-------|------|-------------|
| `text` | `string` | The option label |
| `correct` | `boolean` | Whether this option is correct |

---

#### Session Responses (`sessions/{sid}/questions/{qid}/responses`)

Each document records a participant's response to a session question. Document ID is the user's UID.

| Field | Type | Description |
|-------|------|-------------|
| `user` | `Reference<User>` | The responding user |
| `choices` | `Reference<SessionOption>[]` | The option(s) the user selected |
| `correct` | `boolean` | Whether the response is correct |
| `created_at` | `Timestamp` | Time the response was submitted |

---

#### Session Submissions (`sessions/{sid}/submissions`)

References to top-level submission documents, stored as a subcollection for easy querying within a session.

| Field | Type | Description |
|-------|------|-------------|
| `ref` | `Reference<Submission>` | Points to the top-level submission document |

---

#### Session Chat (`sessions/{sid}/chat`)

Chat messages within a session.

| Field | Type | Description |
|-------|------|-------------|
| `user` | `Reference<User>` | The user who sent the message |
| `display_name` | `string` | Display name at time of message |
| `photo_url` | `string \| null` | Profile picture at time of message |
| `message` | `string` | Message content |
| `created_at` | `Timestamp` | When the message was sent |

---

#### Submissions (`submissions`)

Top-level collection storing final results for each participant. Fields are denormalized (duplicated from user/session) to avoid Firestore joins on read.

| Field | Type | Description |
|-------|------|-------------|
| `session` | `Reference<Session>` | The session this submission belongs to |
| `user` | `Reference<User>` | The participant |
| `title` | `string` | Poll title (denormalized) |
| `display_name` | `string` | Display name used during the session (denormalized) |
| `score` | `number` | Raw score achieved |
| `max_score` | `number` | Maximum possible score |
| `score_100` | `number` | Score normalized to 100 |
| `photo_url` | `string \| null` | Profile picture (denormalized) |
| `email` | `string \| null` | Email (denormalized) |
| `submitted_at` | `Timestamp` | When the user finished the poll |

---

### Entity Relationship Diagram

```
┌──────────┐       owns        ┌──────────┐      template     ┌──────────┐
│  USERS   │───────(1:N)───────│  POLLS   │───────(1:N)───────│ SESSIONS │
│          │                   │          │                    │          │
│ uid (PK) │                   │ pid (PK) │                    │ sid (PK) │
│ display  │                   │ owner→   │                    │ host→    │
│ email    │                   │ title    │                    │ poll→    │
│ photo    │                   │ async    │                    │ room_code│
│ created  │                   │ anon     │                    │ state    │
└────┬─────┘                   │ time     │                    │ summary  │
     │                         │ questions│                    │ question │
     │                         └────┬─────┘                    └────┬─────┘
     │                              │                               │
     │                         subcollection                   subcollections
     │                              │                               │
     │                    ┌─────────┴──────────┐          ┌────────┼─────────┐
     │                    │  POLL_QUESTIONS     │          │        │         │
     │                    │  prompt_type        │     waiting   questions   users
     │                    │  prompt             │     _users       │
     │                    │  options[]          │                  │
     │                    │  points             │             RESPONSES
     │                    └─────────┬───────────┘             user→
     │                              │                         choices→[]
     │                         subcollection                  correct
     │                              │
     │                    ┌─────────┴──────────┐
     │                    │  POLL_OPTIONS       │
     │                    │  text               │
     │                    │  correct            │
     │                    └────────────────────┘
     │
     │         submits       ┌──────────────┐
     └────────(1:N)──────────│ SUBMISSIONS  │
                             │ session→     │
                             │ user→        │
                             │ score        │
                             │ max_score    │
                             │ score_100    │
                             │ submitted_at │
                             └──────────────┘
```

### Session State Machine

```
                    ┌─────────────┐
     host creates   │             │
     session ──────►│    OPEN     │  Participants join waiting room
                    │             │
                    └──────┬──────┘
                           │
                    host starts
                    session │
                           ▼
                    ┌─────────────┐
                    │             │
                    │ IN_PROGRESS │  Questions delivered, responses collected
                    │             │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
       all questions              host ends early
       shown  │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │             │          │             │
       │    DONE     │          │   CLOSED    │  Grading still runs
       │             │          │             │
       └──────┬──────┘          └─────────────┘
              │
       grading completes
       (Cloud Function) │
              ▼
       ┌─────────────┐
       │             │
       │  FINISHED   │  Submissions created, summary computed
       │             │
       └─────────────┘
```

### Key Data Patterns

| Pattern | Description |
|---------|-------------|
| **Document References** | Relationships use `DocumentReference<T>` (typed refs to other documents), not raw ID strings. Enables type-safe traversal. |
| **Subcollection Ownership** | Questions belong to polls, responses belong to session questions. Subcollections enforce hierarchical access control in security rules. |
| **Session Snapshot** | When a session is created from a poll, questions and options are **copied** into session subcollections. This decouples the live session from poll edits. |
| **Denormalized Submissions** | Submissions duplicate `title`, `display_name`, `photo_url`, `email` to avoid joins on read. Firestore has no server-side joins. |
| **Ordered Arrays** | `Poll.questions` and `Question.options` store ordered `DocumentReference[]` arrays. Order is maintained by array index, not a separate `order` field. |
| **Embedded Results** | `Session.question` and `Session.results` embed the current question and its results directly on the session document. This allows a single `onSnapshot` listener to receive all session state changes. |

---

## 6. API & Store Layer

### Store Pattern

All Firestore interactions are encapsulated in **store classes** following the Repository pattern. The UI layer never imports directly from `firebase/firestore` — it accesses data exclusively through the `api` singleton.

```
┌─────────────────────────────────────────────────────────────────┐
│                      APIStore (singleton)                        │
│                                                                  │
│  const api = new APIStore(firestore)                            │
│  export default api                                              │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │ .auth    │  │ .users   │  │ .polls   │  │ .submissions │    │
│  │ AuthStore│  │ UserStore│  │ PollStore│  │ SubmissionSt.│    │
│  └──────────┘  └──────────┘  └─────┬────┘  └──────────────┘    │
│                                    │                             │
│                              ┌─────┴────────┐                   │
│                              │ .questions    │                   │
│                              │ QuestionStore │                   │
│                              └─────┬────────┘                   │
│                                    │                             │
│                              ┌─────┴────────┐                   │
│                              │ .options      │                   │
│                              │ OptionStore   │                   │
│                              └──────────────┘                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ .sessions — SessionStore                                  │   │
│  │                                                           │   │
│  │  .questions    .responses    .options     .users          │   │
│  │  .waiting_users              .submissions .chat           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐                                 │
│  │ .vertex  │  │ .github      │                                 │
│  │VertexSt. │  │ GitHubStore  │                                 │
│  └──────────┘  └──────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

### BaseStore & CRUDStore

All Firestore-backed stores extend `BaseStore`, which holds a protected `Firestore` reference. Stores that manage a specific collection implement `CRUDStore<T>`, a generic interface with type-safe document and collection references.

```typescript
abstract class BaseStore {
  private readonly _db: Firestore
  constructor(db: Firestore) { this._db = db }
  protected get db() { return this._db }
}

interface CRUDStore<T> {
  doc(params: DocumentParams<T>): DocumentReference<T>
  collect(params: CollectionParams<T>): CollectionReference<T>
  create(ref: CollectionReference<T>): Promise<DocumentReference<T>>
  updateByRef(ref: DocumentReference<T>, payload: Partial<T>): Promise<void>
  updateById(params: DocumentParams<T>, payload: Partial<T>): Promise<void>
  deleteByRef(ref: DocumentReference<T>): Promise<void>
  deleteById(params: DocumentParams<T>): Promise<void>
}
```

### Conditional Type Parameters

The `DocumentParams<T>` and `CollectionParams<T>` types use **conditional types** to map each entity type to its required path parameters:

```typescript
type DocumentParams<T> =
  T extends PromptOption ? { pid: string; qid: string; oid: string } :
  T extends Question     ? { pid: string; qid: string } :
  T extends Poll         ? { pid: string } :
  T extends Session      ? { sid: string } :
  never

type CollectionParams<T> =
  T extends PromptOption ? { pid: string; qid: string } :
  T extends Question     ? { pid: string } :
  T extends Poll         ? null :
  T extends Session      ? null :
  never
```

This ensures that `api.polls.doc({ pid: "abc" })` compiles but `api.polls.doc({ sid: "abc" })` does not — enforced at the type level.

### Collection Name Enum

```typescript
enum clx {
  polls = "polls",
  questions = "questions",
  options = "options",
  users = "users",
  sessions = "sessions",
  waiting_users = "waiting_users",
  responses = "responses",
  submissions = "submissions",
}
```

All Firestore collection paths reference this enum to prevent hardcoded string typos.

### Store Responsibilities

| Store | Collection | Key Operations |
|-------|-----------|----------------|
| **AuthStore** | Firebase Auth | `loginAsGuest()`, `logout()`, auth state management |
| **UserStore** | `/users` | CRUD on user profiles, query by UID |
| **PollStore** | `/polls` | Create/query/delete polls, compose `QuestionStore` |
| **QuestionStore** | `/polls/{pid}/questions` | Add/update/delete/reorder questions, compose `OptionStore` |
| **OptionStore** | `/polls/{pid}/questions/{qid}/options` | Add/update/delete answer options |
| **SessionStore** | `/sessions` | Create/start/advance/finish sessions, 7 sub-stores for session data |
| **SubmissionStore** | `/submissions` | Query submissions by user or session, fetch detailed results |
| **VertexStore** | Cloud Functions | Invoke `generateQuestions` callable |
| **GitHubStore** | GitHub REST API | Fetch repository contributors |

---

## 7. State Management

PulseCheck uses **React Context API** for global state. No external state management library (Redux, Zustand, MobX) is used — intentionally keeping the architecture simple for a single-developer project.

### Provider Chain

```typescript
// main.tsx → AppProviders.tsx
<BrowserRouter>
  <ThemeProvider>        {/* MUI theme + light/dark mode */}
    <SnackbarProvider>   {/* Toast notification queue */}
      <App />            {/* Routes + pages */}
    </SnackbarProvider>
  </ThemeProvider>
</BrowserRouter>
```

### Contexts

| Context | State Shape | Provider | Consumer Hook |
|---------|-------------|----------|---------------|
| **ThemeContext** | `{ mode: PaletteMode, toggleTheme(), setTheme(type) }` | `ThemeProvider` | `useThemeContext()` |
| **SnackbarContext** | `{ enqueue(msg, severity), dismiss() }` | `SnackbarProvider` | `useSnackbar()` |
| **PollSessionContext** | `{ session, participants, currentQuestion }` | `PollSessionProvider` | Direct context consumption |

### Data Flow Pattern

```
Firestore ──onSnapshot──► Store method ──► Hook ──► Component state ──► UI
                                             │
                                    (or)     │
                                             ▼
Firestore ──react-firebase-hooks──► useDocumentData/useCollectionData ──► UI
```

Components use two patterns for real-time data:

1. **Store + Hook pattern** — for complex logic requiring transformation (e.g., `displayUserResponses()`)
2. **react-firebase-hooks** — for direct document/collection subscriptions where raw Firestore data maps directly to UI (e.g., `useDocumentData(sessionRef)`)

---

## 8. Routing & Navigation

### Route Table

```typescript
// App.tsx — React Router v7
<Routes>
  {/* Public routes */}
  <Route path="/"                element={<Splash />} />
  <Route path="/login"           element={<Login />} />
  <Route path="/register"        element={<Register />} />
  <Route path="/get-started"     element={<GetStarted />} />
  <Route path="/privacy-policy"  element={<PrivacyPolicy />} />
  <Route path="/terms-of-service" element={<TermsOfService />} />
  <Route path="/contributors"    element={<Contributors />} />

  {/* Authenticated routes */}
  <Route path="/dashboard"       element={<Dashboard />} />
  <Route path="/settings"        element={<Settings />} />
  <Route path="/poll/:id/edit"   element={<PollEditor />} />
  <Route path="/poll/history/"   element={<PollHistory />} />

  {/* Session routes */}
  <Route path="/poll/join"                    element={<PollJoin />} />
  <Route path="/poll/session/:id"             element={<PollSession />} />
  <Route path="/poll/session/:id/host"        element={<PollHost />} />
  <Route path="/poll/session/:id/participate" element={<PollParticipate />} />

  {/* Results routes */}
  <Route path="/poll/submission/:id/results"  element={<SubmissionResults />} />
  <Route path="/poll/session/:id/results"     element={<SessionResults />} />

  {/* Debug & fallback */}
  <Route path="/debug"           element={<Debug />} />
  <Route path="*"                element={<NotFound />} />
</Routes>
```

### Route Guards

| Guard | Hook | Behavior |
|-------|------|----------|
| **Auth required** | `useRequireAuth()` | Redirects to `/login` if not authenticated. Used on Dashboard, Settings, PollEditor, PollHistory. |
| **Redirect if authenticated** | `useRedirectIfAuthenticated()` | Redirects to `/dashboard` if already logged in. Used on Login, Register. |
| **Session validation** | Inline check | Verifies session exists and is in correct state before rendering host/participate views. |

---

## 9. Authentication & Authorization

### Authentication Flow

```
┌──────────────┐                    ┌──────────────┐
│   Client     │                    │ Firebase Auth │
│              │                    │              │
│  Login form  │───credentials─────►│  Verify      │
│              │◄──JWT token────────│  Issue token  │
│              │                    │              │
│  onAuthState │◄──state change─────│  Notify      │
│  Changed()   │                    │              │
└──────┬───────┘                    └──────────────┘
       │
       │  auth.currentUser.uid
       ▼
┌──────────────┐
│  Firestore   │
│  /users/{uid}│  ← profile document
└──────────────┘
```

### Auth Methods

| Method | Provider | Use Case |
|--------|----------|----------|
| **Email/Password** | `EmailAuthProvider` | Standard registration |
| **Google Sign-In** | `GoogleAuthProvider` | One-click auth |
| **Anonymous** | `signInAnonymously()` | Guest session participation |

### Authorization Model

Authorization is enforced at two levels:

1. **Client-side** — Route guards (`useRequireAuth`) and UI conditionals (e.g., edit button only shown to poll owner)
2. **Server-side** — Firestore Security Rules and Cloud Functions auth checks

```
Cloud Function (callable):
  context.auth?.uid  →  required, else throw "unauthenticated"

Firestore Security Rules (planned):
  /users/{uid}/**    →  read/write if request.auth.uid == uid
  /polls/{pid}/**    →  read/write if resource.data.owner == request.auth.uid
  /sessions/{sid}/** →  read if user is participant; write if user is host
  /submissions/**    →  read if request.auth.uid == resource.data.user
```

---

## 10. Real-Time Communication

PulseCheck achieves real-time functionality through **Firestore's `onSnapshot` listeners**, which maintain persistent WebSocket connections to the Firestore backend.

### Listener Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Active Listeners (per view)               │
│                                                              │
│  PollHost:                                                   │
│    onSnapshot(/sessions/{sid})           → session state     │
│    onSnapshot(/sessions/{sid}/users)     → participant list  │
│    onSnapshot(/sessions/{sid}/waiting_users) → waiting room  │
│    onSnapshot(/sessions/{sid}/chat)      → chat messages     │
│                                                              │
│  PollParticipate:                                            │
│    onSnapshot(/sessions/{sid})           → current question  │
│    onSnapshot(/sessions/{sid})           → results (async)   │
│                                                              │
│  Dashboard:                                                  │
│    onSnapshot(/polls where owner==uid)   → poll list         │
└─────────────────────────────────────────────────────────────┘
```

### Real-Time Data Flow (Question Advancement)

```
1. Host clicks "Next" → api.sessions.nextQuestion(sid)
2. SessionStore writes to /sessions/{sid}:
   - question: { ref, prompt_type, prompt, options, ... }
   - questions_left: [...remaining]
3. Firestore propagates change to all onSnapshot listeners (~100-300ms)
4. Participant's useDocumentData(sessionRef) receives updated session
5. React re-renders PollParticipate with new question
6. Total host-action-to-participant-render: < 500ms
```

### Listener Lifecycle

Listeners are set up in `useEffect` hooks and must return cleanup functions to prevent memory leaks:

```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
    setSession(snapshot.data())
  })
  return () => unsubscribe()  // cleanup on unmount
}, [sessionRef])
```

---

## 11. AI Pipeline

### Question Generation Flow

```
┌────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌────────────┐
│   Client   │     │Cloud Function│     │   Vertex AI     │     │  Firestore │
│            │     │              │     │  Gemini 2.5     │     │            │
│ Upload PDF ├────►│ Validate     │     │  Flash Lite     │     │            │
│ to Storage │     │ auth + input │     │                 │     │            │
│            │     │              │     │                 │     │            │
│ Call       ├────►│ Retrieve PDF ├────►│ Generate        │     │            │
│ callable   │     │ from Storage │     │ questions       │     │            │
│            │     │              │◄────┤ (structured     │     │            │
│            │     │ Validate     │     │  JSON output)   │     │            │
│            │     │ output       │     │                 │     │            │
│            │     │              │     │ temperature:0.2 │     │            │
│            │     │ Retry if     │     │ system instruct.│     │            │
│            │◄────┤ invalid      │     │ retry logic     │     │            │
│            │     │              │     └─────────────────┘     │            │
│ Receive    │     │ Return JSON  │                             │            │
│ questions  │     │              │                             │            │
│            │     └──────────────┘                             │            │
│ Insert     │                                                  │            │
│ into poll  ├─────────────────────────────────────────────────►│ Write to   │
│            │                                                  │ /polls/    │
└────────────┘                                                  │ {pid}/     │
                                                                │ questions/ │
                                                                └────────────┘
```

### Grading Pipeline (Firestore Trigger)

```
Session state → DONE
        │
        ▼
┌─────────────────────────────┐
│ finishSession (callable)    │
│                             │
│ 1. Read all session         │
│    questions + responses    │
│                             │
│ 2. For each participant:    │
│    - Count correct answers  │
│    - Compute score          │
│    - Compute score_100      │
│                             │
│ 3. Compute SessionSummary:  │
│    - total_participants     │
│    - mean, median           │
│    - low, high              │
│    - quartiles (Q1, Q3)     │
│    - max_score              │
│                             │
│ 4. Batch write:             │
│    - /submissions/{subid}   │
│    - /sessions/{sid}/summary│
│    - /sessions/{sid}/       │
│      submissions/{ref}      │
│                             │
│ 5. Set state → FINISHED     │
└─────────────────────────────┘
```

### AI Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Model | `gemini-2.0-flash` | Fast inference, sufficient quality for MCQ generation |
| Temperature | `0.2` | Low creativity — factual MCQs require deterministic output |
| Response format | `application/json` with schema | Structured output eliminates JSON parsing failures |
| System instructions | Educational assessment expert | Constrains output to pedagogically sound questions |
| Retry attempts | 2–3 | Validation failures (e.g., `correct_answer` not in `options`) trigger retry |
| Validation checks | `correct_answer ∈ options`, exactly 4 options, no duplicates | Application-level output validation |

---

## 12. Build & Deployment

### Build Pipeline

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌──────────────┐
│  Source    │     │  Vite     │     │  ESBuild  │     │   Output     │
│  (.tsx)    ├────►│  Transform├────►│  Minify   ├────►│  dist/       │
│           │     │  + HMR    │     │  + Tree   │     │  index.html  │
│           │     │           │     │  Shake    │     │  assets/*.js │
└───────────┘     └───────────┘     └───────────┘     └──────┬───────┘
                                                              │
                                                     firebase deploy
                                                              │
                                                              ▼
                                                     ┌──────────────┐
                                                     │   Firebase   │
                                                     │   Hosting    │
                                                     │   (CDN)      │
                                                     └──────────────┘
```

### Development Commands

```bash
yarn dev        # Vite dev server with HMR (port 5173)
yarn build      # Production build → dist/
yarn lint       # ESLint check
yarn preview    # Preview production build locally
```

### Emulator Configuration

```json
// firebase.json
{
  "emulators": {
    "auth":      { "port": 9099 },
    "functions": { "port": 5001 },
    "firestore": { "port": 8080 },
    "storage":   { "port": 9199 },
    "ui":        { "enabled": true }
  }
}
```

Activated via environment variable: `VITE_USE_EMULATORS=true yarn dev`

---

## 13. Security Architecture

### Threat Model & Mitigations

| Threat | Mitigation |
|--------|-----------|
| **Unauthorized API access** | Firebase Auth JWT required for all Firestore writes. Cloud Functions verify `auth.uid`. Planned: App Check with reCAPTCHA. |
| **Client-side AI abuse** | AI inference moved entirely server-side (Cloud Functions). No client-side Vertex AI SDK. Rate limiting via Cloud Functions. |
| **Data exfiltration** | Firestore Security Rules enforce per-user data isolation. Users can only read their own submissions and sessions they participate in. |
| **XSS** | React's JSX auto-escaping. No `dangerouslySetInnerHTML`. No `eval()` (ESLint `no-eval` rule). |
| **Credential exposure** | Firebase config keys are public by design (restricted by security rules). No server secrets in client bundle. All secrets in Cloud Functions environment. |
| **Session hijacking** | Firebase Auth manages JWT lifecycle (1h expiry, auto-refresh). No manual token storage. |
| **Unauthorized session control** | Only the `host` ref on a session document can advance questions, show results, or end the session. Enforced in security rules. |

### Security Layers

```
┌──────────────────────────────────────────────────────┐
│ Layer 1: Network — HTTPS everywhere (Firebase)       │
├──────────────────────────────────────────────────────┤
│ Layer 2: Auth — Firebase Auth (JWT, auto-refresh)    │
├──────────────────────────────────────────────────────┤
│ Layer 3: Authorization — Firestore Security Rules    │
├──────────────────────────────────────────────────────┤
│ Layer 4: Validation — Cloud Functions input check    │
├──────────────────────────────────────────────────────┤
│ Layer 5: Client — React auto-escaping, ESLint        │
└──────────────────────────────────────────────────────┘
```

---

## 14. Directory Structure

```
PulseCheck/
├── public/                          # Static assets
│   ├── favicon.svg
│   └── ...
│
├── firebase/                        # Cloud Functions
│   ├── functions/
│   │   ├── src/
│   │   │   └── index.ts             # generateQuestions, onSessionFinish
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ...
│
├── src/
│   ├── main.tsx                     # React root — StrictMode + AppProviders
│   ├── App.tsx                      # Route definitions
│   ├── vite-env.d.ts                # Vite type augmentation
│   │
│   ├── api/                         # Data access layer
│   │   ├── index.ts                 # APIStore singleton, Firebase init, clx enum
│   │   ├── firebase/
│   │   │   ├── store.ts             # BaseStore, CRUDStore<T>, type params
│   │   │   ├── auth.ts              # AuthStore
│   │   │   ├── users.ts             # UserStore
│   │   │   ├── polls.ts             # PollStore → QuestionStore → OptionStore
│   │   │   ├── questions.ts         # QuestionStore
│   │   │   ├── options.ts           # PromptOptionStore
│   │   │   ├── submissions.ts       # SubmissionStore
│   │   │   ├── vertex.ts            # VertexStore (Cloud Functions callable)
│   │   │   └── sessions/            # SessionStore + 7 sub-stores
│   │   │       ├── sessions.ts      # Root session operations
│   │   │       ├── question.ts      # Session questions
│   │   │       ├── responses.ts     # User responses
│   │   │       ├── options.ts       # Session question options
│   │   │       ├── users.ts         # Session participants
│   │   │       ├── waiting_users.ts # Waiting room
│   │   │       ├── submissions.ts   # Session submission refs
│   │   │       └── chat.ts          # Session chat
│   │   └── github.ts               # GitHub API (contributors)
│   │
│   ├── components/                  # Reusable UI (feature-organized)
│   │   ├── auth/                    # LoginForm, RegisterForm, GoogleButton
│   │   ├── dashboard/               # UserPollCard, NoRecentPolls, MostRecentGaugeCard
│   │   ├── graphs/                  # PulseGauge, ScoreHistogram, ScatterChart, ResultsChart
│   │   ├── header/                  # AppBar, NavItems, MenuButton, ProfileIcon
│   │   ├── poll/
│   │   │   ├── edit/                # QuestionEditor, PromptField, PromptOptionList, UploadPDFDialog
│   │   │   ├── history/             # PollSessionHistory, PollSubmissionHistory, SessionCard, SubmissionCard
│   │   │   ├── join/                # GuestJoin, RegisterJoin
│   │   │   ├── results/             # AnswerCard, ScoreCard, PollMetricsCard, ScoreGaugeCard
│   │   │   └── session/             # SessionHost, SessionParticipant, QuestionBox, ResponseDialog
│   │   ├── splash/                  # Hero, Features, FAQ sections
│   │   └── transition/              # PageTransition wrapper
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── index.ts                 # Page namespace export
│   │   ├── auth/                    # Login, Register, GetStarted
│   │   ├── poll/                    # PollEditor, PollHost, PollSession, PollParticipate,
│   │   │                            #   PollJoin, PollHistory, SubmissionResults, SessionResults
│   │   ├── legal/                   # PrivacyPolicy, TermsOfService, Contributors
│   │   ├── Dashboard.tsx
│   │   ├── Settings.tsx
│   │   ├── Splash.tsx
│   │   ├── Debug.tsx
│   │   └── NotFound.tsx
│   │
│   ├── contexts/                    # React Context definitions
│   │   ├── ThemeContext.ts
│   │   ├── SnackbarContext.ts
│   │   ├── PollSessionContext.ts
│   │   └── index.ts
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuthContext.ts
│   │   ├── useSnackbar.ts
│   │   ├── useThemeContext.ts
│   │   ├── useRequireAuth.ts
│   │   ├── useRedirectIfAuthenticated.ts
│   │   └── index.ts
│   │
│   ├── providers/                   # Context provider components
│   │   ├── AppProviders.tsx         # Root: BrowserRouter + Theme + Snackbar
│   │   ├── ThemeProvider.tsx        # MUI theme creation + mode persistence
│   │   ├── SnackbarProvider.tsx     # Toast notification queue
│   │   ├── PollSessionProvider.tsx  # Active session state
│   │   └── index.ts
│   │
│   ├── styles/                      # Design system
│   │   ├── theme.ts                 # createCustomTheme(mode)
│   │   ├── themePrimitives.ts       # HSL color scales, typography, shadows
│   │   ├── customizations/          # MUI component overrides
│   │   │   ├── inputs.ts            # TextField, Button, Select, etc.
│   │   │   ├── surfaces.ts          # Card, Paper, Accordion, etc.
│   │   │   ├── feedback.ts          # Alert, Snackbar, Dialog, etc.
│   │   │   ├── navigation.ts        # AppBar, Drawer, Tabs, etc.
│   │   │   └── dataDisplay.ts       # Table, List, Chip, etc.
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── index.ts                 # All interfaces, enums, type aliases
│   │
│   ├── utils/
│   │   └── index.ts                 # Utility functions (stoc, stoni, stommss, etc.)
│   │
│   └── __tests__/                   # Unit tests (Vitest)
│
├── firebase.json                    # Firebase project config + emulator ports
├── package.json                     # Dependencies + scripts
├── vite.config.ts                   # Build config + path aliases
├── tsconfig.json                    # TypeScript strict config
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Node-specific TS config
├── eslint.config.js                 # ESLint flat config
└── .prettierrc                      # Prettier config
```