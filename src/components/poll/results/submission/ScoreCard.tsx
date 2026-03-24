import { Avatar, Typography, Box, CardActionArea } from "@mui/material"
import { Submission } from "@/types"
import { stoc } from "@/utils"
import { useNavigate } from "react-router-dom"
import { DocumentReference } from "firebase/firestore"

interface Props {
  sub: Submission
  ref: DocumentReference<Submission>
}

export default function ScoreCard(props: Props) {
  const { sub, ref } = props
  const navigate = useNavigate()

  const onClick = () => {
    void navigate(`/poll/submission/${ref.id}/results`)
  }
  return (
    <CardActionArea
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (t) => `0 0 0 1px ${t.palette.primary.main}`,
        },
      }}>
      <Box display='flex' alignItems='center'>
        {sub.photo_url ? (
          <Avatar src={sub.photo_url} sx={{ width: 32, height: 32 }} />
        ) : (
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: stoc(sub.display_name) }}
          />
        )}
        <Typography flex={1} ml={1.5} fontWeight={500}>
          {sub.display_name}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {isFinite(sub.score_100) ? `${sub.score_100.toFixed()}%` : "—"}
        </Typography>
      </Box>
    </CardActionArea>
  )
}
