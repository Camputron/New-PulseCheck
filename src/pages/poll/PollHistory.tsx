import PollSessionHistory from "@/components/poll/history/session/PollSessionHistory"
import PollSubmissionHistory from "@/components/poll/history/submission/PollSubmissionHistory"
import RejoinBanner from "@/components/poll/join/RejoinBanner"
import useRequireAuth from "@/hooks/useRequireAuth"
import { RA } from "@/styles"
import { Box, Container, Tab, Tabs, Typography } from "@mui/material"
import React, { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props
  return <React.Fragment>{value === index && children}</React.Fragment>
}

const TAB_MAP = ["sessions", "submissions"] as const

export default function PollHistory() {
  useRequireAuth({ blockGuests: true })
  const [params, setParams] = useSearchParams()

  const tabParam = params.get("tab") ?? "sessions"
  const tabIndex = Math.max(
    TAB_MAP.indexOf(tabParam as (typeof TAB_MAP)[number]),
    0
  )

  const setParam = useCallback(
    (key: string, value: string, defaults: Record<string, string> = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const defaultVal = defaults[key]
          if (value === defaultVal || value === "") {
            next.delete(key)
          } else {
            next.set(key, value)
          }
          return next
        },
        { replace: true }
      )
    },
    [setParams]
  )

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        /* clear filter params when switching tabs */
        next.delete("q")
        next.delete("sort")
        next.delete("date")
        if (newValue === 0) {
          next.delete("tab")
        } else {
          next.set("tab", TAB_MAP[newValue])
        }
        return next
      },
      { replace: true }
    )
  }

  return (
    <Container maxWidth='md' sx={{ py: { xs: 3, md: 5 } }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant='overline'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          Activity
        </Typography>
        <Typography variant='h4' fontWeight={700} sx={{ mb: 3 }}>
          History
        </Typography>
      </RA.Fade>

      <RejoinBanner />

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
        }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label='history tabs'
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            },
          }}>
          <Tab label='Sessions' />
          <Tab label='Submissions' />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <PollSessionHistory
          query={params.get("q") ?? ""}
          sort={params.get("sort") ?? "date-desc"}
          dateFilter={params.get("date") ?? "7d"}
          onParamChange={setParam}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <PollSubmissionHistory
          query={params.get("q") ?? ""}
          sort={params.get("sort") ?? "date-desc"}
          dateFilter={params.get("date") ?? "7d"}
          onParamChange={setParam}
        />
      </TabPanel>
    </Container>
  )
}
