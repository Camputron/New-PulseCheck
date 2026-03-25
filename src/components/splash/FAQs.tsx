import { Box, Stack, Typography } from "@mui/material"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import { ExpandMore } from "@mui/icons-material"
import React from "react"
import { RA } from "@/styles"

const faqs = [
  {
    question: "How do I participate in a quiz or poll?",
    answer:
      "Log in to PulseCheck on any device and join the session using the room code provided by your instructor. No downloads or installations required.",
  },
  {
    question: "Can I review my quiz results after a session?",
    answer:
      "Yes. After completing a quiz, you can view a detailed breakdown of your responses, including which questions you answered correctly and your overall score.",
  },
  {
    question: "How does PulseCheck track attendance?",
    answer:
      "Attendance is recorded automatically based on your participation in live polls and quizzes during a session. Instructors can review participation data from their dashboard.",
  },
  {
    question: "Is PulseCheck available on mobile devices?",
    answer:
      "Absolutely. PulseCheck is a fully responsive web application that works on any device with a modern browser -- desktop, tablet, or smartphone.",
  },
  {
    question: "Can instructors reuse questions across sessions?",
    answer:
      "Yes. Instructors can build question banks and reuse them across multiple sessions. Questions can also be randomized to maintain assessment integrity.",
  },
  {
    question: "Is there a cost to use PulseCheck?",
    answer:
      "PulseCheck is free to use for both instructors and students. There are no hidden fees or premium tiers.",
  },
]

function FAQs(props: { ref?: React.Ref<unknown> }) {
  return (
    <Box ref={props.ref}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant='overline'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          FAQs
        </Typography>
        <Typography variant='h4' fontWeight={700} sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant='body1' sx={{ color: "text.secondary", mb: 4 }}>
          Whether you are an instructor setting up your first session or a
          student joining for the first time, here is what you need to know.
        </Typography>
      </RA.Fade>
      <Stack spacing={1.5}>
        {faqs.map((faq, index) => (
          <RA.Fade triggerOnce duration={600} delay={index * 80} key={index}>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: "8px !important",
                "&::before": { display: "none" },
                "&:not(:last-child)": { mb: 0 },
              }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ px: 3, py: 0.5 }}>
                <Typography fontWeight={600}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                <Typography variant='body2' color='text.secondary'>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </RA.Fade>
        ))}
      </Stack>
    </Box>
  )
}

export default FAQs
