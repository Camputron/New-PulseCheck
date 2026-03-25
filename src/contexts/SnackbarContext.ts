import {
  AlertColor,
  AlertPropsColorOverrides,
  SnackbarOrigin,
} from "@mui/material"
import { OverridableStringUnion } from "@mui/types"
import { createContext } from "react"

/**
 * `SeverityType` defines the valid types of severity for the snackbar.
 * It is an extension of `AlertColor` from Material-UI, which includes the
 * possible values for severity (e.g., "success", "error", "info", "warning").
 */
export type SeverityType = OverridableStringUnion<
  AlertColor,
  AlertPropsColorOverrides
>

/**
 * `SnackbarOptions` defines the options available when showing a snackbar.
 *
 * - `message`: The message to display in the snackbar.
 * - `type`: The severity/type of the snackbar (optional, defaults to "info").
 * - `duration`: The duration (in milliseconds) the snackbar will remain visible (optional)
 * - `position`: The position of the snackbar on the screen (optional).
 */
export interface SnackbarOptions {
  message: string
  type?: SeverityType
  duration?: number
  position?: SnackbarOrigin
}

/**
 * `SnackbarContextType` defines the context's value type, which contains a `show` function
 * that allows triggering the display of a snackbar.
 *
 * - `show`: A function to display a snackbar with the provided opts (`SnackbarOptions`).
 */
interface SnackbarContextType {
  show: (opts: SnackbarOptions) => void
}

/**
 * `SnackbarContext` is a React context used to provide a `show` function that can be
 * used throughout the app to display a snackbar.
 *
 * This context allows components to trigger snackbars by calling the `show` method.
 *
 * @type {SnackbarContextType | null} The context value can either be an object
 *    with a `show` function or `undefined` if the context is not provided.
 */
export const SnackbarContext = createContext<SnackbarContextType | null>(null)
