import { useState, ReactNode } from "react"
import { Snackbar, Alert, SnackbarOrigin } from "@mui/material"
import {
  SnackbarContext,
  SnackbarOptions,
  SeverityType,
} from "@/contexts/SnackbarContext"

const DEFAULT_TYPE = "info"
const DEFAULT_DURATION = 3000
const DEFAULT_V = "top"
const DEFAULT_H = "center"

/**
 * `SnackbarProvider` is a context provider that manages and displays snackbars (temporary
 * notifications) in the app. It provides a `show` function to trigger snackbars from anywhere
 * within the app by using the `SnackbarContext`.
 *
 * The component handles the following aspects:
 * - **Message**: The content of the snackbar.
 * - **Type**: The severity/type of the snackbar (e.g., info, error, warning, success).
 * - **Duration**: The time in milliseconds for the snackbar to stay visible.
 * - **Position**: The position of the snackbar on the screen.
 *
 * @param {ReactNode} children - The child components that will be rendered inside the provider.
 *                                These components will have access to the snackbar context.
 *
 * @returns {JSX.Element} The JSX element that provides the `SnackbarContext` and renders
 *                        the snackbar UI based on state.
 */
export const SnackbarProvider = (props: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<SeverityType | undefined>()
  const [duration, setDuration] = useState<number | undefined>()
  const [position, setPosition] = useState<SnackbarOrigin>({
    vertical: DEFAULT_V,
    horizontal: DEFAULT_H,
  })

  /**
   * Triggers the display of a snackbar with the provided options.
   *
   * @param {SnackbarOptions} opts - The options used to configure the snackbar.
   */
  const show = (opts: SnackbarOptions) => {
    setMessage(opts.message)
    setType(opts.type ?? DEFAULT_TYPE)
    setDuration(opts.duration ?? DEFAULT_DURATION)
    if (opts.position) {
      setPosition(opts.position)
    }
    setOpen(true)
  }

  /**
   * Closes the currently open snackbar.
   */
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <SnackbarContext.Provider value={{ show }}>
      {props.children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={position}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
