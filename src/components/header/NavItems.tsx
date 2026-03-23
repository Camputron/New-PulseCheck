import { useAuthContext } from "@/lib/hooks"
import { Box, Button, useMediaQuery, useTheme } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"

const items = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Join Poll", to: "/poll/join" },
  { label: "History", to: "/poll/history" },
] as const

export default function NavItems() {
  const { user, loading } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  if (loading || !user || user.isAnonymous || isMobile) {
    return null
  }

  return (
    <Box display='flex' alignItems='center' gap={0.5}>
      {items.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Button
            key={item.label}
            color='inherit'
            onClick={() => void navigate(item.to)}
            sx={{
              textTransform: "none",
              fontWeight: isActive ? 700 : 500,
              fontSize: "0.9rem",
              color: isActive ? "primary.main" : "text.secondary",
              px: 1.5,
              minWidth: "auto",
              borderBottom: 2,
              borderColor: isActive ? "primary.main" : "transparent",
              borderRadius: 0,
              "&:hover": {
                color: "text.primary",
                backgroundColor: "transparent",
              },
            }}>
            {item.label}
          </Button>
        )
      })}
    </Box>
  )
}
