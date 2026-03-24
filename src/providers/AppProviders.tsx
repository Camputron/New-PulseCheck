import { BrowserRouter } from "react-router-dom"
import { SnackbarProvider } from "./SnackbarProvider"
import { ThemeProvider } from "./ThemeProvider"
import { ReactNode } from "react"

/**
 * `AppProviders` is a wrapper component that provides essential contexts and providers
 * for the entire application. It wraps the children components with necessary contexts
 * (e.g. routing, theming, snackbars) to these services throughout the app.
 *
 *
 * @param {ReactNode} children - The child components that will be rendered inside the providers.
 *
 * @returns {JSX.Element} The JSX element that wraps the children with the necessary providers.
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
