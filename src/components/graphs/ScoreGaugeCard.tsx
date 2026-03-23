import { Box, Card, CardContent, Typography } from "@mui/material"
import PulseGauge from "./PulseGauge"
import { Submission } from "@/lib/types"

interface Props {
  sub?: Submission
}

export default function ScoreGaugeCard(props: Props) {
  const { sub } = props

  if (!sub || !isFinite(sub.score_100)) {
    return null
  }

  const name = sub.display_name
  return (
    <Card variant='outlined'>
      <CardContent>
        <Typography variant='h6' align='center'>
          {name}'s Score
        </Typography>
        <Box display={"flex"} justifyContent={"center"}>
          <PulseGauge score={sub.score_100} />
        </Box>
        <Box>
          <Typography
            variant='h6'
            fontWeight={"bold"}
            align='center'
            gutterBottom>
            {sub.title}
          </Typography>

          <Typography variant='body2' color='textSecondary' align='center'>
            Submitted: {sub.submitted_at?.toDate().toLocaleDateString()}{" "}
            {sub.submitted_at?.toDate().toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
