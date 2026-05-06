import { Box, Container, Typography } from "@mui/material"
import React from "react"
import { RA } from "@/styles"

const sections = [
  {
    title: "1. Eligibility",
    body: "You must be at least 13 years old to use PulseCheck. By creating an account, you confirm that you meet this requirement.",
  },
  {
    title: "2. User Responsibilities",
    body: "You agree to use PulseCheck for academic purposes only and to refrain from cheating, sharing answers, or disrupting the platform in any way.",
  },
  {
    title: "3. Account Security",
    body: "You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access.",
  },
  {
    title: "4. Intellectual Property",
    body: "All content within PulseCheck, including its design, code, and branding, is owned by PulseCheck or licensed to us. Users may not reproduce or distribute it without written permission.",
  },
  {
    title: "5. Termination",
    body: "We reserve the right to suspend or terminate accounts that violate these terms, at our sole discretion and without prior notice.",
  },
  {
    title: "6. Limitation of Liability",
    body: "PulseCheck is provided as-is. We are not responsible for errors in quiz results, service interruptions, or issues caused by third-party services.",
  },
] as const

export default function TermsOfService(props: { ref?: React.Ref<unknown> }) {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(160deg, rgba(0,150,136,0.15) 0%, rgba(0,0,0,0) 60%)"
            : "linear-gradient(160deg, rgba(0,150,136,0.08) 0%, rgba(255,255,255,0) 60%)",
      }}>
      <Container maxWidth="md">
        <Box ref={props.ref}>
          <RA.Fade triggerOnce duration={600}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 2,
                color: "primary.main",
                fontWeight: 600,
              }}>
              Legal
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Terms of Service
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 6 }}>
              By creating an account or using PulseCheck, you agree to the
              following terms. Please read them carefully.
            </Typography>
          </RA.Fade>
          {sections.map((s, i) => (
            <RA.Fade triggerOnce duration={600} delay={i * 80} key={s.title}>
              <Box
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.body}
                </Typography>
              </Box>
            </RA.Fade>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
