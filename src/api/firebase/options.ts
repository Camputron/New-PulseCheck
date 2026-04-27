import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import BaseStore, { CollectionParams, DocumentParams, CRUDStore } from "./store"
import { PromptOption, Question } from "../../types"
import { clx } from "@/api"

export default class PromptOptionStore
  extends BaseStore
  implements CRUDStore<PromptOption>
{
  public doc(
    params: DocumentParams<PromptOption>,
  ): DocumentReference<PromptOption> {
    return doc(
      this.db,
      clx.polls,
      params.pid,
      clx.questions,
      params.qid,
      clx.options,
      params.oid,
    ) as DocumentReference<PromptOption>
  }

  public collect(
    params: CollectionParams<PromptOption>,
  ): CollectionReference<PromptOption> {
    return collection(
      this.db,
      clx.polls,
      params.pid,
      clx.questions,
      params.qid,
      clx.options,
    ) as CollectionReference<PromptOption>
  }

  public async create(ref: CollectionReference<PromptOption>) {
    const qref = ref.parent as DocumentReference<Question> | null
    if (!qref) {
      throw new Error(
        "PromptOptions collection needs a parent document (questions).",
      )
    }
    const oref = await addDoc(ref, {
      text: "",
      correct: false,
    })
    /* update question doc to include refernece to {oref}  */
    await setDoc(qref, { options: arrayUnion(oref) }, { merge: true })
    return oref
  }

  public async getAllCorrect(ref: CollectionReference<PromptOption>) {
    const q = query(ref, where("correct", "==", "true"))
    const ss = await getDocs(q)
    return ss.docs
  }

  public async updateByRef(
    ref: DocumentReference<PromptOption, DocumentData>,
    payload: Partial<PromptOption>,
  ): Promise<void> {
    await updateDoc(ref, payload)
  }

  public async updateById(
    params: DocumentParams<PromptOption>,
    payload: Partial<PromptOption>,
  ): Promise<void> {
    const ref = this.doc(params)
    await this.updateByRef(ref, payload)
  }

  public async deleteByRef(
    ref: DocumentReference<PromptOption, DocumentData>,
  ): Promise<void> {
    const qref = ref.parent.parent as DocumentReference<Question> | null
    if (!qref) {
      throw new Error(
        "PromptOptions collection needs a parent document (question).",
      )
    }
    await deleteDoc(ref)
    /* update question doc to remove reference to {oref} */
    await setDoc(qref, { options: arrayRemove(ref) }, { merge: true })
  }

  public async deleteById(params: DocumentParams<PromptOption>): Promise<void> {
    const ref = this.doc(params)
    await this.deleteByRef(ref)
  }
}
