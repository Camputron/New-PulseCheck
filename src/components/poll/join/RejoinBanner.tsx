import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Stack } from "@mui/material"
import { getDoc } from "firebase/firestore"
import api from "@/api"
import { ActiveSession, SessionState } from "@/types"
import { getActiveSession, clearActiveSession } from "@/utils"
import { useAuthContext } from "@/hooks"

export default function RejoinBanner() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)

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

  const handleDismiss = () => {
    clearActiveSession()
    setActiveSession(null)
  }

  return (
    <Alert
      severity='info'
      sx={{ mb: 3, borderRadius: 2 }}
      action={
        <Stack direction='row' spacing={1}>
          <Button size='small' color='inherit' onClick={handleDismiss}>
            Dismiss
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
