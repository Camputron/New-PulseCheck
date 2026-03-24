import { Container, Typography, Stack, Grid2, Divider } from "@mui/material"
import SessionGaugeCard from "@/components/graphs/SessionGaugeCard"
import Header from "@/components/poll/results/session/Header"
import PollMetricsCard from "@/components/poll/results/PollMetricsCard"
import { useParams } from "react-router-dom"
import api from "@/api"
import { useDocumentDataOnce } from "react-firebase-hooks/firestore"
import React, { useEffect, useState } from "react"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { Submission } from "@/types"
import ScoreCard from "@/components/poll/results/submission/ScoreCard"
import { ntops } from "@/utils"
import SessionScatterCard from "@/components/graphs/SessionScatterCharrt"
import useRequireAuth from "@/hooks/useRequireAuth"

/**
 * Allows Host to see the poll results.
 * @author ZairaGarcia17, VerySirias
 * @returns {JSX.Element}
 */

/**
 * Make components for the following:
 *-Toolbar
 *-Chart scores (we can reuse the one I made for participants)
 *-Score Details (we can reuse the one I made for participants)
 * -search up and participants card
 * These components are in compoents/poll/submission
 */

export default function PollSessionResults() {
  useRequireAuth({ blockGuests: true })
  const params = useParams()
  const id = params.id ?? ""
  const ref = api.sessions.doc(id)
  const [session] = useDocumentDataOnce(ref)
  const [submissions, setSubmissions] = useState<
    QueryDocumentSnapshot<Submission, DocumentData>[]
  >([])

  useEffect(() => {
    if (session) {
      api.submissions
        .findAllBySID(id)
        .then((res) => {
          const docs = res.docs
          setSubmissions(docs)
        })
        .catch((err) => console.debug(err))
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <React.Fragment>
      {session && (
        <Header title={session?.title} create_at={session?.created_at}></Header>
      )}
      <Container sx={{ marginBlock: 2, textAlign: "initial" }}>
        <Stack spacing={1}>
          <SessionGaugeCard
            score={session?.summary?.average_100 ?? NaN}
            title={session?.title ?? ""}
            timestamp={session?.created_at}
          />
          <PollMetricsCard sum={session?.summary}></PollMetricsCard>
          <SessionScatterCard submissions={submissions.map((i) => i.data())} />
          <Divider>
            <Typography>{ntops(submissions.length)}</Typography>
          </Divider>
          <Grid2 container spacing={1}>
            {submissions?.map((x) => (
              <Grid2
                key={x.ref.path}
                size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>
                <ScoreCard ref={x.ref} sub={x.data()} />
              </Grid2>
            ))}
          </Grid2>
        </Stack>
      </Container>
    </React.Fragment>
  )
}
