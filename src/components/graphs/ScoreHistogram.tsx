import { Submission, SessionSummary } from "@/types"
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material"
import { BarChart } from "@mui/x-charts"

interface Props {
  submissions: Submission[]
  summary?: SessionSummary | null
}

const BINS = [
  { label: "0–10", min: 0, max: 10 },
  { label: "10–20", min: 10, max: 20 },
  { label: "20–30", min: 20, max: 30 },
  { label: "30–40", min: 30, max: 40 },
  { label: "40–50", min: 40, max: 50 },
  { label: "50–60", min: 50, max: 60 },
  { label: "60–70", min: 60, max: 70 },
  { label: "70–80", min: 70, max: 80 },
  { label: "80–90", min: 80, max: 90 },
  { label: "90–100", min: 90, max: 101 },
]

function buildBinCounts(submissions: Submission[]): number[] {
  const counts = new Array(BINS.length).fill(0) as number[]
  for (const sub of submissions) {
    const score = sub.score_100 ?? 0
    for (let i = 0; i < BINS.length; i++) {
      if (score >= BINS[i].min && score < BINS[i].max) {
        counts[i]++
        break
      }
    }
  }
  return counts
}

export default function ScoreHistogram({ submissions, summary }: Props) {
  const theme = useTheme()
  const counts = buildBinCounts(submissions)
  const hasData = submissions.length > 0

  if (!hasData) return null

  return (
    <Card variant='outlined'>
      <CardContent>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='baseline'
          mb={1}>
          <Typography fontWeight={600}>Score Distribution</Typography>
          {summary && isFinite(summary.average_100) && (
            <Typography variant='caption' color='text.secondary'>
              Avg: {summary.average_100.toFixed(0)}%
            </Typography>
          )}
        </Box>
        <BarChart
          xAxis={[
            {
              data: BINS.map((b) => b.label),
              scaleType: "band",
              label: "Score %",
            },
          ]}
          yAxis={[{ label: "Students" }]}
          series={[
            {
              data: counts,
              label: "Students",
              color: theme.palette.primary.main,
            },
          ]}
          slotProps={{ legend: { hidden: true } }}
          grid={{ horizontal: true }}
          height={280}
        />
      </CardContent>
    </Card>
  )
}
