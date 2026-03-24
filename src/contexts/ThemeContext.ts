import { PaletteMode } from "@mui/material"
import { createContext } from "react"
import { ThemeType } from "../types"

interface ThemeContextType {
  toggleTheme: () => void
  setTheme: (type: ThemeType) => void
  mode: PaletteMode
}

/**
 * `ThemeContext` is a React context that provides the current theme mode
 * (light or dark) and a function to toggle between the two modes.
 *
 * This context is used by the `ThemeProvider` component to manage the theme
 * and make the theme mode and toggle function available throughout the app.
 * Components can consume this context to read the current theme mode and
 * change it when needed.
 *
 * The context provides the following values:
 * - `mode`: The current theme mode, which can either be "light" or "dark".
 * - `toggleTheme`: A function that toggles the current theme mode between light and dark.
 *
 * @type {ThemeContextType | null} - The context value can either be the `ThemeContextType`
 *    (containing `toggleTheme` and `mode`) or `null` if the context is not provided.
 */
export const ThemeContext = createContext<ThemeContextType | null>(null)
