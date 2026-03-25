import { Session, SessionUser } from "@/types"
import { AppBar, Box, Toolbar as MUIToolbar, Typography } from "@mui/material"
import LeaveButton from "../LeaveButton"
import { DocumentReference, QuerySnapshot } from "firebase/firestore"
import api from "@/api"
import { useNavigate } from "react-router-dom"
import { ntops } from "@/utils"
import HostButton from "./HostButton"

interface HeaderProps {
  sref: DocumentReference<Session>
  session?: Session
  users?: QuerySnapshot<SessionUser>
  timeLeft: number
}

export default function Header(props: HeaderProps) {
  const { sref, session, users, timeLeft } = props
  const navigate = useNavigate()

  const handleKillSession = () => {
    async function killAsync() {
      try {
        await api.sessions.close(sref)
        await navigate("/dashboard", { replace: true })
      } catch (err) {
        console.debug(err)
      }
    }
    void killAsync()
  }

  return (
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
      <MUIToolbar>
        <LeaveButton
          callback={handleKillSession}
          dialogTitle='Are you sure you want to end the session?'
          dialogContent='All answers submitted will be discarded!'
        />
        <Box textAlign='initial'>
          <Typography fontWeight={600}>{session?.title}</Typography>
          <Typography variant='caption' component='div' color='text.secondary'>
            {ntops(users?.docs.length ?? 0)}
          </Typography>
        </Box>
        <Box flex={1} marginInline={2} />
        <HostButton sref={sref} session={session} timeLeft={timeLeft} />
      </MUIToolbar>
    </AppBar>
  )
}
