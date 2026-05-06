import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { Add, DarkMode, LightMode } from "@mui/icons-material"
import { useThemeContext } from "@/hooks/useThemeContext"
import useSnackbar from "@/hooks/useSnackbar"
import { SeverityType } from "@/contexts/SnackbarContext"

// PulseCheck components (standalone-renderable)
import AsyncButton from "@/components/AsyncButton"
import AuthBranding from "@/components/auth/AuthBranding"
import RecentPollCard from "@/components/dashboard/RecentPollCard"
import PulseGauge from "@/components/graphs/PulseGauge"
import SessionGaugeCard from "@/components/graphs/SessionGaugeCard"
import PollMetricsCard from "@/components/poll/results/PollMetricsCard"
import ScoreHistogram from "@/components/graphs/ScoreHistogram"
import UserAvatar from "@/components/poll/results/UserAvatar"
import LeaveButton from "@/components/poll/session/LeaveButton"
import Features from "@/components/splash/Features"
import About from "@/components/splash/About"
import FAQs from "@/components/splash/FAQs"
import { SessionSummary, Submission } from "@/types"
import { Timestamp } from "firebase/firestore"
import AppTitle from "../appbar/AppTitle"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{
        fontWeight: 700,
        letterSpacing: 1,
        color: "text.secondary",
        mt: 5,
        mb: 2,
        display: "block",
        fontSize: "0.8rem",
      }}>
      {children}
    </Typography>
  )
}

function ShowcaseCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
      {children}
    </Paper>
  )
}

// Mock scattered scores for 30 students
const mockScores = [
  12, 23, 35, 41, 48, 52, 55, 58, 61, 63, 65, 67, 69, 71, 72, 74, 75, 76, 78,
  79, 80, 82, 84, 86, 88, 90, 91, 93, 95, 98,
]

const mockSubmissions = mockScores.map(
  (score) => ({ score_100: score }) as Submission,
)

const mockSummary: SessionSummary = {
  total_participants: 32,
  median: 16,
  median_100: 76,
  average: 15.2,
  average_100: 72,
  low: 8,
  low_100: 38,
  high: 20,
  high_100: 95,
  lower_quartile: 12,
  lower_quartile_100: 57,
  upper_quartile: 18,
  upper_quartile_100: 86,
  max_score: 21,
}

export default function PulseCheckShowcaseTab() {
  const { mode, toggleTheme } = useThemeContext()
  const isDark = mode === "dark"
  const snackbar = useSnackbar()

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            PulseCheck Components
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Custom app components rendered with dummy data
          </Typography>
        </Box>
        <IconButton onClick={toggleTheme} size="large">
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ASYNC BUTTON */}
      <SectionTitle>AsyncButton</SectionTitle>
      <ShowcaseCard title="Async buttons with loading state (click to trigger)">
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <AsyncButton
            variant="contained"
            color="primary"
            callback={() => new Promise((r) => setTimeout(r, 1500))}>
            Submit Response
          </AsyncButton>
          <AsyncButton
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            callback={() => new Promise((r) => setTimeout(r, 1500))}>
            Add Question
          </AsyncButton>
          <AsyncButton
            variant="outlined"
            callback={() => new Promise((r) => setTimeout(r, 1500))}>
            Save Draft
          </AsyncButton>
        </Stack>
      </ShowcaseCard>

      {/* NEW BADGE + APP TITLE */}
      <SectionTitle>NewBadge / AppTitle</SectionTitle>
      <ShowcaseCard title="Badge variants (click badge to toggle style)">
        <Stack direction="column" alignItems={"center"}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}>
              Default
            </Typography>
            <AppTitle />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}>
              Minecraft
            </Typography>
            <AppTitle minecraft />
          </Box>
        </Stack>
      </ShowcaseCard>

      {/* AUTH BRANDING */}
      <SectionTitle>AuthBranding</SectionTitle>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <AuthBranding
          heading="Welcome Back"
          subtext="Sign in to create polls, host live sessions, and track student engagement in real time."
        />
      </Paper>

      {/* LEAVE BUTTON */}
      <SectionTitle>LeaveButton</SectionTitle>
      <ShowcaseCard title="Back button with confirmation dialog">
        <Stack direction="row" spacing={2} alignItems="center">
          <LeaveButton
            callback={() => {
              /* noop demo */
            }}
            dialogTitle="Leave Session?"
            dialogContent="Are you sure you want to leave? Your responses will still be saved."
          />
          <Typography variant="body2" color="text.secondary">
            Click the arrow to see the confirmation dialog
          </Typography>
        </Stack>
      </ShowcaseCard>

      {/* SNACKBAR */}
      <SectionTitle>Snackbar (Global)</SectionTitle>
      <ShowcaseCard title="Snackbar variants — click to trigger each severity">
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {(["success", "info", "warning", "error"] as SeverityType[]).map(
            (severity) => (
              <Button
                key={severity}
                variant="outlined"
                color={severity === "info" ? "primary" : severity}
                onClick={() =>
                  snackbar.show({
                    message: `This is a ${severity} snackbar`,
                    type: severity,
                  })
                }>
                {severity}
              </Button>
            ),
          )}
        </Stack>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Button
            variant="text"
            size="small"
            onClick={() =>
              snackbar.show({
                message: "Bottom-left snackbar",
                type: "info",
                position: { vertical: "bottom", horizontal: "left" },
              })
            }>
            Bottom Left
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() =>
              snackbar.show({
                message: "Bottom-center snackbar",
                type: "info",
                position: { vertical: "bottom", horizontal: "center" },
              })
            }>
            Bottom Center
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() =>
              snackbar.show({
                message: "Custom duration (5s)",
                type: "warning",
                duration: 5000,
              })
            }>
            5s Duration
          </Button>
        </Stack>
      </ShowcaseCard>

      {/* DASHBOARD CARDS */}
      <SectionTitle>Dashboard Cards</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        <RecentPollCard
          pollTitle="CS 300 — Midterm Review"
          result="Average: 78% | 32 students"
        />
        <RecentPollCard
          pollTitle="Algorithms Quiz #9"
          result="Average: 82% | 28 students"
        />
        <RecentPollCard
          pollTitle="Data Structures Exit Ticket"
          result="Average: 65% | 45 students"
        />
      </Box>

      {/* POLL METRICS */}
      <SectionTitle>PollMetricsCard</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <PollMetricsCard sum={mockSummary} />
        <PollMetricsCard
          sum={{
            ...mockSummary,
            average_100: 91,
            median_100: 94,
            low_100: 72,
            high_100: 100,
            lower_quartile_100: 85,
            upper_quartile_100: 98,
            total_participants: 18,
          }}
        />
      </Box>

      {/* SCORE HISTOGRAM */}
      <SectionTitle>ScoreHistogram</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ScoreHistogram submissions={mockSubmissions} summary={mockSummary} />
        <ScoreHistogram
          submissions={mockSubmissions.slice(0, 10)}
          summary={{
            ...mockSummary,
            average_100: 35,
            total_participants: 10,
          }}
        />
      </Box>

      {/* USER AVATAR */}
      <SectionTitle>UserAvatar</SectionTitle>
      <ShowcaseCard title="User avatars with initials">
        <Stack direction="row" spacing={2}>
          <UserAvatar uid="1" displayName="Miguel Campos" />
          <UserAvatar uid="2" displayName="John Doe" />
          <UserAvatar uid="3" displayName="Alice Bob Charlie" />
          <UserAvatar uid="4" displayName="X" />
        </Stack>
      </ShowcaseCard>

      {/* GAUGES */}
      <SectionTitle>Gauge Charts</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title="PulseGauge — High Score">
          <PulseGauge score={92} size={180} />
        </ShowcaseCard>
        <ShowcaseCard title="PulseGauge — Medium Score">
          <PulseGauge score={58} size={180} />
        </ShowcaseCard>
        <ShowcaseCard title="PulseGauge — Low Score">
          <PulseGauge score={23} size={180} />
        </ShowcaseCard>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mt: 3,
        }}>
        <SessionGaugeCard
          score={72}
          title="CS 300 — Midterm Review"
          timestamp={Timestamp.now()}
        />
        <SessionGaugeCard
          score={85}
          title="Algorithms Quiz #9"
          timestamp={Timestamp.now()}
        />
      </Box>

      {/* SPLASH COMPONENTS */}
      <SectionTitle>Splash — Features</SectionTitle>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Features />
      </Paper>

      <SectionTitle>Splash — About</SectionTitle>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <About />
      </Paper>

      <SectionTitle>Splash — FAQs</SectionTitle>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <FAQs />
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* COMPONENTS NOT RENDERED */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        Components Not Shown
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The following components require Firebase, API connections, or complex
        context providers and cannot be rendered standalone with dummy data:
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}>
        {[
          {
            category: "Auth",
            items: [
              "UserLogin",
              "RegisterJoin",
              "ContinueWGoogleButton",
              "SignOutButton",
            ],
          },
          {
            category: "Header",
            items: [
              "AppBar",
              "AppTitle",
              "ProfileIcon",
              "MenuButton",
              "NavItems",
              "AuthMenuList",
              "GuestMenuList",
            ],
          },
          {
            category: "Poll Edit",
            items: [
              "Header",
              "QuestionEditor",
              "QuestionList",
              "PromptField",
              "PromptTypeField",
              "PromptOptionEditor",
              "Settings",
              "TimerSwitch",
              "UploadPDFDialog",
              "DeleteMenuItem",
            ],
          },
          {
            category: "Poll Session",
            items: [
              "HostButton",
              "StartButton",
              "NextButton",
              "FinishButton",
              "Host Header",
              "Participate Header",
              "ResponseDialog",
              "Choice",
            ],
          },
          {
            category: "Poll History",
            items: [
              "PollSessionHistory",
              "PollSubmissionHistory",
              "SessionCard*",
              "SubmissionCard*",
            ],
          },
          {
            category: "Graphs",
            items: ["MostRecentGaugeCard", "NoRecentPoll", "ScoreGaugeCard*"],
          },
        ].map((group) => (
          <Paper
            key={group.category}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {group.category}
            </Typography>
            {group.items.map((item) => (
              <Typography
                key={item}
                variant="caption"
                display="block"
                color="text.secondary">
                {item}
              </Typography>
            ))}
          </Paper>
        ))}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 1 }}>
        * Requires Firestore DocumentReference in props
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 4 }}>
        Toggle dark mode (top-right) to preview both themes
      </Typography>
    </Box>
  )
}
