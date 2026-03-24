import { useContext } from "react"
import { ThemeContext } from "@/contexts/ThemeContext"

/**
 * `useThemeContext` is a custom hook that provides access to the `ThemeContext`'s
 * values, allowing components to access the current theme mode (light or dark)
 * and the `toggleTheme` function to switch between modes.
 *
 * This hook ensures that the component is wrapped in the `ThemeProvider`, which
 * provides the necessary context.
 *
 * If the hook is used outside of the `ThemeProvider`, it will throw an error.
 *
 * @throws {Error} Will throw an error if the hook is used outside of the
 *    `ThemeProvider` context.
 *
 * @returns {ThemeContextType} The `ThemeContext` value, which contains:
 *    - `mode`: The current theme mode (either "light" or "dark").
 *    - `toggleTheme`: A function to toggle between light and dark modes.
 */
export const useThemeContext = () => {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error("useThemeContext must be used within ThemeProvider")
  }
  return theme
}
