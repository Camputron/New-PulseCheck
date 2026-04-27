import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import LeaveButton from "../LeaveButton"
import { Session, SessionUser } from "@/types"
import { QuerySnapshot } from "firebase/firestore"
import { useAuthContext, useSnackbar } from "@/hooks"
import api from "@/api"
import { useNavigate } from "react-router-dom"
import { ntops, clearActiveSession } from "@/utils"

interface HeaderProps {
  sid: string
  session?: Session
  users?: QuerySnapshot<SessionUser>
  onAllowNavigation?: () => void
}

export default function Header(props: HeaderProps) {
  const { sid, session, users, onAllowNavigation } = props
  const { user } = useAuthContext()
  const snackbar = useSnackbar()
  const navigate = useNavigate()

  const leaveSession = () => {
    async function leaveAsync() {
      if (!user) {
        return
      }
      try {
        const uid = user.uid
        await api.sessions.leaveSession(sid, uid)
        clearActiveSession()
        onAllowNavigation?.()
        snackbar.show({
          message: "You left the session",
          type: "info",
        })
        if (user.isAnonymous) {
          await user.delete()
          void navigate("/get-started", { replace: true })
        } else {
          void navigate("/poll/join", { replace: true })
        }
      } catch (err: unknown) {
        console.error(err)
      }
    }
    void leaveAsync()
  }

  return (
    <AppBar
      elevation={0}
      position="relative"
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
        <LeaveButton
          callback={leaveSession}
          dialogTitle="Leave this session?"
          dialogContent="Your submitted answers are saved, but you will receive a 0 for any remaining questions."
        />
        <Box textAlign="initial">
          <Typography fontWeight={600}>{session?.title}</Typography>
          <Typography variant="caption" component="div" color="text.secondary">
            {ntops(users?.docs.length ?? 0)}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
