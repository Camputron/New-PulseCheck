import {
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  signInAnonymously,
  signOut,
  updateProfile,
} from "firebase/auth"
import api, { auth } from "@/api"

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

  /**
   * Upgrades the current anonymous user to a permanent email/password account.
   * Preserves the UID so existing SessionUser/submission docs remain accessible.
   */
  public async upgradeGuestWithEmail(
    email: string,
    password: string,
    displayName: string,
  ) {
    const current = auth.currentUser
    if (!current?.isAnonymous) {
      throw new Error("No anonymous user to upgrade")
    }
    const cred = EmailAuthProvider.credential(email, password)
    const result = await linkWithCredential(current, cred)
    await updateProfile(result.user, { displayName })
    await api.users.create(result.user.uid, {
      email,
      display_name: displayName,
      photo_url: result.user.photoURL,
    })
    return result
  }

  /**
   * Upgrades the current anonymous user to a permanent Google-backed account.
   */
  public async upgradeGuestWithGoogle() {
    const current = auth.currentUser
    if (!current?.isAnonymous) {
      throw new Error("No anonymous user to upgrade")
    }
    const result = await linkWithPopup(current, new GoogleAuthProvider())
    await api.users.create(result.user.uid, {
      email: result.user.email!,
      display_name: result.user.displayName!,
      photo_url: result.user.photoURL,
    })
    return result
  }
}
