import { collection, CollectionReference } from "firebase/firestore"
import BaseStore from "../store"
import { clx } from "@/api"
import { WaitingUser } from "@/types"

/** Manages users waiting to join a session. */
export default class WaitingUserStore extends BaseStore {
  public collect(sid: string) {
    return collection(
      this.db,
      clx.sessions,
      sid,
      clx.waiting_users
    ) as CollectionReference<WaitingUser>
  }
}
