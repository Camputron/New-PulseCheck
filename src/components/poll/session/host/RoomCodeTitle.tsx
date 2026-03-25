import { Session, SessionState } from "@/types"
import { Typography } from "@mui/material"

interface RoomCodeTitleProps {
  session?: Session
}

/**
 * Displays the room code the session if session is open.
 */
export default function RoomCodeTitle(props: RoomCodeTitleProps) {
  const { session } = props
  if (session && session.state === SessionState.OPEN) {
    return (
      <Typography variant='h5' mb={2}>
        Room Code: {session.room_code}
      </Typography>
    )
  }
  return <></>
}
