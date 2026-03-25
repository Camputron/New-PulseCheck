import { Container, Stack } from "@mui/material"
//import { useSnackbar } from "@/hooks"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import api from "@/api"
import PollMetricsCard from "@/components/poll/results/PollMetricsCard"
import { useLocation, useParams } from "react-router-dom"
import Header from "@/components/poll/results/submission/Header"
import React, { useEffect, useState } from "react"
import AnswerCard from "@/components/poll/results/AnswerCard"
import { getDoc } from "firebase/firestore"
import { Session } from "@/types"
import Confetti from "react-confetti"
import ScoreGaugeCard from "@/components/graphs/ScoreGaugeCard"
import useRequireAuth from "@/hooks/useRequireAuth"

/**
 * Allows users to set the settings for a question of a poll.
 * @author VerySirias
 * @returns {JSX.Element}
 */
export default function PollSubmissionResults() {
  useRequireAuth()
  const params = useParams()
  const id = params.id ?? ""
  const ref = api.submissions.doc(id)
  const [sub] = useDocumentDataOnce(ref)
  const [session, setSession] = useState<Session>()
  const [showConfetti, setShowConfetti] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (location.state?.finished && sub?.score_100 === 100) {
      setShowConfetti(true)
    }
  }, [location.state, sub])

  useEffect(() => {
    if (sub !== null && sub !== undefined) {
      getDoc(sub.session)
        .then((x) => {
          setSession(x.data())
        })
        .catch((err) => console.debug(err))
    }
  }, [sub])

  return (
    <React.Fragment>
      {showConfetti && <Confetti tweenDuration={5000} recycle={false} />}
      {session?.title && sub?.submitted_at && (
        <Header
          title={session?.title}
          submitted_at={sub?.submitted_at}></Header>
      )}
      <Container sx={{ marginBlock: 2, textAlign: "initial" }}>
        <Stack spacing={1}>
          {/* <Typography variant='h6'>{sub?.display_name}</Typography> */}
          <ScoreGaugeCard sub={sub} />
          <Stack>
            {sub?.session && (
              <PollMetricsCard sum={session?.summary}></PollMetricsCard>
            )}
          </Stack>
          <Stack spacing={1}>
            {session?.questions.map((x) => (
              <AnswerCard
                key={x.id}
                sid={sub?.session.id ?? ""}
                uid={sub?.user.id ?? ""}
                qref={x}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </React.Fragment>
  )
}
