import {
  AppBar,
  Box,
  Container,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material"
import { ArrowBack, ScreenShare } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSnackbar, useUser } from "@/hooks"
import { Poll } from "@/types"
import api from "@/api"
import AsyncButton from "@/components/AsyncButton"

interface PreSessionConfigProps {
  pid: string
  poll: Poll
  onBack: () => void
}

export default function PreSessionConfig(props: PreSessionConfigProps) {
  const { pid, poll, onBack } = props
  const { authUser, user, updateSessionDefaults } = useUser()
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const [isAnonymous, setIsAnonymous] = useState(false)
  const [hasLeaderboard, setHasLeaderboard] = useState(false)

  useEffect(() => {
    if (user?.session_defaults) {
      setIsAnonymous(user.session_defaults.isAnonymous)
      setHasLeaderboard(user.session_defaults.hasLeaderboard)
    }
  }, [user?.session_defaults])

  const handleStartSession = async () => {
    if (!authUser) return
    const settings = { isAnonymous, hasLeaderboard }
    const sessionId = await api.sessions.host(pid, authUser.uid, settings)
    try {
      await updateSessionDefaults(settings)
    } catch (err) {
      console.warn("Failed to save session defaults", err)
    }
    void navigate(`/poll/session/${sessionId}/host`)
  }

  return (
    <>
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
          <IconButton onClick={onBack}>
            <ArrowBack />
          </IconButton>
          <Typography fontWeight={600} sx={{ ml: 1 }}>
            {poll.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Session Settings
          </Typography>

          <Box>
            <FormControlLabel
              label="Anonymous Mode"
              control={
                <Switch
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
              Hides participant identities during the session. Individual
              questions can still override this setting.
            </Typography>
          </Box>

          <Box>
            <FormControlLabel
              label="Leaderboard"
              control={
                <Switch
                  checked={hasLeaderboard}
                  onChange={(e) => setHasLeaderboard(e.target.checked)}
                />
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
              Show a ranked leaderboard of participant scores during the
              session.
            </Typography>
          </Box>

          <Box alignSelf={"flex-end"}>
            <AsyncButton
              startIcon={<ScreenShare />}
              variant="text"
              size="large"
              callback={handleStartSession}
              onError={() =>
                snackbar.show({
                  type: "error",
                  message: "Failed to start session",
                })
              }>
              Start Session
            </AsyncButton>
          </Box>
        </Stack>
      </Container>
    </>
  )
}
