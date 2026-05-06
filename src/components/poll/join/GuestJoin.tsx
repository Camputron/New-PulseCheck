import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "@/api"
import { FormEvent, useState } from "react"
import useSnackbar from "@/hooks/useSnackbar"
import { RA } from "@/styles"

export default function GuestJoin() {
  const navigate = useNavigate()
  const [query] = useSearchParams()
  const [isJoining, setIsJoining] = useState(false)
  const [roomCode, setRoomCode] = useState<string>(query.get("code") ?? "")
  const [displayName, setDisplayName] = useState<string>("")
  const snackbar = useSnackbar()

  const handleJoinClick = (e: MouseEvent | FormEvent) => {
    e.preventDefault()
    const aux = async () => {
      try {
        setIsJoining(true)
        if (!roomCode.trim()) {
          throw new Error("Room Code cannot be blank!")
        }
        if (!displayName.trim()) {
          throw new Error("Display Name cannot be blank!")
        }
        /* sign in as a guest first so room-code lookup is authenticated */
        const cred = await api.auth.loginAsGuest()
        /* find session with code */
        const sref = await api.sessions.getByCode(roomCode)
        /* add yourself to the queue */
        await api.sessions.enqueue(sref.id, cred.user.uid, {
          display_name: displayName,
          photo_url: null,
        })
        void navigate(`/poll/session/${sref.id}`)
      } catch (err: unknown) {
        console.debug(err)
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
        setIsJoining(false)
      }
    }
    void aux()
  }

  const handleCreateAccount = () => {
    void navigate("/register")
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
      <Container maxWidth="xs">
        <RA.Fade triggerOnce duration={600}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2,
              color: "primary.main",
              fontWeight: 600,
            }}>
            Quick Join
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Join Poll
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Enter the room code to join as a guest.
          </Typography>
          <Stack
            component="form"
            onSubmit={handleJoinClick}
            spacing={2.5}
            noValidate
            autoComplete="off">
            <TextField
              id="room-code"
              placeholder="Room Code"
              variant="outlined"
              fullWidth
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            <TextField
              id="guest-name"
              placeholder="Display Name"
              variant="outlined"
              fullWidth
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleJoinClick}
              disabled={isJoining}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}>
              Join Session
            </Button>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCreateAccount}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}>
              Create an Account
            </Button>
          </Stack>
        </RA.Fade>
      </Container>
    </Box>
  )
}
