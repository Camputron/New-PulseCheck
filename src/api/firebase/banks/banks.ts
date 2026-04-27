import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDocs,
  Query,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import BaseStore from "../store"
import { QuestionBank, User } from "../../../types"
import api, { clx } from "@/api"
import BankQuestionStore from "./questions"

/**
 * Manages a user's question banks.
 * Path: /users/{uid}/question_banks/{bid}
 */
export default class QuestionBankStore extends BaseStore {
  private readonly _questions: BankQuestionStore

  constructor(db: Firestore) {
    super(db)
    this._questions = new BankQuestionStore(super.db)
  }

  public get questions(): BankQuestionStore {
    return this._questions
  }

  public doc(uid: string, bid: string): DocumentReference<QuestionBank> {
    return doc(
      this.db,
      clx.users,
      uid,
      clx.question_banks,
      bid,
    ) as DocumentReference<QuestionBank>
  }

  public collect(uid: string): CollectionReference<QuestionBank> {
    return collection(
      this.db,
      clx.users,
      uid,
      clx.question_banks,
    ) as CollectionReference<QuestionBank>
  }

  public async add(
    owner: DocumentReference<User>,
    name: string,
    description: string | null = null,
  ): Promise<DocumentReference<QuestionBank>> {
    const uid = owner.id
    const bcref = this.collect(uid)
    const ref = await addDoc(bcref, {
      owner,
      name,
      description,
      question_count: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return ref
  }

  public async update(
    ref: DocumentReference<QuestionBank>,
    payload: Partial<QuestionBank>,
  ): Promise<void> {
    await updateDoc(ref, {
      ...payload,
      updated_at: serverTimestamp(),
    })
  }

  /**
   * Cascading delete: removes every snapshot question under the bank, then
   * deletes the bank itself. Acceptable for typical bank sizes (<200).
   * TODO: chunk in batches of 500 if banks ever grow that large.
   */
  public async delete(ref: DocumentReference<QuestionBank>): Promise<void> {
    const uid = ref.parent.parent?.id
    if (!uid) {
      throw new Error("QuestionBank ref must be under /users/{uid}")
    }
    const qclx = this.questions.collect(uid, ref.id)
    const snap = await getDocs(qclx)
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
    await deleteDoc(ref)
  }

  public queryUserBanks(uid: string): Query<QuestionBank> {
    const uref = api.users.doc(uid)
    const banksRef = this.collect(uid)
    return query(banksRef, where("owner", "==", uref))
  }
}
