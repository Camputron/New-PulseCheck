import { useAuthContext } from "@/lib/hooks"
import { Box, Button, useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"

const navLinks = [
  { label: "About", to: "/", state: { scrollTo: "about" } },
  { label: "Features", to: "/", state: { scrollTo: "features" } },
  { label: "FAQs", to: "/", state: { scrollTo: "faqs" } },
] as const

export default function GuestNavItems() {
  const { user, loading } = useAuthContext()
  const navigate = useNavigate()
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"))

  if (loading || user || isPhone) {
    return null
  }

  return (
    <Box display='flex' alignItems='center' gap={1}>
      {navLinks.map((item) => (
        <Button
          key={item.label}
          color='inherit'
          onClick={() => void navigate(item.to, { state: item.state })}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.9rem",
            color: "text.secondary",
            px: 1.5,
            minWidth: "auto",
            "&:hover": {
              color: "text.primary",
              backgroundColor: "transparent",
            },
          }}>
          {item.label}
        </Button>
      ))}
    </Box>
  )
}
