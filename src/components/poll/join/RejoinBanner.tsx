import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Stack } from "@mui/material"
import { getDoc } from "firebase/firestore"
import api from "@/api"
import { ActiveSession, SessionState } from "@/types"
import { getActiveSession, clearActiveSession } from "@/utils"
import { useAuthContext, useSnackbar } from "@/hooks"

export default function RejoinBanner() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const snackbar = useSnackbar()
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const stored = getActiveSession()
    if (!stored || !user) return

    /* default missing role to participant for back-compat with older
       localStorage entries written before the role field existed */
    const session: ActiveSession = {
      sid: stored.sid,
      roomCode: stored.roomCode,
      role: stored.role === "host" ? "host" : "participant",
    }

    async function validate() {
      try {
        const sref = api.sessions.doc(session.sid)
        const snap = await getDoc(sref)
        if (!snap.exists()) {
          clearActiveSession()
          return
        }
        const data = snap.data()
        const isActive =
          data.state === SessionState.OPEN ||
          data.state === SessionState.IN_PROGRESS
        if (!isActive) {
          clearActiveSession()
          return
        }
        if (session.role === "host") {
          const isHost = await api.sessions.isHost(session.sid, user!.uid)
          if (!isHost) {
            clearActiveSession()
            return
          }
        } else {
          const hasJoined = await api.sessions.hasJoined(session.sid, user!.uid)
          if (!hasJoined) {
            clearActiveSession()
            return
          }
        }
        setActiveSession(session)
      } catch {
        clearActiveSession()
      }
    }

    void validate()
  }, [user])

  if (!activeSession) return null

  const isHost = activeSession.role === "host"

  const handleRejoin = () => {
    const path = isHost
      ? `/poll/session/${activeSession.sid}/host`
      : `/poll/session/${activeSession.sid}/participate`
    void navigate(path)
  }

  const handleLeave = async () => {
    if (!user) return
    setLeaving(true)
    try {
      if (isHost) {
        await api.sessions.close(api.sessions.doc(activeSession.sid))
        snackbar.show({
          message: "Session ended",
          type: "info",
        })
      } else {
        await api.sessions.leaveSession(activeSession.sid, user.uid)
        snackbar.show({
          message: "You left the session",
          type: "info",
        })
      }
      clearActiveSession()
      setActiveSession(null)
    } catch (err) {
      console.error(
        isHost ? "Failed to end session" : "Failed to leave session",
        err,
      )
    } finally {
      setLeaving(false)
    }
  }

  return (
    <Alert
      severity="info"
      sx={{
        mb: 3,
        borderRadius: 2,
        alignItems: "center",
        "& .MuiAlert-action": { alignItems: "center", pt: 0, mr: 0 },
      }}
      action={
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="inherit"
            disabled={leaving}
            variant="text"
            onClick={() => void handleLeave()}>
            {isHost ? "End Session" : "Leave Session"}
          </Button>
          <Button size="small" variant="text" onClick={handleRejoin}>
            Rejoin
          </Button>
        </Stack>
      }>
      {isHost
        ? `You are hosting a session (${activeSession.roomCode})`
        : `You have an active session (${activeSession.roomCode})`}
    </Alert>
  )
}
