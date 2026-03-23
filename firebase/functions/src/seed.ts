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

import * as admin from "firebase-admin";

const USE_PROD = process.argv.includes("--prod");
const CLEAN = process.argv.includes("--clean");

const PROJECT_ID = "new-pulsecheck";

if (!USE_PROD) {
  process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
  process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
}

admin.initializeApp({projectId: PROJECT_ID});
const db = admin.firestore();
const authAdmin = admin.auth();
const ts = admin.firestore.Timestamp.now;

const SEED_PASSWORD = "pulsecheck123";

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
];

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
          {id: "seed-o-1a", text: "O(n)", correct: false},
          {id: "seed-o-1b", text: "O(log n)", correct: true},
          {id: "seed-o-1c", text: "O(n log n)", correct: false},
          {id: "seed-o-1d", text: "O(1)", correct: false},
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
          {id: "seed-o-2a", text: "Stack", correct: false},
          {id: "seed-o-2b", text: "Queue", correct: true},
          {id: "seed-o-2c", text: "Binary Tree", correct: false},
          {id: "seed-o-2d", text: "Hash Map", correct: false},
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
          {id: "seed-o-3a", text: "Merge Sort", correct: true},
          {id: "seed-o-3b", text: "Quick Sort", correct: true},
          {id: "seed-o-3c", text: "Slow Sort", correct: false},
          {id: "seed-o-3d", text: "Bubble Sort", correct: true},
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
          {id: "seed-o-h1a", text: "1774", correct: false},
          {id: "seed-o-h1b", text: "1776", correct: true},
          {id: "seed-o-h1c", text: "1778", correct: false},
          {id: "seed-o-h1d", text: "1780", correct: false},
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
          {id: "seed-o-h2a", text: "Thomas Jefferson", correct: false},
          {id: "seed-o-h2b", text: "John Adams", correct: false},
          {id: "seed-o-h2c", text: "George Washington", correct: true},
          {id: "seed-o-h2d", text: "Benjamin Franklin", correct: false},
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
          {id: "seed-o-b1a", text: "Nucleus", correct: false},
          {id: "seed-o-b1b", text: "Mitochondria", correct: true},
          {id: "seed-o-b1c", text: "Ribosome", correct: false},
          {id: "seed-o-b1d", text: "Golgi Apparatus", correct: false},
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
          {id: "seed-o-b2a", text: "Ribosome", correct: true},
          {id: "seed-o-b2b", text: "Mitochondria", correct: true},
          {id: "seed-o-b2c", text: "Nucleus", correct: true},
          {id: "seed-o-b2d", text: "Cell", correct: true},
        ],
      },
      {
        id: "seed-q-bio-3",
        prompt_type: "multi-select" as const,
        prompt: "Which of the following are found in " +
          "plant cells but NOT animal cells?",
        prompt_img: null,
        points: 10,
        anonymous: false,
        time: 30,
        options: [
          {id: "seed-o-b3a", text: "Cell Wall", correct: true},
          {id: "seed-o-b3b", text: "Chloroplast", correct: true},
          {id: "seed-o-b3c", text: "Mitochondria", correct: false},
          {id: "seed-o-b3d", text: "Central Vacuole", correct: true},
        ],
      },
    ],
  },
];

/**
 * Returns a Firestore document reference for a user.
 * @param {string} uid - The user ID.
 * @return {FirebaseFirestore.DocumentReference} The document reference.
 */
function userRef(uid: string) {
  return db.doc(`users/${uid}`);
}

/**
 * Returns a Firestore document reference for a poll.
 * @param {string} pid - The poll ID.
 * @return {FirebaseFirestore.DocumentReference} The document reference.
 */
function pollRef(pid: string) {
  return db.doc(`polls/${pid}`);
}

/**
 * Returns a Firestore document reference for a question.
 * @param {string} pid - The poll ID.
 * @param {string} qid - The question ID.
 * @return {FirebaseFirestore.DocumentReference} The document reference.
 */
function questionRef(pid: string, qid: string) {
  return db.doc(`polls/${pid}/questions/${qid}`);
}

/** Creates Firebase Auth accounts and Firestore user documents. */
async function seedUsers() {
  console.log("Seeding users...");

  // Create Firebase Auth accounts
  for (const u of USERS) {
    try {
      await authAdmin.createUser({
        uid: u.id,
        email: u.email,
        password: SEED_PASSWORD,
        displayName: u.display_name,
      });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/uid-already-exists") {
        console.log(`  ⏭ Auth account for ${u.email} already exists`);
      } else {
        throw err;
      }
    }
  }

  // Create Firestore user documents
  const batch = db.batch();
  for (const u of USERS) {
    batch.set(db.doc(`users/${u.id}`), {
      display_name: u.display_name,
      email: u.email,
      photo_url: u.photo_url,
      created_at: ts(),
    });
  }
  await batch.commit();
  console.log(`  ✓ ${USERS.length} users created (password: ${SEED_PASSWORD})`);
}

/** Creates polls with questions and options in Firestore. */
async function seedPolls() {
  console.log("Seeding polls...");
  const instructor = userRef(USERS[0].id);

  for (const poll of POLLS) {
    const questionRefs = poll.questions.map((q) => questionRef(poll.id, q.id));

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
    });

    // Create questions + options subcollections
    for (const q of poll.questions) {
      const optionRefs = q.options.map((o) =>
        db.doc(`polls/${poll.id}/questions/${q.id}/options/${o.id}`)
      );

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
      });

      const batch = db.batch();
      for (const o of q.options) {
        batch.set(
          db.doc(`polls/${poll.id}/questions/${q.id}/options/${o.id}`),
          {text: o.text, correct: o.correct}
        );
      }
      await batch.commit();
    }
  }
  console.log(`  ✓ ${POLLS.length} polls with questions and options created`);
}

/** Seeds a completed session with responses, chat, and submissions. */
async function seedFinishedSession() {
  console.log("Seeding finished session...");
  const poll = POLLS[0]; // CS 101
  const sid = "seed-session-finished";
  const students = USERS.slice(1); // all except instructor
  const instructor = USERS[0];

  // Build session question refs and docs
  const sessionQuestionIds = poll.questions.map((_q, i) => `seed-sq-fin-${i}`);

  const sessionQuestionRefs = sessionQuestionIds.map((sqid) =>
    db.doc(`sessions/${sid}/questions/${sqid}`)
  );

  // Create session document
  await db.doc(`sessions/${sid}`).set({
    host: userRef(instructor.id),
    poll: pollRef(poll.id),
    room_code: "ABC123",
    title: poll.title,
    async: poll.async,
    anonymous: poll.anonymous,
    time: poll.time,
    question: null,
    results: null,
    questions_left: [],
    questions: sessionQuestionRefs,
    state: "finished",
    summary: {
      total_participants: students.length,
      median: 22,
      median_100: 73.3,
      average: 21.0,
      average_100: 70.0,
      low: 10,
      low_100: 33.3,
      high: 30,
      high_100: 100.0,
      lower_quartile: 15,
      lower_quartile_100: 50.0,
      upper_quartile: 27,
      upper_quartile_100: 90.0,
      max_score: 30,
    },
    created_at: ts(),
  });

  // Create session users
  const userBatch = db.batch();
  for (const s of students) {
    userBatch.set(db.doc(`sessions/${sid}/users/${s.id}`), {
      display_name: s.display_name,
      photo_url: s.photo_url,
      joined_at: ts(),
      incorrect: false,
    });
  }
  await userBatch.commit();

  // Create session questions + options + responses
  for (let i = 0; i < poll.questions.length; i++) {
    const q = poll.questions[i];
    const sqid = sessionQuestionIds[i];

    await db.doc(`sessions/${sid}/questions/${sqid}`).set({
      prompt_type: q.prompt_type,
      prompt: q.prompt,
      prompt_img: q.prompt_img,
      points: q.points,
      anonymous: q.anonymous,
      time: q.time,
    });

    // Session options
    const optBatch = db.batch();
    for (const o of q.options) {
      optBatch.set(
        db.doc(`sessions/${sid}/questions/${sqid}/options/${o.id}`),
        {text: o.text, correct: o.correct}
      );
    }
    await optBatch.commit();

    // Responses from each student (randomized correctness)
    const respBatch = db.batch();
    for (const s of students) {
      // Pick a random option, biased toward correct
      const correctOpts = q.options.filter((o) => o.correct);
      const wrongOpts = q.options.filter((o) => !o.correct);
      const isCorrect = Math.random() > 0.3;
      const chosen = isCorrect ?
        correctOpts[Math.floor(Math.random() * correctOpts.length)] :
        wrongOpts.length > 0 ?
          wrongOpts[Math.floor(Math.random() * wrongOpts.length)] :
          correctOpts[0];

      respBatch.set(
        db.doc(`sessions/${sid}/questions/${sqid}/responses/${s.id}`),
        {
          user: userRef(s.id),
          choices: [
            db.doc(`sessions/${sid}/questions/${sqid}/options/${chosen.id}`),
          ],
          correct: isCorrect,
          created_at: ts(),
        }
      );
    }
    await respBatch.commit();
  }

  // Chat messages
  const chatBatch = db.batch();
  const chatMessages = [
    {user: students[0], message: "Is this graded?"},
    {user: students[1], message: "Good luck everyone!"},
    {user: students[2], message: "The second question was tricky"},
    {user: students[3], message: "I think I got them all right!"},
  ];
  for (const msg of chatMessages) {
    const chatId = `seed-chat-${msg.user.id}`;
    chatBatch.set(db.doc(`sessions/${sid}/chat/${chatId}`), {
      user: userRef(msg.user.id),
      display_name: msg.user.display_name,
      photo_url: msg.user.photo_url,
      message: msg.message,
      created_at: ts(),
    });
  }
  await chatBatch.commit();

  // Submissions (top-level + session subcollection)
  const scores = [30, 20, 10, 25, 20]; // one per student
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const subId = `seed-sub-fin-${s.id}`;
    const score = scores[i];

    await db.doc(`submissions/${subId}`).set({
      title: poll.title,
      session: db.doc(`sessions/${sid}`),
      user: userRef(s.id),
      display_name: s.display_name,
      score: score,
      max_score: 30,
      score_100: Math.round((score / 30) * 100 * 10) / 10,
      submitted_at: ts(),
      photo_url: s.photo_url,
      email: s.email,
    });

    await db.doc(`sessions/${sid}/submissions/${s.id}`).set({
      ref: db.doc(`submissions/${subId}`),
    });
  }

  console.log("  ✓ Finished session with responses, chat, and submissions");
}

/** Seeds an open session with users in the waiting room. */
async function seedOpenSession() {
  console.log("Seeding open session (waiting room)...");
  const poll = POLLS[2]; // Biology
  const sid = "seed-session-open";
  const instructor = USERS[0];
  const waitingStudents = USERS.slice(1, 4);

  const sessionQuestionRefs = poll.questions.map((_q, i) =>
    db.doc(`sessions/${sid}/questions/seed-sq-open-${i}`)
  );

  await db.doc(`sessions/${sid}`).set({
    host: userRef(instructor.id),
    poll: pollRef(poll.id),
    room_code: "BIO456",
    title: poll.title,
    async: poll.async,
    anonymous: poll.anonymous,
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
  });

  // Waiting users
  const batch = db.batch();
  for (const s of waitingStudents) {
    batch.set(db.doc(`sessions/${sid}/waiting_users/${s.id}`), {
      display_name: s.display_name,
      photo_url: s.photo_url,
    });
  }
  await batch.commit();

  // Session questions
  for (let i = 0; i < poll.questions.length; i++) {
    const q = poll.questions[i];
    await db.doc(`sessions/${sid}/questions/seed-sq-open-${i}`).set({
      prompt_type: q.prompt_type,
      prompt: q.prompt,
      prompt_img: q.prompt_img,
      points: q.points,
      anonymous: q.anonymous,
      time: q.time,
    });

    const optBatch = db.batch();
    for (const o of q.options) {
      optBatch.set(
        db.doc(`sessions/${sid}/questions/seed-sq-open-${i}/options/${o.id}`),
        {text: o.text, correct: o.correct}
      );
    }
    await optBatch.commit();
  }

  console.log("  ✓ Open session with waiting room users");
}

/**
 * Deletes all documents in a Firestore collection.
 * @param {string} path - The collection path.
 * @return {Promise<number>} The number of deleted documents.
 */
async function deleteDocs(path: string) {
  const snap = await db.collection(path).get();
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  if (snap.size > 0) await batch.commit();
  return snap.size;
}

/** Removes all seed data from Firestore and Firebase Auth. */
async function clean() {
  console.log("Cleaning seed data...");

  // Delete subcollections first, then parents
  for (const poll of POLLS) {
    for (const q of poll.questions) {
      await deleteDocs(`polls/${poll.id}/questions/${q.id}/options`);
    }
    await deleteDocs(`polls/${poll.id}/questions`);
  }
  await Promise.all(
    POLLS.map((p) =>
      db
        .doc(`polls/${p.id}`)
        .delete()
        .catch(() => {})
    )
  );

  const sessionIds = ["seed-session-finished", "seed-session-open"];
  for (const sid of sessionIds) {
    await deleteDocs(`sessions/${sid}/users`);
    await deleteDocs(`sessions/${sid}/waiting_users`);
    await deleteDocs(`sessions/${sid}/chat`);
    await deleteDocs(`sessions/${sid}/submissions`);

    // Clean session questions + nested options/responses
    const sqSnap = await db.collection(`sessions/${sid}/questions`).get();
    for (const sq of sqSnap.docs) {
      await deleteDocs(`sessions/${sid}/questions/${sq.id}/options`);
      await deleteDocs(`sessions/${sid}/questions/${sq.id}/responses`);
    }
    await deleteDocs(`sessions/${sid}/questions`);
    await db
      .doc(`sessions/${sid}`)
      .delete()
      .catch(() => {});
  }

  // Delete seed submissions, users, and auth accounts
  for (const u of USERS) {
    await db
      .doc(`submissions/seed-sub-fin-${u.id}`)
      .delete()
      .catch(() => {});
    await db
      .doc(`users/${u.id}`)
      .delete()
      .catch(() => {});
    await authAdmin.deleteUser(u.id).catch(() => {});
  }

  console.log("  ✓ Seed data cleaned");
}

/** Entry point — seeds or cleans based on CLI args. */
async function main() {
  console.log("\nPulseCheck Firestore Seed");
  console.log(`Target: ${USE_PROD ? "PRODUCTION" : "EMULATOR (localhost)"}\n`);

  if (USE_PROD) {
    console.log("⚠️  WARNING: You are about to write to PRODUCTION Firestore.");
    console.log("   Press Ctrl+C within 3 seconds to abort.\n");
    await new Promise((r) => setTimeout(r, 3000));
  }

  if (CLEAN) {
    await clean();
    console.log("");
  }

  await seedUsers();
  await seedPolls();
  await seedFinishedSession();
  await seedOpenSession();

  console.log("\n✓ Seed complete!\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
