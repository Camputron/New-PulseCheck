import { doc, DocumentReference, getDoc, setDoc } from "firebase/firestore"
import BaseStore from "../store"
import { SessionSubmission } from "@/types"
import { clx } from "@/api"

/**
 * Manages session submissions
 */
export default class SubmissionStore extends BaseStore {
  public doc(sid: string, uid: string): DocumentReference<SessionSubmission> {
    const ref = doc(this.db, clx.submissions, sid, clx.sessions, uid)
    return ref as DocumentReference<SessionSubmission>
  }

  public async insert(sid: string, uid: string, payload: SessionSubmission) {
    const ref = this.doc(sid, uid)
    await setDoc(ref, payload, { merge: false })
  }

  public async get(sid: string, uid: string): Promise<SessionSubmission> {
    const ref = this.doc(sid, uid)
    const ss = await getDoc(ref)
    if (!ss.exists()) {
      throw new Error(`SessionSubmission(${ss.id}) does not exist!`)
    }
    return ss.data()
  }
}
