import { Session } from "@/types"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { QRCodeSVG } from "qrcode.react"

interface RoomCodeDisplayProps {
  session: Session
}

export default function RoomCodeDisplay({ session }: RoomCodeDisplayProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))
  const joinUrl = `${window.location.origin}/get-started?code=${session.room_code}`
  const qrSize = isDesktop ? 320 : 192

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
      }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "3rem", md: "4.5rem" },
          letterSpacing: { xs: "0.1em", md: "0.15em" },
          mb: { xs: 2, md: 3 },
          color: theme.palette.text.primary,
        }}>
        {session.room_code}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
          color: theme.palette.text.secondary,
          mb: { xs: 2, md: 3 },
        }}>
        Join at{" "}
        <Box
          component="span"
          sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          {window.location.host}
        </Box>
      </Typography>
      <Box
        sx={{
          p: { xs: 1.5, md: 2 },
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <QRCodeSVG value={joinUrl} size={qrSize} level="M" />
      </Box>
    </Box>
  )
}
