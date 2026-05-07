import { Box, Stack, Typography, Divider } from "@mui/material"
import { QuestionStat } from "@/types"

interface Props {
  stats?: QuestionStat[] | null
}

function fmtPct(v: number): string {
  if (!isFinite(v)) return "—"
  return `${v.toFixed(0)}%`
}

function fmtTime(ms: number | null): string {
  if (ms === null || !isFinite(ms)) return "—"
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(1)} s`
}

/**
 * Per-question difficulty ranking card (F41 / SRS AR-15).
 * Renders nothing for sessions finished before F41 shipped.
 */
export default function QuestionDifficultyCard(props: Props) {
  const { stats } = props
  if (!stats || stats.length === 0) return null

  const ranked = [...stats].sort(
    (a, b) => a.percent_correct - b.percent_correct,
  )

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}>
      <Typography fontWeight={600} gutterBottom>
        Question Difficulty
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Ranked from most difficult to easiest
      </Typography>
      <Divider sx={{ my: 1.5 }} />
      <Stack divider={<Divider />} spacing={1}>
        {ranked.map((s, i) => (
          <Box key={s.qid} sx={{ pt: i === 0 ? 0 : 1 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Typography
                sx={{
                  width: 28,
                  fontWeight: 700,
                  color: "text.secondary",
                }}>
                {i + 1}
              </Typography>
              <Box flex={1} minWidth={0}>
                <Typography
                  fontSize="0.95rem"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                  {s.prompt || "(untitled question)"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s.correct_count} / {s.total_participants} correct · avg{" "}
                  {fmtTime(s.avg_response_time_ms)}
                </Typography>
              </Box>
              <Typography fontWeight={700} fontSize="0.95rem">
                {fmtPct(s.percent_correct)}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
