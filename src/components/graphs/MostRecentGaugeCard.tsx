import {
  Box,
  CardActionArea,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { getDoc, QueryDocumentSnapshot } from "firebase/firestore"
import api from "@/api"
import { useEffect, useState } from "react"
import { Session, Submission } from "@/types"
import { useAuthContext } from "@/hooks"
import { useNavigate } from "react-router-dom"
import {
  Groups,
  QuestionAnswer,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material"
import NoRecentPolls from "./NoRecentPoll"
import PulseGauge from "./PulseGauge"

interface Props {
  mrpsd: number
}

function scoreMessage(pct: number): string {
  if (pct >= 90) return "Excellent work!"
  if (pct >= 70) return "Good job, keep it up!"
  if (pct >= 50) return "Not bad — room to improve."
  return "Keep practicing!"
}

export default function MostRecentGaugeCard(props: Props) {
  const { mrpsd } = props
  const { user } = useAuthContext()
  const [snapshot, setSnapshot] = useState<
    QueryDocumentSnapshot<Submission> | null | undefined
  >()
  const [session, setSession] = useState<Session>()
  const navigate = useNavigate()
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (user) {
      api.submissions
        .findMostRecentSubmission(user.uid)
        .then((x) => {
          if (!x) return
          setSnapshot(x)
          const sub = x.data()
          getDoc(sub.session)
            .then((s) => {
              if (s.exists()) {
                setSession(s.data())
              }
            })
            .catch((err) => console.debug(err))
        })
        .catch((err) => console.debug(err))
    }
  }, [user])

  const sub = snapshot?.data()
  if (!snapshot?.data()) {
    return <NoRecentPolls />
  }

  const submitted_at = sub?.submitted_at

  const onClick = () => {
    if (snapshot) {
      void navigate(`/poll/submission/${snapshot.id}/results`)
    }
  }

  const heading =
    mrpsd === 0
      ? `${user?.displayName}'s Score`
      : mrpsd === 1
        ? "Your Latest Score"
        : "Most Recent Poll"

  const isClickable = mrpsd !== 0
  const scoreValid = sub && isFinite(sub.score_100)
  const classAvg = session?.summary?.average_100
  const classAvgValid = classAvg !== undefined && isFinite(classAvg)
  const questionCount = session?.questions?.length
  const participants = session?.summary?.total_participants

  const gaugeSize = isPhone ? 200 : 150
  const gaugeFontSize = isPhone ? "1.5em" : "1.3em"

  const formattedDate = submitted_at
    ? submitted_at.toDate().toLocaleDateString()
    : ""

  const wrapperSx = {
    p: isPhone ? 2.5 : 3,
    borderRadius: 3,
    border: 1,
    borderColor: "divider",
    overflow: "hidden",
    ...(mrpsd !== 0 && { mt: 2 }),
    display: "flex",
    flexDirection: isPhone ? "column" : "row",
    alignItems: "center",
    gap: isPhone ? 1.5 : 3,
    transition: "all 0.2s ease",
    ...(isClickable && {
      "&:hover": {
        borderColor: "primary.main",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,150,136,0.15)"
            : "0 4px 20px rgba(0,150,136,0.1)",
      },
    }),
  }

  const inner = (
    <>
      {scoreValid && (
        <Box sx={{ flexShrink: 0 }}>
          <PulseGauge
            score={sub.score_100}
            size={gaugeSize}
            fontSize={gaugeFontSize}
          />
        </Box>
      )}
      <Box
        flex={1}
        minWidth={0}
        textAlign={isPhone ? "center" : "left"}
        width={isPhone ? "100%" : "auto"}>
        <Typography variant='body2' color='text.secondary' fontWeight={500}>
          {heading}
        </Typography>
        <Typography
          variant={isPhone ? "subtitle1" : "h6"}
          fontWeight={700}
          noWrap
          sx={{ mt: 0.25 }}>
          {sub?.title}
        </Typography>
        <Box
          display='flex'
          alignItems='center'
          justifyContent={isPhone ? "center" : "flex-start"}
          flexWrap='wrap'
          gap={0.75}
          mt={1}>
          {scoreValid && (
            <>
              <Chip
                size='small'
                label={`${sub.score_100.toFixed(0)}%`}
                color='primary'
                variant='outlined'
              />
              <Chip
                size='small'
                label={`${sub.score}/${sub.max_score} pts`}
                variant='outlined'
                sx={{ fontSize: "0.75rem" }}
              />
            </>
          )}
          {classAvgValid && scoreValid && (
            <Chip
              size='small'
              icon={
                sub.score_100 >= classAvg ? (
                  <TrendingUp fontSize='small' />
                ) : (
                  <TrendingDown fontSize='small' />
                )
              }
              label={`Avg ${classAvg.toFixed(0)}%`}
              variant='outlined'
              color={sub.score_100 >= classAvg ? "success" : "warning"}
              sx={{ fontSize: "0.75rem" }}
            />
          )}
          {questionCount !== undefined && questionCount > 0 && (
            <Chip
              size='small'
              icon={<QuestionAnswer fontSize='small' />}
              label={`${questionCount} Question${questionCount !== 1 ? "s" : ""}`}
              variant='outlined'
              sx={{ px: 0.5, fontSize: "0.75rem" }}
            />
          )}
          {participants !== undefined && participants > 0 && (
            <Chip
              size='small'
              icon={<Groups fontSize='small' />}
              label={`${participants}`}
              variant='outlined'
              sx={{ px: 0.5, fontSize: "0.75rem" }}
            />
          )}
        </Box>
        {formattedDate && (
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ mt: 1, display: "block" }}>
            {formattedDate}
          </Typography>
        )}
        {scoreValid && (
          <Typography
            variant='body2'
            color='text.secondary'
            fontStyle='italic'
            sx={{ mt: 1 }}>
            {scoreMessage(sub.score_100)}
          </Typography>
        )}
      </Box>
    </>
  )

  if (!isClickable) {
    return <Box sx={wrapperSx}>{inner}</Box>
  }

  return (
    <CardActionArea onClick={onClick} sx={wrapperSx}>
      {inner}
    </CardActionArea>
  )
}
