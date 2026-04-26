# PulseCheck — Features

## Table of Contents

- [The Big Question](#the-big-question)
- [Features](#features)
  - [F1 — Knowledge Pulse](#f1--knowledge-pulse-p1-med-3-5-days-no-deps)
  - [F2 — Peer Pulse](#f2--peer-pulse-p1-low-med-2-3-days-no-deps)
  - [F3 — AI Summaries](#f3--ai-summaries-p2-med-3-4-days-deps-f16-ideal)
  - [F4 — Persistent Poll Data](#f4--persistent-poll-data-p0-low-1-2-days-no-deps)
  - [F5 — Learning Pulse Dashboard](#f5--learning-pulse-dashboard-p3-high-5-8-days-deps-f8)
  - [F6 — Weekly Reflection](#f6--weekly-reflection-p3-med-3-4-days-deps-f5)
  - [F7 — Show Past Answers](#f7--show-past-answers)
  - [F8 — Topics Struggled With](#f8--topics-struggled-with-p2-med-high-4-6-days-deps-f5)
  - [F9 — Study Resources](#f9--study-resources-p3-med-3-5-days-deps-f8-f16)
  - [F10 — Instructor Dashboard](#f10--instructor-dashboard-p2-med-high-4-6-days-no-deps)
  - [F11 — Fat Finger](#f11--fat-finger-p0-low-1-2-days-no-deps)
  - [F12 — Auto-Fill Prompts](#f12--auto-fill-prompts-p0-low-1-2-days-no-deps)
  - [F13a — Poll Templates](#f13a--poll-templates-p2-med-3-5-days-no-deps)
  - [F13b — UI Customization](#f13b--ui-customization-p4-med-3-5-days-no-deps)
  - [F14 — Async Results](#f14--async-results-p1-med-3-5-days-no-deps)
  - [F15 — Sharing Polls](#f15--sharing-polls-p2-med-3-5-days-no-deps)
  - [F16 — Backend Migration](#f16--backend-migration-p3-high-8-12-days-deps-blaze-plan)
  - [F17 — Enhanced Poll History](#f17--enhanced-poll-history-p0-low-med-3-5-days-no-deps)
  - [F18 — Gemini AI Overhaul](#f18--gemini-ai-overhaul-p1-med-3-5-days-no-deps)
  - [F19 — Testing & CI/CD](#f19--testing--cicd-p1-med-high-5-8-days-deps-f16-for-functions-tests)
  - [F20 — Build Security & Obfuscation](#f20--build-security--obfuscation-p3-low-1-2-days-deps-f16)
  - [F21 — Word Clouds](#f21--word-clouds-stretch-med-3-5-days-no-deps)
  - [F22 — Open-Ended / Short Answer](#f22--open-ended--short-answer-stretch-med-high-4-6-days-no-deps)
  - [F23 — LMS Integration](#f23--lms-integration-stretch-high-8-12-days-deps-f16)
  - [F24 — AI Learning Analytics Dashboard](#f24--ai-learning-analytics-dashboard-stretch-high-5-8-days-deps-f3-f8)
  - [F25 — AI Study Guides](#f25--ai-study-guides-stretch-med-3-5-days-deps-f3-f9)
  - [F26 — Bloom's Taxonomy Tagging](#f26--blooms-taxonomy-tagging-stretch-low-med-2-3-days-deps-f18)
  - [F27 — Misconception Detection](#f27--misconception-detection-stretch-med-3-5-days-deps-f3)
  - [F28 — Q&A Mode with Upvoting](#f28--qa-mode-with-upvoting-stretch-med-3-5-days-no-deps)
  - [F29 — True/False Question Type](#f29--truefalse-question-type-stretch-low-1-day-no-deps)
  - [F30 — Exit Tickets](#f30--exit-tickets-stretch-low-med-2-3-days-deps-f13a)
  - [F31 — UI Improvements](#f31--ui-improvements-p1-low-1-2-days-no-deps)
  - [F32 — UI Modernization Phase 2](#f32--ui-modernization-phase-2-p1-low-med-2-3-days-no-deps--done)
  - [F33 — Dashboard Card Redesign + PulseGauge Overhaul](#f33--dashboard-card-redesign--pulsegauge-overhaul-p1-low-1-day-no-deps--done)
  - [F34 — Design System Overhaul](#f34--design-system-overhaul-p1-med-high-5-8-days-no-deps)
  - [F35 — Guest Account Upgrade](#f35--guest-account-upgrade-stretch-med-3-5-days-deps-f11)
  - [F36 — Host Response Progress](#f36--host-response-progress-p2-low-1-2-days-no-deps)
  - [F37 — Clone Polls](#f37--clone-polls-p2-low-1-day-no-deps)
  - [F38 — Download Poll to PDF](#f38--download-poll-to-pdf-p3-med-2-3-days-no-deps)
  - [F39 — Cloud Poll Session Settings](#f39--cloud-poll-session-settings-p3-low-1-2-days-no-deps)
  - [F40 — Question Bank](#f40--question-bank-p2-med-high-4-6-days-deps-f13a)
  - [F41 — Question Difficulty Ranking](#f41--question-difficulty-ranking-p2-low-med-2-3-days-no-deps)
  - [F42 — Host Edit Ended Session](#f42--host-edit-ended-session-p2-med-3-5-days-no-deps)
- [Competitive Positioning](#competitive-positioning)

Also see: [SRS](SRS.md) | [Architecture](ARCHITECTURE.md) | [Project Plan](PROJECT_PLAN.md) | [Roadmap](ROADMAP.md)

## The Big Question
Alot of similar things compared to other polling applications. What is the innovation here? What's the problem I'm trying solve with this software that other software hasn't solved already? What makes this software stand out?

## Features

#### F1 — Knowledge Pulse `P1` `Med` `3-5 days` `No deps`
Confidence slider (1-5) per answer + heatmap for class confusion

- **What Exists:** `ResponseDialog.tsx` renders choices; `SessionResponse` stores `choices[]`/`correct`; `displayUserResponses()` aggregates into bar/pie; MUI `Slider` + X-Charts `HeatMap` available
- **What's Needed:** Add `confidence: number` to `SessionResponse`; `confidence_avg` to `SessionQuestionResults`; new `ConfidenceSlider` component; modify `responses.ts` → `answer()`; new `ConfidenceHeatmap` on `SessionResults`
- **Action Plan:**
  1. Add field to `types/index.ts`
  2. Build `ConfidenceSlider` (MUI Slider)
  3. Insert into `ResponseDialog.tsx`
  4. Update `responses.ts`
  5. Update `displayUserResponses()`
  6. Build `ConfidenceHeatmap`
  7. Add to `SessionResults.tsx`
  8. Test multi-participant
- **Risk:** Extra tap per question — must be fast or students spam 3/5

#### F2 — Peer Pulse `P1` `Low-Med` `2-3 days` `No deps`
Optional leaderboard showing ranked scores

- **What Exists:** `Submission` has `score`/`score_100`; `UserSessionGrid` renders participant cards; `SessionResults` maps `ScoreCard` per participant; `SessionScatterCard` receives submissions
- **What's Needed:** Add `leaderboard: boolean` to `Poll`/`Session`; new `LeaderboardCard` component (sorted by `score_100` desc); add to `SessionResults.tsx` + optionally `PollParticipate.tsx`
- **Action Plan:**
  1. Add toggle to types
  2. Add toggle in editor `Settings.tsx`
  3. Build `LeaderboardCard`
  4. Add to results views
  5. Respect anonymous mode
  6. Handle ties
- **Risk:** Low — data exists. Anonymous mode must suppress names

#### F3 — AI Summaries `P2` `Med` `3-4 days` `Deps: F16 (ideal)`
Post-session AI summary: accuracy, misconceptions, review topics

- **What Exists:** `vertex.ts` calls Gemini; `SessionSummary` has all metrics; `SessionQuestionResults` has barchart/piechart/responses/opts_correct
- **What's Needed:** New `VertexStore.summarizeSession()`; `AISessionSummary` type; `AISummaryCard` component (MUI Accordion); cache in Firestore `ai_summary` field
- **Action Plan:**
  1. Define `AISessionSummary` type
  2. Add `summarizeSession()` to `VertexStore`
  3. Build prompt w/ question text + % correct + wrong-answer distribution
  4. Use structured JSON output
  5. Build `AISummaryCard`
  6. Add to `SessionResults.tsx`
  7. Cache in Firestore
- **Risk:** Vertex AI cost ~$0.01-0.03/call. Cache to avoid duplicates. Needs error handling

#### F4 — Persistent Poll Data `P0` `Low` `1-2 days` `No deps`
Search/filter/export on session history

- **What Exists:** `PollHistory.tsx` with tabs; `SessionCard`/`SubmissionCard` render items; `findUserSessions()`/`findAllByUID()` queries; data persists in Firestore after FINISHED
- **What's Needed:** Search `TextField` filter; sort dropdown (date/score); CSV export (client-side `Blob`); enhanced card metadata
- **Action Plan:**
  1. Add search filter to `PollHistory.tsx`
  2. Add sort dropdown
  3. Add CSV export button
  4. Enhance cards with more stats
- **Risk:** None. Low effort, high UX value

#### F5 — Learning Pulse Dashboard `P3` `High` `5-8 days` `Deps: F8`
Student performance over time, weak areas, trends

- **What Exists:** `Dashboard.tsx` is host-focused; `PollSubmissionHistory.tsx` lists submissions; `Submission` has `score_100`/`submitted_at`/`title`; `AnswerCard` shows correct/incorrect
- **What's Needed:** New `StudentDashboard` screen; `PerformanceLineChart` (MUI X-Charts `LineChart`); `WeakAreasCard`; route `/dashboard/student`; auth-gated
- **Action Plan:**
  1. Query submissions via `findAllByUID()`
  2. Build `PerformanceLineChart`
  3. Build `WeakAreasCard`
  4. Build `StudentDashboard` screen
  5. Add navigation
  6. Gate behind auth
- **Risk:** Many Firestore reads for wrong-answer analysis. Denormalize: store per-question results on submission doc

#### F6 — Weekly Reflection `P3` `Med` `3-4 days` `Deps: F5`
Aggregated weekly performance for students

- **What Exists:** `Submission.submitted_at` — filterable by date; no weekly aggregation logic
- **What's Needed:** `WeeklyReflectionCard`; date range utils; aggregate metrics (sessions, avg score, improvement); optional AI reflection via Gemini
- **Action Plan:**
  1. Add date range utils
  2. Filter submissions by week
  3. Build `WeeklyReflectionCard`
  4. Integrate into Student Dashboard (F5)
  5. Optional Gemini reflection
- **Risk:** Orphaned without F5. Low data volume — client-side filtering OK

#### F7 — Show Past Answers
- **What Exists:** `SubmissionResults.tsx` renders `AnswerCard` per question w/ user's answer vs correct answer
- **What's Needed:** Enhance with color coding + confidence (if F1 done)

#### F8 — Poll Tags & Topic Identification `P2` `Med-High` `4-6 days` `Deps: F5`
Tag-based poll categorization and weak topic identification

- **What Exists:** `Poll.title` as rough topic proxy; `Question.prompt` extractable by AI; `Submission.score_100` for thresholding; no tag field exists
- **What's Needed:**
  - Add `tags: string[]` to `Poll` type
  - Free-form tag input on first use (MUI `Autocomplete` freeSolo)
  - On subsequent tags, render combo box with checkboxes showing existing tags + free-form entry; "Apply" to confirm
  - Tags enable categorization — helpful when a user owns many polls
  - Polls searchable by tag (`tag:example` syntax in history search)
  - Tags feed into F25 (Personalized Study Guide) — build study guides from sessions tagged with a given topic
  - AI auto-tagging: have Gemini return topic tags during question generation
  - `WeakTopicsCard` component; threshold logic (<60% = struggling)
- **Action Plan:**
  1. Add `tags` to `Poll` type
  2. Build `TagInput` component (free-form first tag, combo box for subsequent)
  3. Add tag input in editor `Header.tsx`
  4. Have Gemini return topic tags during generation
  5. Add `tag:` search syntax to poll history
  6. Build `WeakTopicsCard`
  7. Integrate into Dashboard (F5)
- **Risk:** Manual tagging = friction. AI tagging = extra API calls. Use optional manual + AI suggestion

#### F9 — Study Resources `P3` `Med` `3-5 days` `Deps: F8, F16`
Attach source PDF + AI-suggested study materials

- **What Exists:** `vertex.ts` takes Cloud Storage `uri`; `Question.prompt_img` stores images; no `source_uri` on `Poll`; Cloud Storage integration exists
- **What's Needed:** Add `source_uri: string|null` to `Poll`; "View Source Material" button on `SubmissionResults.tsx`; optional AI study suggestions via Gemini
- **Action Plan:**
  1. Add `source_uri` to `Poll` type
  2. Save URI during AI generation
  3. Add download/view button
  4. Optional: `StudyResourcesCard` w/ Gemini suggestions
  5. Optional: per-question `source_page`
- **Risk:** Signed URLs expire. AI may hallucinate resource URLs. Stick to original PDF attachment

#### F10 — Instructor Dashboard `P2` `Med-High` `4-6 days` `No deps`
Engagement metrics over time across sessions

- **What Exists:** `Dashboard.tsx` shows polls + recent gauge; `findUserSessions(uid)` returns `Session[]` w/ `summary`/`created_at`; `SessionSummary` has all metrics; MUI X-Charts available
- **What's Needed:** `EngagementLineChart` (avg score over time); `ParticipationBarChart` (participants per session); `InstructorStatsCard` (totals); date range filter; session comparison
- **Action Plan:**
  1. Enhance `findUserSessions()` sorted by date
  2. Build `EngagementLineChart`
  3. Build `ParticipationBarChart`
  4. Build `InstructorStatsCard`
  5. Add to `Dashboard.tsx` as tab
  6. Add date filter
  7. Optional: compare repeat polls
- **Risk:** Many Firestore reads at 100+ sessions. Paginate/cache. Spark plan read limits

#### F11 — Fat Finger `P0` `Low` `1-2 days` `No deps`
Rejoin session after accidental back-out

- **What Exists:** `hasJoined(sid, uid)` checked every 2s; `SessionUser` doc persists after disconnect; `leaveSession()` only called by `LeaveButton`; user stays in `users` subcollection
- **What's Needed:** Check `hasJoined()` in `PollSession.tsx` → skip waiting room; persist `{sid, room_code}` in `localStorage`; "Rejoin" banner on Dashboard/Join
- **Action Plan:**
  1. Add `hasJoined()` check in `PollSession.tsx` → redirect to participate
  2. Store session in `localStorage` on join
  3. Clear on FINISHED/CLOSED
  4. Show "Rejoin" button on Dashboard/Join
  5. Verify session state before showing
- **Risk:** Very low. Infrastructure already exists

#### F12 — Auto-Fill Prompts `P0` `Low` `1-2 days` `No deps`
Question-level quick-fill presets, duplicate questions, targeted AI generation

- **What Exists:** `QuestionEditor.tsx` w/ `PromptField`/`PromptOptionList`; `UploadPDFDialog.tsx` for AI bulk gen; `questions.ts` → `add()` creates blanks; no duplicate/template features
- **What's Needed:**
  - **Quick-Fill Chips:** When a question has 0 options, show a horizontal chip row inside `QuestionEditor` with presets: `T/F`, `Yes/No`, `Agree Scale`, `Rating 1-5`, `Confidence`, `Frequency`, `Blank (4)`. One-click fills options via existing `api.polls.questions.options.create()` + `updateByRef()`. Chips auto-dismiss when options appear (Firestore-reactive).
  - **Duplicate Question:** "Duplicate" button in `AccordionActions` clones question structure (type, options, points, settings) with blank prompt.
  - **Topic field in `UploadPDFDialog`:** Optional text field for topic/focus area.
  - **Correct-answer validation indicator:** Visual cue when no correct answer is marked.
- **Action Plan:**
  1. Define `OptionPreset` type in `src/types/index.ts`
  2. Create `optionPresets.ts` constants (7 presets)
  3. Create `QuickFillChips.tsx` component
  4. Render in `QuestionEditor.tsx` when `data.options.length === 0`
  5. Add "Duplicate" button in `QuestionEditor.tsx` `AccordionActions`
  6. Add topic field in `UploadPDFDialog.tsx`
  7. Add correct-answer validation indicator
- **Risk:** None. QoL improvement, high usability impact

#### F13a — Poll Templates `P2` `Med` `3-5 days` `No deps`
Pre-built poll structures with post-apply editing acceleration

- **What Exists:** `Poll` has `anonymous`/`time` globals; `Question` inherits/overrides per-question; `Settings.tsx` exists; `api.polls.generateQuestions(pid, AIQuestions)` creates bulk questions (used by AI/PDF flow); no template system
- **What's Needed:**
  - **Template Picker (empty state):** When `poll.questions.length === 0` in PollEditor, show a card grid with 8 templates across 3 categories (Assessment, Feedback, Engagement). One-click applies via existing `generateQuestions()` method. Auto-dismisses when questions appear.
  - **8 Built-in Templates:** Quick Quiz (5 MCQ), True/False (5 T/F), Vocabulary Check (4 MCQ), Exit Ticket (3 multi-select), Course Survey (4 ranking), Icebreaker (3 MCQ), Muddiest Point (2 multi-select), Discussion Prep (3 MCQ). Feedback/engagement templates have pre-filled usable prompts; assessment templates have pre-filled option structure with empty prompts.
  - **Template Preview Dialog:** Read-only preview of questions/options before applying.
  - **Post-Apply Acceleration:**
    - Auto-expand all question accordions after template apply (no click-to-open each one)
    - Auto-focus first question's prompt field (cursor ready immediately)
    - Tab-through keyboard flow between all expanded questions (free once expanded)
    - Completion progress bar ("3/5 questions ready") with Host shortcut button
  - **Browse Templates (stretch):** Menu item in Header for appending templates to non-empty polls.
- **Action Plan:**
  1. Define `PollTemplate`, `TemplateCategory` types in `src/types/index.ts`
  2. Create `pollTemplates.ts` with 8 template definitions using `AIQuestions` type
  3. Create `TemplateCard.tsx` (card grid item with icon, name, description, loading state)
  4. Create `TemplatePicker.tsx` (empty-state component with category filter + card grid)
  5. Create `TemplatePreviewDialog.tsx` (read-only preview before applying)
  6. Modify `QuestionList.tsx` to render `TemplatePicker` when `questions.length === 0`
  7. Add `expandAll` state to `PollEditor.tsx` — auto-expand after template apply
  8. Add `autoFocus` to `PromptField.tsx` for first question
  9. Create `CompletionBar.tsx` (progress indicator + Host shortcut)
  10. Stretch: "Browse Templates" menu item in `Header.tsx`
- **Risk:** Low for core (templates + picker). Post-apply acceleration is all client-side state, no backend changes.

#### F13b — UI Customization `P4` `Med` `3-5 days` `No deps`
Per-user color theme, font size, font family

- **What Exists:** Theme is app-wide light/dark via `ThemeProvider`; no per-poll/user theming
- **What's Needed:** `UserPreferences` type; `PreferencesDialog` (color pickers, font dropdown); MUI `createTheme()` override in `ThemeProvider`
- **Action Plan:**
  1. Add `preferences` to `User` type
  2. Build `PreferencesDialog`
  3. Override theme in `ThemeProvider`
  4. Add "Customize" in settings
- **Risk:** Scope creep — dark/light + custom colors + a11y contrast. Only if time permits

#### F14 — Async Results `P1` `Med` `3-5 days` `No deps`
Show results to participants post-session or in real-time

- **What Exists:** `Poll.async`/`Session.async` flags exist but unimplemented; `displayUserResponses()` triggered by host; `ResultsChart` reusable; **`PollParticipate.tsx:118-122` already renders `ResultsChart` when `session.results` exists**
- **What's Needed:** Option C (easiest): `show_results` toggle → show charts on `SubmissionResults.tsx`. Option B: already partially working — data flow exists via `useDocumentData`. Option A (self-paced): too complex solo
- **Action Plan:**
  - **Option C:** 1. Add `show_results` toggle 2. Render `ResultsChart` on `SubmissionResults.tsx` 3. Fetch session results per question
  - **Option B:** Already partially working — just gate behind user's own submission
- **Risk:** Selection bias if shown before answering. Gate results behind submission. Option A (self-paced) requires full session flow rethink — skip

#### F15 — Sharing Polls `P2` `Med` `3-5 days` `No deps`
Share polls with view/edit permissions

- **What Exists:** `Poll.owner` is single ref; `queryUserPolls(uid)` filters by owner only; no permissions model; anyone with URL can edit
- **What's Needed:** `shared_with` array on `Poll`; `SharePollDialog` (email input, permission dropdown); update `queryUserPolls()` w/ `array-contains`; read-only mode in editor; Firestore security rules
- **Action Plan:**
  1. Add `shared_with` to `Poll` type
  2. Build `SharePollDialog`
  3. Add "Share" button in editor header
  4. Update query to include shared polls
  5. Permission check in `PollEditor.tsx`
  6. Update security rules
  7. Optional: short-code share links
- **Risk:** Firestore `array-contains` limits (1 per query). Consider `/poll_shares` collection at scale. Security rules must be tight

#### F16 — Backend Migration `P3` `High` `8-12 days` `Deps: Blaze Plan`
Move grading, AI, session init to Cloud Functions

- **What Exists:** `vertex.ts` runs AI client-side; `sessions.ts` → `finish()`/`start()`/`gradeQuestion()` all client-side w/ N+1 reads; `submissions.ts` client-side score calc
- **What's Needed:** `firebase init functions`; Phase 1: `generateQuestions` callable; Phase 2: `onSessionFinish` trigger; Phase 3: `onUserResponse` trigger; Phase 4: `start()` callable; emulator setup
- **Action Plan:**
  1. Init functions project
  2. **P1:** Move AI gen to callable function
  3. **P2:** Move grading to Firestore trigger
  4. **P3:** Move real-time grading to response trigger
  5. **P4:** Move session start server-side
  6. Emulator setup
  7. Deploy
  8. Remove client-side code
- **Risk:** **Requires Blaze Plan** (billing change). Cold starts 1-3s. Start with Phase 1 (AI) for biggest security win

#### F17 — Enhanced Poll History `P0` `Low-Med` `3-5 days` `No deps`
Improve the existing poll history with sorting, filtering, export, and richer card data

- **What Exists:** `PollHistory.tsx` tab view (Sessions / Submissions); `PollSessionHistory.tsx` + `PollSubmissionHistory.tsx` with title-only search and fixed most-recent sort; `SessionCard.tsx` shows title + participant count + relative time; `SubmissionCard.tsx` shows title + score/100 + relative time; `findUserSessions(uid)` hardcoded to FINISHED state only; `findUserSubmissions(uid)` returns all with no pagination
- **What's Needed:**
  - Sort dropdown (date, score, participants/alphabetical)
  - Date range filter (Last 7 days, Last 30 days, Custom)
  - Richer card metadata: avg score + question count on session cards, max_score + class avg comparison on submission cards
  - Result count display ("Showing X of Y")
  - CSV export (client-side `Blob`)
  - Loading skeletons + error states (currently silent failures)
  - Include CLOSED sessions in `findUserSessions()` (not just FINISHED)
  - Fix `setTimeout` cleanup bug (no `clearTimeout` on unmount)
- **Action Plan:**
  1. Fix `setTimeout` cleanup bug in both history components
  2. Add sort dropdown (MUI `Select`) to both views
  3. Add date range filter (MUI `ToggleButtonGroup` or `Select`)
  4. Enhance `SessionCard` — show `summary.average_100`, question count, session state badge
  5. Enhance `SubmissionCard` — show `max_score`, question count
  6. Add result count label
  7. Add loading skeletons + error snackbar on fetch failure
  8. Update `findUserSessions()` to include CLOSED sessions
  9. Add CSV export button (sessions: title, date, participants, avg score; submissions: title, date, score)
- **Risk:** Low. All data already exists in Firestore — just surfacing it. CSV export is client-side only

#### F18 — Gemini AI Overhaul `P1` `Med` `3-5 days` `No deps`
Restructure AI question generation: structured output, single API call, validation, reliability improvements

- **What Exists:** `vertex.ts` calls Gemini 2.0 Flash with fragile markdown fence parsing (`` ```json ... ``` ``); two-step flow (extract text → generate questions); no structured output mode; default temperature (1.0); no application-level validation; no system instructions
- **What's Needed:**
  - Switch to structured output mode (`responseMimeType: "application/json"` + `responseSchema`) — eliminates JSON parsing failures
  - Lower temperature to 0.2 for factual MCQ generation
  - Add system instructions (educational assessment expert, strict MCQ rules)
  - Collapse to single API call — send PDF directly instead of extract-then-generate
  - Application-level validation: verify `correct_answer` ∈ `options`, exactly 4 options, no duplicates, retry on failure (2-3 attempts)
  - Few-shot examples in prompt
- **Action Plan:**
  1. Update model config in `vertex.ts` — add `responseSchema`, `responseMimeType`, `temperature: 0.2`
  2. Add system instructions to model initialization
  3. Remove markdown fence parsing, use structured JSON response directly
  4. Collapse two-step flow into single API call (send PDF + prompt together)
  5. Add validation layer: check `correct_answer` in `options`, 4 options, no duplicates
  6. Add retry logic (2-3 attempts on validation failure)
  7. Add few-shot examples to prompt
  8. Update `AIQuestions` type if needed
- **Schema enforcement:**
  ```typescript
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-2.0-flash-001",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
            correct_answer: { type: "string" }
          },
          required: ["question", "options", "correct_answer"]
        }
      },
      temperature: 0.2
    }
  });
  ```
- **Risk:** `gemini-2.0-flash` retires **June 1, 2026** — plan migration to `gemini-2.5-flash` before then. Constrained decoding may cause ~10% accuracy drop vs free-form
- **Relevant files:** `src/lib/api/firebase/vertex.ts`, `src/lib/api/firebase/index.ts`, `src/lib/types/index.ts` (`AIQuestions` type)

#### F19 — Testing & CI/CD `P1` `Med-High` `5-8 days` `Deps: F16 (for Functions tests)`
Set up testing infrastructure focused on business logic and Cloud Functions — no UI/E2E testing (too expensive for project timeline)

- **What Exists:** Vitest 3.x already installed. Cloud Functions directory exists with `finishSession`, `computeLeaderboard`, and `generateQuestions`. Grading logic, metrics computation, and leaderboard scoring are currently embedded in Cloud Functions and client-side stores.
- **Scope:** Logic tests only. No UI/component/E2E testing — visual testing requires expensive tooling and is brittle with frequent UI changes. Focus on ensuring the **business logic is correct and robust**.
- **What's Needed:**
  - **Decouple logic from Firestore** — extract pure functions for grading, metrics, leaderboard scoring so they can be tested in isolation without database calls
  - **Unit tests for business logic** — test grading logic (`gradeResponse` per prompt type), `calcMetrics`, leaderboard speed scoring, score normalization. Cover simple cases AND edge cases (empty sessions, zero participants, NaN inputs, all-correct, all-incorrect, single participant, tied scores)
  - **Cloud Functions integration tests** — Vitest + `firebase-functions-test` + Firebase Emulator for `finishSession`, `computeLeaderboard`, `regradeSession`, `generateQuestions`. Seed Firestore with test data, invoke function, assert outputs
  - **Firestore Rules tests** — Vitest + `@firebase/rules-unit-testing` to verify security rules enforce proper access control
  - **CI/CD** — GitHub Actions workflow running tests against Firebase Emulator Suite
- **Action Plan:**
  1. Install `@firebase/rules-unit-testing`, `firebase-functions-test`
  2. Decouple logic into pure functions:
     - Extract `gradeResponse(promptType, choices, correctOptions): boolean` from `responses.ts`
     - Extract `calcMetrics(scores, maxScore)` (already standalone in Cloud Functions)
     - Extract `calcSpeedScore(responseTime, displayedAt, questionDuration): number` from leaderboard logic
  3. Write unit tests for extracted pure functions (Vitest, no emulator needed):
     - `gradeResponse`: all 3 prompt types × correct/incorrect/partial/empty
     - `calcMetrics`: normal distribution, single value, empty array, NaN inputs
     - `calcSpeedScore`: instant answer (1000), timeout (0), negative values, null timestamps
  4. Write Cloud Functions integration tests (Vitest + emulator):
     - `finishSession`: seed session with users/questions/responses → invoke → assert submissions + summary
     - `computeLeaderboard`: seed timed responses → invoke → assert speed scores + cumulative
     - `regradeSession` (F42): change correct answer → invoke → assert updated scores
  5. Write Firestore Rules tests:
     - Users can only read/write own data
     - Session participants can read session data
     - Only hosts can modify session state
  6. Configure Firebase Emulator in `firebase.json` for CI:
     ```json
     "emulators": {
       "auth": { "port": 9099 },
       "functions": { "port": 5001 },
       "firestore": { "port": 8080 },
       "storage": { "port": 9199 }
     }
     ```
  7. Create GitHub Actions workflow: start emulator → run tests → report results
- **Notes:**
  - Firebase Emulator Suite runs fully in CI (GitHub Actions) — no external services needed
  - Vitest over Jest: native Vite integration, ESM/TS out of the box, faster watch mode
  - `firebase-functions-test` provides offline and online (emulator) modes for testing Cloud Functions
  - `@firebase/rules-unit-testing` seeds mock data and asserts rule allow/deny without a real project
  - Productization mindset: ensure grading, scoring, and metrics are provably correct before shipping
- **Risk:** Emulator startup adds ~10s to CI. Keep test suite fast by preferring pure function unit tests over integration tests where possible

#### F20 — Build Security & Obfuscation `P3` `Low` `1-2 days` `Deps: F16`
Harden production build: disable source maps, App Check, security rules, optional obfuscation

- **What Exists:** Vite esbuild minification active by default (strips whitespace, shortens variables, tree-shakes). Does NOT obscure control flow, string literals, or application logic. Firebase config keys hardcoded in source
- **What's Needed:**
  - **Tier 1 (zero cost, high value):** Disable source maps, enable Firebase App Check, write tight Firestore Security Rules, move secrets to Cloud Functions (F16)
  - **Tier 2 (optional IP protection):** Add `vite-plugin-bundle-obfuscator` with light config, exclude vendor chunks
- **Action Plan:**
  1. Disable source maps: `build: { sourcemap: false }` in `vite.config.ts`
  2. Enable Firebase App Check
  3. Write/tighten Firestore Security Rules
  4. Move `.env` Firebase config to environment variables (best practice, keys are public but cleaner)
  5. Optional: add `vite-plugin-bundle-obfuscator` with light-to-medium config
- **Performance impact of obfuscation:** bundle size +10-60%, runtime ~15% slower at p95, build time ~30s with threading
- **Risk:** Obfuscation can break dynamic imports — test thoroughly. For a Firebase SPA, Tier 1 is sufficient. The real security boundary is backend (Cloud Functions + Security Rules + App Check)

#### F21 — Word Clouds `Stretch` `Med` `3-5 days` `No deps`
Word cloud visualization for open-ended brainstorming responses

- **Competitors:** Mentimeter, Slido, Wooclap, Poll Everywhere
- **What's Needed:** New `word-cloud` prompt type; word cloud rendering component; response aggregation logic
- **Risk:** Requires open-ended question type (F22) first

#### F22 — Open-Ended / Short Answer `Stretch` `Med-High` `4-6 days` `No deps`
Free-text response question type with optional AI grading

- **Competitors:** Poll Everywhere, Socrative, Mentimeter, Slido
- **What's Needed:** New `short-answer` prompt type; text input response UI; optional AI-assisted grading via Gemini; manual review mode for instructors
- **Risk:** AI grading of free-text is unreliable — provide manual override

#### F23 — LMS Integration `Stretch` `High` `8-12 days` `Deps: F16`
Canvas/Blackboard/Moodle integration for roster sync and grade passback

- **Competitors:** iClicker, Wooclap, TopHat, Poll Everywhere
- **What's Needed:** LTI 1.3 integration; roster import; grade passback API; OAuth flow for LMS auth
- **Risk:** Each LMS has different LTI implementation quirks. Start with Canvas only

#### F24 — AI Learning Analytics Dashboard `Stretch` `High` `5-8 days` `Deps: F3, F8`
Post-session AI analysis: which topics students struggled with, auto-identified from question performance

- **Competitors:** No competitor does this well
- **What's Needed:** Aggregate wrong-answer patterns across sessions; AI identifies misconceptions ("most students confused X with Y"); topic-level performance breakdown
- **Risk:** Requires meaningful data volume across multiple sessions

#### F25 — Personalized Study Guides `Stretch` `Med-High` `5-8 days` `Deps: F3, F9, F8`
Auto-generate personalized study guides per student based on what they got wrong, with self-quiz and progress tracking

- **Competitors:** Completely unique — no competitor offers this
- **What's Needed:**
  - **Wrong-answer compilation** — for questions the user got incorrect, compile these into a study guide
  - **Self-quiz mode** — allow the user to re-quiz themselves on their weak questions with a timed input system
  - **Attempt history** — log previous self-quiz attempts so students can track improvement over time
  - **Tag integration (F8)** — allow the study guide to pull from sessions tagged with a specific topic, building topic-focused study material
  - **AI generation** — Gemini prompt to generate targeted study material grounded in original source content
  - **Export** — PDF/markdown export of study guide
- **Action Plan:**
  1. Build wrong-answer aggregation query (per-student, per-session or per-tag)
  2. Build `StudyGuide` page with compiled incorrect questions + correct answers
  3. Build self-quiz mode (re-present questions, accept answers, grade, time responses)
  4. Build attempt history log (store attempts in Firestore, show improvement chart)
  5. Integrate with F8 tags — filter study guide by poll tags
  6. AI-generate supplementary study notes via Gemini
  7. Add PDF/markdown export
- **Risk:** AI hallucination on study content. Ground in source material (F9). Self-quiz timing adds UI complexity

#### F26 — Bloom's Taxonomy Tagging `Stretch` `Low-Med` `2-3 days` `Deps: F18`
AI auto-tags questions by cognitive level (remember/understand/apply/analyze)

- **Competitors:** No competitor offers this
- **What's Needed:** Add `bloom_level` field to `Question`; Gemini tags during generation; filter/view by level in instructor dashboard
- **Risk:** AI categorization may be inconsistent across runs

#### F27 — Misconception Detection `Stretch` `Med` `3-5 days` `Deps: F3`
AI analyzes wrong-answer patterns to identify common misconceptions per question

- **Competitors:** No competitor does this well
- **What's Needed:** Wrong-answer distribution analysis; Gemini prompt: "given these wrong answers, what misconception does each represent?"; display on `SessionResults`
- **Risk:** Requires enough responses per question (10+) for meaningful patterns

#### F28 — Q&A Mode with Upvoting `Stretch` `Med` `3-5 days` `No deps`
Live Q&A where students submit and upvote questions

- **Competitors:** Slido, Mentimeter
- **What's Needed:** New session mode; `qa_questions` subcollection; upvote logic; real-time sorting by votes; instructor "answered" toggle
- **Risk:** Scope creep — keep it simple, no threading

#### F29 — True/False Question Type `Stretch` `Low` `1 day` `No deps`
Dedicated True/False prompt type (simplified MCQ)

- **Competitors:** Socrative, Kahoot, iClicker
- **What's Needed:** New `true-false` prompt type; auto-create 2 options; simplified UI in `ResponseDialog`
- **Risk:** None — trivial to implement as MCQ subset

#### F30 — Exit Tickets `Stretch` `Low-Med` `2-3 days` `Deps: F13a`
Formative assessment workflow: quick end-of-class check-in polls

- **Competitors:** Socrative, TopHat
- **What's Needed:** Exit ticket template in F13a; 1-click "Start Exit Ticket" from dashboard; pre-built reflection questions ("What did you learn today?", "What's still unclear?")
- **Risk:** Low — mostly a template + UX flow on top of existing infrastructure

#### F31 — UI Improvements `P1` `Low` `1-2 days` `No deps`
Responsive app bar, NaN-safe score displays, metrics card redesign

- **What Exists:** Nav items (Dashboard, Join Poll, History) inside avatar dropdown menu at all screen sizes; `PollMetricsCard` renders NaN for unscored polls; `SessionGaugeCard`/`ScoreGaugeCard` show broken gauge at 0 for NaN scores
- **What's Needed:**
  - Responsive app bar: nav items inline (text+icons) on desktop, icons-only on medium, back in dropdown on phone
  - Guest responsive app bar: About, Features, FAQs inline; Login/Register stay in dropdown; remove Home
  - NaN/Infinity guards on `PollMetricsCard`, `SessionGaugeCard`, `ScoreGaugeCard` — return null when no valid data
  - `PollMetricsCard` redesign — mean headline + 5-number summary distribution row
- **Action Plan:**
  1. Create `NavItems` component with `useMediaQuery` breakpoints
  2. Create `GuestNavItems` component with same responsive pattern
  3. Update `AppBar` to render `NavItems` and `GuestNavItems` inline
  4. Update `AuthMenuList` and `GuestMenuList` to conditionally show nav items only on phone
  5. Add `isFinite()` guards to gauge and metrics components
  6. Redesign `PollMetricsCard` layout
- **Risk:** None. Pure UI improvements

#### F32 — UI Modernization Phase 2 `P1` `Low-Med` `2-3 days` `No deps` ✅ Done
Glass-morphism app bars, bordered cards, responsive menus, URL-synced history, settings redesign

- **What Was Done:**
  - F32.1 — Glass-morphism on all 5 sub AppBars (poll editor, host session, participant session, session results, submission results) — `elevation={0}`, `backdropFilter: "blur(12px)"`, semi-transparent bg, `borderBottom: 1, borderColor: "divider"`
  - F32.2 — Bordered card pattern on 5 card components (`UserSessionCard`, `QuestionBox`, `AnswerCard`, `PollMetricsCard`, `ScoreCard`) — `border: 1, borderColor: "divider", borderRadius: 2` replacing MUI `Card`/`CardContent`, hover glow on clickable cards
  - F32.3 — Responsive bottom-sheet drawer menus — `SwipeableDrawer` on mobile (`breakpoints.down("sm")`), `Menu` dropdown on desktop; applied to poll editor header menu + main app bar menu; bottom sheet has rounded top corners, drag handle pill, section title
  - F32.4 — Removed medium-breakpoint dot-icon nav — now two states only: desktop text buttons (sm+) and mobile drawer (<sm)
  - F32.5 — Settings screen redesign — GitHub-style single bordered container with horizontal rows (label 140px left, value right), avatar header above
  - F32.6 — History page URL param syncing — tab (`?tab=`), search (`?q=`), sort (`?sort=`), date filter (`?date=`) persisted in URL search params via `useSearchParams`; state restores on refresh
  - F32.7 — Default date filter changed from "All time" to "Last 7 days" for both sessions and submissions
  - F32.8 — Modernized `SubmissionCard`, `PollSessionHistory`, `PollSubmissionHistory`, `MostRecentGaugeCard`, `GuestJoin` — bordered cards, CSS grid layouts, `RA.Fade` animations
- **Files Modified:** `Settings.tsx`, `PollHistory.tsx`, `PollSessionHistory.tsx`, `PollSubmissionHistory.tsx`, `Header.tsx` (×5), `MenuButton.tsx`, `NavItems.tsx`, `UserSessionCard.tsx`, `QuestionBox.tsx`, `AnswerCard.tsx`, `PollMetricsCard.tsx`, `ScoreCard.tsx`, `SubmissionCard.tsx`, `MostRecentGaugeCard.tsx`, `GuestJoin.tsx`

#### F33 — Dashboard Card Redesign + PulseGauge Overhaul `P1` `Low` `1 day` `No deps` ✅ Done
Redesigned dashboard cards and overhauled PulseGauge animation

- **What Was Done:**
  - F33.1 — `UserPollCard` redesign — vertical card with avatar+title row at top (colored avatar via `stoc()`), chip+timestamp at bottom, `minHeight: 140`, hover glow + lift effect
  - F33.2 — `MostRecentGaugeCard` redesign — fetches session data via `getDoc(sub.session)` for class average, question count, participant count; horizontal layout on desktop (gauge left, text right), vertical centered on phone; chips for score %, points, class avg (with TrendingUp/TrendingDown icons), question count, participant count; motivational score message; date display
  - F33.3 — `PulseGauge` animation overhaul — replaced `setTimeout` loop with `requestAnimationFrame` + ease-out cubic easing (1.2s duration); smooth sweep instead of jerky 6ms increments; proper `cancelAnimationFrame` cleanup on unmount
  - F33.4 — `PulseGauge` dynamic score colors — arc color shifts based on score: red (<20), orange (20-40), amber (40-60), light teal (60-80), teal (80+); CSS transition between colors; bold value text
  - F33.5 — `PulseGauge` aspect ratio — changed from `1/1` to `4/3` to reduce vertical dead space above/below the gauge arc
  - F33.6 — Firestore composite index required — `submissions` collection needs composite index on `user` (asc) + `submitted_at` (desc) for most recent submission query
- **Files Modified:** `UserPollCard.tsx`, `MostRecentGaugeCard.tsx`, `PulseGauge.tsx`

#### F34 — Design System Overhaul `P1` `Med-High` `5-8 days` `No deps`
Adopt MUI v7 dashboard/marketing-page template design language across PulseCheck

- **Style Reference:** MUI v7.3.9 templates cloned at `/Users/camposm/Desktop/New-PulseCheck/material-ui/docs/data/material/getting-started/templates/`
  - `dashboard/` — Dashboard layout, cards, charts, data grid styling
  - `marketing-page/` — Landing page, hero, features, pricing patterns
  - `shared-theme/` — Base theme primitives, component customizations
- **Design Language (from MUI templates):**
  - **Color system:** HSL-based 10-step scales (50–900) for brand, gray, semantic colors
  - **Typography:** Inter font, `pxToRem()` sizing, weight progression 400→500→600
  - **Border radius:** 8px global (`theme.shape.borderRadius`)
  - **Cards:** Elevation 0 (flat), border-based (`1px solid divider`), 16px padding/gap
  - **Buttons:** Gradient depth (linear-gradient + inset shadows), no ripple
  - **Inputs:** 8px 12px padding, 40px height, focus = 3px solid brand outline at 50% opacity
  - **Shadows:** HSL-based custom shadows (not MUI defaults)
  - **Dark mode:** CSS variables with `data-mui-color-scheme` selector, prefix `template-`
  - **Transitions:** 100ms ease on cards/buttons, no ripple effects (`disableRipple: true`)
  - **Focus states:** 3px solid outline, 50% brand opacity, 2px offset on all interactive elements
  - **Chips:** 999px radius (pill), color-coded borders
  - **AppBar:** Transparent + `backdropFilter: blur(24px)` (glass-morphism — already adopted in F32)
  - **Responsive:** 2-state nav (desktop inline / mobile drawer), `maxWidth: 1700px` content
- **Color Palette — Teal Primary + Amber/Gold Secondary:**
  - Primary (Teal, ~174° hue): HSL 10-step scale, main at `hsl(174, 80%, 42%)`
  - Secondary (Amber/Gold, ~45° hue): HSL 10-step scale, main at `hsl(45, 95%, 50%)`
  - Gray: Neutral HSL scale (220° hue base) for backgrounds, text, borders
  - Semantic: Green (success), Orange (warning), Red (error) — each with 10-step HSL scales
- **What's Needed:**
  - Create `themePrimitives.ts` with HSL color scales (teal, amber, gray, green, orange, red)
  - Create component customization files: `inputs.ts`, `surfaces.ts`, `navigation.ts`, `dataDisplay.ts`, `feedback.ts`
  - Switch font from Monospace to Inter
  - Apply elevation-0 + border pattern to all cards
  - Standardize button variants (contained primary = gradient, outlined = border, text = minimal)
  - Standardize input focus states (3px brand outline)
  - Add CSS variable theming with `colorSchemeSelector`
  - Update `ThemeProvider` to use new theme structure
- **Action Plan:**
  1. Install Inter font (Google Fonts or `@fontsource/inter`)
  2. Create `src/lib/theme/themePrimitives.ts` — HSL color scales, typography, shadows
  3. Create `src/lib/theme/customizations/` — 5 component override files
  4. Update `ThemeProvider` to compose new theme
  5. Migrate existing components to new design tokens
  6. Test light/dark modes thoroughly
  7. Verify all interactive elements have proper focus states
- **Risk:** Large surface area — touches every component. Do incrementally. Font change may affect layouts

#### F35 — Guest Account Upgrade `Stretch` `Med` `3-5 days` `Deps: F11`
Allow guest participants to upgrade to a registered account after a session, preserving their session data

- **What Exists:** Guests join via anonymous auth; their `SessionUser` doc persists in Firestore for grading/metrics. On tab close or session end, their anonymous auth identity is lost. Guest data is never deleted to preserve session metrics accuracy
- **What's Needed:**
  - Persist guest identity in `localStorage` during session (UID + session info)
  - **Prompt on session finish** — when a guest finishes a poll session, prompt them to register/login to preserve their results
  - Be clear about what the guest gains: "Register to save this poll and your results to your account"
  - **Auth linkage** — link anonymous UID to new account via Firebase Auth account linking (`linkWithCredential`), making the previous poll data accessible under the new account
  - If they register, migrate `SessionUser` docs and `submissions` from anonymous UID to new UID (or keep anonymous UID if Firebase linking preserves it)
  - If they decline or close tab, guest data remains in Firestore under anonymous UID (metrics preserved)
  - Enable rejoin for guests during active session via `localStorage` identity
- **Action Plan:**
  1. Extend `localStorage` session persistence (from F11) to include guest UID
  2. Add post-session registration prompt component (shown after session FINISHED)
  3. Clear messaging: explain what upgrading preserves (this poll + results)
  4. Implement Firebase Auth anonymous-to-permanent account linking
  5. Handle UID migration in Firestore if needed
  6. Add "Save my results" CTA on session results page for guests
- **Risk:** Firebase Auth account linking has edge cases (email already in use, provider conflicts). Needs careful error handling

#### F36 — Host Response Progress `P2` `Low` `1-2 days` `No deps`
Real-time progress bar showing how many participants have answered the current question

- **What Exists:** `UserSessionGrid` shows individual participant cards during session; `session.results` contains response data; `/sessions/{sid}/questions/{qid}/responses/` subcollection tracks individual responses; host can see `waiting_users` count
- **What's Needed:**
  - **Linear progress bar** on the host view showing percentage of participants who have selected an answer for the current question
  - Display format: "12 / 30 responded" + MUI `LinearProgress` bar
  - Count of responses from `/sessions/{sid}/questions/{qid}/responses/` vs total users in `/sessions/{sid}/users/`
  - Real-time updates via Firestore listener on response collection
  - List the participants who have answered (name or avatar) vs those who haven't
- **Action Plan:**
  1. Add `ResponseProgressBar` component with real-time response count listener
  2. Integrate into `PollHost.tsx` below the current question display
  3. Show participant names/avatars who have/haven't responded
  4. Update in real time as responses come in
- **Risk:** Low. Data already exists in Firestore. Listener on responses collection may be chatty with 300 participants — consider snapshot count query

#### F37 — Clone Polls `P2` `Low` `1 day` `No deps`
Duplicate an entire poll (questions + options) into a new poll document

- **What Exists:** PM-6 duplicates a single question within a poll; `api.polls.add()` creates polls; `api.polls.questions.add()` creates questions; `api.polls.questions.options.create()` creates options; no poll-level duplication
- **What's Needed:**
  - "Clone" action in poll editor header menu or dashboard poll card context menu
  - Deep-copy: create new poll doc, then copy all questions and their options into the new poll's subcollections
  - New poll name: `"${original_poll_name} (Copy)"`
  - Clone preserves: questions, options, correct answers, points, prompt types, settings
  - Clone does NOT preserve: sessions, submissions, created_at (gets new timestamp)
- **Action Plan:**
  1. Add `clone(pid: string)` method to `PollStore`
  2. Implement deep copy: read poll → create new poll → iterate questions → create copies → iterate options → create copies
  3. Add "Clone" button to poll editor header menu and/or dashboard card menu
  4. Navigate to new poll editor after clone
- **Risk:** None. Straightforward CRUD operation

#### F38 — Download Poll to PDF `P3` `Med` `2-3 days` `No deps`
Export a poll or session results as a printable PDF document

- **What Exists:** CSV export in poll history (F17.9); no PDF generation; polls and sessions have all data needed
- **What's Needed:**
  - **Poll export** — render all questions + options as a printable PDF (useful for instructors who need a paper backup)
  - **Use case: student without a phone** — instructor prints the poll, student fills it out on paper, instructor manually inputs the student's responses into the poll session to allow for regrading (ties into F42)
  - Client-side PDF generation via a library (e.g., `jspdf`, `react-pdf`, or `@react-pdf/renderer`)
  - "Download PDF" button in poll editor header and/or session results header
  - PDF layout: poll title, date, questions numbered with options (A/B/C/D), answer blanks for paper submissions
- **Action Plan:**
  1. Install PDF generation library (`@react-pdf/renderer` or `jspdf`)
  2. Build `PollPDFDocument` component rendering poll structure
  3. Add "Download PDF" button to poll editor header
  4. Optional: session results PDF with charts (stretch)
- **Risk:** PDF styling is fiddly. Keep the layout simple — focus on printability over aesthetics

#### F39 — Cloud Poll Session Settings `P3` `Low` `1-2 days` `No deps`
Persist poll session default settings (leaderboard, anonymous, timer) in Firestore user profile instead of localStorage

- **What Exists:** `PreSessionConfig.tsx` stores poll session settings (leaderboard toggle, anonymous toggle, timer) in `localStorage`; settings are device-local and don't sync across devices
- **What's Needed:**
  - Move remembered poll session settings from `localStorage` to Firestore under the user's document (e.g., `users/{uid}/preferences/poll_session`)
  - Settings sync across all devices the user logs into
  - Add a "Poll Session Defaults" section in the Settings page (`/settings`) where the user can edit their default session configuration
  - Fallback to `localStorage` if Firestore read fails (offline resilience)
- **Action Plan:**
  1. Add `session_defaults` field to `User` type (or a `preferences` subcollection)
  2. Update `PreSessionConfig.tsx` to read/write from Firestore instead of localStorage
  3. Add "Poll Session Defaults" section to `Settings.tsx`
  4. Migrate existing localStorage settings on first login after update
- **Risk:** Low. Minor Firestore schema addition. Must handle offline gracefully

#### F40 — Question Bank `P2` `Med-High` `4-6 days` `Deps: F13a`
Allow users to create reusable question banks that can be used to quickly populate polls

- **What Exists:** Polls contain questions; AI generates questions from PDFs; F13a provides poll templates; no standalone question repository
- **What's Needed:**
  - **Question bank** — a named collection of questions owned by a user, stored as a Firestore collection (`/users/{uid}/question_banks/{bid}/questions/{qid}`)
  - Questions can be batched into a bank (bulk add)
  - When creating/editing a poll, user can "Import from Question Bank" to pick individual questions or entire banks
  - Works in conjunction with F13a (Poll Templates) — templates + question banks = rapid poll creation
  - Questions in a bank have same structure as poll questions (prompt, options, correct answers, points, prompt_type)
  - Bank management UI: create, rename, delete banks; add/remove/reorder questions within a bank
- **Action Plan:**
  1. Define `QuestionBank` and `BankQuestion` types
  2. Create Firestore collection structure under user doc
  3. Build `QuestionBankStore` with CRUD methods
  4. Build `QuestionBankManager` page/dialog for managing banks
  5. Build `ImportFromBankDialog` for poll editor
  6. Add "Save to Bank" action on individual poll questions
  7. Integrate with poll editor header menu
- **Risk:** Additional Firestore reads when importing. Keep bank size reasonable (<100 questions). UI complexity for bank management

#### F41 — Question Difficulty Ranking `P2` `Low-Med` `2-3 days` `No deps`
Statistical ranking of questions by participant difficulty after a session completes

- **What Exists:** `SessionQuestionResults` has per-question response aggregates (barchart, piechart); `SessionResponse.correct` tracks correctness per user; `finishSession` Cloud Function iterates all questions and responses
- **What's Needed:**
  - After a session finishes, compute per-question statistics: % correct, % incorrect, average response time
  - Rank questions from most difficult (lowest % correct) to easiest
  - Display on `PollSessionResults` as a "Question Difficulty" card/accordion
  - Help instructors identify which concepts students struggled with most
  - Store difficulty stats in session doc or as a computed view
- **Action Plan:**
  1. Extend `finishSession` (or add post-processing) to compute per-question % correct
  2. Store as `question_stats: { qid: string, prompt: string, percent_correct: number, avg_response_time: number }[]` on session doc
  3. Build `QuestionDifficultyCard` component (sorted bar chart or ranked list)
  4. Add to `PollSessionResults.tsx`
- **Risk:** Low. Data already exists — just needs aggregation

#### F42 — Host Edit Ended Session `P2` `Med` `3-5 days` `No deps`
Allow host to edit a finished session's questions/options and trigger automatic regrading

- **What Exists:** Sessions deep-copy poll questions/options at start time; `finishSession` Cloud Function grades all responses and creates submissions; `computeLeaderboard` Cloud Function calculates speed-based scores; session questions/options are independent Firestore docs
- **What's Needed:**
  - **Edit UI** — full-screen dialog on `PollSessionResults` page allowing the host to edit question prompts, option text, correct answer toggles, and point values for a FINISHED session
  - **Cosmetic edits** (typo fixes) — direct Firestore update on session question/option docs
  - **Grade-affecting edits** (correct answer change, point value change) — trigger a `regradeSession` Cloud Function that:
    1. Re-evaluates every response's `correct` boolean against updated correct options
    2. Recalculates every user's total score
    3. Updates all `Submission` docs (score, max_score, score_100)
    4. Recomputes `SessionSummary` metrics (average, median, quartiles)
    5. Replays leaderboard scoring if enabled
  - Edits do NOT propagate back to the original poll (session is an independent copy)
  - Cannot add/remove questions or options, cannot change prompt type
- **Action Plan:**
  1. Add `update()` methods to session `QuestionStore` and `OptionStore`
  2. Create `regradeSession` Cloud Function (auth check, re-grade, recompute scores/metrics/leaderboard)
  3. Add `regrade()` client method to `SessionStore`
  4. Build `EditSessionDialog` component
  5. Add "Edit" button to session results `Header`
  6. Wire into `PollSessionResults.tsx` with live data refresh
- **Risk:** Batch write limits (500 ops) for large sessions — chunk batches. Leaderboard replay must process all questions in order. Partial update visibility during regrade is acceptable for MVP

### Competitive Positioning

**Competitors reviewed:** Kahoot, Poll Everywhere, Mentimeter, iClicker, Slido, Socrative, Wooclap, TopHat

**PulseCheck's existing differentiators:**
1. **AI Question Generation from Lecture Materials** — No competitor offers: upload PDF/image of lecture slides → AI generates relevant MCQs automatically. This is PulseCheck's strongest unique feature.
2. **Free, zero-cost-to-students model** — iClicker ($15-55/student) and TopHat ($30-130/course) charge students directly. PulseCheck has zero friction.
3. **Purpose-built for large lecture halls** — Unlike Kahoot (gamification-first) or Mentimeter (presentation-first).

**The Big Question — Answered:**

> *"PulseCheck is the only classroom polling tool that uses AI to close the loop between lecture content and student understanding. While other tools help you **ask** questions, PulseCheck helps you **know what to ask** by generating questions directly from your lecture materials — and then tells you **what students actually learned** through AI-powered misconception analysis and learning analytics."*

The competitive landscape breaks into three camps:
- **Engagement-first** (Kahoot, Mentimeter) — fun but shallow pedagogically
- **Infrastructure-first** (iClicker, Poll Everywhere, TopHat) — reliable but expensive and not AI-native
- **Interaction-first** (Slido, Wooclap, Socrative) — good participation tools but no deep analytics

PulseCheck owns a fourth camp: **Intelligence-first** — AI generates the questions, AI analyzes the results, AI identifies what students don't understand. The instructor's job shifts from "create quiz, review scores" to "upload slides, receive insights." This positions PulseCheck not as another polling app, but as an **AI teaching assistant that uses real-time polling as its data collection mechanism.**