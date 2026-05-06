import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore"
import BaseStore from "../store"
import { clx } from "@/api"
import { Session, SessionUser } from "@/types"

/** Manages users in a session */
export default class UserStore extends BaseStore {
  public doc(sid: string, uid: string): DocumentReference<SessionUser> {
    return doc(
      this.db,
      clx.sessions,
      sid,
      clx.users,
      uid,
    ) as DocumentReference<SessionUser>
  }

  public collect(sid: string) {
    return collection(
      this.db,
      clx.sessions,
      sid,
      clx.users,
    ) as CollectionReference<SessionUser>
  }

  public async set(sid: string, uid: string, payload: Partial<SessionUser>) {
    const suref = this.doc(sid, uid)
    await setDoc(suref, payload, { merge: false })
  }

  /**
   * Retrieves all users currently in the session.
   */
  public async getAll(sref: DocumentReference<Session>) {
    const ref = this.collect(sref.id)
    const q = query(ref)
    return getDocs(q)
  }
}
