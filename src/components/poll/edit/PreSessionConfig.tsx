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
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext, useSnackbar } from "@/hooks"
import { Poll } from "@/types"
import api from "@/api"
import { getHostSettings, saveHostSettings } from "@/utils"
import AsyncButton from "@/components/AsyncButton"

interface PreSessionConfigProps {
  pid: string
  poll: Poll
  onBack: () => void
}

export default function PreSessionConfig(props: PreSessionConfigProps) {
  const { pid, poll, onBack } = props
  const auth = useAuthContext()
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const saved = auth.user ? getHostSettings(auth.user.uid) : null
  const [isAnonymous, setIsAnonymous] = useState(saved?.isAnonymous ?? false)
  const [hasLeaderboard, setHasLeaderboard] = useState(
    saved?.hasLeaderboard ?? false,
  )

  const handleStartSession = async () => {
    if (!auth.user) return
    const uid = auth.user.uid
    const settings = { isAnonymous, hasLeaderboard }
    const sessionId = await api.sessions.host(pid, uid, settings)
    saveHostSettings(uid, settings)
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

          <AsyncButton
            variant="contained"
            size="large"
            startIcon={<ScreenShare />}
            callback={handleStartSession}
            onError={() =>
              snackbar.show({
                type: "error",
                message: "Failed to start session",
              })
            }>
            Start Session
          </AsyncButton>
        </Stack>
      </Container>
    </>
  )
}
