import { AIQuestions, Poll, User } from "../../types"
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
    payload: Partial<Poll>
  ) {
    await updateDoc(ref, {
      ...payload,
      updated_at: serverTimestamp(),
    })
  }

  public async delete(pref: DocumentReference<Poll>) {
    await deleteDoc(pref)
    // await api.sessions.deleteAllByPREF(pref)
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
        /* iterate and create option docs from AI response */
        const opt_proms = ai.options.map(async (opt) => {
          try {
            /* create option doc */
            const oref = await this.questions.options.create(opts_clx)
            /* update option doc */
            await this.questions.options.updateByRef(oref, {
              text: opt,
              correct: opt === ai.correct_answer,
            })
          } catch (err) {
            console.debug(err)
          }
        })
        /* wait for all options to be process */
        await Promise.all(opt_proms)
      } catch (err) {
        console.debug(err)
      }
    })
    /* wait for all questions to be process */
    await Promise.all(promises)
  }
}
