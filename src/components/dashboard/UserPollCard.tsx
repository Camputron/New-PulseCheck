import api from "@/api"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import { Poll } from "@/types"
import { ntoq, stoc, tstos } from "@/utils"
import {
  ContentCopy,
  Description,
  MoreVert,
  QuestionAnswer,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  CardActionArea,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

interface UserPolLCardProps {
  pid: string
  poll: Poll
}

export default function UserPollCard(props: UserPolLCardProps) {
  const { pid, poll } = props
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { user } = useAuthContext()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isCloning, setIsCloning] = useState(false)

  const handleClick = () => {
    void navigate(`/poll/${pid}/edit`)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleClone = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handleMenuClose()
    if (!user) return
    setIsCloning(true)
    try {
      const ownerRef = api.users.doc(user.uid)
      const newPollRef = await api.polls.clone(pid, ownerRef)
      snackbar.show({
        type: "success",
        message: "Poll cloned",
      })
      void navigate(`/poll/${newPollRef.id}/edit`)
    } catch (err) {
      console.error(`Failed to clone poll ${pid}`, err)
      snackbar.show({
        type: "error",
        message: "Failed to clone poll",
      })
    } finally {
      setIsCloning(false)
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <CardActionArea
        onClick={handleClick}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          minHeight: 120,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: (t) =>
              `0 4px 20px ${t.palette.mode === "dark" ? "rgba(0,150,136,0.15)" : "rgba(0,150,136,0.1)"}`,
            transform: "translateY(-2px)",
          },
        }}>
        <Box display="flex" alignItems="center" gap={1.5} width="100%" pr={4}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: stoc(poll.title),
              flexShrink: 0,
            }}>
            <Description sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            flex={1}
            textAlign="left">
            {poll.title}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mt="auto"
          pt={1.5}
          width="100%">
          <Chip
            label={ntoq(poll.questions.length)}
            size="small"
            icon={<QuestionAnswer fontSize="small" />}
            variant="outlined"
            sx={{ pl: 0.5, fontSize: "0.7rem", height: 22 }}
          />
          <Typography variant="caption" color="text.secondary" ml="auto">
            {tstos(poll.updated_at)}
          </Typography>
        </Box>
      </CardActionArea>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
        }}
        aria-label="Poll actions">
        <MoreVert fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              minWidth: 180,
            },
          },
        }}>
        <MenuItem
          onClick={(e) => void handleClone(e)}
          disabled={isCloning || !user}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isCloning ? "Cloning..." : "Clone"}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
