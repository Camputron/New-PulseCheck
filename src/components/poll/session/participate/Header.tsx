import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import LeaveButton from "../LeaveButton"
import { Session, SessionUser } from "@/types"
import { QuerySnapshot } from "firebase/firestore"
import { useAuthContext } from "@/hooks"
import { ntops } from "@/utils"

interface HeaderProps {
  session?: Session
  users?: QuerySnapshot<SessionUser>
  onLeaveSession: () => void
}

export default function Header(props: HeaderProps) {
  const { session, users, onLeaveSession } = props
  const { user } = useAuthContext()

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
          callback={onLeaveSession}
          dialogTitle="Leave this session?"
          dialogContent={
            user?.isAnonymous
              ? "Your submitted answers are saved and any remaining questions will be marked 0. As a guest, leaving will permanently delete your account — you won't be able to rejoin this session."
              : "Your submitted answers are saved, but you will receive a 0 for any remaining questions."
          }
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
