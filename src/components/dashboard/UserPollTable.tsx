import api from "@/api"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import { Poll } from "@/types"
import { ntoq, stoc, tstos } from "@/utils"
import {
  ContentCopy,
  Description,
  KeyboardArrowRight,
  MoreVert,
} from "@mui/icons-material"
import {
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

interface UserPollTableProps {
  polls: { id: string; data: Poll }[]
}

export default function UserPollTable(props: UserPollTableProps) {
  const { polls } = props
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const { user } = useAuthContext()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [menuPid, setMenuPid] = useState<string | null>(null)
  const [isCloning, setIsCloning] = useState(false)

  const handleRowClick = (pid: string) => {
    void navigate(`/poll/${pid}/edit`)
  }

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    pid: string,
  ) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setMenuPid(pid)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuPid(null)
  }

  const handleClone = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const pid = menuPid
    handleMenuClose()
    if (!user || !pid) return
    setIsCloning(true)
    try {
      const ownerRef = api.users.doc(user.uid)
      const newPollRef = await api.polls.clone(pid, ownerRef)
      snackbar.show({ type: "success", message: "Poll cloned" })
      void navigate(`/poll/${newPollRef.id}/edit`)
    } catch (err) {
      console.error(`Failed to clone poll ${pid}`, err)
      snackbar.show({ type: "error", message: "Failed to clone poll" })
    } finally {
      setIsCloning(false)
    }
  }

  return (
    <>
      <TableContainer
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Questions
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Updated
              </TableCell>
              <TableCell padding="checkbox" />
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {polls.map(({ id, data }) => (
              <TableRow
                key={id}
                hover
                onClick={() => handleRowClick(id)}
                sx={{
                  cursor: "pointer",
                  "&:last-child td": { border: 0 },
                }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: stoc(data.title),
                      }}>
                      <Description sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {data.title}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {ntoq(data.questions.length)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" color="text.secondary">
                    {tstos(data.updated_at)}
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, id)}
                    aria-label="Poll actions">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell padding="checkbox">
                  <KeyboardArrowRight
                    fontSize="small"
                    sx={{ color: "action.active" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </>
  )
}
