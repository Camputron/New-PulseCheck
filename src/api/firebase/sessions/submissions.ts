import { doc, DocumentReference, getDoc, setDoc } from "firebase/firestore"
import BaseStore from "../store"
import { SessionSubmission } from "@/types"
import { clx } from "@/api"

/**
 * @deprecated DEAD CODE — slated for removal.
 * Session submissions are created exclusively by the `finishSession` Cloud Function.
 * No client-side code calls this store. The path construction in `doc()` is also
 * buggy (clx args are swapped, producing `/submissions/{sid}/sessions/{uid}`
 * instead of `/sessions/{sid}/submissions/{uid}`).
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
