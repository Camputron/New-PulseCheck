import { Box, Container, Typography } from "@mui/material"
import React from "react"
import { RA } from "@/styles"

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect personal information such as names, email addresses, and quiz results when you create an account or participate in a session.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your data is used to deliver personalized results, track session participation, and improve the functionality and reliability of PulseCheck.",
  },
  {
    title: "3. How We Protect Your Data",
    body: "We use industry-standard encryption and secure infrastructure provided by Firebase to protect your data from unauthorized access.",
  },
  {
    title: "4. Your Rights",
    body: "You have the right to request access to, correction of, or deletion of your personal information at any time by contacting us.",
  },
  {
    title: "5. Data Sharing",
    body: "We do not sell or share your data with third parties unless required by law or necessary to operate the service.",
  },
] as const

export default function PrivacyPolicy(props: { ref?: React.Ref<unknown> }) {
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
              Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 6 }}>
              At PulseCheck, we respect your privacy and are committed to
              protecting your personal information. This policy explains how we
              collect, use, and safeguard your data.
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
