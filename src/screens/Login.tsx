import { Box } from "@mui/material"
import LoginForm from "@/components/auth/LoginForm"
import useRedirectIfAuthenticated from "@/lib/hooks/useRedirectIfAuthenticated"
import AuthBranding from "@/components/auth/AuthBranding"

export default function Login() {
  useRedirectIfAuthenticated()

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        flexDirection: { xs: "column", md: "row" },
      }}>
      <AuthBranding
        heading='Welcome back.'
        subtext='Sign in to manage your sessions, review results, and keep your classroom engaged.'
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, md: 0 },
          px: 2,
        }}>
        <LoginForm />
      </Box>
    </Box>
  )
}
