import { setGlobalOptions } from "firebase-functions"
import { onCall, HttpsError } from "firebase-functions/v2/https"
import * as logger from "firebase-functions/logger"
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai"
import { initializeApp } from "firebase-admin/app"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

const admin = initializeApp()

setGlobalOptions({ maxInstances: 10 })

// ── Types ────────────────────────────────────────────────────────────────────

interface AIQuestion {
  question: string
  options: string[]
  correct_answer: string
}

interface GenerateQuestionsRequest {
  n: number
  uri: string
}

interface FinishSessionRequest {
  sessionId: string
}

// ── Vertex AI Setup ──────────────────────────────────────────────────────────

const vertexAI = new VertexAI({
  project: "new-pulsecheck",
  location: "us-central1",
})

const model = vertexAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.2,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: `You are an educational assessment expert specializing in 
        multiple-choice question generation.

Rules:
- Each question must have exactly 4 unique options
- Exactly one option must be the correct answer
- The correct_answer field must exactly match one of the options
- Options should be plausible — avoid obviously wrong distractors
- Questions should test understanding, not just recall
- Keep questions clear and unambiguous`,
      },
    ],
  },
})

// ── Validation ───────────────────────────────────────────────────────────────

function validateQuestions(questions: AIQuestion[]): string | null {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    if (!q.question || typeof q.question !== "string") {
      return `Question ${i + 1}: missing or invalid question text`
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return `Question ${i + 1}: must have exactly 4 options`
    }
    const uniqueOptions = new Set(q.options)
    if (uniqueOptions.size !== 4) {
      return `Question ${i + 1}: options must be unique`
    }
    if (!q.options.includes(q.correct_answer)) {
      return `Question ${i + 1}: correct_answer must match one of the options`
    }
  }
  return null
}

// ── Callable Function ────────────────────────────────────────────────────────

export const generateQuestions = onCall<GenerateQuestionsRequest>(
  { timeoutSeconds: 120, memory: "512MiB" },
  async (request) => {
    // Auth check
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Must be signed in to generate questions"
      )
    }

    const { n, uri } = request.data
    const MIN_QUESTIONS = 1
    const MAX_QUESTIONS = 20

    // Input validation
    if (!n || typeof n !== "number" || n < MIN_QUESTIONS || n > MAX_QUESTIONS) {
      throw new HttpsError(
        "invalid-argument",
        `n must be a number between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}`
      )
    }
    if (!uri || typeof uri !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "uri must be a valid Cloud Storage URI"
      )
    }

    const prompt = `Generate ${n} multiple-choice questions from the 
    following document. Return a JSON array where each object has 
    "question" (string), "options" (array of exactly 4 strings), and 
    "correct_answer" (string matching one of the options).`

    // In emulator: download file and send inline (Gemini can't access local storage)
    // In production: pass gs:// URI directly (Gemini fetches from GCS)
    const isEmulator = process.env.FUNCTIONS_EMULATOR === "true"
    let filePart:
      | { inlineData: { mimeType: string; data: string } }
      | { fileData: { mimeType: string; fileUri: string } }

    if (isEmulator) {
      const match = uri.match(/^gs:\/\/([^/]+)\/(.+)$/)
      if (!match) {
        throw new HttpsError("invalid-argument", "Invalid gs:// URI format")
      }
      const [, bucket, filePath] = match
      const file = getStorage(admin).bucket(bucket).file(filePath)
      const [fileBuffer] = await file.download()
      filePart = {
        inlineData: {
          mimeType: "application/pdf",
          data: fileBuffer.toString("base64"),
        },
      }
    } else {
      filePart = {
        fileData: { mimeType: "application/pdf", fileUri: uri },
      }
    }

    const maxAttempts = 3
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }, filePart],
            },
          ],
        })

        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) {
          throw new Error("Empty response from Gemini")
        }

        const questions: AIQuestion[] = JSON.parse(text)
        const validationError = validateQuestions(questions)

        if (validationError) {
          logger.warn(
            `Attempt ${attempt}/${maxAttempts} validation failed: ${validationError}`
          )
          if (attempt === maxAttempts) {
            throw new HttpsError(
              "internal",
              `AI generated invalid questions after ${maxAttempts} 
              attempts: ${validationError}`
            )
          }
          continue
        }

        logger.info(
          `Generated ${questions.length} questions for user ${request.auth.uid}`,
          { attempt }
        )
        return { questions }
      } catch (err) {
        if (err instanceof HttpsError) throw err

        logger.error(`Attempt ${attempt}/${maxAttempts} failed:`, err)
        if (attempt === maxAttempts) {
          throw new HttpsError(
            "internal",
            "Failed to generate questions. Please try again."
          )
        }
      }
    }

    // Should never reach here, but TypeScript needs it
    throw new HttpsError("internal", "Unexpected error")
  }
)

// ── Grading Helpers ─────────────────────────────────────────────────────────

function getMedian(arr: number[]): number {
  const len = arr.length
  const mid = Math.floor(len / 2)
  if (len % 2 === 0) {
    return (arr[mid - 1] + arr[mid]) / 2
  } else {
    return arr[mid]
  }
}

function calcMetrics(scores: number[], maxScore: number) {
  if (scores.length <= 0) {
    return {
      average: 0,
      average_100: 0,
      low: 0,
      low_100: 0,
      high: 0,
      high_100: 0,
      median: 0,
      median_100: 0,
      lower_quartile: 0,
      lower_quartile_100: 0,
      upper_quartile: 0,
      upper_quartile_100: 0,
    }
  }
  const sorted = [...scores].sort((a, b) => a - b)
  const sum = scores.reduce((acc, val) => acc + val, 0)
  const average = sum / scores.length
  const median = getMedian(sorted)
  let lower_quartile = 0
  let upper_quartile = 0
  if (sorted.length === 1) {
    lower_quartile = sorted[0]
    upper_quartile = sorted[0]
  } else {
    const mid = Math.floor(sorted.length / 2)
    const lowerHalf = sorted.slice(0, mid)
    const upperHalf =
      sorted.length % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1)
    lower_quartile = getMedian(lowerHalf)
    upper_quartile = getMedian(upperHalf)
  }
  const low = sorted[0]
  const high = sorted[sorted.length - 1]
  return {
    average,
    average_100: (average / maxScore) * 100,
    low,
    low_100: (low / maxScore) * 100,
    high,
    high_100: (high / maxScore) * 100,
    median,
    median_100: (median / maxScore) * 100,
    lower_quartile,
    lower_quartile_100: (lower_quartile / maxScore) * 100,
    upper_quartile,
    upper_quartile_100: (upper_quartile / maxScore) * 100,
  }
}

// ── Finish Session ──────────────────────────────────────────────────────────

export const finishSession = onCall<FinishSessionRequest>(
  { timeoutSeconds: 60, memory: "256MiB" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in")
    }
    const uid = request.auth.uid
    const { sessionId } = request.data

    if (!sessionId || typeof sessionId !== "string") {
      throw new HttpsError("invalid-argument", "sessionId is required")
    }

    const db = getFirestore()
    const sessionRef = db.doc(`sessions/${sessionId}`)
    const sessionSnap = await sessionRef.get()

    if (!sessionSnap.exists) {
      throw new HttpsError("not-found", `Session ${sessionId} not found`)
    }

    const session = sessionSnap.data()!

    // Verify caller is the session host
    if (session.host.path !== `users/${uid}`) {
      throw new HttpsError(
        "permission-denied",
        "Only the host can finish a session"
      )
    }

    // Validate session is in DONE state
    if (session.state !== "done") {
      throw new HttpsError(
        "failed-precondition",
        `Session state must be "done", got "${session.state}"`
      )
    }

    // Fetch all users in session
    const usersSnap = await db
      .collection(`sessions/${sessionId}/users`)
      .get()
    const users = usersSnap.docs

    // Resolve all session question docs
    const questionRefs: FirebaseFirestore.DocumentReference[] =
      session.questions || []
    const questionSnaps = await Promise.all(
      questionRefs.map((ref) => ref.get())
    )

    // Score each user
    const maxScore: number = session.summary?.max_score ?? 0
    const scores: number[] = []

    for (const userDoc of users) {
      let score = 0
      const participantUid = userDoc.id
      const userData = userDoc.data()!

      for (const qSnap of questionSnaps) {
        if (!qSnap.exists) continue
        const question = qSnap.data()!
        const qid = qSnap.id

        const responseRef = db.doc(
          `sessions/${sessionId}/questions/${qid}/responses/${participantUid}`
        )
        const responseSnap = await responseRef.get()

        if (!responseSnap.exists) {
          // User didn't answer — create empty response
          await responseRef.set({
            user: db.doc(`users/${participantUid}`),
            choices: [],
            correct: false,
            created_at: FieldValue.serverTimestamp(),
          })
        } else {
          const response = responseSnap.data()!
          if (response.correct) {
            score += question.points
          }
        }
      }

      // Create top-level submission doc
      const submissionRef = await db.collection("submissions").add({
        title: session.title,
        user: db.doc(`users/${participantUid}`),
        display_name: userData.display_name,
        photo_url: userData.photo_url ?? null,
        email: null,
        session: sessionRef,
        score,
        max_score: maxScore,
        score_100: maxScore > 0 ? (score / maxScore) * 100 : 0,
        submitted_at: FieldValue.serverTimestamp(),
      })

      // Create pointer in session's submissions subcollection
      await db
        .doc(`sessions/${sessionId}/submissions/${participantUid}`)
        .set({ ref: submissionRef })

      scores.push(score)
    }

    // Compute metrics and finalize session
    const metrics = calcMetrics(scores, maxScore)
    await sessionRef.set(
      {
        summary: {
          ...metrics,
          total_participants: users.length,
          max_score: maxScore,
        },
        state: "finished",
      },
      { merge: true }
    )

    logger.info(`Session ${sessionId} finished by host ${uid}`, {
      participants: users.length,
      maxScore,
    })

    return { success: true }
  }
)
