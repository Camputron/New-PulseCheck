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

  public async clone(
    pid: string,
    owner: DocumentReference<User>
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
      title: `${source.title} (Copy)`,
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
        const newOref = await this.questions.options.create(newOptsClx)
        await this.questions.options.updateByRef(newOref, {
          text: srcO.text,
          correct: srcO.correct,
        })
      }
    }
    return newPollRef
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
