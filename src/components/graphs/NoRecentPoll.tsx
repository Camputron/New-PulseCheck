import { Box, Card, CardContent, Typography } from "@mui/material"
import { useAuthContext } from "@/lib/hooks"
import { useEffect } from "react"
import api from "@/lib/api/firebase"
import { useState } from "react"
import Image from "mui-image"

export default function NoRecentPolls() {
  const { user } = useAuthContext()
  const [doc, setDoc] = useState<string>()

  useEffect(() => {
    if (!user || user.isAnonymous) {
      return
    }
    api.users
      .get(user.uid)
      .then((x) => {
        const name: string = x.display_name
        setDoc(name)
      })
      .catch((err) => console.debug(err))
  }, [user])

  if (!user) {
    return <></>
  }
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        marginTop: 4,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 25%, ${theme.palette.secondary.main} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.light} 25%, ${theme.palette.secondary.light} 100%)`,
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      })}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          py: 4,
        }}>
        <Image
          src='/favicon.png'
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant='h5' fontWeight='bold' color='common.white'>
            Hello {doc}!
          </Typography>
          <Typography
            variant='body1'
            sx={{ mt: 0.5, color: "rgba(255,255,255,0.85)" }}>
            Welcome to PulseCheck
          </Typography>
        </Box>
        <Typography
          variant='body2'
          sx={{ mt: 1, fontStyle: "italic", color: "rgba(255,255,255,0.7)" }}>
          No recent polls yet — create or join one to get started!
        </Typography>
      </CardContent>
    </Card>
  )
}
