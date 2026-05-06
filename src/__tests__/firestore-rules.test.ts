/**
 * Firestore security rules tests.
 *
 * Runs against the local Firestore emulator. The CI workflow wraps this
 * suite in `firebase emulators:exec`, which spins up the emulator, sets
 * FIRESTORE_EMULATOR_HOST, runs the tests, and tears the emulator down.
 *
 * To run locally:
 *   firebase emulators:exec --only firestore "yarn test:emulator"
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { readFileSync } from "fs"
import { resolve } from "path"
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"

const PROJECT_ID = "pulsecheck-rules-test"
const RULES_PATH = resolve(__dirname, "../../firebase/config/firestore.rules")

const HOST_UID = "host-uid"
const PARTICIPANT_UID = "participant-uid"
const OTHER_UID = "other-uid"
const POLL_ID = "poll-1"
const SESSION_ID = "session-1"
const QUESTION_ID = "q-1"

let env: RulesTestEnvironment

const userPath = (uid: string) => `/users/${uid}`

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(RULES_PATH, "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  })
})

afterAll(async () => {
  await env.cleanup()
})

beforeEach(async () => {
  await env.clearFirestore()
  // Seed parent docs with security rules disabled. Subsequent test writes go
  // through the rule-checked clients.
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await setDoc(doc(db, "polls", POLL_ID), {
      title: "Sample",
      owner: doc(db, userPath(HOST_UID)),
    })
    await setDoc(doc(db, "sessions", SESSION_ID), {
      code: "ABC123",
      host: doc(db, userPath(HOST_UID)),
      state: "OPEN",
    })
    // Mark PARTICIPANT_UID as a session member so participant-scoped rules
    // (questions read, response create) succeed for them.
    await setDoc(doc(db, "sessions", SESSION_ID, "users", PARTICIPANT_UID), {
      user: doc(db, userPath(PARTICIPANT_UID)),
      name: "P1",
    })
    await setDoc(doc(db, "sessions", SESSION_ID, "questions", QUESTION_ID), {
      prompt: "What?",
      prompt_type: "multiple-choice",
    })
    await setDoc(doc(db, "submissions", "sub-1"), {
      user: doc(db, userPath(PARTICIPANT_UID)),
      session: doc(db, "sessions", SESSION_ID),
      score: 5,
    })
  })
})

describe("/users/{uid}", () => {
  it("owner can read their own profile", async () => {
    const db = env.authenticatedContext(HOST_UID).firestore()
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", HOST_UID), { name: "H" })
    })
    await assertSucceeds(getDoc(doc(db, "users", HOST_UID)))
  })

  it("a different user cannot read someone else's profile", async () => {
    const db = env.authenticatedContext(OTHER_UID).firestore()
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", HOST_UID), { name: "H" })
    })
    await assertFails(getDoc(doc(db, "users", HOST_UID)))
  })

  it("nobody can delete a user — not even the owner", async () => {
    const db = env.authenticatedContext(HOST_UID).firestore()
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users", HOST_UID), { name: "H" })
    })
    await assertFails(deleteDoc(doc(db, "users", HOST_UID)))
  })
})

describe("/polls/{pid}", () => {
  it("creator can update their own poll", async () => {
    const db = env.authenticatedContext(HOST_UID).firestore()
    await assertSucceeds(
      setDoc(
        doc(db, "polls", POLL_ID),
        {
          title: "Renamed",
          owner: doc(db, userPath(HOST_UID)),
        },
        { merge: true },
      ),
    )
  })

  it("non-creator cannot update a poll", async () => {
    const db = env.authenticatedContext(OTHER_UID).firestore()
    await assertFails(
      setDoc(
        doc(db, "polls", POLL_ID),
        {
          title: "Hijacked",
          owner: doc(db, userPath(OTHER_UID)),
        },
        { merge: true },
      ),
    )
  })
})

describe("/sessions/{sid}/questions/{qid}/responses/{uid}", () => {
  it("participant can write their own response", async () => {
    const db = env.authenticatedContext(PARTICIPANT_UID).firestore()
    await assertSucceeds(
      setDoc(
        doc(
          db,
          "sessions",
          SESSION_ID,
          "questions",
          QUESTION_ID,
          "responses",
          PARTICIPANT_UID,
        ),
        {
          user: doc(db, userPath(PARTICIPANT_UID)),
          choices: [],
        },
      ),
    )
  })

  it("participant cannot write a response under someone else's uid", async () => {
    const db = env.authenticatedContext(PARTICIPANT_UID).firestore()
    await assertFails(
      setDoc(
        doc(
          db,
          "sessions",
          SESSION_ID,
          "questions",
          QUESTION_ID,
          "responses",
          OTHER_UID,
        ),
        {
          user: doc(db, userPath(PARTICIPANT_UID)),
          choices: [],
        },
      ),
    )
  })
})

describe("/submissions/{subid}", () => {
  it("client cannot create a submission (Cloud Function only)", async () => {
    const db = env.authenticatedContext(HOST_UID).firestore()
    await assertFails(
      setDoc(doc(db, "submissions", "sub-new"), {
        user: doc(db, userPath(HOST_UID)),
        session: doc(db, "sessions", SESSION_ID),
        score: 10,
      }),
    )
  })

  it("client cannot update an existing submission", async () => {
    const db = env.authenticatedContext(PARTICIPANT_UID).firestore()
    await assertFails(
      setDoc(doc(db, "submissions", "sub-1"), { score: 999 }, { merge: true }),
    )
  })

  it("submission owner can read their own submission", async () => {
    const db = env.authenticatedContext(PARTICIPANT_UID).firestore()
    await assertSucceeds(getDoc(doc(db, "submissions", "sub-1")))
  })
})
