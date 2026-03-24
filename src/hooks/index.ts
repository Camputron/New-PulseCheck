import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/api"
import useSnackbar from "./useSnackbar"
import { useThemeContext } from "./useThemeContext"

/**
 * Custom hook to get the current authenticated user state from firebase.
 *
 * Uses `userAuthState` from `react-firebase-hooks/auth` to provide real-time authentication.
 * @returns {{ user: User | null | undefined, loading: boolean, error: Error | undefined }}
 * - `user`: The authenticated user object (or `null` if not logged in)
 * - `loading`: A boolean indicating if authentication status is still being determined.
 * - `error`: An error object if there was an issue retreiving the auth state.
 * @example
 * const { user, loading, error } = useAuthContext()
 * if (loading) return <p>Loading...</p>
 * if (error) return <p>Error: {error.message}</p>
 * return <p>Welcome, {user ? user.displayName : "Guest"}!</p>
 */
export function useAuthContext() {
  const [user, loading, error] = useAuthState(auth)
  return { user, loading, error }
}

export { useSnackbar, useThemeContext }
