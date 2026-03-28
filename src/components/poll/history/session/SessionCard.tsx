import { useThemeContext } from "@/hooks"
import { Session, SessionState } from "@/types"
import { ntops, stoc, tstos } from "@/utils"
import { BarChart } from "@mui/icons-material"
import { Avatar, Box, CardActionArea, Chip, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"

interface SessionCardProps {
  sid: string
  session: Session
}

export default function SessionCard(props: SessionCardProps) {
  const { sid, session: x } = props
  const navigate = useNavigate()
  const theme = useThemeContext()

  const onClick = () => {
    void navigate(`/poll/session/${sid}/results`)
  }

  const avg = x.summary?.average_100
  const questionCount = x.questions?.length ?? 0

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
        <Box display='flex' alignItems='center' mb={1}>
          <Avatar
            sx={{ width: 28, height: 28, mr: 1.5, bgcolor: stoc(x.title) }}>
            <BarChart
              sx={{ fontSize: 16 }}
              color={theme.mode === "light" ? "inherit" : "action"}
            />
          </Avatar>
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
          {x.state === SessionState.CLOSED && (
            <Chip size='small' label='Closed' color='warning' sx={{ ml: 1 }} />
          )}
        </Box>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='body2' color='text.secondary'>
            {questionCount} question{questionCount !== 1 ? "s" : ""}
          </Typography>
          {avg !== null && avg !== undefined && isFinite(avg) && (
            <Chip
              size='small'
              label={`Avg ${avg.toFixed(0)}%`}
              variant='outlined'
            />
          )}
        </Box>
        <Typography variant='body2' color='text.secondary'>
          {ntops(x.summary?.total_participants)}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Hosted {tstos(x.created_at)}
        </Typography>
      </CardActionArea>
    </React.Fragment>
  )
}
