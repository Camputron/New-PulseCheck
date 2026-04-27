import { Submission } from "@/types"
import { tstos } from "@/utils"
import { Box, CardActionArea, Chip, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"

interface SubmissionCardProps {
  sid: string
  submission: Submission
}

export default function SubmissionCard(props: SubmissionCardProps) {
  const { sid, submission: x } = props
  const navigate = useNavigate()

  const onClick = () => {
    void navigate(`/poll/submission/${sid}/results`)
  }

  const hasValidScore = x.max_score > 0 && isFinite(x.score_100)
  const scoreLabel = hasValidScore
    ? `${x.score}/${x.max_score} (${x.score_100.toFixed(0)}%)`
    : "No score"

  return (
    <React.Fragment>
      <CardActionArea
        onClick={onClick}
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          textAlign: "initial",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: (t) => `0 0 0 1px ${t.palette.primary.main}`,
          },
        }}>
        <Box display="flex" alignItems="center" mb={1}>
          {/* <Avatar
            sx={{
              mr: 1.5,
              width: 28,
              height: 28,
              bgcolor: stoc(x.display_name),
              fontSize: 14,
            }}
            src={x.photo_url ?? ""}>
            {stoni(x.display_name)}
          </Avatar> */}
          <Typography
            fontWeight={600}
            flex={1}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
            {x.title}
          </Typography>
          <Chip size="small" label={scoreLabel} variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {x.display_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Submitted {tstos(x.submitted_at)}
        </Typography>
      </CardActionArea>
    </React.Fragment>
  )
}
