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
import NavItems from "./NavItems"

export default function AppBar() {
  return (
    <HideOnScroll>
      <MUIAppbar
        position='sticky'
        elevation={0}
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          borderBottom: 1,
          borderColor: "divider",
          color: "text.primary",
        }}>
        <Toolbar
          sx={{
            px: { xs: 2, md: 4 },
            minHeight: { xs: 56, md: 64 },
          }}>
          <AppTitle />
          <Box flexGrow={1} />
          <GuestNavItems />
          <NavItems />
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
      direction='down'
      in={!trigger}
      timeout={{ enter: 500, exit: 300 }}>
      {children}
    </Slide>
  )
}
