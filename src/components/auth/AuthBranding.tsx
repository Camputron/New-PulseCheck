import { Box, Typography } from "@mui/material"
import { RA } from "@/styles"

interface Props {
  heading: string
  subtext: string
}

export default function AuthBranding({ heading, subtext }: Props) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: { xs: 4, md: 8 },
        py: { xs: 6, md: 0 },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(160deg, rgba(0,150,136,0.2) 0%, rgba(0,0,0,0) 70%)"
            : "linear-gradient(160deg, rgba(0,150,136,0.1) 0%, rgba(255,255,255,0) 70%)",
      }}>
      <RA.Fade triggerOnce duration={800}>
        <Typography
          variant='overline'
          sx={{
            letterSpacing: 3,
            color: "primary.main",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}>
          PulseCheck
        </Typography>
      </RA.Fade>
      <RA.Fade triggerOnce duration={800} delay={150}>
        <Typography
          variant='h3'
          fontWeight={800}
          sx={{
            mt: 1,
            mb: 2,
            fontSize: { xs: "2rem", md: "2.75rem" },
            lineHeight: 1.15,
          }}>
          {heading}
        </Typography>
      </RA.Fade>
      <RA.Fade triggerOnce duration={800} delay={300}>
        <Typography
          variant='body1'
          sx={{
            color: "text.secondary",
            lineHeight: 1.7,
          }}>
          {subtext}
        </Typography>
      </RA.Fade>
    </Box>
  )
}
