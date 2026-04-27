import { useState, useRef, useCallback, ReactNode } from "react"
import { Snackbar, Alert } from "@mui/material"
import { SnackbarContext, SnackbarOptions } from "@/contexts/SnackbarContext"

const DEFAULT_TYPE = "info"
const DEFAULT_DURATION = 3000
const DEFAULT_POSITION = {
  vertical: "top" as const,
  horizontal: "center" as const,
}

export const SnackbarProvider = (props: { children: ReactNode }) => {
  const queueRef = useRef<SnackbarOptions[]>([])
  const [current, setCurrent] = useState<SnackbarOptions | null>(null)
  const [open, setOpen] = useState(false)

  const processQueue = useCallback(() => {
    if (queueRef.current.length > 0) {
      setCurrent(queueRef.current.shift()!)
      setOpen(true)
    }
  }, [])

  const show = useCallback(
    (opts: SnackbarOptions) => {
      queueRef.current.push(opts)
      if (!open) {
        processQueue()
      } else {
        // Close the current snackbar so the next one can appear after exit
        setOpen(false)
      }
    },
    [open, processQueue],
  )

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") return
    setOpen(false)
  }

  const handleExited = () => {
    processQueue()
  }

  const severity = current?.type ?? DEFAULT_TYPE
  const duration = current?.duration ?? DEFAULT_DURATION
  const position = current?.position ?? DEFAULT_POSITION

  return (
    <SnackbarContext.Provider value={{ show }}>
      {props.children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={position}
        TransitionProps={{ onExited: handleExited }}>
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ backdropFilter: "blur(12px)" }}>
          {current?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
