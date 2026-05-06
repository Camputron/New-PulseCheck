import { RA } from "@/styles"
import { Box, Stack, Typography } from "@mui/material"
import { School, TrendingUp, Groups } from "@mui/icons-material"
import React from "react"

function About(props: { ref?: React.Ref<unknown> }) {
  const highlights = [
    {
      icon: <School sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Built for Educators",
      description:
        "Designed in collaboration with instructors who understand the challenges of engaging large classrooms.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Data-Driven Insights",
      description:
        "Real-time analytics give instructors immediate visibility into student comprehension and participation.",
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Student-Centered Design",
      description:
        "An intuitive interface that lowers the barrier to participation and keeps students actively involved.",
    },
  ]

  return (
    <Box ref={props.ref}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          About
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Why PulseCheck Exists
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            lineHeight: 1.8,
            mb: 5,
          }}>
          PulseCheck closes that feedback loop in real time. Instructors launch
          a live poll or quiz in seconds, students respond from any device, and
          the results appear instantly -- revealing exactly where the class
          stands before moving on. No clickers to buy, no apps to install, and
          no time wasted.
        </Typography>
      </RA.Fade>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ mt: 2, alignItems: "stretch" }}>
        {highlights.map((item) => (
          <RA.Fade
            triggerOnce
            duration={600}
            key={item.title}
            style={{ flex: 1, display: "flex" }}>
            <Box
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                textAlign: "center",
              }}>
              <Box sx={{ mb: 2 }}>{item.icon}</Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          </RA.Fade>
        ))}
      </Stack>
    </Box>
  )
}

export default About
