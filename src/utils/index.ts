import { Timestamp } from "firebase/firestore"
import { ActiveSession, HostSettings } from "@/types"

const ACTIVE_SESSION_KEY = "active-session"

export function saveActiveSession(session: ActiveSession): void {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session))
  } catch (err) {
    console.warn("Failed to save active session to localStorage", err)
  }
}

export function getActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ActiveSession
  } catch {
    return null
  }
}

export function clearActiveSession(): void {
  localStorage.removeItem(ACTIVE_SESSION_KEY)
}

const HOST_SETTINGS_PREFIX = "host-settings"

/** @deprecated F39 migration only. Use useUser().updateSessionDefaults instead. */
export function saveHostSettings(uid: string, settings: HostSettings): void {
  try {
    localStorage.setItem(
      `${HOST_SETTINGS_PREFIX}:${uid}`,
      JSON.stringify(settings),
    )
  } catch (err) {
    console.warn("Failed to save host settings to localStorage", err)
  }
}

/** @deprecated F39 migration only. Use useUser().user?.session_defaults instead. */
export function getHostSettings(uid: string): HostSettings | null {
  try {
    const raw = localStorage.getItem(`${HOST_SETTINGS_PREFIX}:${uid}`)
    if (!raw) return null
    return JSON.parse(raw) as HostSettings
  } catch {
    return null
  }
}

/** @deprecated F39 migration only. */
export function clearHostSettings(uid: string): void {
  localStorage.removeItem(`${HOST_SETTINGS_PREFIX}:${uid}`)
}

/**
 * Converts string to a muted hex color that blends well in both light and dark mode.
 * Uses HSL with constrained saturation (35-55%) and lightness (40-60%) to avoid
 * overly bright or dark colors.
 */
export function stoc(str?: string): string {
  if (!str) return "#808080"
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = (((hash & 0xffff) % 360) + 360) % 360
  const sat = 35 + (((hash >> 8) & 0xff) % 21)
  const lit = 40 + (((hash >> 16) & 0xff) % 21)

  const sn = sat / 100
  const ln = lit / 100
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => {
    const k = (n + hue / 30) % 12
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Generated initials from a given name string based on the following rules:
 *  - If there is only one word, return the first character.
 *  - If there are two words, return the first character of each word.
 *  - If there are three or more words, take the first characters of the first and last word.
 *  - The resulting initials are always in uppercase.
 *  - Leading, trailing, and extra spaces are trimmed before processing.
 * @param name - The input name string.
 * @returns The formatted uppercase initials.
 */
export function stoni(name?: string): string {
  if (!name) return ""
  const words = name.trim().split(/\s+/) // Split by whitespace and remove extra spaces
  let initials = ""
  if (words.length === 1) {
    /* take first character of first word */
    initials = words[0].slice(0, 1)
  } else if (words.length === 2) {
    /* take first character of first and second word */
    initials = words[0].slice(0, 1) + words[1].slice(0, 1)
  } else {
    /* take first character of first and last word */
    initials = words[0].slice(0, 1) + words[words.length - 1].slice(0, 1)
  }
  return initials.toUpperCase()
}

/**
 * Converts MM:SS to milliseconds (number)
 */
export function mmsston(formattedMMSS: string): number | null {
  if (!formattedMMSS) {
    return null
  }
  const tokens = formattedMMSS.split(":")
  const minutes = parseInt(tokens[0]) || 0
  const seconds = parseInt(tokens[1]) || 0
  return (minutes * 60 + seconds) * 1000
}

/**
 * Converts number to MM:SS
 */
export function ntommss(n: number | null) {
  if (!n || isNaN(n)) {
    return ""
  }
  const totalSeconds = Math.floor(n / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

/**
 * Converts string to MM:SS format
 */
export function stommss(s: string) {
  let val = s.replace(/\D/g, "")
  if (val.length > 4) {
    val = val.slice(0, 4)
  }
  let formattedVal = val
  if (val.length >= 3) {
    /* format to MM:SS */
    formattedVal = `${val.slice(0, val.length - 2)}:${val.slice(-2)}`
  } else if (val.length > 0) {
    formattedVal = val
  }
  return formattedVal
}

/**
 * Converts a number to a label displaying the number of participants in a poll session.
 * @param n Number of participants
 * @returns Formatted participant count label
 */
export function ntops(n: number | null | undefined) {
  return `${n ?? 0} Participant${n !== 1 ? "s" : ""}`
}

/**
 * Converts number to Question(s) {N} format.
 */
export function ntoq(n: number) {
  return `${n} Question${n !== 1 ? "s" : ""}`
}

export function tstos(timestamp: Timestamp) {
  const lastUpdated = timestamp.toDate()
  const now = new Date()

  // Calculate time difference in seconds
  const diffInSeconds = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / 1000,
  )

  let timeAgo = ""
  if (diffInSeconds < 5) {
    timeAgo = "Just Now"
  } else if (diffInSeconds < 60) {
    timeAgo = `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    timeAgo = `${diffInMinutes}m ago`
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600)
    timeAgo = `${diffInHours}h ago`
  } else if (diffInSeconds < 2592000) {
    const diffInDays = Math.floor(diffInSeconds / 86400)
    timeAgo = `${diffInDays}d ago`
  } else if (diffInSeconds < 31536000) {
    const diffInMonths = Math.floor(diffInSeconds / 2592000)
    timeAgo = `${diffInMonths}mo ago`
  } else {
    const diffInYears = Math.floor(diffInSeconds / 31536000)
    timeAgo = `${diffInYears}y ago`
  }
  return `${timeAgo}`
}

/**
 * Generates a random room code.
 */
export function generateRoomCode() {
  const MAX = 6
  const characters = "ABCDEFGHJKLMNPRTUVWXY0123456789"
  let roomCode = ""

  for (let i = 0; i < MAX; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    roomCode += characters[randomIndex]
  }

  return roomCode
}

export function getMedian(arr: number[]): number {
  const len = arr.length
  const mid = Math.floor(len / 2)
  if (len % 2 === 0) {
    return (arr[mid - 1] + arr[mid]) / 2
  } else {
    return arr[mid]
  }
}

/**
 * @brief Converts 0-100 scale number to red-green color
 * @deprecated
 */
export function ntogc(score: number | undefined): string {
  const clamped = Math.max(0, Math.min(100, score ?? NaN))
  const hue = clamped * 1.2
  return `hsl(${hue}, 58%, 25%)`
}
