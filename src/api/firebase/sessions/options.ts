import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDocs,
  query,
  QuerySnapshot,
} from "firebase/firestore"
import { clx } from "@/api"
import BaseStore from "../store"
import { SessionOption, SessionQuestion } from "@/types"

/**
 * Manages options to choose for a question
 */
export default class OptionStore extends BaseStore {
  public doc(sid: string, qid: string, oid: string) {
    return doc(this.db, clx.sessions, sid, clx.questions, qid, clx.options, oid)
  }

  public collect(sid: string, qid: string) {
    return collection(
      this.db,
      clx.sessions,
      sid,
      clx.questions,
      qid,
      clx.options,
    )
  }
  public async getAllByRef(qref: DocumentReference<SessionQuestion>) {
    const ref = collection(qref, clx.options)
    const q = query(ref)
    const ss = await getDocs(q)
    return ss as QuerySnapshot<SessionOption>
  }

  public async getAll(sid: string, qid: string) {
    const ref = this.collect(sid, qid)
    const q = query(ref)
    const ss = await getDocs(q)
    return ss as QuerySnapshot<SessionOption>
  }

  public async create(sid: string, qid: string, payload: SessionOption) {
    const oref = await addDoc(this.collect(sid, qid), payload)
    return oref as DocumentReference<SessionOption>
  }
}
