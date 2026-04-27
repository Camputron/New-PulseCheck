import { SessionSummary } from "@/types"
import { Box, Divider, Typography } from "@mui/material"

interface Props {
  sum?: SessionSummary | null
}

function fmt(val?: number): string {
  if (val === undefined || val === null || !isFinite(val)) return "—"
  return `${val.toFixed(0)}%`
}

/**
 * UI for submission data showing users the data
 * @author VerySirias
 * @returns {JSX.Element}
 */
export default function PollMetricsCard(props: Props) {
  const { sum } = props

  const hasData =
    sum !== undefined &&
    sum !== null &&
    isFinite(sum.average_100) &&
    sum.total_participants > 0

  if (!hasData) {
    return null
  }

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}>
      <Typography fontWeight={600} gutterBottom>
        Score Details
      </Typography>
      <Box textAlign="center" py={1}>
        <Typography variant="h4" fontWeight={700}>
          {fmt(sum.average_100)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mean
        </Typography>
      </Box>
      <Divider sx={{ my: 1.5 }} />
      <Box display="flex" justifyContent="space-between" textAlign="center">
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {fmt(sum.low_100)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Low
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {fmt(sum.lower_quartile_100)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Q1
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {fmt(sum.median_100)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Median
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {fmt(sum.upper_quartile_100)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Q3
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {fmt(sum.high_100)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            High
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="right"
        mt={1}>
        {sum.total_participants} participant
        {sum.total_participants !== 1 ? "s" : ""}
      </Typography>
    </Box>
  )
}
