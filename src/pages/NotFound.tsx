import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { Home, ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { RA } from "@/styles"

export default function NotFound() {
  const navigate = useNavigate()
  const [showSanta, setShowSanta] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSanta(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          gap: 2,
        }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <RA.Fade triggerOnce duration={600}>
            <Typography
              sx={{
                fontSize: { xs: "6rem", md: "8rem" },
                fontWeight: 900,
                lineHeight: 1,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              404
            </Typography>
          </RA.Fade>
          {showSanta && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <RA.Hinge triggerOnce duration={3000}>
                <Box
                  component='img'
                  src='/not-found.png'
                  alt='Easter egg'
                  sx={{
                    width: { xs: 100, md: 130 },
                    pointerEvents: "none",
                    filter: (theme) =>
                      theme.palette.mode === "dark"
                        ? "drop-shadow(0 2px 12px rgba(255,255,255,0.15))"
                        : "drop-shadow(0 2px 12px rgba(0,0,0,0.15))",
                  }}
                />
              </RA.Hinge>
            </Box>
          )}
        </Box>
        <RA.Fade triggerOnce duration={600} delay={100}>
          <Typography variant='h5' fontWeight={700}>
            Page not found
          </Typography>
        </RA.Fade>
        <RA.Fade triggerOnce duration={600} delay={200}>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ maxWidth: 360 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
        </RA.Fade>
        <RA.Fade triggerOnce duration={600} delay={300}>
          <Stack direction='row' spacing={1.5} sx={{ mt: 1 }}>
            <Button
              variant='outlined'
              startIcon={<ArrowBack />}
              onClick={() => void navigate(-1)}>
              Go Back
            </Button>
            <Button
              variant='contained'
              startIcon={<Home />}
              onClick={() => void navigate("/")}>
              Home
            </Button>
          </Stack>
        </RA.Fade>
      </Box>
    </Container>
  )
}
