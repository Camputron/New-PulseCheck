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
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import BaseStore, { CollectionParams, DocumentParams, CRUDStore } from "./store"
import { Poll, PromptOption, Question } from "../../types"
import { clx } from "@/api"

/**
 * Resolves the parent poll DocumentReference from any descendant ref
 * (question ref or option ref). Returns null if the ref is rooted outside
 * the polls collection.
 */
function pollRefFromQuestionRef(
  qref: DocumentReference<Question>,
): DocumentReference<Poll> | null {
  return (qref.parent.parent as DocumentReference<Poll> | null) ?? null
}

function pollRefFromOptionRef(
  oref: DocumentReference<PromptOption, DocumentData>,
): DocumentReference<Poll> | null {
  const qref = oref.parent.parent as DocumentReference<Question> | null
  return qref ? pollRefFromQuestionRef(qref) : null
}

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

  public async create(
    ref: CollectionReference<PromptOption>,
    initial?: Partial<PromptOption>,
  ) {
    const qref = ref.parent as DocumentReference<Question> | null
    if (!qref) {
      throw new Error(
        "PromptOptions collection needs a parent document (questions).",
      )
    }
    const oref = await addDoc(ref, {
      text: initial?.text ?? "",
      correct: initial?.correct ?? false,
    })
    /* update question doc to include reference to {oref} and bump updated_at */
    await setDoc(
      qref,
      { options: arrayUnion(oref), updated_at: serverTimestamp() },
      { merge: true },
    )
    /* bump parent poll's updated_at so edits surface in dashboards */
    const pref = pollRefFromQuestionRef(qref)
    if (pref) {
      await updateDoc(pref, { updated_at: serverTimestamp() })
    }
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
    /* bump parent question + poll updated_at — option has no own timestamp.
       Best-effort: a debounced editor write may race with a poll/question
       delete, in which case the parent doc is gone and the bump fails. */
    const qref = ref.parent.parent as DocumentReference<Question> | null
    if (!qref) return
    try {
      await updateDoc(qref, { updated_at: serverTimestamp() })
    } catch (err) {
      console.debug("Skipped bumping question updated_at:", err)
      return
    }
    const pref = pollRefFromQuestionRef(qref)
    if (!pref) return
    try {
      await updateDoc(pref, { updated_at: serverTimestamp() })
    } catch (err) {
      console.debug("Skipped bumping poll updated_at:", err)
    }
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
    /* update question doc to remove reference to {oref} and bump updated_at */
    await setDoc(
      qref,
      { options: arrayRemove(ref), updated_at: serverTimestamp() },
      { merge: true },
    )
    /* bump parent poll's updated_at so edits surface in dashboards */
    const pref = pollRefFromOptionRef(ref)
    if (pref) {
      await updateDoc(pref, { updated_at: serverTimestamp() })
    }
  }

  public async deleteById(params: DocumentParams<PromptOption>): Promise<void> {
    const ref = this.doc(params)
    await this.deleteByRef(ref)
  }
}
