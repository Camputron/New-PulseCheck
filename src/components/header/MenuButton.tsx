import {
  Box,
  Divider,
  IconButton,
  Menu,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"
import React, { useState } from "react"
import { useAuthContext } from "@/lib/hooks"
import GuestMenuList from "./GuestMenuList"
import AuthMenuList from "./AuthMenuList"
import ProfileIcon from "./ProfileIcon"

export default function MenuButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAuthContext()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setDrawerOpen(true)
    } else {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
    setDrawerOpen(false)
  }

  return (
    <React.Fragment>
      <IconButton
        color='inherit'
        size='large'
        onClick={handleOpen}
        sx={{ border: "none" }}>
        {user ? <ProfileIcon /> : <MenuIcon />}
      </IconButton>
      {!user?.isAnonymous && (
        <React.Fragment>
          {/* Desktop: dropdown menu */}
          {!isMobile && (
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    minWidth: 200,
                    overflow: "visible",
                    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
                  },
                },
              }}>
              <GuestMenuList handleClose={handleClose} />
              <AuthMenuList handleClose={handleClose} />
            </Menu>
          )}
          {/* Mobile: bottom sheet drawer */}
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
                <GuestMenuList handleClose={handleClose} />
                <AuthMenuList handleClose={handleClose} />
              </Box>
              <Box sx={{ pb: 2 }} />
            </SwipeableDrawer>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
