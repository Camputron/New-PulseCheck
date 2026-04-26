# PulseCheck — Software Requirements Specification

> **Version:** 2.0.0
> **Date:** 2026-03-25
> **Author:** Michael Campos
> **Status:** Living Document — SP26 Capstone
> **Standard:** IEEE 830-1998

Also see: [Architecture](ARCHITECTURE.md) | [Project Plan](PROJECT_PLAN.md) | [Roadmap](ROADMAP.md)

---

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  - [1.4 References](#14-references)
  - [1.5 Overview](#15-overview)
- [2. Overall Description](#2-overall-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Functions](#22-product-functions)
  - [2.3 User Classes and Characteristics](#23-user-classes-and-characteristics)
  - [2.4 Operating Environment](#24-operating-environment)
  - [2.5 Design and Implementation Constraints](#25-design-and-implementation-constraints)
  - [2.6 Assumptions and Dependencies](#26-assumptions-and-dependencies)
- [3. Specific Requirements](#3-specific-requirements)
  - [3.1 External Interface Requirements](#31-external-interface-requirements)
  - [3.2 Functional Requirements](#32-functional-requirements)
  - [3.3 Performance Requirements](#33-performance-requirements)
  - [3.4 Design Constraints](#34-design-constraints)
  - [3.5 Software System Attributes](#35-software-system-attributes)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification defines the functional and non-functional requirements for **PulseCheck**, a real-time in-class polling web application. The document serves as the authoritative reference for all stakeholders — developer, advisors, and evaluators — throughout the SP26 capstone semester.

PulseCheck enables instructors to create AI-generated polls from lecture materials, host live sessions with room codes, and collect student responses in real time. The system differentiates itself through an **intelligence-first** approach: AI generates questions, AI grades responses, and AI analyzes misconceptions — positioning PulseCheck not as another polling app, but as an AI teaching assistant that uses real-time polling as its data collection mechanism.

### 1.2 Scope

#### 1.2.1 System Name

PulseCheck

#### 1.2.2 System Capabilities

The system will provide the following high-level capabilities:

1. **AI-Powered Question Generation** — Instructors upload lecture materials (PDF/images) and the system generates relevant multiple-choice, multi-select, and ranking-poll questions via Gemini 2.0 Flash.
2. **Real-Time Polling Sessions** — Instructors host live sessions with 6-character room codes; students join via code and respond to questions in real time with instant feedback.
3. **Automated Grading & Analytics** — Server-side grading via Cloud Functions with statistical summaries (mean, median, quartiles, 5-number summary) per session.
4. **Session History & Data Persistence** — Full history of sessions and submissions with search, sort, date filtering, and CSV export.
5. **Poll Management** — Create, edit, duplicate, and organize polls with multiple question types and per-question configuration.
6. **Responsive Web Interface** — Mobile-first responsive design using Material UI with light/dark/system theme modes.

#### 1.2.3 System Boundaries

The system operates as a client-side Single Page Application (SPA) backed by Firebase services. The system boundary includes:

- **In scope:** Web application (React SPA), Firebase Authentication, Cloud Firestore, Cloud Storage, Cloud Functions, Vertex AI (Gemini)
- **Out of scope:** Native mobile applications, LMS grade passback (stretch goal), offline mode, real-time video/audio, slide presentation rendering

#### 1.2.4 Intended Users and Roles

| Role | Description |
|------|-------------|
| **Host (Instructor)** | Creates polls, hosts sessions, views analytics. Authenticated via email/password or Google Sign-In. |
| **Participant (Student)** | Joins sessions via room code, submits responses, views personal results. Authenticated or guest. |
| **Guest** | Joins a single session via anonymous auth. No persistent account. Data preserved for session metrics. |

### 1.3 Definitions, Acronyms, and Abbreviations

#### 1.3.1 General Terms

| Term | Definition |
|------|------------|
| **Poll** | A reusable collection of questions created by a host. Serves as a template for sessions. |
| **Session** | A live instance of a poll with a unique room code. Has a lifecycle: `OPEN → IN_PROGRESS → DONE → FINISHED \| CLOSED`. |
| **Submission** | A participant's graded result for a completed session, including score and per-question responses. |
| **Room Code** | A 6-character alphanumeric code used by participants to join a live session. |
| **Prompt Type** | The question format: `multiple-choice`, `multi-select`, or `ranking-poll`. |
| **Fat Finger** | The ability to rejoin a session after accidental navigation away (back button, tab close). |
| **Knowledge Pulse** | A per-answer confidence rating (1–5) that generates class-wide confusion heatmaps. |
| **Peer Pulse** | An optional leaderboard showing ranked participant scores during or after a session. |

#### 1.3.2 Technical Terms

| Term | Definition |
|------|------------|
| **SPA** | Single Page Application — a web app that dynamically rewrites the page rather than loading new pages. |
| **Firestore** | Google Cloud Firestore — a NoSQL document database with real-time listeners. |
| **Cloud Functions** | Firebase Cloud Functions — serverless backend functions triggered by HTTPS calls or Firestore events. |
| **Vertex AI** | Google Cloud's AI platform; the system uses Gemini 2.5 Flash for question generation and grading. |
| **Callable Function** | A Firebase Cloud Function invoked from the client via `httpsCallable`, with built-in auth context. |
| **Firestore Trigger** | A Cloud Function that executes automatically when a Firestore document is created, updated, or deleted. |
| **MUI** | Material UI — React component library implementing Google's Material Design. |

#### 1.3.3 Abbreviations

| Abbreviation | Expansion |
|------|------------|
| **SRS** | Software Requirements Specification |
| **MCQ** | Multiple-Choice Question |
| **CRUD** | Create, Read, Update, Delete |
| **CSV** | Comma-Separated Values |
| **HSL** | Hue, Saturation, Lightness (color model) |
| **LMS** | Learning Management System |
| **CI/CD** | Continuous Integration / Continuous Deployment |

### 1.4 References

| Reference | Description |
|-----------|-------------|
| IEEE 830-1998 | IEEE Recommended Practice for Software Requirements Specifications |
| [Firebase Documentation](https://firebase.google.com/docs) | Firebase platform documentation |
| [MUI v6 Documentation](https://mui.com/) | Material UI component library documentation |
| [Gemini API Reference](https://ai.google.dev/docs) | Google Gemini model API reference |
| SP25 SRS v1.0.0 | PulseCheck Software Requirements Specification (Spring 2025) |
| SP25 Data Model | PulseCheck Firestore Data Model (Spring 2025) |

### 1.5 Overview

**Section 2** provides an overall description of the product: its context, major functions, user classes, operating environment, constraints, and assumptions.

**Section 3** specifies detailed requirements: external interfaces, functional requirements organized by domain, performance targets, design constraints, and quality attributes (reliability, security, maintainability, portability).

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a standalone web application that replaces manual classroom participation methods (hand-raising, paper clickers) and competes with commercial polling tools (Kahoot, Poll Everywhere, Mentimeter, iClicker, Slido, Socrative). It is not a component of a larger system, though future LMS integration (Canvas, Blackboard) is a stretch goal.

The system architecture follows a **client-server model** where:

- The **client** is a React SPA served via Firebase Hosting
- The **server** consists of Firebase Cloud Functions handling AI generation, grading, and session lifecycle
- **Data persistence** is provided by Cloud Firestore with real-time subscription support
- **Authentication** is managed by Firebase Auth (email/password, Google Sign-In, anonymous)
- **AI inference** is provided by Vertex AI (Gemini 2.5 Flash) via Cloud Functions

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React SPA)                  │
│  ┌──────────┐   ┌──────────┐  ┌────────┐   ┌──────────┐ │
│  │   Pages  │   │Components│  │ Hooks  │   │ Contexts │ │
│  └────┬─────┘   └────┬─────┘  └───┬────┘   └────┬─────┘ │
│       └──────────────┴──────────-─┴─────────────┘       │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │ API Store │                        │
│                    └─────┬─────┘                        │
└──────────────────────────┼──────────────────────────────┘
                           │ Firebase SDK
┌──────────────────────────┼──────────────────────────────┐
│                    Firebase Platform                    │
│  ┌──────┐  ┌──────────┐  ┌─────────┐  ┌─────────────┐   │
│  │ Auth │  │ Firestore│  │ Storage │  │  Functions  │   │
│  └──────┘  └──────────┘  └─────────┘  └──────┬──────┘   │
│                                              │          │
│                                      ┌───────┴───────┐  │
│                                      │  Vertex AI    │  │
│                                      │ (Gemini 2.5)  │  │
│                                      └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Product Functions

The system's functionality is organized into six domains:

| Domain | Description | Key Features |
|--------|-------------|-------------|
| **Poll Management** | Creating, editing, configuring, and organizing polls | Question editor, AI generation, templates, duplication, sharing |
| **Session Lifecycle** | Hosting, joining, and participating in live polling sessions | Room codes, waiting room, real-time question delivery, fat-finger rejoin |
| **Response & Grading** | Submitting answers and computing scores | Multiple prompt types, server-side grading, confidence ratings |
| **Analytics & Reporting** | Viewing results, history, and performance metrics | Session summaries, leaderboards, dashboards, CSV export |
| **AI Services** | AI-powered question generation, grading, and analysis | PDF-to-questions, post-session summaries, misconception detection |
| **Platform & Infrastructure** | Authentication, theming, backend, CI/CD | Firebase Auth, Cloud Functions, design system, testing |

### 2.3 User Classes and Characteristics

#### Host (Instructor)

- **Technical proficiency:** Moderate — comfortable using web applications, may not be technically sophisticated
- **Usage frequency:** Multiple times per week during semester
- **Primary goals:** Create polls quickly (ideally via AI), run sessions during lectures, review class performance
- **Key expectations:** Minimal setup time, clear analytics, reliable real-time delivery to 30–300 students

#### Participant (Student)

- **Technical proficiency:** High — digital-native, primarily mobile device users
- **Usage frequency:** Multiple times per week during class
- **Primary goals:** Join sessions quickly via room code, submit answers, view personal results
- **Key expectations:** Fast load times, mobile-friendly UI, immediate feedback, ability to recover from accidental navigation

#### Guest

- **Technical proficiency:** Variable
- **Usage frequency:** One-time per session
- **Primary goals:** Participate without creating an account
- **Key expectations:** Zero-friction join flow, results visible during session

### 2.4 Operating Environment

| Requirement | Specification |
|-------------|---------------|
| **Platform** | Modern web browsers (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+) |
| **Devices** | Desktop, tablet, and mobile (responsive design, minimum 320px viewport) |
| **Network** | Active internet connection required (no offline mode) |
| **Backend** | Firebase (Blaze plan) — Auth, Firestore, Cloud Storage, Cloud Functions, Vertex AI |
| **Hosting** | Firebase Hosting with CDN |
| **Region** | `nam5` (North America multi-region) for Firestore |

### 2.5 Design and Implementation Constraints

| ID | Constraint |
|----|------------|
| **C-1** | The application shall not render or display instructor slide content — only AI-generated questions derived from uploaded materials. |
| **C-2** | A single poll shall support a maximum of **100 questions**. |
| **C-3** | A single session shall support a maximum of **300 concurrent participants**. |
| **C-4** | All AI inference shall execute server-side via Cloud Functions — no client-side model calls. |
| **C-5** | The application shall support English language only. |
| **C-6** | Firebase Blaze (pay-as-you-go) plan is required for Cloud Functions and Vertex AI. |
| **C-7** | The system shall not store raw lecture materials (PDFs) permanently — only the generated questions. Cloud Storage URIs are ephemeral for AI processing. |
| **C-8** | All UI components shall use the MUI theme system — no hardcoded colors, spacing, or shadows. |

### 2.6 Assumptions and Dependencies

| ID | Assumption / Dependency |
|----|------------------------|
| **A-1** | Firebase services (Auth, Firestore, Functions, Storage) maintain 99.95% uptime per Google Cloud SLA. |
| **A-2** | Participants have access to a device with a modern web browser and stable internet during class. |
| **A-3** | Instructors have lecture materials in PDF or image format suitable for AI question generation. |
| **A-4** | The application targets the latest stable versions of Chrome, Firefox, Safari, and Edge. No IE11 support. |
| **A-5** | Firebase Anonymous Auth is used for guest participants; anonymous UIDs are ephemeral and cannot be recovered after session/browser close. |

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces

The application provides a responsive web interface with the following primary views:

| View | Route | Description |
|------|-------|-------------|
| **Splash / Landing** | `/` | Marketing-style landing page with feature highlights, CTA to register or join |
| **Login** | `/login` | Email/password and Google Sign-In authentication |
| **Register** | `/register` | Account creation with email/password or Google |
| **Get Started** | `/get-started` | Guest join flow for unauthenticated users |
| **Dashboard** | `/dashboard` | Instructor home — poll cards, most recent gauge, quick actions |
| **Poll Editor** | `/poll/:id/edit` | WYSIWYG poll editor with drag-and-drop question ordering, AI generation dialog |
| **Join Session** | `/poll/join` | Room code entry for authenticated participants |
| **Session Lobby** | `/poll/session/:id` | Waiting room with participant list before session starts |
| **Host View** | `/poll/session/:id/host` | Instructor session control — advance questions, view live responses, end session |
| **Participant View** | `/poll/session/:id/participate` | Student response UI — question display, answer selection, timer |
| **Submission Results** | `/poll/submission/:id/results` | Individual participant score breakdown with per-question review |
| **Session Results** | `/poll/session/:id/results` | Instructor aggregate results — charts, statistics, participant scores |
| **Poll History** | `/poll/history/` | Tabbed view (Sessions / Submissions) with search, sort, date filter, CSV export |
| **Settings** | `/settings` | User profile management — display name, photo, email, theme preference |

**Design language:**

- Glass-morphism AppBar (`backdropFilter: blur(24px)`, transparent background)
- Elevation-0 bordered cards (`1px solid divider`, `borderRadius: 8px`)
- HSL-based color system with 10-step scales (50–900)
- Inter font family with `pxToRem()` sizing
- Two-state responsive navigation: desktop inline buttons (sm+), mobile drawer (<sm)
- Light and dark mode support via CSS variables and `data-mui-color-scheme` selector

#### 3.1.2 Hardware Interfaces

No direct hardware interfaces. The application communicates exclusively over HTTPS with Firebase backend services. Device hardware (camera, microphone, GPS) is not accessed.

#### 3.1.3 Software Interfaces

| Interface | Protocol | Description |
|-----------|----------|-------------|
| **Firebase Auth** | Firebase SDK | Authentication (email/password, Google, anonymous). Client receives JWT tokens. |
| **Cloud Firestore** | Firebase SDK (WebSocket) | Real-time document reads/writes with `onSnapshot` listeners for live session data. |
| **Cloud Storage** | Firebase SDK (HTTPS) | PDF/image upload for AI question generation. Files stored at `gs://new-pulsecheck.firebasestorage.app`. |
| **Cloud Functions** | `httpsCallable` (HTTPS) | Callable functions for AI generation (`generateQuestions`). Firestore triggers for grading (`onSessionFinish`). |
| **Vertex AI (Gemini)** | Google Cloud SDK | Server-side only (via Cloud Functions). Model: `gemini-2.0-flash`. Structured JSON output. |
| **GitHub API** | REST (HTTPS) | Contributors page fetches repo contributor data. Read-only. |

#### 3.1.4 Communication Interfaces

| Channel | Technology | Description |
|---------|------------|-------------|
| **Real-Time Session Updates** | Firestore `onSnapshot` (WebSocket) | Participants receive question changes, session state transitions, and results in <500ms via Firestore real-time listeners. |
| **Authentication Events** | Firebase Auth `onAuthStateChanged` | Client subscribes to auth state changes for login/logout/token refresh. |
| **AI Inference** | Cloud Functions `httpsCallable` | Client invokes `generateQuestions` callable; server calls Vertex AI and returns structured JSON response. |
| **File Upload** | Firebase Storage SDK | Client uploads PDF/image to Cloud Storage; Cloud Function receives `gs://` URI for processing. |

---

### 3.2 Functional Requirements

Requirements are organized by domain. Each requirement has a unique ID and priority level. Implementation status is tracked in the [Roadmap](ROADMAP.md).

**Priority levels:** `P0` (must-have, launch-blocking), `P1` (high-value, planned), `P2` (important, scheduled), `P3` (desirable), `P4` (stretch/future).

---

#### 3.2.1 Poll Management

| ID | Requirement | Priority |
|----|-------------|----------|
| **PM-1** | The system shall allow authenticated users to create a new poll with a title, question type configuration, anonymity setting, and optional timer. | P0 |
| **PM-2** | The system shall allow the poll owner to add, edit, reorder, and delete questions within a poll. Each question shall have a prompt, prompt type (`multiple-choice`, `multi-select`, `ranking-poll`), options, point value, and optional image. | P0 |
| **PM-3** | The system shall allow the poll owner to mark one or more options as correct per question, depending on prompt type. | P0 |
| **PM-4** | The system shall allow the poll owner to configure per-question overrides for anonymity and timer, independent of poll-level defaults. | P0 |
| **PM-5** | The system shall allow the poll owner to upload a PDF or image and generate questions automatically via AI (Gemini 2.0 Flash). The user shall specify the number of questions and difficulty level. | P0 |
| **PM-6** | The system shall allow the poll owner to duplicate an existing question within the same poll, copying all fields (prompt, options, points, settings). | P0 |
| **PM-7** | The system shall provide quick-insert templates for common question patterns (True/False, Agree/Disagree scale, blank MCQ). | P0 |
| **PM-8** | The system shall provide pre-built poll templates (Quick Quiz, Survey, Exit Ticket) that create a poll with pre-configured settings and placeholder questions. | P2 |
| **PM-9** | The system shall allow a poll owner to share a poll with other authenticated users via email, with configurable view or edit permissions. | P2 |
| **PM-10** | The system shall support a `true-false` prompt type as a simplified variant of `multiple-choice` with exactly two options. | P4 |
| **PM-11** | The system shall update the poll's `updated_at` timestamp when any question or option within the poll is modified, not only when the title changes. | P0 |
| **PM-12** | The system shall allow the poll owner to add free-form tags to a poll for categorization. On subsequent tag additions, the system shall present existing tags as selectable options alongside free-form entry. Polls shall be searchable by tag (`tag:example`) in history views. | P2 |
| **PM-13** | The system shall allow the poll owner to clone an entire poll (deep copy of all questions and options) into a new poll document named `"${original_name} (Copy)"`. | P2 |
| **PM-14** | The system shall allow the poll owner to export a poll as a printable PDF document containing numbered questions with options and answer blanks, suitable for paper-based participation. | P3 |
| **PM-15** | The system shall persist poll session default settings (leaderboard, anonymous, timer) in the user's Firestore profile instead of `localStorage`, enabling cross-device consistency. The user shall be able to edit these defaults from the Settings page. | P3 |
| **PM-16** | The system shall allow authenticated users to create named question banks — reusable collections of questions that can be imported into polls individually or in bulk to accelerate poll creation. | P2 |

---

#### 3.2.2 Session Lifecycle

| ID | Requirement | Priority |
|----|-------------|----------|
| **SL-1** | The system shall allow a host to create a live session from any poll, generating a unique 6-character alphanumeric room code. The session shall begin in `OPEN` state. | P0 |
| **SL-2** | The system shall allow participants to join an `OPEN` session by entering the room code. Participants enter a waiting room visible to the host. | P0 |
| **SL-3** | The system shall allow the host to start the session (transition `OPEN → IN_PROGRESS`), which delivers the first question to all connected participants. | P0 |
| **SL-4** | The system shall allow the host to advance through questions sequentially. Each question transition shall update all connected participants in real time via Firestore listeners. | P0 |
| **SL-5** | The system shall allow the host to display aggregate response results (bar chart, pie chart) after each question. | P0 |
| **SL-6** | The system shall allow the host to end the session at any point. If all questions were shown, the state transitions `DONE → FINISHED`. If ended early, the state transitions to `CLOSED`. | P0 |
| **SL-7** | The system shall allow a participant who accidentally navigates away from a session to rejoin without re-entering the waiting room, provided the session is still active and the user's `SessionUser` document persists. The system shall store `{sid, room_code}` in `localStorage` and display a "Rejoin" banner on the Dashboard and Join pages. | P0 |
| **SL-8** | The system shall allow guest (unauthenticated) users to join a session via anonymous Firebase Auth. Guest data shall persist in Firestore for session metrics accuracy. | P0 |
| **SL-9** | The system shall support optional asynchronous result display — participants can view aggregate response charts for each question after submitting their own answer, gated behind submission. | P1 |
| **SL-10** | The system shall prevent a participant from rejoining a session that has transitioned to `FINISHED` or `CLOSED`, redirecting them to the dashboard with a notification. | P0 |
| **SL-11** | The system shall allow a guest participant to upgrade to a registered account after a session completes, preserving their session data via Firebase Auth account linking. The system shall prompt the guest upon session finish with clear messaging about what upgrading preserves. | P4 |
| **SL-12** | The system shall display a real-time progress indicator on the host view showing the number and percentage of participants who have submitted a response for the current question, with a list of who has/hasn't responded. | P2 |
| **SL-13** | The system shall allow the host to edit a finished session's question prompts, option text, correct answer designations, and point values. Grade-affecting edits shall trigger an automatic regrade that recalculates all response correctness, submission scores, session summary metrics, and leaderboard data. | P2 |

---

#### 3.2.3 Response & Grading

| ID | Requirement | Priority |
|----|-------------|----------|
| **RG-1** | The system shall allow participants to submit a response for the current question. For `multiple-choice`, exactly one option is selected. For `multi-select`, one or more options are selected. For `ranking-poll`, all options are ordered. | P0 |
| **RG-2** | The system shall grade responses server-side via Cloud Functions upon session completion (`onSessionFinish` trigger). Grading shall compute per-question correctness and aggregate scores. | P0 |
| **RG-3** | The system shall compute a `SessionSummary` for each completed session containing: `total_participants`, `median`, `average`, `low`, `high`, `lower_quartile`, `upper_quartile`, and `max_score` — both raw and normalized to a 0–100 scale. | P0 |
| **RG-4** | The system shall create a `Submission` document for each participant upon session completion, containing: `score`, `max_score`, `score_100`, `display_name`, `photo_url`, `email`, and `submitted_at`. | P0 |
| **RG-5** | The system shall guard against `NaN` and `Infinity` values in all score calculations and displays. If `max_score` is 0 or `NaN`, derived percentages shall default to 0. | P0 |
| **RG-6** | The system shall allow participants to submit a confidence rating (1–5 scale) alongside each response. Confidence data shall be aggregated into a class-wide heatmap per question. | P1 |
| **RG-7** | The system shall support an `open-ended` prompt type where participants submit free-text responses, with optional AI-assisted grading via Gemini and manual instructor review. | P4 |

---

#### 3.2.4 Analytics & Reporting

| ID | Requirement | Priority |
|----|-------------|----------|
| **AR-1** | The system shall display a tabbed history view (Sessions / Submissions) showing all past sessions hosted and polls taken by the authenticated user. | P0 |
| **AR-2** | The system shall allow users to search history by title, sort by date/score/participants, and filter by date range (7d, 30d, 90d, all time). | P0 |
| **AR-3** | The system shall persist history view state (tab, search query, sort order, date filter) in URL search parameters so that the view restores on page refresh. | P0 |
| **AR-4** | The system shall display enhanced session cards showing: title, participant count, average score chip, question count, session state badge, and relative timestamp. | P0 |
| **AR-5** | The system shall display enhanced submission cards showing: title, score/max_score with percentage, and relative timestamp. | P0 |
| **AR-6** | The system shall provide CSV export for both session history (title, date, participants, avg score) and submission history (title, date, score, max score). | P0 |
| **AR-7** | The system shall display a result count label ("Showing X of Y") on both history views. | P0 |
| **AR-8** | The system shall display loading skeletons during data fetch and error snackbars on fetch failure in all history views. | P0 |
| **AR-9** | The system shall include sessions in `CLOSED` state (host-terminated) in the host's session history, in addition to `FINISHED` sessions. | P0 |
| **AR-10** | The system shall display an optional ranked leaderboard of participant scores during or after a session. The host shall be able to toggle the leaderboard on/off. Anonymous mode shall suppress participant names. | P1 |
| **AR-11** | The system shall provide an instructor dashboard with engagement metrics over time: average score trend (line chart), participation per session (bar chart), and aggregate statistics (total sessions, total participants, overall average). | P2 |
| **AR-12** | The system shall provide a student dashboard showing personal performance over time: score trend (line chart), weak topic identification, and session history. | P3 |
| **AR-13** | The system shall provide weekly reflection summaries for students: sessions attended, average score, improvement trend, with optional AI-generated reflection. | P3 |
| **AR-14** | The system shall allow additional search/filter/export capabilities on session history beyond the current implementation. | P0 |
| **AR-15** | The system shall compute and display per-question difficulty statistics (% correct, average response time) after a session completes, ranked from most to least difficult, to help instructors identify concepts students struggled with. | P2 |

---

#### 3.2.5 AI Services

| ID | Requirement | Priority |
|----|-------------|----------|
| **AI-1** | The system shall generate multiple-choice questions from uploaded PDF or image content via Gemini 2.0 Flash, executed server-side through a Cloud Functions callable (`generateQuestions`). | P0 |
| **AI-2** | The AI generation callable shall enforce: auth verification, input validation, structured JSON output schema, system instructions (educational assessment expert), and retry logic with validation (2–3 attempts). | P0 |
| **AI-3** | The AI generation shall validate output: `correct_answer` must exist in `options`, exactly 4 options per question, no duplicate options. Failed validation triggers retry. | P0 |
| **AI-4** | The system shall grade completed sessions server-side via a Firestore trigger (`onSessionFinish`) that fires when session state transitions to `FINISHED` or `CLOSED`. | P0 |
| **AI-5** | The system shall generate a post-session AI summary including: overall accuracy analysis, identified misconceptions, and recommended review topics. The summary shall be cached in Firestore to avoid duplicate API calls. | P2 |
| **AI-6** | The system shall allow instructors to specify a topic or focus area when generating AI questions, in addition to uploading source material. | P0 |
| **AI-7** | The system shall auto-tag AI-generated questions with Bloom's Taxonomy cognitive level (remember, understand, apply, analyze). Tags shall be filterable in the instructor dashboard. | P4 |
| **AI-8** | The system shall analyze wrong-answer patterns across responses and use AI to identify common misconceptions per question (requires 10+ responses for meaningful analysis). | P4 |
| **AI-9** | The system shall generate personalized study guides per student based on their incorrect answers, grounded in the original source material. The study guide shall include a self-quiz mode with timed input and an attempt history log so students can track improvement over time. Study guides shall optionally filter by poll tags (PM-12). | P4 |
| **AI-10** | The system shall provide AI-suggested study resources linked to topics where a student scored below 60%. | P4 |
| **AI-11** | The system shall provide an AI learning analytics dashboard aggregating misconception patterns and topic-level performance across multiple sessions. | P4 |

---

#### 3.2.6 User Interface & Experience

| ID | Requirement | Priority |
|----|-------------|----------|
| **UI-1** | The application shall provide a responsive navigation bar: text + icon buttons on desktop (sm+), collapsible drawer on mobile (<sm). Guest navigation shall show About, Features, FAQs inline with Login/Register in dropdown. | P1 |
| **UI-2** | All AppBar components shall use a glass-morphism style: `elevation={0}`, `backdropFilter: "blur(12px)"`, semi-transparent background, `borderBottom: 1, borderColor: "divider"`. | P1 |
| **UI-3** | All card components shall use an elevation-0 bordered pattern: `border: 1, borderColor: "divider", borderRadius: 2`. Clickable cards shall have hover glow effects. | P1 |
| **UI-4** | Interactive menus shall render as `SwipeableDrawer` bottom sheets on mobile and `Menu` dropdowns on desktop. Bottom sheets shall have rounded top corners, drag handle pill, and section title. | P1 |
| **UI-5** | The Settings page shall use a GitHub-style layout: single bordered container with horizontal rows (label 140px left, value right), avatar header above. | P1 |
| **UI-6** | The dashboard shall display poll cards as vertical cards with avatar + title row, chip + timestamp footer, `minHeight: 140`, hover glow + lift effect. | P1 |
| **UI-7** | The PulseGauge component shall use `requestAnimationFrame` with ease-out cubic easing (1.2s duration) and dynamic score-based arc colors (red → orange → amber → teal). | P1 |
| **UI-8** | Gauge and metrics components shall return `null` (render nothing) when data contains `NaN` or `Infinity` values. | P1 |
| **UI-9** | The system shall adopt the MUI v7 dashboard/marketing-page template design language: HSL 10-step color scales, Inter font, gradient buttons, 3px focus outlines, CSS variable theming. | P1 |
| **UI-10** | The system shall support three theme modes: Light, Dark, and System (follows OS preference). Theme preference shall persist in `localStorage`. | P0 |
| **UI-11** | The system shall allow per-user color theme customization, font size, and font family via a preferences dialog. | P4 |
| **UI-12** | The system shall provide a word cloud visualization for open-ended brainstorming responses. | P4 |

---

#### 3.2.7 Engagement & Interaction

| ID | Requirement | Priority |
|----|-------------|----------|
| **EI-1** | The system shall provide pre-built exit ticket templates (quick end-of-class check-in) with 1-click "Start Exit Ticket" from the dashboard. | P4 |
| **EI-2** | The system shall provide a live Q&A mode where participants submit and upvote questions. Questions shall sort by votes in real time. The instructor shall have an "answered" toggle. | P4 |
| **EI-3** | The system shall display a real-time chat sidebar during active sessions for participant communication. | P0 |

---

#### 3.2.8 Infrastructure & Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| **IO-1** | All AI inference (question generation, grading) shall execute server-side via Firebase Cloud Functions. No client-side Vertex AI SDK usage. | P0 |
| **IO-2** | The system shall support Firebase Emulator Suite for local development (Auth on port 9099, Firestore on 8080, Storage on 9199, Functions on 5001). | P0 |
| **IO-3** | Cloud Functions shall be deployed to production and verified end-to-end. | P0 |
| **IO-4** | The system shall provide unit tests for business logic (grading, metrics computation, leaderboard scoring) and integration tests for Cloud Functions via Firebase Emulator Suite. Logic shall be decoupled into testable pure functions. Firestore Security Rules shall have dedicated test coverage. | P1 |
| **IO-5** | The system shall provide a CI/CD pipeline via GitHub Actions that starts the Firebase Emulator Suite, runs all logic and integration tests, and reports results. | P1 |
| **IO-6** | The production build shall disable source maps (`build.sourcemap: false` in Vite config). | P3 |
| **IO-7** | The system shall enable Firebase App Check with reCAPTCHA to prevent unauthorized API access. | P3 |
| **IO-8** | Firestore Security Rules shall enforce: users can only read/write their own data, session participants can only read session data, only hosts can modify session state. | P0 |
| **IO-9** | The system shall integrate with Canvas/Blackboard/Moodle via LTI 1.3 for roster sync and grade passback. | P4 |

---

### 3.3 Performance Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| **PR-1** | UI interaction latency (button click → visual feedback) | < 100ms |
| **PR-2** | Authentication completion (login/register → dashboard) | < 2s |
| **PR-3** | Real-time question delivery (host advances → participant sees question) | < 500ms |
| **PR-4** | AI question generation (upload → questions returned) | < 15s for 10 questions |
| **PR-5** | Session grading (session finish → all submissions created) | < 5s for 300 participants |
| **PR-6** | Page initial load (first contentful paint) | < 2s on 4G connection |
| **PR-7** | Concurrent participants per session | Up to 300 |
| **PR-8** | Firestore real-time listener propagation | < 500ms (per Google Cloud SLA) |

### 3.4 Design Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| **DC-1** | TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enforced. | Prevents runtime type errors and dead code accumulation. |
| **DC-2** | ESLint with `typescript-eslint` strict + stylistic rules. `no-console` (only `warn`/`error`/`debug` allowed), `eqeqeq`, `no-eval`, `no-shadow`. | Consistent code quality and security. |
| **DC-3** | Prettier formatting: no semicolons, double quotes, trailing commas (ES5), bracket spacing. | Consistent code style across the codebase. |
| **DC-4** | All Firestore interactions must go through the Store pattern (`APIStore` → sub-stores). Components shall not import directly from Firebase SDK. | Single responsibility, testability, and maintainability. |
| **DC-5** | All UI colors, spacing, and shadows must reference the MUI theme system. No hardcoded values in components. Theme primitives are restricted to `src/styles/`. | Consistent theming and dark mode support. |
| **DC-6** | Feature-based folder organization. Components organized by domain (`poll/`, `auth/`, `dashboard/`), not by file type. | Discoverability and modularity. |
| **DC-7** | Angular Conventional Commits for all git history. Format: `<type>(<scope>): <subject>`. | Semantic versioning, readable changelog. |

### 3.5 Software System Attributes

#### 3.5.1 Reliability

- The system shall target **99.5% uptime**, backed by Firebase's 99.95% SLA for core services.
- All Firestore writes shall use atomic operations (transactions or batched writes) where consistency across multiple documents is required (e.g., session grading).
- Cloud Functions shall implement retry logic for transient failures (AI generation: 2–3 retries with validation).
- The system shall gracefully degrade when Vertex AI is unavailable — manual question creation remains fully functional.

#### 3.5.2 Availability

- The system shall be accessible 24/7 via Firebase Hosting CDN.
- Firestore real-time listeners shall automatically reconnect after network interruption.
- Session data shall persist in Firestore — participants can view results even if the host disconnects.
- The `localStorage`-based fat-finger recovery (SL-7) shall allow session rejoin even after browser restart, provided the session is still active.

#### 3.5.3 Security

- All client-server communication shall use HTTPS (enforced by Firebase Hosting and SDK).
- Firebase Auth shall manage authentication tokens (JWT). Tokens expire after 1 hour and are auto-refreshed by the SDK.
- Firestore Security Rules shall enforce role-based access control: users read/write their own data, session participants read session data, only hosts modify session state.
- Cloud Functions callable shall verify `auth.uid` before processing requests. Unauthenticated calls shall be rejected with `unauthenticated` error.
- No raw user credentials shall be stored in Firestore — only Firebase Auth UIDs as references.
- Firebase API keys are public (restricted by security rules and App Check) but shall be moved to environment variables as best practice.

#### 3.5.4 Maintainability

- TypeScript strict mode ensures type safety across the codebase.
- The Store pattern provides a single abstraction layer over Firestore, enabling mock-based testing and implementation changes without UI impact.
- The component hierarchy follows SRP — container components handle logic, presentational components handle rendering.
- Files exceeding ~300 lines shall be evaluated for splitting at natural boundaries.
- ESLint + Prettier enforce consistent code style automatically.
- All types are centralized in `src/types/index.ts` for single-source-of-truth type definitions.

#### 3.5.5 Portability

- The React SPA architecture ensures platform independence — any modern browser with JavaScript enabled can run the application.
- Material UI's responsive design system provides consistent rendering across devices (320px–2560px viewport).
- Firebase SDK abstracts backend communication — switching cloud providers would require only store-level changes, not UI changes.
- The Vite build system produces standard ES module bundles compatible with all modern browsers.

---

*This is a living document. Requirements are added, refined, and re-prioritized throughout the SP26 semester. Implementation status is tracked in the [Roadmap](ROADMAP.md). Detailed feature specifications are maintained in [SPECS.md](SPECS.md).*
