import { SnackbarContext } from "@/contexts/SnackbarContext"
import { useContext } from "react"

/**
 * `useSnackbar` is a custom hook that provides access to the `SnackbarContext`'s
 * `show` function, allowing components to trigger the display of a snackbar
 * anywhere in the app. The hook ensures that the component is wrapped in the
 * `SnackbarProvider`, which provides the necessary context.
 *
 * If the hook is used outside of the `SnackbarProvider`, it will throw an error.
 *
 * @throws {Error} Will throw an error if the hook is used outside of the
 *    `SnackbarProvider` context.
 *
 * @returns {SnackbarContextType} The `SnackbarContext` value, which contains
 *    the `show` function to display snackbars.
 */
export default function useSnackbar() {
  const snackbar = useContext(SnackbarContext)
  if (!snackbar) {
    throw new Error("useSnackbar must be used within SnackbarProvider")
  }
  return snackbar
}
