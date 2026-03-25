import {
  doc,
  DocumentReference,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import BaseStore from "./store"
import { User } from "@/types"
import { clx } from "@/api"

/**
 * Manages /users collection in Firestore.
 */
export default class UserStore extends BaseStore {
  public doc(uid: string): DocumentReference<User> {
    return doc(this.db, clx.users, uid) as DocumentReference<User>
  }

  public async create(uid: string, payload: Partial<User>) {
    const uref = this.doc(uid)
    const userDoc = await getDoc(uref)
    if (userDoc.exists()) {
      return setDoc(
        uref,
        {
          email: payload.email,
          display_name: payload.display_name,
          photo_url: payload.photo_url,
        },
        { merge: true }
      )
    } else {
      return setDoc(
        uref,
        {
          email: payload.email,
          display_name: payload.display_name,
          photo_url: payload.photo_url,
          created_at: serverTimestamp(),
        },
        { merge: false }
      )
    }
  }

  public async get(uid: string): Promise<User> {
    const uref = this.doc(uid)
    const userDoc = await getDoc(uref)
    if (!userDoc.exists()) {
      throw new Error(`User${uid} does not exist!`)
    }
    return userDoc.data()
  }
}
