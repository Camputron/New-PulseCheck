import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDocs,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import BaseStore from "../store"
import { BankQuestion, QuestionBank } from "../../../types"
import { clx } from "@/api"

/**
 * Manages snapshot questions inside a user's question bank.
 * Path: /users/{uid}/question_banks/{bid}/questions/{qid}
 *
 * Snapshots are denormalized — `options` is an inline array, not a subcollection.
 *
 * NOTE: parent bank's `question_count` is maintained here (incremented on add,
 * decremented on delete). Direct Firestore writes that bypass this store will
 * desync the count.
 */
export default class BankQuestionStore extends BaseStore {
  public doc(
    uid: string,
    bid: string,
    qid: string,
  ): DocumentReference<BankQuestion> {
    return doc(
      this.db,
      clx.users,
      uid,
      clx.question_banks,
      bid,
      clx.questions,
      qid,
    ) as DocumentReference<BankQuestion>
  }

  public collect(uid: string, bid: string): CollectionReference<BankQuestion> {
    return collection(
      this.db,
      clx.users,
      uid,
      clx.question_banks,
      bid,
      clx.questions,
    ) as CollectionReference<BankQuestion>
  }

  private bankDoc(uid: string, bid: string): DocumentReference<QuestionBank> {
    return doc(
      this.db,
      clx.users,
      uid,
      clx.question_banks,
      bid,
    ) as DocumentReference<QuestionBank>
  }

  /**
   * Adds a snapshot question and bumps the parent bank's `question_count`.
   * `created_at`/`updated_at` are set via serverTimestamp.
   */
  public async add(
    uid: string,
    bid: string,
    snapshot: Omit<BankQuestion, "created_at" | "updated_at">,
  ): Promise<DocumentReference<BankQuestion>> {
    const qclx = this.collect(uid, bid)
    const qref = await addDoc(qclx, {
      ...snapshot,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    await updateDoc(this.bankDoc(uid, bid), {
      question_count: increment(1),
      updated_at: serverTimestamp(),
    })
    return qref as DocumentReference<BankQuestion>
  }

  /** Sequential bulk insert; preserves order; bumps `question_count` once. */
  public async addMany(
    uid: string,
    bid: string,
    snapshots: Omit<BankQuestion, "created_at" | "updated_at">[],
  ): Promise<DocumentReference<BankQuestion>[]> {
    const qclx = this.collect(uid, bid)
    const refs: DocumentReference<BankQuestion>[] = []
    for (const snap of snapshots) {
      const qref = await addDoc(qclx, {
        ...snap,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
      refs.push(qref as DocumentReference<BankQuestion>)
    }
    if (snapshots.length > 0) {
      await updateDoc(this.bankDoc(uid, bid), {
        question_count: increment(snapshots.length),
        updated_at: serverTimestamp(),
      })
    }
    return refs
  }

  public async update(
    ref: DocumentReference<BankQuestion>,
    payload: Partial<BankQuestion>,
  ): Promise<void> {
    await updateDoc(ref, {
      ...payload,
      updated_at: serverTimestamp(),
    })
  }

  public async delete(ref: DocumentReference<BankQuestion>): Promise<void> {
    const bankRef = ref.parent.parent as DocumentReference<QuestionBank> | null
    if (!bankRef) {
      throw new Error("Bank question must have a parent bank document")
    }
    await deleteDoc(ref)
    await updateDoc(bankRef, {
      question_count: increment(-1),
      updated_at: serverTimestamp(),
    })
  }

  public async list(uid: string, bid: string): Promise<BankQuestion[]> {
    const snap = await getDocs(this.collect(uid, bid))
    return snap.docs.map((d) => d.data())
  }
}
