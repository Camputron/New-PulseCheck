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

    async function validate(session: ActiveSession) {
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
        const hasJoined = await api.sessions.hasJoined(session.sid, user!.uid)
        if (!hasJoined) {
          clearActiveSession()
          return
        }
        setActiveSession(session)
      } catch {
        clearActiveSession()
      }
    }

    void validate(stored)
  }, [user])

  if (!activeSession) return null

  const handleRejoin = () => {
    void navigate(`/poll/session/${activeSession.sid}/participate`)
  }

  const handleLeave = async () => {
    if (!user) return
    setLeaving(true)
    try {
      await api.sessions.leaveSession(activeSession.sid, user.uid)
      clearActiveSession()
      setActiveSession(null)
      snackbar.show({
        message: "You left the session",
        type: "info",
      })
    } catch (err) {
      console.error("Failed to leave session", err)
    } finally {
      setLeaving(false)
    }
  }

  return (
    <Alert
      severity='info'
      sx={{ mb: 3, borderRadius: 2 }}
      action={
        <Stack direction='row' spacing={1}>
          <Button
            size='small'
            color='inherit'
            disabled={leaving}
            onClick={() => void handleLeave()}>
            Leave Session
          </Button>
          <Button size='small' variant='contained' onClick={handleRejoin}>
            Rejoin
          </Button>
        </Stack>
      }>
      You have an active session ({activeSession.roomCode})
    </Alert>
  )
}
