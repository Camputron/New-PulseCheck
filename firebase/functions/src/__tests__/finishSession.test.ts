/**
 * finishSession integration test.
 *
 * Runs against the Firestore emulator. The CI workflow wraps this suite in
 * `firebase emulators:exec`, which sets FIRESTORE_EMULATOR_HOST and tears the
 * emulator down on exit.
 *
 * To run locally:
 *   cd firebase/functions
 *   firebase emulators:exec --only firestore "npm test"
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import functionsTestInit from "firebase-functions-test"
import * as admin from "firebase-admin"

const PROJECT_ID = "pulsecheck-functions-test"

const test = functionsTestInit({ projectId: PROJECT_ID })

if (!admin.apps.length) {
  admin.initializeApp({ projectId: PROJECT_ID })
}

const db = admin.firestore()

let finishSession: (typeof import("../index.js"))["finishSession"]

const SESSION_ID = "session-test-1"
const HOST_UID = "host-uid"
const P1_UID = "p1"
const P2_UID = "p2"
const P3_UID = "p3"

beforeAll(async () => {
  ;({ finishSession } = await import("../index.js"))
})

afterAll(() => {
  test.cleanup()
})

async function clearFirestore() {
  // Recursively delete every doc under this project's database. The emulator
  // exposes a REST endpoint for this but using the Admin SDK keeps the test
  // self-contained.
  const collections = await db.listCollections()
  for (const c of collections) {
    const docs = await c.listDocuments()
    await Promise.all(docs.map((d) => db.recursiveDelete(d)))
  }
}

beforeEach(async () => {
  await clearFirestore()
})

async function seedSession(opts: {
  participantsCorrectness: Record<string, boolean[]>
}) {
  // Two questions, 5 points each → max_score = 10.
  const sessionRef = db.doc(`sessions/${SESSION_ID}`)
  const q1Ref = db.doc(`sessions/${SESSION_ID}/questions/q1`)
  const q2Ref = db.doc(`sessions/${SESSION_ID}/questions/q2`)

  await q1Ref.set({ prompt: "Q1", prompt_type: "multiple-choice", points: 5 })
  await q2Ref.set({ prompt: "Q2", prompt_type: "multiple-choice", points: 5 })

  await sessionRef.set({
    title: "Test Session",
    code: "TEST01",
    host: db.doc(`users/${HOST_UID}`),
    state: "done",
    questions: [q1Ref, q2Ref],
    summary: { max_score: 10 },
  })

  for (const [uid, correctness] of Object.entries(
    opts.participantsCorrectness,
  )) {
    await db.doc(`sessions/${SESSION_ID}/users/${uid}`).set({
      user: db.doc(`users/${uid}`),
      display_name: `User ${uid}`,
      photo_url: null,
    })
    await db
      .doc(`sessions/${SESSION_ID}/questions/q1/responses/${uid}`)
      .set({ user: db.doc(`users/${uid}`), choices: [], correct: correctness[0] })
    await db
      .doc(`sessions/${SESSION_ID}/questions/q2/responses/${uid}`)
      .set({ user: db.doc(`users/${uid}`), choices: [], correct: correctness[1] })
  }
}

async function callFinish(uid: string) {
  // firebase-functions-test wraps the v2 callable. Invoking it calls the
  // underlying handler with a synthetic CallableRequest.
  const wrapped = test.wrap(finishSession)
  return await wrapped({
    data: { sessionId: SESSION_ID },
    auth: { uid, token: { uid } as never, rawToken: "" } as never,
  } as never)
}

describe("finishSession", () => {
  it("rejects callers that are not the session host", async () => {
    await seedSession({ participantsCorrectness: { [P1_UID]: [true, true] } })
    await expect(callFinish(P1_UID)).rejects.toThrow(/Only the host/)
  })

  it("scores participants based on their pre-graded responses", async () => {
    await seedSession({
      participantsCorrectness: {
        [P1_UID]: [true, true], //   10 / 10 → 100
        [P2_UID]: [true, false], //   5 / 10 →  50
        [P3_UID]: [false, false], //  0 / 10 →   0
      },
    })

    await callFinish(HOST_UID)

    const submissionsSnap = await db
      .collection("submissions")
      .where("session", "==", db.doc(`sessions/${SESSION_ID}`))
      .get()

    const byUid: Record<string, FirebaseFirestore.DocumentData> = {}
    for (const d of submissionsSnap.docs) {
      const data = d.data()
      const uid = data.user.path.split("/")[1]
      byUid[uid] = data
    }

    expect(byUid[P1_UID].score).toBe(10)
    expect(byUid[P1_UID].score_100).toBe(100)
    expect(byUid[P2_UID].score).toBe(5)
    expect(byUid[P2_UID].score_100).toBe(50)
    expect(byUid[P3_UID].score).toBe(0)
    expect(byUid[P3_UID].score_100).toBe(0)
  })

  it("transitions session state to finished and writes aggregate metrics", async () => {
    await seedSession({
      participantsCorrectness: {
        [P1_UID]: [true, true], //   10
        [P2_UID]: [true, false], //   5
        [P3_UID]: [false, false], //  0
      },
    })

    await callFinish(HOST_UID)

    const sessionSnap = await db.doc(`sessions/${SESSION_ID}`).get()
    const session = sessionSnap.data()!
    expect(session.state).toBe("finished")
    expect(session.summary.total_participants).toBe(3)
    expect(session.summary.average).toBe(5) // (10 + 5 + 0) / 3
    expect(session.summary.median).toBe(5)
    expect(session.summary.low).toBe(0)
    expect(session.summary.high).toBe(10)
  })

  it("creates an empty response for participants who never answered a question", async () => {
    // P1 has responses for both questions; we manually delete one to simulate
    // a participant who never answered.
    await seedSession({
      participantsCorrectness: { [P1_UID]: [true, true] },
    })
    await db
      .doc(`sessions/${SESSION_ID}/questions/q2/responses/${P1_UID}`)
      .delete()

    await callFinish(HOST_UID)

    const filledSnap = await db
      .doc(`sessions/${SESSION_ID}/questions/q2/responses/${P1_UID}`)
      .get()
    expect(filledSnap.exists).toBe(true)
    expect(filledSnap.data()!.correct).toBe(false)
    expect(filledSnap.data()!.choices).toEqual([])

    const subSnap = await db
      .collection("submissions")
      .where("session", "==", db.doc(`sessions/${SESSION_ID}`))
      .get()
    expect(subSnap.docs[0].data().score).toBe(5) // q1 only
  })
})
