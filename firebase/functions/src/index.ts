import { setGlobalOptions } from "firebase-functions"
import { onCall, HttpsError } from "firebase-functions/v2/https"
import * as logger from "firebase-functions/logger"
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai"
import { initializeApp } from "firebase-admin/app"
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
