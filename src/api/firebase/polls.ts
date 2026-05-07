import { AIQuestions, BankQuestion, Poll, User } from "../../types"
import BaseStore from "./store"
import QuestionStore from "./questions"
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import api, { clx } from "@/api"

/**
 * Manages /polls collection in Firestore.
 */
export default class PollStore extends BaseStore {
  private readonly _questions: QuestionStore

  constructor(db: Firestore) {
    super(db)
    this._questions = new QuestionStore(super.db)
  }

  public get questions(): QuestionStore {
    return this._questions
  }

  public doc(pid: string) {
    return doc(this.db, clx.polls, pid) as DocumentReference<Poll>
  }

  public collect() {
    return collection(this.db, clx.polls)
  }

  public async add(host: DocumentReference<User>) {
    const pcref = collection(this.db, clx.polls) as CollectionReference<Poll>
    return addDoc(pcref, {
      owner: host,
      title: "Untitled Poll",
      async: true,
      anonymous: false,
      time: null,
      questions: [],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
  }

  public queryUserPolls(uid: string): Query<Poll> {
    const uref = api.users.doc(uid)
    const pollsRef = this.collect()
    const q = query(pollsRef, where("owner", "==", uref)) as Query<Poll>
    return q
  }

  public async getUserPolls(uid: string): Promise<Poll[]> {
    const uref = api.users.doc(uid)
    const pollsRef = this.collect()
    const q = query(pollsRef, where("owner", "==", uref))
    const snapshot = (await getDocs(q)) as QuerySnapshot<Poll>
    const polls: Poll[] = snapshot.docs.map((x) => ({
      ...x.data(),
      id: x.id,
    }))
    return polls
  }

  public async update(
    ref: DocumentReference<Poll, DocumentData>,
    payload: Partial<Poll>,
  ) {
    await updateDoc(ref, {
      ...payload,
      updated_at: serverTimestamp(),
    })
  }

  /**
   * Bumps `updated_at` on a poll without modifying any other field.
   * Called by question/option mutations so edits to subcollections still
   * surface as a poll update on the dashboard / history views.
   */
  public async touch(ref: DocumentReference<Poll, DocumentData>) {
    await updateDoc(ref, { updated_at: serverTimestamp() })
  }

  public async delete(pref: DocumentReference<Poll>) {
    /* Firestore doesn't cascade — manually delete questions + their options
       so we don't leave orphans, and so debounced writes from any still-mounted
       editor target docs that no longer exist. */
    const qclx = this.questions.collect(pref.id)
    const qsnap = await getDocs(qclx)
    await Promise.all(
      qsnap.docs.map(async (qdoc) => {
        const oclx = this.questions.options.collect({
          pid: pref.id,
          qid: qdoc.id,
        })
        const osnap = await getDocs(oclx)
        await Promise.all(osnap.docs.map((odoc) => deleteDoc(odoc.ref)))
        await deleteDoc(qdoc.ref)
      }),
    )
    await deleteDoc(pref)
  }

  public async clone(
    pid: string,
    owner: DocumentReference<User>,
  ): Promise<DocumentReference<Poll>> {
    /* fetch source poll */
    const sourceRef = this.doc(pid)
    const sourceSnap = await getDoc(sourceRef)
    const source = sourceSnap.data()
    if (!source) {
      throw new Error(`Failed to clone poll ${pid}: source poll not found`)
    }
    /* create new poll doc with copied settings */
    const pcref = collection(this.db, clx.polls) as CollectionReference<Poll>
    const newPollRef = await addDoc(pcref, {
      owner: owner,
      title: `Copy of ${source.title}`,
      async: source.async,
      anonymous: source.anonymous,
      time: source.time,
      questions: [],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    /* iterate source questions sequentially to preserve order in poll.questions array */
    const newQclx = this.questions.collect(newPollRef.id)
    for (const srcQref of source.questions) {
      const srcQsnap = await getDoc(srcQref)
      const srcQ = srcQsnap.data()
      if (!srcQ) continue
      const newQref = await this.questions.add(newQclx)
      await this.questions.update(newQref, {
        prompt: srcQ.prompt,
        prompt_type: srcQ.prompt_type,
        prompt_img: srcQ.prompt_img,
        points: srcQ.points,
        anonymous: srcQ.anonymous,
        time: srcQ.time,
      })
      /* iterate options sequentially to preserve order in question.options array */
      const newOptsClx = this.questions.options.collect({
        pid: newPollRef.id,
        qid: newQref.id,
      })
      for (const srcOref of srcQ.options) {
        const srcOsnap = await getDoc(srcOref)
        const srcO = srcOsnap.data()
        if (!srcO) continue
        await this.questions.options.create(newOptsClx, {
          text: srcO.text,
          correct: srcO.correct,
        })
      }
    }
    return newPollRef
  }

  /**
   * Reads a poll question and dereferences each option doc into an inline
   * snapshot suitable for storing in a question bank.
   * Timestamps are stripped — the caller (BankQuestionStore.add) sets fresh ones.
   */
  public async snapshotPollQuestion(
    pid: string,
    qid: string,
  ): Promise<Omit<BankQuestion, "created_at" | "updated_at">> {
    const qref = this.questions.doc(pid, qid)
    const qsnap = await getDoc(qref)
    const q = qsnap.data()
    if (!q) {
      throw new Error(`Question ${qid} not found in poll ${pid}`)
    }
    const optSnaps = await Promise.all(q.options.map((oref) => getDoc(oref)))
    const options = optSnaps
      .map((s) => s.data())
      .filter((d): d is NonNullable<typeof d> => Boolean(d))
      .map((d) => ({ text: d.text, correct: d.correct }))
    return {
      prompt: q.prompt,
      prompt_type: q.prompt_type,
      prompt_img: q.prompt_img,
      options,
      points: q.points,
      anonymous: q.anonymous,
      time: q.time,
    }
  }

  /**
   * Bulk-creates poll questions from in-memory bank snapshots, sequentially to
   * preserve order in `poll.questions`. Mirrors `clone()`.
   */
  public async importBankQuestions(
    pid: string,
    snapshots: BankQuestion[],
  ): Promise<void> {
    const q_clx = this.questions.collect(pid)
    for (const snap of snapshots) {
      const qref = await this.questions.add(q_clx)
      await this.questions.update(qref, {
        prompt: snap.prompt,
        prompt_type: snap.prompt_type,
        prompt_img: snap.prompt_img,
        points: snap.points,
        anonymous: snap.anonymous,
        time: snap.time,
      })
      const opts_clx = this.questions.options.collect({
        pid,
        qid: qref.id,
      })
      for (const opt of snap.options) {
        await this.questions.options.create(opts_clx, {
          text: opt.text,
          correct: opt.correct,
        })
      }
    }
  }

  public async generateQuestions(pid: string, questions: AIQuestions) {
    /* create reference to poll's question subcollection */
    const q_clx = this.questions.collect(pid)
    /* process each question from AI */
    const promises: Promise<void>[] = questions.map(async (ai) => {
      try {
        /* create question doc */
        const ref = await this.questions.add(q_clx)
        const qid = ref.id
        /* update question doc prompt with AI response */
        await this.questions.update(ref, { prompt: ai.question })
        const opts_clx = this.questions.options.collect({
          pid: pid,
          qid: qid,
        })
        /* create option docs sequentially with correct flag set atomically.
           Sequential ordering preserves option order in question.options;
           single-write avoids a race where the editor subscribes to a fresh
           option doc with correct=false before the follow-up update lands. */
        for (const opt of ai.options) {
          try {
            await this.questions.options.create(opts_clx, {
              text: opt,
              correct: opt === ai.correct_answer,
            })
          } catch (err) {
            console.debug(err)
          }
        }
      } catch (err) {
        console.debug(err)
      }
    })
    /* wait for all questions to be process */
    await Promise.all(promises)
  }
}
