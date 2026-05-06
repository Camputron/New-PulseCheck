import { useCallback, useEffect, useState } from "react"
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import api, { auth } from "@/api"
import { HostSettings, User } from "@/types"
import { clearHostSettings, getHostSettings } from "@/utils"

interface UseUser {
  user: User | null
  authUser: FirebaseUser | null | undefined
  loading: boolean
  error: Error | null
  updateDisplayName: (next: string) => Promise<void>
  updateEmail: (next: string) => Promise<void>
  updatePhotoUrl: (next: string | null) => Promise<void>
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>
  updateSessionDefaults: (next: HostSettings) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Provides the current user's Firestore profile and edit methods.
 * Keeps Firebase Auth and the /users/{uid} document in sync on every write.
 */
export default function useUser(): UseUser {
  const [authUser, authLoading] = useAuthState(auth)
  const [user, setUser] = useState<User | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback(async (uid: string) => {
    setProfileLoading(true)
    try {
      const profile = await api.users.get(uid)
      setUser(profile)
      setError(null)

      if (!profile.session_defaults) {
        const local = getHostSettings(uid)
        if (local) {
          await api.users.update(uid, { session_defaults: local })
          setUser((prev) =>
            prev ? { ...prev, session_defaults: local } : prev,
          )
          clearHostSettings(uid)
        }
      }
    } catch (err) {
      console.error(`Failed to fetch user profile ${uid}`, err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setUser(null)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authUser || authUser.isAnonymous) {
      setUser(null)
      return
    }
    void fetchProfile(authUser.uid)
  }, [authUser, fetchProfile])

  const refresh = useCallback(async () => {
    if (!authUser || authUser.isAnonymous) return
    await fetchProfile(authUser.uid)
  }, [authUser, fetchProfile])

  const updateDisplayName = useCallback(
    async (next: string) => {
      if (!authUser) throw new Error("No authenticated user")
      try {
        await updateProfile(authUser, { displayName: next })
        await api.users.update(authUser.uid, { display_name: next })
        setUser((prev) => (prev ? { ...prev, display_name: next } : prev))
      } catch (err) {
        console.error(`Failed to update display name for ${authUser.uid}`, err)
        throw err
      }
    },
    [authUser],
  )

  const updateEmail = useCallback(
    async (next: string) => {
      if (!authUser) throw new Error("No authenticated user")
      try {
        await fbUpdateEmail(authUser, next)
        await api.users.update(authUser.uid, { email: next })
        setUser((prev) => (prev ? { ...prev, email: next } : prev))
      } catch (err) {
        console.error(`Failed to update email for ${authUser.uid}`, err)
        throw err
      }
    },
    [authUser],
  )

  const updatePhotoUrl = useCallback(
    async (next: string | null) => {
      if (!authUser) throw new Error("No authenticated user")
      try {
        await updateProfile(authUser, { photoURL: next })
        await api.users.update(authUser.uid, { photo_url: next })
        setUser((prev) => (prev ? { ...prev, photo_url: next } : prev))
      } catch (err) {
        console.error(`Failed to update photo URL for ${authUser.uid}`, err)
        throw err
      }
    },
    [authUser],
  )

  const updateSessionDefaults = useCallback(
    async (next: HostSettings) => {
      if (!authUser) throw new Error("No authenticated user")
      try {
        await api.users.update(authUser.uid, { session_defaults: next })
        setUser((prev) => (prev ? { ...prev, session_defaults: next } : prev))
      } catch (err) {
        console.error(
          `Failed to update session defaults for ${authUser.uid}`,
          err,
        )
        throw err
      }
    },
    [authUser],
  )

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!authUser?.email) throw new Error("No authenticated user with email")
      try {
        const credential = EmailAuthProvider.credential(
          authUser.email,
          currentPassword,
        )
        await reauthenticateWithCredential(authUser, credential)
        await fbUpdatePassword(authUser, newPassword)
      } catch (err) {
        console.error(`Failed to update password for ${authUser.uid}`, err)
        throw err
      }
    },
    [authUser],
  )

  return {
    user,
    authUser,
    loading: authLoading || profileLoading,
    error,
    updateDisplayName,
    updateEmail,
    updatePhotoUrl,
    updatePassword,
    updateSessionDefaults,
    refresh,
  }
}
