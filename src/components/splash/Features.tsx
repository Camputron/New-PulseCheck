import { RA } from "@/styles"
import { Box, Typography } from "@mui/material"
import {
  BoltOutlined,
  ScoreboardOutlined,
  DashboardOutlined,
  DevicesOutlined,
  FactCheckOutlined,
  ShuffleOutlined,
} from "@mui/icons-material"
import React from "react"

const features = [
  {
    icon: <BoltOutlined sx={{ fontSize: 36 }} />,
    title: "Real-Time Polling",
    description:
      "Create and deploy multiple-choice quizzes and polls that students respond to simultaneously, with results updating live as answers come in.",
  },
  {
    icon: <ScoreboardOutlined sx={{ fontSize: 36 }} />,
    title: "Automatic Scoring",
    description:
      "Quiz scores are calculated instantly, giving students immediate feedback after each question and a comprehensive performance summary at session end.",
  },
  {
    icon: <DashboardOutlined sx={{ fontSize: 36 }} />,
    title: "Host Dashboard",
    description:
      "Monitor participant data in real time during active sessions. Identify trends, gauge comprehension, and adjust your teaching on the fly.",
  },
  {
    icon: <DevicesOutlined sx={{ fontSize: 36 }} />,
    title: "Cross-Platform Access",
    description:
      "Works seamlessly on desktop, tablet, and mobile. No app download required -- just open your browser and join.",
  },
  {
    icon: <FactCheckOutlined sx={{ fontSize: 36 }} />,
    title: "Attendance Tracking",
    description:
      "Participation doubles as attendance verification. Non-participating users are flagged for review and can be managed at the host's discretion.",
  },
  {
    icon: <ShuffleOutlined sx={{ fontSize: 36 }} />,
    title: "Question Banks & Randomization",
    description:
      "Build reusable question banks for future sessions. Randomize question order to maintain assessment integrity across participants.",
  },
]

function Features(props: { ref?: React.Ref<unknown> }) {
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
          Features
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Built to Keep Every Student in the Conversation
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 5 }}>
          From live polling to automatic grading, PulseCheck gives instructors
          the tools to run interactive sessions without slowing down the lecture
          -- and gives students a reason to stay engaged from start to finish.
        </Typography>
      </RA.Fade>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
        }}>
        {features.map((feature, index) => (
          <RA.Fade
            triggerOnce
            duration={600}
            delay={index * 100}
            key={feature.title}>
            <Box
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                transition: "border-color 0.2s, box-shadow 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: (theme) =>
                    `0 0 0 1px ${theme.palette.primary.main}`,
                },
              }}>
              <Box sx={{ color: "primary.main", mb: 1.5 }}>{feature.icon}</Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </RA.Fade>
        ))}
      </Box>
    </Box>
  )
}

export default Features
