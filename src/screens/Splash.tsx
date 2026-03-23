import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import About from "../components/splash/About"
import FAQs from "../components/splash/FAQs"
import Features from "../components/splash/Features"
import FooterLink from "../components/splash/FooterLink"
import { useRef, useEffect } from "react"
import { RA } from "@/styles"
import { ArrowForward } from "@mui/icons-material"
import useRedirectIfAuthenticated from "@/lib/hooks/useRedirectIfAuthenticated"

interface LocationState {
  scrollTo?: string
}

export default function Splash() {
  useRedirectIfAuthenticated()
  const navigate = useNavigate()

  const handleClick = () => {
    void navigate("/get-started")
  }
  const location = useLocation()

  const aboutRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const locstate = location.state as LocationState
    if (locstate?.scrollTo) {
      const target = locstate.scrollTo
      let destination: HTMLDivElement | null = null

      if (target === "about") {
        destination = aboutRef.current
      } else if (target === "faqs") {
        destination = faqRef.current
      } else if (target === "features") {
        destination = featuredRef.current
      }

      if (destination) {
        destination.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [location])

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: "center",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(160deg, rgba(0,150,136,0.15) 0%, rgba(0,0,0,0) 60%)"
              : "linear-gradient(160deg, rgba(0,150,136,0.08) 0%, rgba(255,255,255,0) 60%)",
        }}>
        <Container maxWidth='md'>
          <RA.Fade triggerOnce duration={800}>
            <Typography
              variant='overline'
              sx={{
                letterSpacing: 3,
                color: "primary.main",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}>
              Classroom Engagement, Reimagined
            </Typography>
          </RA.Fade>
          <RA.Fade triggerOnce duration={800} delay={200}>
            <Typography
              variant='h3'
              fontWeight={800}
              sx={{
                mt: 2,
                mb: 3,
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.2,
              }}>
              Transform Passive Lectures into Active Learning
            </Typography>
          </RA.Fade>
          <RA.Fade triggerOnce duration={800} delay={400}>
            <Typography
              variant='h6'
              sx={{
                maxWidth: 600,
                mx: "auto",
                mb: 5,
                color: "text.secondary",
                fontWeight: 400,
                lineHeight: 1.6,
              }}>
              PulseCheck empowers instructors with real-time polls and quizzes
              that keep every student engaged. Get instant feedback, track
              understanding, and make every session count.
            </Typography>
          </RA.Fade>
          <RA.Fade triggerOnce duration={800} delay={600}>
            <Button
              variant='contained'
              color='primary'
              size='large'
              endIcon={<ArrowForward />}
              onClick={handleClick}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}>
              Get Started
            </Button>
          </RA.Fade>
        </Container>
      </Box>

      {/* Content Sections */}
      <Container maxWidth='md'>
        <Stack spacing={10} sx={{ py: 8 }}>
          <About ref={aboutRef} />
          <Divider />
          <Features ref={featuredRef} />
          <Divider />
          <FAQs ref={faqRef} />
        </Stack>

        {/* Footer */}
        <Divider sx={{ mt: 4 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            py: 4,
          }}>
          <FooterLink text='Privacy Policy' path='privacy-policy' />
          <FooterLink text='Terms of Service' path='terms-of-service' />
        </Box>
      </Container>
    </Box>
  )
}
