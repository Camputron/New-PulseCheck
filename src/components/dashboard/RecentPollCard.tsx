import { Box, Typography } from "@mui/material"
import { RA } from "@/styles"

interface RecentPollCardProps {
  pollTitle: string
  result: string
}

export default function RecentPollCard({
  pollTitle,
  result,
}: RecentPollCardProps) {
  return (
    <RA.Fade triggerOnce>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}>
        <Typography variant='h6' fontWeight={600} gutterBottom>
          {pollTitle}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {result}
        </Typography>
      </Box>
    </RA.Fade>
  )
}
