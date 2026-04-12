import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentReference,
  QueryDocumentSnapshot,
} from "firebase/firestore"
import BaseStore from "./store"
import {
  SessionOption,
  SessionQuestion,
  SessionResponse,
  Submission,
} from "@/types"
import api, { clx } from "@/api"
interface UserResponse {
  question: SessionQuestion
  response: SessionResponse | null
  options: Map<string, SessionOption>
}

/**
 * Manages /submissions collection in Firestore.
 */
export default class SubmissionStore extends BaseStore {
  public doc(sid: string): DocumentReference<Submission> {
    return doc(this.db, clx.submissions, sid) as DocumentReference<Submission>
  }

  public collect(): CollectionReference<Submission> {
    return collection(
      this.db,
      clx.submissions
    ) as CollectionReference<Submission>
  }

  public async updateByRef(
    ref: DocumentReference<Submission>,
    payload: Partial<Submission>
  ): Promise<void> {
    await updateDoc(ref, payload)
  }

  public async create(
    payload: Partial<Submission>
  ): Promise<DocumentReference<Submission>> {
    const ref = await addDoc(this.collect(), {
      ...payload,
      submitted_at: serverTimestamp(),
    })
    return ref as DocumentReference<Submission>
  }

  public async getUserResponses(
    submission: Submission
  ): Promise<UserResponse[]> {
    const sref = submission.session
    const uid = submission.user.id
    /* fetch session doc */
    const s_ss = await getDoc(sref)
    if (!s_ss.exists()) {
      throw new Error(`Failed to get sessions/${sref.id}`)
    }
    const arr: UserResponse[] = []
    /* iterate all session questions */
    for (const qref of s_ss.data().questions) {
      /* fetch session queston doc  */
      const q_ss = await getDoc(qref)
      if (!q_ss.exists()) {
        throw new Error(`Failed to get sessions/questions/${qref.id}`)
      }
      const question = q_ss.data()
      /* fetch session question options */
      const o_ss = await api.sessions.questions.options.getAll(sref.id, qref.id)
      /* map options */
      const options = new Map<string, SessionOption>()
      o_ss.forEach((x) => {
        options.set(x.id, x.data())
      })
      const rref = api.sessions.questions.responses.doc(sref.id, qref.id, uid)
      /* fetch user's response doc */
      const r_ss = await getDoc(rref)
      const response = r_ss.data() ?? null
      arr.push({ question, response, options })
    }
    return arr
  }

  public findAllByUID(uid: string) {
    const userRef = doc(this.db, clx.users, uid)
    const subsRef = collection(this.db, clx.submissions)
    const q = query(subsRef, where("user", "==", userRef))
    return getDocs(q)
  }

  /** @brief Finds the most recent submission, otherwise null */
  public async findMostRecentSubmission(
    uid: string
  ): Promise<QueryDocumentSnapshot<Submission> | null> {
    const userRef = doc(this.db, clx.users, uid)
    const subsRef = collection(this.db, clx.submissions)
    const q = query(
      subsRef,
      where("user", "==", userRef),
      orderBy("submitted_at", "desc"),
      limit(1)
    )
    const ss = await getDocs(q)
    return ss.empty ? null : (ss.docs[0] as QueryDocumentSnapshot<Submission>)
  }

  public findAllBySID(sid: string) {
    const sessionRef = doc(this.db, clx.sessions, sid)
    const subsRef = this.collect()
    const q = query(subsRef, where("session", "==", sessionRef))
    return getDocs(q)
  }

  public async findUserSubmissions(
    uid: string
  ): Promise<QueryDocumentSnapshot<Submission>[]> {
    const uref = doc(this.db, clx.users, uid)
    const subsRef = collection(this.db, clx.submissions)
    const q = query(subsRef, where("user", "==", uref))
    const ss = await getDocs(q)

    return (ss.docs as QueryDocumentSnapshot<Submission>[]) ?? []
  }
}
