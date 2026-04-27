# PulseCheck — Roadmap

> **Last Updated:** 2026-04-27
> **Sprint:** S3 (Weeks 4–5)
> **Timeline:** 2026-03-11 → 2026-05-06 (8 weeks)

Also see: [SRS](SRS.md) | [Architecture](ARCHITECTURE.md) | [Project Plan](PROJECT_PLAN.md) | [Features](SPECS.md)

---

## Table of Contents

- [Board](#board)
  - [Legend](#legend)
  - [TODO](#todo)
  - [IN PROGRESS](#in-progress)
  - [DONE](#done)
  - [BACKLOG](#backlog)
- [Bug Tracker](#bug-tracker)
  - [Critical](#critical)
  - [High](#high)
  - [Medium](#medium)
  - [Low](#low)
- [Velocity & Progress](#velocity--progress)
- [How to Use This Board](#how-to-use-this-board)

---

## Board

### Legend

| Label | Meaning |
|-------|---------|
| `P0` | Must-have — launch-blocking |
| `P1` | High-value — planned for this semester |
| `P2` | Important — scheduled if time permits |
| `P3` | Desirable — backlog |
| `P4` | Stretch — future consideration |
| `S1`–`S5` | Sprint assignment |
| `[SRS: XX-N]` | Traceability to SRS requirement ID |

---

### TODO

Scheduled for upcoming sprints. Ready to be picked up.

| ID | Item | Sprint | SRS Ref | Estimate | Dependencies |
|----|------|--------|---------|----------|-------------|
| F4 | **Persistent Poll Data** — additional search/filter/export on session history | S3 | AR-14 | 1–2 days | None |
| F14 | **Async Results** — show results to participants post-session (gated behind submission) | S3 | SL-9 | 3–5 days | None |
| F42 | **Host Edit Ended Session** — edit finished session questions/options/correct answers + automatic regrading via Cloud Function | S4 | SL-13 | 3–5 days | None |
| F36 | **Host Response Progress** — real-time linear progress bar showing % of participants who answered current question | S4 | SL-12 | 1–2 days | None |
| F41 | **Question Difficulty Ranking** — per-question % correct stats ranked most→least difficult on session results | S4 | AR-15 | 2–3 days | None |
| F8 | **Poll Tags** — free-form tags on polls, combo-box for existing tags, `tag:` search syntax in history | S4 | PM-12 | 4–6 days | None |
| F19 | **Testing & CI/CD** — business logic tests, Cloud Functions tests (emulator), Firestore rules tests, GitHub Actions CI/CD | S5 | IO-4, IO-5 | 5–8 days | F16 |
| F15 | **Sharing Polls** — share with view/edit permissions via email | S4 | PM-9 | 3–5 days | None |
| F25 | **Personalized Study Guides** — wrong-answer compilation, self-quiz mode with timed input, attempt history for improvement tracking, tag-filtered study guides | S4 | AI-9 | 5–8 days | F3, F8, F9 |
| F35 | **Guest Account Upgrade** — anonymous → registered account linking | S5 | SL-11 | 3–5 days | F11 |
| F39 | **Cloud Poll Session Settings** — move session defaults from localStorage to Firestore user profile; editable in Settings page | S5 | PM-15 | 1–2 days | None |
| F40 | **Question Bank** — named reusable question collections; bulk add; import into polls; works with F13a templates | S4 | PM-16 | 4–6 days | F13a |
| — | **Bug fixes, testing, polish** | S5 | — | — | — |
| BUG | **No double-join protection** — `joinSession` called twice in React Strict Mode | S5 | — | 0.5 day | None |
| BUG | **`poll.updated_at` not updating** on question/option edits | S5 | PM-11 | 0.5 day | None |
| BUG | **Rejoin after host ends** — participant sees white screen instead of redirect | S5 | SL-10 | 1 day | None |

---

### IN PROGRESS

Actively being worked on this sprint.

| ID | Item | Sprint | SRS Ref | Owner | Notes |
|----|------|--------|---------|-------|-------|
| F16.8 | **Backend** — deploy Cloud Functions to production + verify | S3 | IO-3 | Michael | Last step of F16. Blocked on final testing. |

---

### DONE

Completed and verified.

| ID | Item | Sprint | SRS Ref |
|----|------|--------|---------|
| F12 | **Auto-Fill Prompts** — quick-fill option presets (T/F, Agree Scale, Rating 1-5, Confidence, Frequency, Blank), question-level chips in editor | S4 | PM-6, PM-7, AI-6 |
| F13a | **Poll Templates** — 8 pre-built templates (Quick Quiz, T/F, Vocab, Exit Ticket, Survey, Icebreaker, Muddiest Point, Discussion Prep), template picker empty state, preview dialog, post-apply acceleration (auto-expand, auto-focus, tab-through, completion bar) | S4 | PM-8 |
| F11 | **Fat Finger** — rejoin after accidental back-out via `localStorage` persistence + "Rejoin" banner on Dashboard/Join | S1 | SL-7 |
| F17.1 | **Poll History** — fix `setTimeout` cleanup in `PollSessionHistory` and `PollSubmissionHistory` | S1 | AR-1 |
| F17.2 | **Poll History** — sort dropdown (date, score, participants/alpha) on both history views | S1 | AR-2 |
| F17.3 | **Poll History** — date range filter (All, 7d, 30d, 90d) on both history views | S1 | AR-2 |
| F17.4 | **Poll History** — enhanced `SessionCard` with avg score chip, question count, CLOSED badge | S1 | AR-4 |
| F17.5 | **Poll History** — enhanced `SubmissionCard` with score/max_score percentage display | S1 | AR-5 |
| F17.6 | **Poll History** — result count label ("Showing X of Y") | S1 | AR-7 |
| F17.7 | **Poll History** — loading skeletons + error snackbar on fetch failure | S1 | AR-8 |
| F17.8 | **Poll History** — `findUserSessions()` updated to include CLOSED sessions | S1 | AR-9 |
| F17.9 | **Poll History** — CSV export (sessions + submissions) | S1 | AR-6 |
| F17.10 | **Poll History** — NaN/Infinity guards on all score displays | S1 | RG-5 |
| F17.11 | **Poll History** — NaN/Infinity guards on sort functions and CSV exports | S1 | RG-5 |
| F31.1 | **UI** — responsive app bar nav (desktop text+icons, mobile drawer) | S1 | UI-1 |
| F31.2 | **UI** — NaN/Infinity guards on gauge and metrics components | S1 | UI-8 |
| F31.3 | **UI** — `PollMetricsCard` redesign with mean headline + 5-number summary | S1 | UI-6 |
| F31.4 | **UI** — `NoRecentPolls` greeting card redesign (gradient, themed) | S1 | UI-6 |
| F31.5 | **UI** — rename Profile → Settings, route `/profile` → `/settings` | S1 | UI-5 |
| F31.6 | **UI** — guest responsive app bar nav | S1 | UI-1 |
| F16.1 | **Backend** — `firebase init functions` + emulator config | S1 | IO-2 |
| F16.2 | **Backend** — install `@google-cloud/vertexai` in functions | S1 | IO-1 |
| F16.3 | **Backend** — `generateQuestions` callable function (auth, validation, structured output, retry) | S1 | AI-1, AI-2, AI-3 |
| F16.4 | **Backend** — rewrite client `VertexStore` to use `httpsCallable` | S1 | AI-1 |
| F16.5 | **Backend** — remove client-side Vertex AI SDK usage | S1 | IO-1 |
| F16.6 | **Backend** — `UploadPDFDialog` passes `gs://` URI instead of download URL | S1 | AI-1 |
| F16.7 | **Backend** — end-to-end emulator test (upload PDF → callable → questions) | S1 | IO-2 |
| F16-P2 | **Backend** — grading moved to Firestore trigger (`onSessionFinish`) | S1 | AI-4 |
| F32.1 | **UI** — glass-morphism on all 5 sub AppBars | S2 | UI-2 |
| F32.2 | **UI** — bordered card pattern on 5 card components | S2 | UI-3 |
| F32.3 | **UI** — responsive bottom-sheet drawer menus (mobile/desktop) | S2 | UI-4 |
| F32.4 | **UI** — two-state nav (desktop inline / mobile drawer) | S2 | UI-1 |
| F32.5 | **UI** — Settings redesign (GitHub-style horizontal rows) | S2 | UI-5 |
| F32.6 | **UI** — history URL param syncing (tab, search, sort, date filter) | S2 | AR-3 |
| F32.7 | **UI** — default date filter changed to "Last 7 days" | S2 | AR-2 |
| F32.8 | **UI** — modernized SubmissionCard, history views, MostRecentGaugeCard, GuestJoin | S2 | UI-3 |
| F33.1 | **UI** — `UserPollCard` redesign (vertical, avatar+title, hover glow) | S2 | UI-6 |
| F33.2 | **UI** — `MostRecentGaugeCard` redesign (session data, chips, motivation) | S2 | UI-6 |
| F33.3 | **UI** — `PulseGauge` animation overhaul (requestAnimationFrame, ease-out) | S2 | UI-7 |
| F33.4 | **UI** — `PulseGauge` dynamic score colors (red→teal gradient) | S2 | UI-7 |
| F33.5 | **UI** — `PulseGauge` aspect ratio fix (4:3) | S2 | UI-7 |
| F4 | **Persistent Poll Data** — additional search/filter/export on session history | S3 | AR-14 |
| F2 | **Peer Pulse** — optional ranked leaderboard (host toggle, per-question, top-10 filter) | S3 | AR-10 |
| F34 | **Design System Overhaul** — MUI v7 template design language adoption | S3 | UI-9 |
| BUG | **Firestore listener leaks** — `useEffect` cleanup in `SessionView.tsx` | S3 | — |
| BUG-3 | **Incorrect `await navigate()` usage** — `PollSession.tsx`, `PollJoin.tsx`, `PollParticipate.tsx`, `GuestJoin.tsx` | S3 | — |
| F38 | **Download Poll to PDF** — export poll as printable PDF with numbered questions, options, and answer blanks | S3 | PM-14 |
| F37 | **Clone Polls** — deep-copy entire poll (questions + options) into new poll; "Clone Poll" in editor menu + 3-dot menu on dashboard cards | S4 | PM-13 |

---

### BACKLOG

Not scheduled. Will be pulled in if ahead of schedule or deferred to future semesters.

| ID | Item | Priority | SRS Ref | Estimate | Dependencies |
|----|------|----------|---------|----------|-------------|
| F1 | **Knowledge Pulse** — confidence slider (1–5) per answer + class confusion heatmap | P1 | RG-6 | 3–5 days | None |
| F3 | **AI Summaries** — post-session AI analysis (accuracy, misconceptions, review topics) | P2 | AI-5 | 3–4 days | F16 |
| F10 | **Instructor Dashboard** — engagement metrics over time (line/bar charts, stats) | P2 | AR-11 | 4–6 days | None |
| F20 | **Build Security** — disable source maps, App Check, security rules hardening | P3 | IO-6, IO-7, IO-8 | 1–2 days | F16 |
| F5 | **Learning Pulse Dashboard** — student performance over time, weak areas | P3 | AR-12 | 5–8 days | F8 |
| F6 | **Weekly Reflection** — aggregated weekly performance summaries | P3 | AR-13 | 3–4 days | F5 |
| F18 | **Gemini AI Overhaul** — migrate from `@firebase/vertexai` to `@google/genai` SDK | P1 | — | 3–5 days | None |
| F29 | **True/False Question Type** — simplified MCQ with 2 options | P4 | PM-10 | 1 day | None |
| F22 | **Open-Ended / Short Answer** — free-text responses with optional AI grading | P4 | RG-7 | 4–6 days | None |
| F21 | **Word Clouds** — word cloud visualization for open-ended responses | P4 | UI-12 | 3–5 days | F22 |
| F28 | **Q&A Mode** — live Q&A with upvoting | P4 | EI-2 | 3–5 days | None |
| F30 | **Exit Tickets** — 1-click end-of-class check-in flow | P4 | EI-1 | 2–3 days | F13a |
| F13b | **UI Customization** — per-user color theme, font size, font family | P4 | UI-11 | 3–5 days | None |
| F23 | **LMS Integration** — Canvas/Blackboard via LTI 1.3 | P4 | IO-9 | 8–12 days | F16 |
| F24 | **AI Learning Analytics** — cross-session misconception analysis | P4 | AI-11 | 5–8 days | F3, F8 |
| F26 | **Bloom's Taxonomy Tagging** — AI auto-tags questions by cognitive level | P4 | AI-7 | 2–3 days | F18 |
| F27 | **Misconception Detection** — AI wrong-answer pattern analysis | P4 | AI-8 | 3–5 days | F3 |
| F9 | **Study Resources** — attach source PDF + AI study suggestions | P3 | AI-10 | 3–5 days | F8, F16 |
| BUG | **Undefined data access in `gradeSubmission`** — missing `.exists()` check | High | — | 0.5 day | None |
| BUG | **Array index out of bounds on `currentQuestion`** — no bounds check | High | — | 0.5 day | None |
| BUG | **Missing error handling in Vertex AI calls** — no try/catch on AI grading | High | — | 0.5 day | None |
| BUG | **Missing `useEffect` dependencies** — stale closures in PollSession, PollParticipate | Med | — | 1 day | None |
| BUG | **Race condition — overlapping interval calls** — `PollSession.tsx` | Med | — | 0.5 day | None |
| BUG | **Listener re-attachment on every state change** — `PollHost.tsx` | Med | — | 0.5 day | None |
| BUG | **Silent error handling** — no user feedback on API failure | Low | — | 1 day | None |
| BUG | **Unsafe non-null assertions** — `RegisterJoin.tsx` | Low | — | 0.5 day | None |
| BUG | **Hardcoded Firebase API keys** — move to `.env` | Low | — | 0.5 day | None |
| BUG | **Missing input sanitization** — no sanitization on user-submitted poll responses | Low | — | 1 day | None |
| CHORE | **Migrate `@firebase/vertexai` → `@google/genai`** — deprecated June 2025, removal June 2026 | P1 | — | 1–2 days | None |
| CHORE | **Firebase App Check** — integrate reCAPTCHA | P3 | IO-7 | 1 day | None |
| CHORE | **Multi-session guard** — enforce single active session per user | P2 | — | 1 day | None |
| CHORE | **SnackBar improvements** — hide close button if auto-hide, animated progress | P3 | — | 1 day | None |
| CHORE | **Mobile bottom nav** — phone-optimized navigation bar | P3 | — | 2 days | None |
| CHORE | **History state filter** — filter sessions/submissions by state (open, closed, done, finished); default to "finished" | P3 | — | 1 day | None |

---

## Bug Tracker

Identified via static analysis of the codebase. Organized by severity. Each bug is also tracked as a `BUG` item in the board tables above for sprint planning.

### Critical

- [x] **BUG-1: Firestore listener leak — unnecessary re-attachment** — `PollHost.tsx`
  - **Sprint:** S5 (DONE)
  - The `onSnapshot` listener on `waiting_users` included `session` in its `useEffect` dependency array, causing the listener to tear down and re-create on every session state change. Fixed by using a `useRef` to track current session state and removing `session` from the dependency array.

- [ ] **BUG-2: No double-join protection** — `join/[code]/page.tsx`
  - **Sprint:** S5 (TODO)
  - `joinSession` is called in `useEffect` with no guard against being called twice (React Strict Mode calls effects twice in dev). This could create duplicate waiting room entries.

### High

- [x] **BUG-3: Incorrect `await navigate()` usage** — `PollSession.tsx`, `PollJoin.tsx`, `PollParticipate.tsx`, `GuestJoin.tsx`
  - **Sprint:** S3 (DONE)
  - React Router's `navigate()` does not return a Promise. Using `await` on it is a no-op and allows subsequent code (like error throws) to execute when it shouldn't.

- [ ] **BUG-4: NaN / division-by-zero in score calculations** — `sessions.ts`, `ScoreCard.tsx`, `PollMetricsCard.tsx`
  - **Sprint:** S5 (TODO)
  - Sessions are initialized with `max_score: NaN`. When calculating `score_100`, dividing by `NaN` or `0` produces `NaN`/`Infinity`. Calling `.toFixed()` on `NaN` renders `"Score: NaN"` to users. Affects score display, metrics low/high, and stored submission data.
  - **Note:** Display-side guards added in F17.10, F17.11, F31.2 (Done). Root cause in `sessions.ts` initialization still unresolved.

- [ ] **BUG-5: Undefined data access in `gradeSubmission`** — `submissions.ts`
  - **Sprint:** Backlog
  - After `getDoc()`, `submissionDoc.data()` is called without checking `.exists()`. If the doc doesn't exist, `.data()` returns `undefined` and the function throws.

- [ ] **BUG-6: Array index out of bounds on `currentQuestion`** — `SessionView.tsx`
  - **Sprint:** Backlog
  - `session.questions[session.currentQuestion]` is accessed without verifying the index is within bounds. If `currentQuestion` exceeds the array length (e.g., during a race on question advancement), this silently returns `undefined` and downstream code breaks.

- [ ] **BUG-7: Missing error handling in Vertex AI calls** — `vertex.ts`
  - **Sprint:** Backlog
  - AI grading calls to Gemini have no try/catch. If the call fails (rate limit, network error), the error propagates uncaught and could crash the grading flow.

### Medium

- [x] **BUG-8: Missing `setTimeout` cleanup** — `PollSubmissionHistory.tsx`, `PollSessionHistory.tsx`
  - **Sprint:** S1 (Done — F17.1)
  - `setTimeout` inside `useEffect` with no `clearTimeout` in the cleanup function. Fixed in F17.1.

- [ ] **BUG-9: Missing `useEffect` dependencies (stale closures)** — `PollSession.tsx`, `PollParticipate.tsx`, `GetStarted.tsx`
  - **Sprint:** Backlog
  - Empty or incomplete dependency arrays that reference `user`, `loading`, `navigate`, etc. Closures capture initial values and never update, causing stale state checks and missed re-initialization.

- [ ] **BUG-10: Race condition — overlapping interval calls** — `PollSession.tsx`
  - **Sprint:** Backlog
  - `setInterval` fires async `aux()` with no guard against overlapping calls. If one call is still pending when the next fires, multiple navigations could trigger simultaneously.

- [ ] **BUG-11: Listener re-attachment on every state change** — `PollHost.tsx`
  - **Sprint:** Backlog
  - `onSnapshot` listener depends on `[sid, session]`. Since `session` changes on every update, the listener is detached and re-attached every time, potentially missing updates or creating duplicates.

### Low

- [ ] **BUG-12: Silent error handling (no user feedback)** — `ProfileIcon.tsx`, `Dashboard.tsx`, `ContinueWGoogleButton.tsx`
  - **Sprint:** Backlog
  - API failures caught with `console.debug` only. Components stay in loading state forever or silently fail with no feedback to the user.

- [ ] **BUG-13: Unsafe non-null assertions** — `RegisterJoin.tsx`
  - **Sprint:** Backlog
  - `user.email!` and `user.displayName!` assume non-null, but these can be null for certain Firebase auth providers.

- [ ] **BUG-14: Hardcoded Firebase API keys** — `firebase/index.ts`
  - **Sprint:** Backlog
  - Config values are hardcoded in source instead of loaded from environment variables. Client-side Firebase keys are restricted by security rules, but best practice is to use `.env` files.

- [ ] **BUG-15: Missing input sanitization** — Various
  - **Sprint:** Backlog
  - No visible sanitization on user-submitted poll responses before storing in Firestore or rendering in the UI.

- [ ] **BUG-16: Poll `updated_at` not updating on question edits**
  - **Sprint:** S5 (TODO)
  - Poll `updated_at` field only updates when the title is edited, not when questions or options are modified.

- [ ] **BUG-17: Dead code — `sessions/submissions.ts` store** — `src/api/firebase/sessions/submissions.ts`
  - **Sprint:** Backlog
  - Session submissions are created exclusively by the `finishSession` Cloud Function. The client-side `SubmissionStore` (session sub-store) is never called. Additionally, its `doc()` method has a swapped path bug (`/submissions/{sid}/sessions/{uid}` instead of `/sessions/{sid}/submissions/{uid}`). Remove the file and its references in `SessionStore`.

---

## Velocity & Progress

| Sprint | Dates | Planned | Completed | Carry-Over |
|--------|-------|---------|-----------|-----------|
| **S1** | Mar 11–17 | F11, F17, F31, F16 P1–P2 | F11, F17 (11 items), F31 (6 items), F16 P1 (7 items), F16 P2 | F16.8 |
| **S2** | Mar 18–24 | F32, F33, F12, F4 | F32 (8 items), F33 (6 items) | F12, F4 |
| **S3** | Apr 1–14 | F12, F4, F1, F2, F14, F16.8 | F2, F34, BUG (listener leak), BUG-3 | F12, F4, F1, F14, F16.8 |
| **S4** | Apr 15–28 | F3, F13a, F12, F42, F36, F37, F41, F8 | F12, F13a | — |
| **S5** | Apr 29 – May 6 | F34, bugs, polish | — | — |

---

## How to Use This Board

1. **Pull items** from TODO → IN PROGRESS when starting work
2. **Move items** from IN PROGRESS → DONE when verified
3. **Carry over** incomplete items to the next sprint with a note
4. **Promote** BACKLOG items to TODO when sprint capacity allows
5. **Update velocity** table at the end of each sprint
6. **Reference SRS IDs** for traceability between requirements and implementation

---

*This is a living document updated at sprint boundaries. For detailed feature specifications see [SPECS.md](SPECS.md). For requirement definitions see [SRS](SRS.md).*
