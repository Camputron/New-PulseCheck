import {
  addDoc,
  arrayRemove,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase/firestore"
import BaseStore from "../store"
import {
  CurrentQuestion,
  Poll,
  Session,
  SessionQuestion,
  SessionState,
  SessionUser,
} from "@/lib/types"
import api, { clx } from ".."
import UserStore from "./users"
import WaitingUserStore from "./waiting_users"
import ChatStore from "./chat"
import { generateRoomCode, getMedian } from "@/utils"
import QuestionStore from "./question"
import SubmissionStore from "./submissions"

/**
 * Manages /sessions collection in Firestore.
 */
export default class SessionStore extends BaseStore {
  private readonly _users: UserStore
  private readonly _waiting_users: WaitingUserStore
  private readonly _chat: ChatStore
  private readonly _questions: QuestionStore
  private readonly _submissions: SubmissionStore

  constructor(db: Firestore) {
    super(db)
    this._users = new UserStore(db)
    this._waiting_users = new WaitingUserStore(db)
    this._chat = new ChatStore(db)
    this._questions = new QuestionStore(db)
    this._submissions = new SubmissionStore(db)
  }

  public get users() {
    return this._users
  }

  public get waiting_users() {
    return this._waiting_users
  }

  public get chat() {
    return this._chat
  }

  public get questions() {
    return this._questions
  }

  public get submissions() {
    return this._submissions
  }

  public doc(sid: string) {
    const ref = doc(this.db, clx.sessions, sid)
    return ref as DocumentReference<Session>
  }

  public collect(): CollectionReference<Session> {
    return collection(this.db, clx.sessions) as CollectionReference<Session>
  }

  /**
   * Tries to find a session with room code.
   * @throws Error if session with passed code does not exist.
   */
  public async getByCode(code: string): Promise<DocumentReference<Session>> {
    const ref = this.collect()
    /* find the first session that matches */
    const q = query(ref, where("room_code", "==", code), limit(1))
    const ss = await getDocs(q)
    if (!ss.empty) {
      /* found session with code */
      const x = ss.docs[0]
      return x.ref
    }
    throw new Error(`Invalid room code: ${code}`)
  }

  /**
   * Checks if the user is in the waiting queue.
   * @param sid - Session ID
   * @param uid - User ID
   * @returns {Promise<boolean>} - True if the user is waiting, false otherwise.
   */
  public async isWaitingForEntry(sid: string, uid: string): Promise<boolean> {
    const ref = doc(this.doc(sid), clx.waiting_users, uid)
    const data = await getDoc(ref)
    return data.exists()
  }

  /**
   * Checks if the user is participating the session.
   * @param sid - Session ID
   * @param uid - User ID
   * @returns {Promise<boolean>} - True if the user is in the session, false otherwise.
   */
  public async hasJoined(sid: string, uid: string): Promise<boolean> {
    const ref = doc(this.doc(sid), clx.users, uid)
    const data = await getDoc(ref)
    return data.exists()
  }

  /**
   * Adds a user to the waiting queue to join the session.
   * @param sid - Session ID
   * @param uid - User ID
   */
  public async enqueue(
    sid: string,
    uid: string,
    payload: { photo_url: string | null; display_name: string }
  ) {
    const sref = this.doc(sid)
    const wref = doc(sref, clx.waiting_users, uid)
    await setDoc(wref, payload, { merge: false })
  }

  public async leaveQueue(sid: string, uid: string) {
    const sref = this.doc(sid)
    const wref = doc(sref, clx.waiting_users, uid)
    await deleteDoc(wref)
  }

  public async leaveSession(sid: string, uid: string) {
    const sref = this.doc(sid)
    const uref = doc(sref, clx.users, uid)
    await deleteDoc(uref)
  }

  public async isHost(sid: string, uid: string): Promise<boolean> {
    const sref = this.doc(sid)
    const session = await getDoc(sref)
    if (!session.exists()) {
      throw new Error("Session does not exist!")
    }
    return session.data().host.id === uid
  }

  /**
   * Creates Poll Session by given poll id
   */
  public async host(pid: string, uid: string): Promise<string> {
    const uref = api.users.doc(uid)
    const pref = api.polls.doc(pid)
    const pollDoc = await getDoc(pref)
    if (!pollDoc.exists()) {
      throw new Error(`${pref.path} does not exist!`)
    }
    const poll = pollDoc.data()
    if (poll.owner.path !== uref.path) {
      throw new Error(`Unauthorized access to poll!`)
    }
    const session = await addDoc(this.collect(), {
      summary: {
        total_participants: NaN,
        average: NaN,
        average_100: NaN,
        high: NaN,
        high_100: NaN,
        low: NaN,
        low_100: NaN,
        lower_quartile: NaN,
        lower_quartile_100: NaN,
        median: NaN,
        median_100: NaN,
        upper_quartile: NaN,
        upper_quartile_100: NaN,
        max_score: NaN,
      },
      host: uref,
      poll: pref,
      room_code: generateRoomCode(),
      title: poll.title,
      async: poll.async,
      anonymous: poll.anonymous,
      time: poll.time,
      question: null,
      results: null,
      questions_left: [],
      questions: [],
      state: SessionState.OPEN,
      created_at: serverTimestamp(),
    })
    return session.id
  }

  public async updateByRef(
    ref: DocumentReference<Session>,
    payload: Partial<Session>
  ) {
    await updateDoc(ref, payload)
  }

  /**
   * @brief Host starts the session.
   */
  public async start(ref: DocumentReference<Session>) {
    /* fetch session doc by {ref} */
    const session_ss = await getDoc(ref)
    if (!session_ss.exists()) {
      throw new Error(`session(${ref.id}) does not exist!`)
    }
    const session = session_ss.data()
    /* fetch session's poll by {session.poll} reference */
    const poll_ss = await getDoc(session.poll)
    const poll = poll_ss.data()
    if (!poll) {
      throw new Error(`poll(${poll_ss.id}) does not exist!`)
    }
    /* init an array of session question refs */
    const question_refs: DocumentReference<SessionQuestion>[] = []
    /* iterate all of the poll's questions */
    let maxScore = 0

    for (const q of poll.questions) {
      /* fetch the question's data */
      const pq_ss = await getDoc(q)
      if (!pq_ss.exists()) {
        throw new Error(`question(${pq_ss.id}) does not exist!`)
      }
      const pq = pq_ss.data()
      /* create session question doc using poll question data */
      const sqref = await this.questions.create(ref.id, {
        anonymous: pq.anonymous,
        points: pq.points,
        prompt: pq.prompt,
        prompt_img: pq.prompt_img,
        prompt_type: pq.prompt_type,
        time: pq.time,
      })
      question_refs.push(sqref)

      // if (pq.prompt_type !== "ranking-poll") {
      maxScore += pq.points
      // }

      /* iterate the poll question's options */
      for (const oref of pq.options) {
        const opt_ss = await getDoc(oref)
        if (!opt_ss.exists()) {
          throw new Error(`opt(${opt_ss.id}) does not exist!`)
        }
        const optData = opt_ss.data()
        // await addDoc(optionsRef, optData)
        /* create options doc for live question */
        await this.questions.options.create(ref.id, sqref.id, optData)
      }
    }
    await this.updateByRef(ref, {
      summary: {
        total_participants: NaN,
        average: NaN,
        average_100: NaN,
        high: NaN,
        high_100: NaN,
        low: NaN,
        low_100: NaN,
        lower_quartile: NaN,
        lower_quartile_100: NaN,
        median: NaN,
        median_100: NaN,
        upper_quartile: NaN,
        upper_quartile_100: NaN,
        max_score: maxScore,
      },
      state: SessionState.IN_PROGRESS,
      questions_left: question_refs,
      questions: question_refs,
    })
  }

  /**
   * @brief Host moves to the next question
   * @throws Error if the session does not exist
   * @throws Error if the next question of the session does not exist.
   */
  public async nextQuestion(ref: DocumentReference<Session>) {
    const ss = await getDoc(ref)
    if (!ss.exists()) {
      throw new Error(`session(${ref.id}) does not exist!`)
    }
    const session = ss.data()
    const questions = session.questions_left
    /* fetch the next question in the session */
    const nextQuestion = questions.shift()
    if (nextQuestion) {
      /* fetch data of next question */
      const q_ss = await getDoc(nextQuestion)
      if (!q_ss.exists()) {
        throw new Error(`nextQuestion(${nextQuestion.id}) does nto exist!`)
      }
      const q = q_ss.data()
      /* fetch all options of the next question */
      const opts = await this.questions.options.getAll(ref.id, q_ss.id)
      const payload: CurrentQuestion = {
        ref: nextQuestion,
        prompt_type: q.prompt_type,
        prompt: q.prompt,
        prompt_img: q.prompt_img,
        options: opts.docs.map((x) => ({ ref: x.ref, text: x.data().text })),
        anonymous: q.anonymous,
        time: q.time,
      }
      await setDoc(
        ref,
        {
          question: payload,
          results: null,
          questions_left: arrayRemove(nextQuestion),
        },
        { merge: true }
      )
    } else {
      /* otherwise, switch session to DONE state. */
      await setDoc(
        ref,
        {
          question: null,
          results: null,
          state: SessionState.DONE,
        },
        { merge: true }
      )
    }
  }

  public async clearQuestion(ref: DocumentReference<Session>) {
    await setDoc(
      ref,
      {
        question: null,
      },
      { merge: true }
    )
  }

  public async displayUserResponses(
    sref: DocumentReference<Session>,
    question: CurrentQuestion
  ) {
    /* fetch all user responses as a Map<string(uid), SessionResponse>  */
    const responses = await this.questions.responses.getAllAsMap(
      sref.id,
      question.ref.id
    )
    /* init frequency table */
    const table: Record<string, { text: string; count: number }> = {}
    /* iterate all options of question */
    for (const opt of question.options) {
      table[opt.ref.id] = {
        text: opt.text,
        count: 0,
      }
    }
    /* iterate all user responses */
    for (const [, res] of Object.entries(responses)) {
      /* count!  */
      for (const opt of res.choices) {
        table[opt.id].count++
      }
    }

    /* init series */
    const series = {
      labels: Object.values(table).map((x) => x.text),
      data: Object.values(table).map((x) => x.count),
    }
    const data = Object.entries(table).map(([key, val]) => ({
      id: key,
      value: val.count,
      label: val.text,
    }))
    const options = await this.questions.options.getAllByRef(question.ref)
    const opts_correct = options.docs
      .filter((x) => x.data().correct)
      .map((x) => ({ id: x.id, text: x.data().text }))
    await setDoc(
      sref,
      {
        results: {
          question: question,
          opts_correct,
          barchart: series,
          piechart: data,
          responses: responses,
        },
      },
      { merge: true }
    )
  }

  /** @brief Grades the responses for the given question */
  public async gradeQuestion(
    sref: DocumentReference<Session>,
    question: CurrentQuestion
  ) {
    const opts = await this.questions.options.getAll(sref.id, question.ref.id)
    const docs = opts.docs
    const correct_opts = docs.filter((x) => x.data().correct)
    await this.questions.gradeAll(
      sref.id,
      question.ref.id,
      question.prompt_type,
      correct_opts
    )
  }

  /**
   * @brief Changes session state to CLOSED.
   */
  public async close(ref: DocumentReference<Session>) {
    await this.updateByRef(ref, {
      room_code: ref.id,
      state: SessionState.CLOSED,
    })
  }

  /**
   * Calulcates the user's total score in session. Creates submission to save user results.
   */
  protected async calcUserScore(
    sid: string,
    user: QueryDocumentSnapshot<SessionUser>,
    s_ss: QueryDocumentSnapshot<Session>,
    questions: DocumentSnapshot<SessionQuestion>[]
  ): Promise<number> {
    /* init users score */
    let score = 0
    console.debug(`grading user(${user.id})`)
    const uid = user.id
    /* iterate all session question ids */
    for (const q_ss of questions) {
      const qid = q_ss.id
      /* fetch snapshot of session question */
      // const q_ss = await getDoc(q_ss)
      if (!q_ss.exists()) {
        throw new Error(`Failed to get sessions/${sid}/questions/${qid}`)
      }
      /* init ref to user's response to question */
      const rref = this.questions.responses.doc(sid, qid, uid)
      /* fetch user's response */
      const r_ss = await getDoc(rref)
      const question = q_ss.data()
      /* check if user's response is recorded */
      if (!r_ss.exists()) {
        /* if no record, mark as no choices were made */
        console.debug(`user(${uid}) did not answer this question(${qid})`)
        await this.questions.responses.answer(sid, qid, uid, [])
      } else {
        /* check if this question is a ranking-poll */
        // if (question.prompt_type !== "ranking-poll") {
        const res = r_ss.data()
        /* check if the user's answer is correct */
        if (res.correct) {
          score += question.points
        }
        // }
      }
    }
    /* create submission doc */
    const submission_ref = await api.submissions.create({
      title: s_ss.data().title,
      user: api.users.doc(uid),
      display_name: user.data().display_name,
      photo_url: user.data().photo_url,
      session: s_ss.ref,
      score: score,
      max_score: s_ss.data().summary.max_score,
      score_100: (score / s_ss.data().summary.max_score) * 100,
    })
    /* create pointer to submission doc in sessions's subcollection */
    await this.submissions.insert(s_ss.id, uid, {
      ref: submission_ref,
    })
    return score
  }

  protected calcMetrics(scores: number[], maxScore: number) {
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
    const low_100 = (low / maxScore) * 100
    const high_100 = (high / maxScore) * 100
    const average_100 = (average / maxScore) * 100
    const median_100 = (median / maxScore) * 100
    const lower_quartile_100 = (lower_quartile / maxScore) * 100
    const upper_quartile_100 = (upper_quartile / maxScore) * 100
    return {
      average,
      average_100,
      low,
      low_100,
      high,
      high_100,
      median,
      median_100,
      lower_quartile,
      lower_quartile_100,
      upper_quartile,
      upper_quartile_100,
    }
  }

  /**
   * Changes session state to FINISHED. Creates all submissions for users in session.
   */
  public async finish(sref: DocumentReference<Session>) {
    console.debug("create submission docs!")
    const sid = sref.id
    /* fetch session doc */
    const s_ss = await getDoc(sref)
    if (!s_ss.exists()) {
      throw new Error(`Failed to get sessions/${sid}`)
    }
    const session = s_ss.data()
    /* fetch all user docs in session */
    const users = (await this.users.getAll(sref)).docs
    /* init question promises list */
    const question_promises: Promise<DocumentSnapshot<SessionQuestion>>[] = []
    /* fetch all session question docs */
    for (const qref of session.questions) {
      question_promises.push(getDoc(qref))
    }
    /* wait to fetch all session question docs */
    const questions = await Promise.all(question_promises)
    /* init score promises list */
    const score_promises: Promise<number>[] = []
    /* compute score for all users in session */
    for (const user of users) {
      score_promises.push(this.calcUserScore(sid, user, s_ss, questions))
    }
    /* wait to finish scoring all users */
    const scores = await Promise.all(score_promises)
    const maxScore = session.summary.max_score
    /* update session summary with metrics */
    await setDoc(
      sref,
      {
        summary: {
          ...this.calcMetrics(scores, maxScore),
          total_participants: users.length,
        },
        state: SessionState.FINISHED,
      },
      { merge: true }
    )
  }

  public async deleteAllByPREF(pref: DocumentReference<Poll>) {
    const q = query(
      collection(this.db, clx.sessions),
      where("poll", "==", pref)
    )
    const batchSize = 500
    let batch = writeBatch(this.db)
    let count = 0
    const ss = await getDocs(q)
    ss.docs.forEach((x) => {
      batch.delete(x.ref)
      count++
      if (count % batchSize === 0) {
        void batch.commit()
        batch = writeBatch(this.db)
      }
    })
    if (count % batchSize !== 0) {
      await batch.commit()
    }
    console.debug(`Deleted ${count} document(s) from ${clx.sessions}`)
  }

  /** @brief Finds all sessions the user hosted (FINISHED + CLOSED) */
  public async findUserSessions(
    uid: string
  ): Promise<QueryDocumentSnapshot<Session>[]> {
    const uref = doc(this.db, clx.users, uid)
    const subsRef = collection(this.db, clx.sessions)
    const q = query(
      subsRef,
      where("host", "==", uref),
      where("state", "in", [SessionState.FINISHED, SessionState.CLOSED])
    )
    const ss = await getDocs(q)
    return (ss.docs as QueryDocumentSnapshot<Session>[]) ?? []
  }
}
