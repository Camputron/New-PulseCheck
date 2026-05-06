import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  Firestore,
  QueryDocumentSnapshot,
} from "firebase/firestore"
import BaseStore from "../store"
import OptionStore from "./options"
import { clx } from "@/api"
import { PromptType, SessionOption, SessionQuestion } from "@/types"
import ResponseStore from "./responses"

/**
 * Manages session questions
 */
export default class QuestionStore extends BaseStore {
  private readonly _options: OptionStore
  private readonly _responses: ResponseStore

  constructor(db: Firestore) {
    super(db)
    this._options = new OptionStore(db)
    this._responses = new ResponseStore(db)
  }

  public get options() {
    return this._options
  }

  public get responses() {
    return this._responses
  }

  public doc(sid: string, qid: string) {
    return doc(this.db, clx.sessions, sid, clx.questions, qid)
  }

  public collect(sid: string) {
    return collection(this.db, clx.sessions, sid, clx.questions)
  }

  public async create(sid: string, payload: SessionQuestion) {
    const qref = await addDoc(this.collect(sid), payload)
    return qref as DocumentReference<SessionQuestion>
  }

  public async gradeAll(
    sid: string,
    qid: string,
    prompt_type: PromptType,
    correct_opts: QueryDocumentSnapshot<SessionOption>[],
  ) {
    const responses = await this.responses.getAllAsMap(sid, qid)
    const promises: Promise<void>[] = []
    Object.entries(responses).forEach((x) => {
      const uid = x[0]
      const rref = this.responses.doc(sid, qid, uid)
      const p = this.responses.grade(rref, prompt_type, correct_opts)
      promises.push(p)
    })
    await Promise.all(promises)
  }
}
