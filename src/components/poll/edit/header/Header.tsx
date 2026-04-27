import {
  Toolbar,
  TextField,
  IconButton,
  Box,
  Typography,
  AppBar,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import React, { useState } from "react"
import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import {
  ArrowBack,
  AutoAwesome,
  Done,
  Edit,
  MenuOpen,
  ScreenShare,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { Poll } from "@/types"
import DeleteMenuItem from "./DeleteMenuItem"
import DownloadPDFMenuItem from "./DownloadPDFMenuItem"
import UploadPDFDialog from "../UploadPDFDialog"

interface HeaderProps {
  pid: string /* poll id */
  poll: Poll
  canHost: boolean
  onStartConfig: () => void
}

/**
 * Allows users to edit the title of a poll.
 * Users can click on the edit icon next to the title to edit it inline and save changes with the Done icon.
 * Below the title it will display the last time the poll was updated.
 * @author VerySirias
 * @returns {JSX.Element}
 */
export default function Header(props: HeaderProps) {
  const { pid, poll, canHost, onStartConfig } = props
  const [title, setTitle] = useState(poll.title)
  const [isEditing, setIsEditing] = useState(false)
  const snackbar = useSnackbar()
  const [anchorElPoll, setAnchorElPoll] = useState<HTMLElement | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const [generateWithAIModal, setGenerateWithAIModal] = useState(false)
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"))

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setDrawerOpen(true)
    } else {
      setAnchorElPoll(event.currentTarget)
    }
  }

  const openGenerateWithAI = () => {
    setGenerateWithAIModal(true)
    handleClose()
  }

  const handleClose = () => {
    setAnchorElPoll(null)
    setDrawerOpen(false)
  }

  async function saveTitle(text: string) {
    const ref = api.polls.doc(pid)
    await api.polls.update(ref, {
      title: text,
    })
  }

  const handleTitleClick = () => {
    handleClickEdit()
  }

  const handleClickEdit = () => {
    if (isEditing) {
      saveTitle(title)
        .then(() => {
          setIsEditing(false)
        })
        .catch(() => {
          setIsEditing(true)
          snackbar.show({
            type: "error",
            message: "Failed to update poll",
          })
        })
    } else {
      setIsEditing(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      handleClickEdit()
    }
  }

  const handleHostClick = () => {
    onStartConfig()
    handleClose()
  }

  return (
    <React.Fragment>
      <AppBar
        elevation={0}
        position='relative'
        sx={{
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: 1,
          borderColor: "divider",
          color: "text.primary",
        }}>
        <Toolbar>
          <Stack direction='row' alignItems='center' flex={1}>
            <IconButton
              onClick={() => {
                void navigate(-1)
              }}>
              <ArrowBack />
            </IconButton>
            {isEditing ? (
              <TextField
                size='small'
                placeholder='Poll Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: isEditing && (
                      <IconButton color='primary' onClick={handleClickEdit}>
                        <Done />
                      </IconButton>
                    ),
                  },
                }}
              />
            ) : (
              <Typography
                onDoubleClick={handleTitleClick}
                textAlign='left'
                fontWeight={600}>
                {title}
              </Typography>
            )}
            {!isEditing && (
              <IconButton
                size='small'
                color='primary'
                onClick={handleClickEdit}>
                <Edit />
              </IconButton>
            )}
            <Box flex={1} marginInline={2} />
            <Box>
              <IconButton onClick={handleOpen} color='inherit'>
                <MenuOpen />
              </IconButton>
              {/* Desktop: dropdown menu */}
              {!isMobile && (
                <Menu
                  anchorEl={anchorElPoll}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  open={Boolean(anchorElPoll)}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        minWidth: 220,
                      },
                    },
                  }}>
                  <MenuItem onClick={openGenerateWithAI}>
                    <ListItemIcon>
                      <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText>Generate with AI</ListItemText>
                  </MenuItem>
                  <DownloadPDFMenuItem poll={poll} onClick={handleClose} />
                  <Divider />
                  <DeleteMenuItem pid={pid} onClick={handleClose} />
                  <Divider />
                  <MenuItem onClick={handleHostClick} disabled={!canHost}>
                    <ListItemIcon>
                      <ScreenShare />
                    </ListItemIcon>
                    <ListItemText>Host</ListItemText>
                  </MenuItem>
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
                      maxHeight: "70vh",
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
                    Poll Options
                  </Typography>
                  <Divider />
                  <MenuItem onClick={openGenerateWithAI} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText>Generate with AI</ListItemText>
                  </MenuItem>
                  <DownloadPDFMenuItem poll={poll} onClick={handleClose} />
                  <Divider />
                  <DeleteMenuItem pid={pid} onClick={handleClose} />
                  <Divider />
                  <MenuItem
                    onClick={handleHostClick}
                    disabled={!canHost}
                    sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <ScreenShare />
                    </ListItemIcon>
                    <ListItemText>Host</ListItemText>
                  </MenuItem>
                  <Box sx={{ pb: 2 }} />
                </SwipeableDrawer>
              )}
            </Box>
          </Stack>
          {/* <Typography variant='body2'>
          Last Updated:{" "}
          {updatedAt ? updatedAt.toDate().toLocaleDateString() : ""}
        </Typography> */}
        </Toolbar>
      </AppBar>
      <UploadPDFDialog
        pid={pid}
        open={generateWithAIModal}
        onClose={() => setGenerateWithAIModal(false)}
      />
    </React.Fragment>
  )
}
