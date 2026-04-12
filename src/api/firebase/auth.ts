import { signInAnonymously, signOut } from "firebase/auth"
import { auth } from "@/api"

/**
 * Manages user authentication.
 */
export default class AuthStore {
  /**
   * Logs in teh user as a guest using Firebase Authentication.
   */
  public loginAsGuest() {
    return signInAnonymously(auth)
  }
  /**
   * Logout the current user using Firebase Authentication
   */
  public logout() {
    return signOut(auth)
  }
}
