import { Box, Card, CardContent, Typography } from "@mui/material"
import PulseGauge from "./PulseGauge"
import { Timestamp } from "firebase/firestore"

interface Props {
  score: number
  title: string
  timestamp?: Timestamp
}

/**
 * UI for submiision Chart.
 * @author VerySirias, ZairaGarcia17
 * @returns {JSX.Element}
 */
export default function SessionGaugeCard(props: Props) {
  const { score, title, timestamp } = props

  if (!isFinite(score)) {
    return null
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" align="center">
          Average Score
        </Typography>
        <Box display={"flex"} justifyContent={"center"}>
          <PulseGauge score={score} />
        </Box>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          align="center"
          gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" align={"center"}>
          Hosted: {timestamp?.toDate().toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  )
}
