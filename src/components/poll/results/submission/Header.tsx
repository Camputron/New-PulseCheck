import { Timestamp } from "firebase/firestore"
import { Toolbar, Typography, Stack, AppBar, IconButton } from "@mui/material"
import { tstos } from "@/utils"
import { ArrowBack } from "@mui/icons-material"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "@/hooks"
import api from "@/api"

interface HeaderProps {
  title: string
  submitted_at: Timestamp
}

export default function Header(props: HeaderProps) {
  const { title, submitted_at } = props
  const navigate = useNavigate()
  const auth = useAuthContext()
  const location = useLocation()

  const onClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (location.state?.finished) {
      if (auth.user?.isAnonymous) {
        void api.auth.logout()
      } else {
        void navigate("/poll/history")
      }
    } else {
      if (auth.user?.isAnonymous) {
        void api.auth.logout()
      } else {
        void navigate(-1)
      }
    }
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
      <Toolbar>
        <Stack direction='row' alignItems='center' flexGrow={1}>
          <IconButton onClick={onClick}>
            <ArrowBack color='inherit' />
          </IconButton>
          <Stack alignItems='flex-start'>
            <Typography variant='h6' fontWeight={600}>
              {title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Submitted {tstos(submitted_at)}
            </Typography>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
