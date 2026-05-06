import { useTheme, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"

export type ViewMode = "cards" | "table"

export type ViewModeStorageKey =
  | "polls:view"
  | "banks:view"
  | "history:sessions:view"
  | "history:submissions:view"

interface UseViewModeResult {
  view: ViewMode
  effectiveView: ViewMode
  isMobile: boolean
  setView: (view: ViewMode) => void
}

/**
 * Persists a Cards/Table view preference per storage key, while forcing
 * "cards" on mobile-sized viewports regardless of the stored preference.
 */
export default function useViewMode(
  storageKey: ViewModeStorageKey
): UseViewModeResult {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "cards"
    const stored = window.localStorage.getItem(storageKey)
    return stored === "table" ? "table" : "cards"
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, view)
  }, [storageKey, view])

  return {
    view,
    effectiveView: isMobile ? "cards" : view,
    isMobile,
    setView,
  }
}
