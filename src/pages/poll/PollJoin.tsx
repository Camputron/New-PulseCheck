import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material"
import { useNavigate, useSearchParams } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { FormEvent } from "react"
import { useAuthContext } from "@/hooks"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import useRequireAuth from "@/hooks/useRequireAuth"
import { RA } from "@/styles"
import RejoinBanner from "@/components/poll/join/RejoinBanner"

function DisplayNameField(props: {
  uid: string
  displayName: string
  setDisplayName: React.Dispatch<React.SetStateAction<string>>
}) {
  const { uid, displayName, setDisplayName } = props
  const [user, loading] = useDocumentDataOnce(api.users.doc(uid))

  useEffect(() => {
    if (user && !loading) {
      setDisplayName(user.display_name)
    }
  }, [user, loading, setDisplayName])

  return (
    <React.Fragment>
      <TextField
        placeholder='Display Name'
        variant='outlined'
        fullWidth
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
    </React.Fragment>
  )
}

export default function PollJoin() {
  const navigate = useNavigate()
  useRequireAuth({ blockGuests: true })
  const ref = useRef<HTMLButtonElement>(null)
  const [query] = useSearchParams()
  const [roomCode, setRoomCode] = useState<string>(query.get("code") ?? "")
  const [displayName, setDisplayName] = useState<string>("")
  const snackbar = useSnackbar()
  const { user } = useAuthContext()
  const [disable, setDisable] = useState(false)
  const [fire, setFire] = useState(true)

  useEffect(() => {
    const code = query.get("code")
    if (code && ref.current && user && displayName && fire) {
      ref.current.click()
      setFire(false)
    }
  }, [query, user, displayName, fire])

  const handleJoinClick = (e: MouseEvent | FormEvent) => {
    e.preventDefault()
    const aux = async () => {
      setDisable(true)
      try {
        if (!roomCode.trim()) {
          throw new Error("Room Code cannot be blank!")
        }
        if (!displayName.trim()) {
          throw new Error("Display Name cannot be blank!")
        }
        if (!user) {
          throw new Error("How did you do this?")
        }
        const sref = await api.sessions.getByCode(roomCode)
        await api.sessions.enqueue(sref.id, user.uid, {
          display_name: displayName,
          photo_url: user.photoURL,
        })
        await navigate(`/poll/session/${sref.id}`)
      } catch (err: unknown) {
        if (err instanceof Error) {
          snackbar.show({
            message: err.message,
            type: "error",
          })
        } else {
          snackbar.show({
            message: "An unexpected error occured.",
            type: "error",
          })
        }
      } finally {
        setDisable(false)
      }
    }
    void aux()
  }

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
      }}>
      <Container maxWidth='xs'>
        <RA.Fade triggerOnce duration={600}>
          <RejoinBanner />
          <Typography
            variant='overline'
            sx={{
              letterSpacing: 2,
              color: "primary.main",
              fontWeight: 600,
            }}>
            Session
          </Typography>
          <Typography variant='h4' fontWeight={700} sx={{ mb: 1 }}>
            Join Poll
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
            Enter the room code provided by your instructor.
          </Typography>
          <Stack
            component='form'
            onSubmit={handleJoinClick}
            spacing={2.5}
            noValidate
            autoComplete='off'>
            <TextField
              id='room-code'
              placeholder='Room Code'
              variant='outlined'
              fullWidth
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            {user && (
              <DisplayNameField
                uid={user.uid}
                displayName={displayName}
                setDisplayName={setDisplayName}
              />
            )}
            <Button
              ref={ref}
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleJoinClick}
              fullWidth
              disabled={disable}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}>
              Join Session
            </Button>
          </Stack>
        </RA.Fade>
      </Container>
    </Box>
  )
}
