import {
  Box,
  Button,
  Divider,
  IconButton,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Login } from "@mui/icons-material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "@/lib/hooks"
import AuthMenuList from "./AuthMenuList"
import ProfileIcon from "./ProfileIcon"

export default function MenuButton() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))

  const handleClose = () => {
    setDrawerOpen(false)
  }

  // Unauthenticated: show sign-in button
  if (!user) {
    return (
      <Button
        variant='outlined'
        size='small'
        startIcon={<Login />}
        onClick={() => void navigate("/login")}
        sx={{ textTransform: "none", borderRadius: 2 }}>
        Sign In
      </Button>
    )
  }

  // Anonymous guest: no menu
  if (user.isAnonymous) {
    return null
  }

  const handleClick = () => {
    if (isMobile) {
      setDrawerOpen(true)
    } else {
      void navigate("/settings")
    }
  }

  return (
    <React.Fragment>
      <IconButton
        color='inherit'
        size='large'
        onClick={handleClick}
        sx={{ border: "none" }}>
        <ProfileIcon />
      </IconButton>
      {/* Mobile only: bottom sheet drawer */}
      {isMobile && (
        <SwipeableDrawer
          anchor='bottom'
          open={drawerOpen}
          onClose={handleClose}
          onOpen={() => setDrawerOpen(true)}
          disableSwipeToOpen
          PaperProps={{
            sx: {
              borderRadius: "16px 16px 0 0",
              maxHeight: "60vh",
            },
          }}>
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: "divider",
              borderRadius: 2,
              mx: "auto",
              mt: 1.5,
              mb: 1,
            }}
          />
          <Typography
            variant='body2'
            color='text.secondary'
            fontWeight={600}
            sx={{ px: 2, pb: 1 }}>
            Menu
          </Typography>
          <Divider />
          <Box sx={{ py: 1 }}>
            <AuthMenuList handleClose={handleClose} />
          </Box>
          <Box sx={{ pb: 2 }} />
        </SwipeableDrawer>
      )}
    </React.Fragment>
  )
}
