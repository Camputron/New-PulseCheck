import {
  Box,
  AppBar as MUIAppbar,
  Slide,
  Toolbar,
  useScrollTrigger,
} from "@mui/material"
import AppTitle from "./AppTitle"
import GuestNavItems from "./GuestNavItems"
import MenuButton from "./MenuButton"
import AuthNavItems from "./AuthNavItems"

export default function AppBar() {
  return (
    <HideOnScroll>
      <MUIAppbar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
          color: "text.primary",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 1px 12px rgba(0, 0, 0, 0.3)"
              : "0 1px 12px rgba(0, 0, 0, 0.04)",
        }}>
        <Toolbar
          sx={{
            // px: { xs: 2, md: 4 },
            minHeight: { xs: 56, md: 64 },
          }}>
          <AppTitle />
          <Box pr={2} />
          <GuestNavItems />
          <AuthNavItems />
          <Box flexGrow={1} />
          <MenuButton />
        </Toolbar>
      </MUIAppbar>
    </HideOnScroll>
  )
}

interface HideOnScrollProps {
  children: React.ReactElement
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger({ threshold: 50 })
  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
      timeout={{ enter: 500, exit: 300 }}>
      {children}
    </Slide>
  )
}
