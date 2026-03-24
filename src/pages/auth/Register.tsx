import { Box } from "@mui/material"
import RegisterForm from "@/components/auth/RegisterForm"
import useRedirectIfAuthenticated from "@/hooks/useRedirectIfAuthenticated"
import AuthBranding from "@/components/auth/AuthBranding"

export default function Register() {
  useRedirectIfAuthenticated()

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        flexDirection: { xs: "column", md: "row" },
      }}>
      <AuthBranding
        heading='Join PulseCheck.'
        subtext='Create an account to start building interactive sessions and engaging your classroom in real time.'
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
        <RegisterForm />
      </Box>
    </Box>
  )
}
