/**
 * Firestore Seed Script
 *
 * Populates Firestore with realistic dummy data for PulseCheck.
 * Works with both emulators and production.
 *
 * Usage:
 *   # Emulator (default):
 *   npx ts-node src/seed.ts
 *
 *   # Production:
 *   npx ts-node src/seed.ts --prod
 *
 *   # Clean existing seed data before seeding:
 *   npx ts-node src/seed.ts --clean
 */

import * as admin from "firebase-admin"

const USE_PROD = process.argv.includes("--prod")
const CLEAN = process.argv.includes("--clean")

const PROJECT_ID = "new-pulsecheck"

if (!USE_PROD) {
  process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099"
}

admin.initializeApp({ projectId: PROJECT_ID })
const db = admin.firestore()
const authAdmin = admin.auth()
const ts = admin.firestore.Timestamp.now

const SEED_PASSWORD = "pulsecheck123"

const USERS = [
  {
    id: "seed-user-instructor",
    display_name: "Dr. Smith",
    email: "smith@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-1",
    display_name: "Alice Johnson",
    email: "alice@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-2",
    display_name: "Bob Williams",
    email: "bob@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-3",
    display_name: "Carlos Rivera",
    email: "carlos@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-4",
    display_name: "Diana Chen",
    email: "diana@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-5",
    display_name: "Ethan Park",
    email: "ethan@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-6",
    display_name: "Fiona Garcia",
    email: "fiona@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-7",
    display_name: "George Kim",
    email: "george@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-8",
    display_name: "Hannah Lee",
    email: "hannah@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-9",
    display_name: "Isaac Patel",
    email: "isaac@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-10",
    display_name: "Julia Santos",
    email: "julia@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-11",
    display_name: "Kevin Nguyen",
    email: "kevin@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-12",
    display_name: "Laura Thompson",
    email: "laura@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-13",
    display_name: "Marcus Brown",
    email: "marcus@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-14",
    display_name: "Nina Volkov",
    email: "nina@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-15",
    display_name: "Oscar Hernandez",
    email: "oscar@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-16",
    display_name: "Priya Sharma",
    email: "priya@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-17",
    display_name: "Quinn O'Brien",
    email: "quinn@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-18",
    display_name: "Rachel Wu",
    email: "rachel@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-19",
    display_name: "Sam Jackson",
    email: "sam@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-20",
    display_name: "Tanya Ivanova",
    email: "tanya@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-21",
    display_name: "Umar Farouk",
    email: "umar@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-22",
    display_name: "Victoria Chang",
    email: "victoria@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-23",
    display_name: "William Davis",
    email: "william@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-24",
    display_name: "Xena Morales",
    email: "xena@university.edu",
    photo_url: null,
  },
  {
    id: "seed-user-student-25",
    display_name: "Yusuf Ahmed",
    email: "yusuf@university.edu",
    photo_url: null,
  },
]

const POLLS = [
  {
    id: "seed-poll-cs101",
    title: "CS 101 - Midterm Review",
    async: false,
    anonymous: false,
    time: 30,
    questions: [
      {
        id: "seed-q-cs101-1",
        prompt_type: "multiple-choice" as const,
        prompt: "What is the time complexity of binary search?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 30,
        options: [
          { id: "seed-o-1a", text: "O(n)", correct: false },
          { id: "seed-o-1b", text: "O(log n)", correct: true },
          { id: "seed-o-1c", text: "O(n log n)", correct: false },
          { id: "seed-o-1d", text: "O(1)", correct: false },
        ],
      },
      {
        id: "seed-q-cs101-2",
        prompt_type: "multiple-choice" as const,
        prompt: "Which data structure uses FIFO ordering?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 30,
        options: [
          { id: "seed-o-2a", text: "Stack", correct: false },
          { id: "seed-o-2b", text: "Queue", correct: true },
          { id: "seed-o-2c", text: "Binary Tree", correct: false },
          { id: "seed-o-2d", text: "Hash Map", correct: false },
        ],
      },
      {
        id: "seed-q-cs101-3",
        prompt_type: "multi-select" as const,
        prompt: "Which of the following are valid sorting algorithms?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 45,
        options: [
          { id: "seed-o-3a", text: "Merge Sort", correct: true },
          { id: "seed-o-3b", text: "Quick Sort", correct: true },
          { id: "seed-o-3c", text: "Slow Sort", correct: false },
          { id: "seed-o-3d", text: "Bubble Sort", correct: true },
        ],
      },
    ],
  },
  {
    id: "seed-poll-history",
    title: "US History - Chapter 5 Quiz",
    async: true,
    anonymous: true,
    time: null,
    questions: [
      {
        id: "seed-q-hist-1",
        prompt_type: "multiple-choice" as const,
        prompt: "In what year was the Declaration of Independence signed?",
        prompt_img: null,
        points: 5,
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-h1a", text: "1774", correct: false },
          { id: "seed-o-h1b", text: "1776", correct: true },
          { id: "seed-o-h1c", text: "1778", correct: false },
          { id: "seed-o-h1d", text: "1780", correct: false },
        ],
      },
      {
        id: "seed-q-hist-2",
        prompt_type: "multiple-choice" as const,
        prompt: "Who was the first President of the United States?",
        prompt_img: null,
        points: 5,
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-h2a", text: "Thomas Jefferson", correct: false },
          { id: "seed-o-h2b", text: "John Adams", correct: false },
          { id: "seed-o-h2c", text: "George Washington", correct: true },
          { id: "seed-o-h2d", text: "Benjamin Franklin", correct: false },
        ],
      },
    ],
  },
  {
    id: "seed-poll-bio",
    title: "Biology 201 - Cell Structure",
    async: false,
    anonymous: false,
    time: 60,
    questions: [
      {
        id: "seed-q-bio-1",
        prompt_type: "multiple-choice" as const,
        prompt: "What organelle is known as the 'powerhouse of the cell'?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 20,
        options: [
          { id: "seed-o-b1a", text: "Nucleus", correct: false },
          { id: "seed-o-b1b", text: "Mitochondria", correct: true },
          { id: "seed-o-b1c", text: "Ribosome", correct: false },
          { id: "seed-o-b1d", text: "Golgi Apparatus", correct: false },
        ],
      },
      {
        id: "seed-q-bio-2",
        prompt_type: "ranking-poll" as const,
        prompt: "Rank these cell structures from smallest to largest",
        prompt_img: null,
        points: 15,
        anonymous: false,
        time: 45,
        options: [
          { id: "seed-o-b2a", text: "Ribosome", correct: true },
          { id: "seed-o-b2b", text: "Mitochondria", correct: true },
          { id: "seed-o-b2c", text: "Nucleus", correct: true },
          { id: "seed-o-b2d", text: "Cell", correct: true },
        ],
      },
      {
        id: "seed-q-bio-3",
        prompt_type: "multi-select" as const,
        prompt:
          "Which of the following are found in " +
          "plant cells but NOT animal cells?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 30,
        options: [
          { id: "seed-o-b3a", text: "Cell Wall", correct: true },
          { id: "seed-o-b3b", text: "Chloroplast", correct: true },
          { id: "seed-o-b3c", text: "Mitochondria", correct: false },
          { id: "seed-o-b3d", text: "Central Vacuole", correct: true },
        ],
      },
    ],
  },
  // Ungraded poll — all questions worth 0 points (opinion/feedback poll)
  {
    id: "seed-poll-feedback",
    title: "Course Feedback - Mid-Semester",
    async: true,
    anonymous: true,
    time: null,
    questions: [
      {
        id: "seed-q-fb-1",
        prompt_type: "multiple-choice" as const,
        prompt: "How would you rate the pace of the course so far?",
        prompt_img: null,
        points: 0,
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-fb1a", text: "Too slow", correct: false },
          { id: "seed-o-fb1b", text: "Just right", correct: false },
          { id: "seed-o-fb1c", text: "Too fast", correct: false },
          { id: "seed-o-fb1d", text: "Varies by topic", correct: false },
        ],
      },
      {
        id: "seed-q-fb-2",
        prompt_type: "multi-select" as const,
        prompt: "Which teaching methods do you find most helpful?",
        prompt_img: null,
        points: 0,
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-fb2a", text: "Lecture slides", correct: false },
          { id: "seed-o-fb2b", text: "Live coding demos", correct: false },
          { id: "seed-o-fb2c", text: "Group activities", correct: false },
          { id: "seed-o-fb2d", text: "Homework assignments", correct: false },
          { id: "seed-o-fb2e", text: "Office hours", correct: false },
        ],
      },
      {
        id: "seed-q-fb-3",
        prompt_type: "ranking-poll" as const,
        prompt: "Rank these topics by difficulty (hardest first)",
        prompt_img: null,
        points: 0,
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-fb3a", text: "Recursion", correct: false },
          { id: "seed-o-fb3b", text: "Pointers", correct: false },
          { id: "seed-o-fb3c", text: "Data Structures", correct: false },
          { id: "seed-o-fb3d", text: "Algorithms", correct: false },
        ],
      },
      {
        id: "seed-q-fb-4",
        prompt_type: "multiple-choice" as const,
        prompt: "Would you recommend this course to a friend?",
        prompt_img: null,
        points: 0,
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-fb4a", text: "Definitely yes", correct: false },
          { id: "seed-o-fb4b", text: "Probably yes", correct: false },
          { id: "seed-o-fb4c", text: "Probably not", correct: false },
          { id: "seed-o-fb4d", text: "Definitely not", correct: false },
        ],
      },
    ],
  },
  // Mixed grading — some questions graded, some not, varied point values
  {
    id: "seed-poll-chem",
    title: "Chemistry 110 - Final Exam Review",
    async: false,
    anonymous: false,
    time: 45,
    questions: [
      {
        id: "seed-q-chem-1",
        prompt_type: "multiple-choice" as const,
        prompt: "What is the chemical symbol for gold?",
        prompt_img: null,
        points: 5,
        anonymous: false,
        time: 20,
        options: [
          { id: "seed-o-ch1a", text: "Go", correct: false },
          { id: "seed-o-ch1b", text: "Au", correct: true },
          { id: "seed-o-ch1c", text: "Ag", correct: false },
          { id: "seed-o-ch1d", text: "Gd", correct: false },
        ],
      },
      {
        id: "seed-q-chem-2",
        prompt_type: "multi-select" as const,
        prompt: "Select ALL noble gases from the list below.",
        prompt_img: null,
        points: 20,
        anonymous: false,
        time: 45,
        options: [
          { id: "seed-o-ch2a", text: "Helium", correct: true },
          { id: "seed-o-ch2b", text: "Neon", correct: true },
          { id: "seed-o-ch2c", text: "Nitrogen", correct: false },
          { id: "seed-o-ch2d", text: "Argon", correct: true },
          { id: "seed-o-ch2e", text: "Chlorine", correct: false },
        ],
      },
      {
        id: "seed-q-chem-3",
        prompt_type: "multiple-choice" as const,
        prompt: "How confident are you about the periodic table?",
        prompt_img: null,
        points: 0, // ungraded warm-up question
        anonymous: false,
        time: 15,
        options: [
          { id: "seed-o-ch3a", text: "Very confident", correct: false },
          { id: "seed-o-ch3b", text: "Somewhat confident", correct: false },
          { id: "seed-o-ch3c", text: "Not confident", correct: false },
          { id: "seed-o-ch3d", text: "Need more review", correct: false },
        ],
      },
      {
        id: "seed-q-chem-4",
        prompt_type: "ranking-poll" as const,
        prompt: "Rank these elements by atomic number (lowest first)",
        prompt_img: null,
        points: 25,
        anonymous: false,
        time: 60,
        options: [
          { id: "seed-o-ch4a", text: "Hydrogen (H)", correct: true },
          { id: "seed-o-ch4b", text: "Carbon (C)", correct: true },
          { id: "seed-o-ch4c", text: "Iron (Fe)", correct: true },
          { id: "seed-o-ch4d", text: "Gold (Au)", correct: true },
        ],
      },
      {
        id: "seed-q-chem-5",
        prompt_type: "multiple-choice" as const,
        prompt: "Which type of bond involves sharing electrons?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 30,
        options: [
          { id: "seed-o-ch5a", text: "Ionic bond", correct: false },
          { id: "seed-o-ch5b", text: "Covalent bond", correct: true },
          { id: "seed-o-ch5c", text: "Metallic bond", correct: false },
          { id: "seed-o-ch5d", text: "Hydrogen bond", correct: false },
        ],
      },
      {
        id: "seed-q-chem-6",
        prompt_type: "multi-select" as const,
        prompt: "Which topics would you like to review before the final?",
        prompt_img: null,
        points: 0, // ungraded survey question
        anonymous: true,
        time: null,
        options: [
          { id: "seed-o-ch6a", text: "Stoichiometry", correct: false },
          { id: "seed-o-ch6b", text: "Thermodynamics", correct: false },
          { id: "seed-o-ch6c", text: "Organic chemistry", correct: false },
          { id: "seed-o-ch6d", text: "Acid-base reactions", correct: false },
          { id: "seed-o-ch6e", text: "Electrochemistry", correct: false },
        ],
      },
    ],
  },
  // Another mixed-grading poll with varied weights
  {
    id: "seed-poll-psych",
    title: "Psychology 200 - Memory & Cognition",
    async: false,
    anonymous: false,
    time: 40,
    questions: [
      {
        id: "seed-q-psych-1",
        prompt_type: "multiple-choice" as const,
        prompt: "What did you think of the reading assignment?",
        prompt_img: null,
        points: 0, // ungraded check-in
        anonymous: true,
        time: 15,
        options: [
          { id: "seed-o-ps1a", text: "Very interesting", correct: false },
          { id: "seed-o-ps1b", text: "Somewhat interesting", correct: false },
          { id: "seed-o-ps1c", text: "Neutral", correct: false },
          { id: "seed-o-ps1d", text: "Did not complete it", correct: false },
        ],
      },
      {
        id: "seed-q-psych-2",
        prompt_type: "multiple-choice" as const,
        prompt: "Which memory system has the largest capacity?",
        prompt_img: null,
        points: 15,
        anonymous: false,
        time: 30,
        options: [
          { id: "seed-o-ps2a", text: "Sensory memory", correct: false },
          { id: "seed-o-ps2b", text: "Short-term memory", correct: false },
          { id: "seed-o-ps2c", text: "Long-term memory", correct: true },
          { id: "seed-o-ps2d", text: "Working memory", correct: false },
        ],
      },
      {
        id: "seed-q-psych-3",
        prompt_type: "multi-select" as const,
        prompt: "Which are types of long-term memory?",
        prompt_img: null,
        points: 20,
        anonymous: false,
        time: 40,
        options: [
          { id: "seed-o-ps3a", text: "Episodic", correct: true },
          { id: "seed-o-ps3b", text: "Semantic", correct: true },
          { id: "seed-o-ps3c", text: "Procedural", correct: true },
          { id: "seed-o-ps3d", text: "Iconic", correct: false },
          { id: "seed-o-ps3e", text: "Echoic", correct: false },
        ],
      },
      {
        id: "seed-q-psych-4",
        prompt_type: "ranking-poll" as const,
        prompt: "Rank stages of memory processing in order",
        prompt_img: null,
        points: 30,
        anonymous: false,
        time: 45,
        options: [
          { id: "seed-o-ps4a", text: "Encoding", correct: true },
          { id: "seed-o-ps4b", text: "Storage", correct: true },
          { id: "seed-o-ps4c", text: "Retrieval", correct: true },
        ],
      },
      {
        id: "seed-q-psych-5",
        prompt_type: "multiple-choice" as const,
        prompt: "The 'magic number' for short-term memory capacity is:",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 25,
        options: [
          { id: "seed-o-ps5a", text: "5 ± 2", correct: false },
          { id: "seed-o-ps5b", text: "7 ± 2", correct: true },
          { id: "seed-o-ps5c", text: "9 ± 2", correct: false },
          { id: "seed-o-ps5d", text: "12 ± 2", correct: false },
        ],
      },
    ],
  },
]

/**
 * Returns a Firestore document reference for a user.
 * @param {string} uid - The user ID.
 * @return {FirebaseFirestore.DocumentReference} The document reference.
 */
function userRef(uid: string) {
  return db.doc(`users/${uid}`)
}

/**
 * Returns a Firestore document reference for a poll.
 * @param {string} pid - The poll ID.
 * @return {FirebaseFirestore.DocumentReference} The document reference.
 */
function pollRef(pid: string) {
  return db.doc(`polls/${pid}`)
}

/**
 * Returns a Firestore document reference for a question.
 * @param {string} pid - The poll ID.
 * @param {string} qid - The question ID.
 * @return {FirebaseFirestore.DocumentReference} The document reference.
 */
function questionRef(pid: string, qid: string) {
  return db.doc(`polls/${pid}/questions/${qid}`)
}

/** Creates Firebase Auth accounts and Firestore user documents. */
async function seedUsers() {
  console.log("Seeding users...")

  // Create Firebase Auth accounts
  for (const u of USERS) {
    try {
      await authAdmin.createUser({
        uid: u.id,
        email: u.email,
        password: SEED_PASSWORD,
        displayName: u.display_name,
      })
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === "auth/uid-already-exists") {
        console.log(`  ⏭ Auth account for ${u.email} already exists`)
      } else {
        throw err
      }
    }
  }

  // Create Firestore user documents
  const batch = db.batch()
  for (const u of USERS) {
    batch.set(db.doc(`users/${u.id}`), {
      display_name: u.display_name,
      email: u.email,
      photo_url: u.photo_url,
      created_at: ts(),
    })
  }
  await batch.commit()
  console.log(`  ✓ ${USERS.length} users created (password: ${SEED_PASSWORD})`)
}

/** Creates polls with questions and options in Firestore. */
async function seedPolls() {
  console.log("Seeding polls...")
  const instructor = userRef(USERS[0].id)

  for (const poll of POLLS) {
    const questionRefs = poll.questions.map((q) => questionRef(poll.id, q.id))

    // Create poll document
    await db.doc(`polls/${poll.id}`).set({
      owner: instructor,
      title: poll.title,
      async: poll.async,
      anonymous: poll.anonymous,
      time: poll.time,
      questions: questionRefs,
      created_at: ts(),
      updated_at: ts(),
    })

    // Create questions + options subcollections
    for (const q of poll.questions) {
      const optionRefs = q.options.map((o) =>
        db.doc(`polls/${poll.id}/questions/${q.id}/options/${o.id}`)
      )

      await db.doc(`polls/${poll.id}/questions/${q.id}`).set({
        prompt_type: q.prompt_type,
        prompt: q.prompt,
        prompt_img: q.prompt_img,
        options: optionRefs,
        points: q.points,
        anonymous: q.anonymous,
        time: q.time,
        created_at: ts(),
        updated_at: ts(),
      })

      const batch = db.batch()
      for (const o of q.options) {
        batch.set(
          db.doc(`polls/${poll.id}/questions/${q.id}/options/${o.id}`),
          { text: o.text, correct: o.correct }
        )
      }
      await batch.commit()
    }
  }
  console.log(`  ✓ ${POLLS.length} polls with questions and options created`)
}

/** All session IDs created by the seed script. */
const ALL_SESSION_IDS = [
  "seed-session-finished",
  "seed-session-chem",
  "seed-session-feedback",
  "seed-session-psych",
  "seed-session-open",
]

/**
 * Generic helper to seed a finished session with responses and submissions.
 * Handles graded, ungraded, and mixed-grading polls with all question types.
 */
async function seedFinishedSessionForPoll(config: {
  poll: (typeof POLLS)[number]
  sessionId: string
  roomCode: string
  students: typeof USERS
}) {
  const { poll, sessionId: sid, roomCode, students } = config
  const instructor = USERS[0]
  const maxScore = poll.questions.reduce((sum, q) => sum + q.points, 0)

  const sessionQuestionIds = poll.questions.map(
    (_q, i) => `seed-sq-${sid}-${i}`
  )
  const sessionQuestionRefs = sessionQuestionIds.map((sqid) =>
    db.doc(`sessions/${sid}/questions/${sqid}`)
  )

  // Each student gets a unique random score between 0 and maxScore.
  // Use a beta-like distribution (skewed toward passing) for realism.
  const studentSkill: Record<string, number> = {}
  const studentScores: Record<string, number> = {}
  for (const s of students) {
    studentSkill[s.id] = 0.15 + Math.random() * 0.8
    // Generate a unique continuous score: skill acts as a center,
    // then add noise so no two students land on the same value
    const base = studentSkill[s.id] * maxScore
    const noise = (Math.random() - 0.5) * maxScore * 0.3
    const raw = Math.round((base + noise) * 10) / 10
    studentScores[s.id] = Math.max(0, Math.min(maxScore, raw))
  }

  // Create session questions + options + responses
  for (let i = 0; i < poll.questions.length; i++) {
    const q = poll.questions[i]
    const sqid = sessionQuestionIds[i]

    await db.doc(`sessions/${sid}/questions/${sqid}`).set({
      prompt_type: q.prompt_type,
      prompt: q.prompt,
      prompt_img: q.prompt_img,
      points: q.points,
      anonymous: q.anonymous,
      time: q.time,
    })

    const optBatch = db.batch()
    for (const o of q.options) {
      optBatch.set(
        db.doc(`sessions/${sid}/questions/${sqid}/options/${o.id}`),
        { text: o.text, correct: o.correct }
      )
    }
    await optBatch.commit()

    // Responses — Firestore batches max 500, split into chunks
    const chunkSize = 400
    for (let c = 0; c < students.length; c += chunkSize) {
      const chunk = students.slice(c, c + chunkSize)
      const respBatch = db.batch()

      for (const s of chunk) {
        const correctOpts = q.options.filter((o) => o.correct)
        const wrongOpts = q.options.filter((o) => !o.correct)
        const hasCorrectAnswer = correctOpts.length > 0 && wrongOpts.length > 0
        const skill = studentSkill[s.id]

        let chosenIds: string[]
        let isCorrect: boolean

        if (!hasCorrectAnswer) {
          // Ungraded question — pick a random option
          const pick = q.options[Math.floor(Math.random() * q.options.length)]
          chosenIds = [pick.id]
          isCorrect = false
        } else if (q.prompt_type === "multi-select") {
          // Skill determines likelihood of getting all correct
          isCorrect = Math.random() < skill
          if (isCorrect) {
            chosenIds = correctOpts.map((o) => o.id)
          } else {
            // Pick a mix of correct and wrong based on skill
            const picked = q.options.filter(() => Math.random() < skill * 0.6)
            chosenIds =
              picked.length > 0 ? picked.map((o) => o.id) : [wrongOpts[0].id]
          }
        } else if (q.prompt_type === "ranking-poll") {
          // Skill determines likelihood of correct ordering
          isCorrect = Math.random() < skill
          if (isCorrect) {
            chosenIds = q.options.map((o) => o.id)
          } else {
            const shuffled = [...q.options].sort(() => Math.random() - 0.5)
            chosenIds = shuffled.map((o) => o.id)
          }
        } else {
          // multiple-choice — skill determines correctness probability
          isCorrect = Math.random() < skill
          const chosen = isCorrect ?
            correctOpts[Math.floor(Math.random() * correctOpts.length)] :
            wrongOpts[Math.floor(Math.random() * wrongOpts.length)]
          chosenIds = [chosen.id]
        }

        respBatch.set(
          db.doc(`sessions/${sid}/questions/${sqid}/responses/${s.id}`),
          {
            user: userRef(s.id),
            choices: chosenIds.map((oid) =>
              db.doc(`sessions/${sid}/questions/${sqid}/options/${oid}`)
            ),
            correct: isCorrect,
            created_at: ts(),
          }
        )
      }
      await respBatch.commit()
    }
  }

  // Create session users
  for (let c = 0; c < students.length; c += 400) {
    const chunk = students.slice(c, c + 400)
    const userBatch = db.batch()
    for (const s of chunk) {
      userBatch.set(db.doc(`sessions/${sid}/users/${s.id}`), {
        display_name: s.display_name,
        photo_url: s.photo_url,
        joined_at: ts(),
        incorrect: false,
        status: "active",
      })
    }
    await userBatch.commit()
  }

  // Compute summary statistics from actual scores
  const allScores = students
    .map((s) => studentScores[s.id])
    .sort((a, b) => a - b)
  const sum = allScores.reduce((a, b) => a + b, 0)
  const avg = allScores.length > 0 ? sum / allScores.length : 0
  const mid = Math.floor(allScores.length / 2)
  const median =
    allScores.length % 2 === 0 ?
      (allScores[mid - 1] + allScores[mid]) / 2 :
      allScores[mid]
  const q1Idx = Math.floor(allScores.length * 0.25)
  const q3Idx = Math.floor(allScores.length * 0.75)
  const toPercent = (v: number) =>
    maxScore > 0 ? Math.round((v / maxScore) * 100 * 10) / 10 : 0

  await db.doc(`sessions/${sid}`).set({
    host: userRef(instructor.id),
    poll: pollRef(poll.id),
    room_code: roomCode,
    title: poll.title,
    async: poll.async,
    anonymous: poll.anonymous,
    leaderboard: false,
    time: poll.time,
    question: null,
    results: null,
    questions_left: [],
    questions: sessionQuestionRefs,
    state: "finished",
    summary: {
      total_participants: students.length,
      median: median,
      median_100: toPercent(median),
      average: Math.round(avg * 10) / 10,
      average_100: toPercent(avg),
      low: allScores[0] ?? 0,
      low_100: toPercent(allScores[0] ?? 0),
      high: allScores[allScores.length - 1] ?? 0,
      high_100: toPercent(allScores[allScores.length - 1] ?? 0),
      lower_quartile: allScores[q1Idx] ?? 0,
      lower_quartile_100: toPercent(allScores[q1Idx] ?? 0),
      upper_quartile: allScores[q3Idx] ?? 0,
      upper_quartile_100: toPercent(allScores[q3Idx] ?? 0),
      max_score: maxScore,
    },
    created_at: ts(),
  })

  // Chat messages
  const chatBatch = db.batch()
  const chatTemplates = [
    "Is this graded?",
    "Good luck everyone!",
    "That last question was tricky",
    "I think I got them all right!",
    "Can we go over the answers after?",
    "Running out of time here",
    "Thanks for the review session!",
  ]
  const chatStudents = students.slice(0, chatTemplates.length)
  for (let i = 0; i < chatStudents.length; i++) {
    const s = chatStudents[i]
    chatBatch.set(db.doc(`sessions/${sid}/chat/seed-chat-${sid}-${s.id}`), {
      user: userRef(s.id),
      display_name: s.display_name,
      photo_url: s.photo_url,
      message: chatTemplates[i],
      created_at: ts(),
    })
  }
  await chatBatch.commit()

  // Submissions — always create so participants are visible
  for (let c = 0; c < students.length; c += 400) {
    const chunk = students.slice(c, c + 400)
    for (const s of chunk) {
      const score = studentScores[s.id]
      const subId = `seed-sub-${sid}-${s.id}`

      await db.doc(`submissions/${subId}`).set({
        title: poll.title,
        session: db.doc(`sessions/${sid}`),
        user: userRef(s.id),
        display_name: s.display_name,
        score: score,
        max_score: maxScore,
        score_100: toPercent(score),
        submitted_at: ts(),
        photo_url: s.photo_url,
        email: s.email,
      })

      await db.doc(`sessions/${sid}/submissions/${s.id}`).set({
        ref: db.doc(`submissions/${subId}`),
      })
    }
  }
}

/** Seeds the CS 101 finished session — all 25 students, fully graded. */
async function seedFinishedSession() {
  console.log("Seeding finished session (CS 101 — graded, 25 students)...")
  const students = USERS.slice(1)
  await seedFinishedSessionForPoll({
    poll: POLLS[0],
    sessionId: "seed-session-finished",
    roomCode: "ABC123",
    students,
  })
  console.log("  ✓ CS 101 finished session")
}

/** Seeds a finished session for Chemistry — mixed grading (some 0-pt questions). */
async function seedChemSession() {
  console.log(
    "Seeding finished session (Chem 110 — mixed grading, 25 students)..."
  )
  const students = USERS.slice(1)
  await seedFinishedSessionForPoll({
    poll: POLLS[4], // seed-poll-chem
    sessionId: "seed-session-chem",
    roomCode: "CHM789",
    students,
  })
  console.log("  ✓ Chem 110 finished session (mixed grading)")
}

/** Seeds a finished session for Feedback — fully ungraded (all 0-pt). */
async function seedFeedbackSession() {
  console.log("Seeding finished session (Feedback — ungraded, 25 students)...")
  const students = USERS.slice(1)
  await seedFinishedSessionForPoll({
    poll: POLLS[3], // seed-poll-feedback
    sessionId: "seed-session-feedback",
    roomCode: "FBK321",
    students,
  })
  console.log("  ✓ Feedback finished session (ungraded)")
}

/** Seeds a finished session for Psychology — mixed grading with varied weights. */
async function seedPsychSession() {
  console.log(
    "Seeding finished session (Psych 200 — mixed grading, 25 students)..."
  )
  const students = USERS.slice(1)
  await seedFinishedSessionForPoll({
    poll: POLLS[5], // seed-poll-psych
    sessionId: "seed-session-psych",
    roomCode: "PSY555",
    students,
  })
  console.log("  ✓ Psych 200 finished session (mixed grading)")
}

/** Seeds an open session with users in the waiting room. */
async function seedOpenSession() {
  console.log("Seeding open session (waiting room)...")
  const poll = POLLS[2] // Biology
  const sid = "seed-session-open"
  const instructor = USERS[0]
  const waitingStudents = USERS.slice(1, 4)

  const sessionQuestionRefs = poll.questions.map((_q, i) =>
    db.doc(`sessions/${sid}/questions/seed-sq-open-${i}`)
  )

  await db.doc(`sessions/${sid}`).set({
    host: userRef(instructor.id),
    poll: pollRef(poll.id),
    room_code: "BIO456",
    title: poll.title,
    async: poll.async,
    anonymous: poll.anonymous,
    leaderboard: false,
    time: poll.time,
    question: null,
    results: null,
    questions_left: sessionQuestionRefs,
    questions: sessionQuestionRefs,
    state: "open",
    summary: {
      total_participants: 0,
      median: 0,
      median_100: 0,
      average: 0,
      average_100: 0,
      low: 0,
      low_100: 0,
      high: 0,
      high_100: 0,
      lower_quartile: 0,
      lower_quartile_100: 0,
      upper_quartile: 0,
      upper_quartile_100: 0,
      max_score: 35,
    },
    created_at: ts(),
  })

  // Waiting users
  const batch = db.batch()
  for (const s of waitingStudents) {
    batch.set(db.doc(`sessions/${sid}/waiting_users/${s.id}`), {
      display_name: s.display_name,
      photo_url: s.photo_url,
    })
  }
  await batch.commit()

  // Session questions
  for (let i = 0; i < poll.questions.length; i++) {
    const q = poll.questions[i]
    await db.doc(`sessions/${sid}/questions/seed-sq-open-${i}`).set({
      prompt_type: q.prompt_type,
      prompt: q.prompt,
      prompt_img: q.prompt_img,
      points: q.points,
      anonymous: q.anonymous,
      time: q.time,
    })

    const optBatch = db.batch()
    for (const o of q.options) {
      optBatch.set(
        db.doc(`sessions/${sid}/questions/seed-sq-open-${i}/options/${o.id}`),
        { text: o.text, correct: o.correct }
      )
    }
    await optBatch.commit()
  }

  console.log("  ✓ Open session with waiting room users")
}

/**
 * Deletes all documents in a Firestore collection.
 * @param {string} path - The collection path.
 * @return {Promise<number>} The number of deleted documents.
 */
async function deleteDocs(path: string) {
  const snap = await db.collection(path).get()
  // Firestore batch limit is 500
  const chunks: FirebaseFirestore.DocumentReference[][] = []
  for (let i = 0; i < snap.docs.length; i += 450) {
    chunks.push(snap.docs.slice(i, i + 450).map((d) => d.ref))
  }
  for (const chunk of chunks) {
    const batch = db.batch()
    chunk.forEach((ref) => batch.delete(ref))
    await batch.commit()
  }
  return snap.size
}

/** Removes all seed data from Firestore and Firebase Auth. */
async function clean() {
  console.log("Cleaning seed data...")

  // Delete subcollections first, then parents
  for (const poll of POLLS) {
    for (const q of poll.questions) {
      await deleteDocs(`polls/${poll.id}/questions/${q.id}/options`)
    }
    await deleteDocs(`polls/${poll.id}/questions`)
  }
  await Promise.all(
    POLLS.map((p) =>
      db
        .doc(`polls/${p.id}`)
        .delete()
        .catch(() => {})
    )
  )

  for (const sid of ALL_SESSION_IDS) {
    await deleteDocs(`sessions/${sid}/users`)
    await deleteDocs(`sessions/${sid}/waiting_users`)
    await deleteDocs(`sessions/${sid}/chat`)
    await deleteDocs(`sessions/${sid}/submissions`)

    // Clean session questions + nested options/responses
    const sqSnap = await db.collection(`sessions/${sid}/questions`).get()
    for (const sq of sqSnap.docs) {
      await deleteDocs(`sessions/${sid}/questions/${sq.id}/options`)
      await deleteDocs(`sessions/${sid}/questions/${sq.id}/responses`)
    }
    await deleteDocs(`sessions/${sid}/questions`)
    await db
      .doc(`sessions/${sid}`)
      .delete()
      .catch(() => {})
  }

  // Delete seed submissions, users, and auth accounts
  for (const u of USERS) {
    for (const sid of ALL_SESSION_IDS) {
      await db
        .doc(`submissions/seed-sub-${sid}-${u.id}`)
        .delete()
        .catch(() => {})
    }
    // Legacy submission ID format
    await db
      .doc(`submissions/seed-sub-fin-${u.id}`)
      .delete()
      .catch(() => {})
    await db
      .doc(`users/${u.id}`)
      .delete()
      .catch(() => {})
    await authAdmin.deleteUser(u.id).catch(() => {})
  }

  console.log("  ✓ Seed data cleaned")
}

/** Entry point — seeds or cleans based on CLI args. */
async function main() {
  console.log("\nPulseCheck Firestore Seed")
  console.log(`Target: ${USE_PROD ? "PRODUCTION" : "EMULATOR (localhost)"}\n`)

  if (USE_PROD) {
    console.log("⚠️  WARNING: You are about to write to PRODUCTION Firestore.")
    console.log("   Press Ctrl+C within 3 seconds to abort.\n")
    await new Promise((r) => setTimeout(r, 3000))
  }

  if (CLEAN) {
    await clean()
    console.log("")
  }

  await seedUsers()
  await seedPolls()
  await seedFinishedSession()
  await seedChemSession()
  await seedFeedbackSession()
  await seedPsychSession()
  await seedOpenSession()

  console.log("\n✓ Seed complete!\n")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
