import { Box, Card, CardContent, Typography } from "@mui/material"
import { PollOutlined } from "@mui/icons-material"
import { useAuthContext } from "@/lib/hooks"
import { useEffect, useState } from "react"
import api from "@/lib/api/firebase"

export default function NoRecentPolls() {
  const { user } = useAuthContext()
  const [displayName, setDisplayName] = useState<string>()

  useEffect(() => {
    if (!user || user.isAnonymous) {
      return
    }
    api.users
      .get(user.uid)
      .then((x) => {
        const name: string = x.display_name
        setDisplayName(name)
      })
      .catch((err) => console.debug(err))
  }, [user])

  if (!user) {
    return <></>
  }

  return (
    <Card
      variant='outlined'
      sx={{
        mt: 4,
        borderRadius: 2,
      }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          py: 5,
        }}>
        <Box
          sx={(theme) => ({
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "action.selected"
                : "action.hover",
          })}>
          <PollOutlined sx={{ fontSize: 28, color: "primary.main" }} />
        </Box>
        <Typography variant='h6' fontWeight={600}>
          Welcome, {displayName}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ maxWidth: 320, textAlign: "center" }}>
          No recent polls yet — create or join one to get started!
        </Typography>
      </CardContent>
    </Card>
  )
}
