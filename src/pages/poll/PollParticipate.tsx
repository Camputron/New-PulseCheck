import Header from "@/components/poll/session/participate/Header"
import ResponseDialog from "@/components/poll/session/participate/ResponseDialog"
import ResultsChart from "@/components/poll/session/ResultsChart"
import LeaderboardCard from "@/components/poll/session/LeaderboardCard"
import UserSessionGrid from "@/components/poll/session/UserSessionGrid"
import api from "@/api"
import { useAuthContext, useSnackbar } from "@/hooks"
import { SessionState } from "@/types"
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material"
import { deleteDoc, doc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore"
import { useNavigate, useParams } from "react-router-dom"
// import MemoryGame from "react-card-memory-game"
// import Confetti from "react-confetti"
import useRequireAuth from "@/hooks/useRequireAuth"
import { saveActiveSession, clearActiveSession } from "@/utils"

const CHECK_INTERVAL_MS = 2000

export default function PollParticipate() {
  useRequireAuth()
  const params = useParams()
  const sid = params.id ?? ""
  const { user, loading } = useAuthContext()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const sref = api.sessions.doc(sid)
  const [session, sessionLoading] = useDocumentData(sref)
  const [users] = useCollection(api.sessions.users.collect(sid))
  const [gettingstated, setGettingStated] = useState(false)
  // const [completedGame, setCompletedGame] = useState(false)
  const [allowNavigation, setAllowNavigation] = useState(false)

  /* Block browser back / swipe-back via popstate.
     Pushes a duplicate history entry so pressing back lands on the same page,
     then shows a confirmation dialog instead of navigating away. */
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  useEffect(() => {
    if (allowNavigation) return undefined

    // Push a sentinel entry so the first "back" stays on this page
    window.history.pushState({ sentinel: true }, "")

    const handlePopState = () => {
      // User pressed back / swiped — block and show dialog
      setShowLeaveDialog(true)
      // Re-push so subsequent back presses are also caught
      window.history.pushState({ sentinel: true }, "")
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [allowNavigation])

  /* Block page refresh / tab close */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!allowNavigation) e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [allowNavigation])

  useEffect(() => {
    if (session && !sessionLoading) {
      if (session.state === SessionState.CLOSED) {
        clearActiveSession()
        setAllowNavigation(true)
        snackbar.show({
          message: "Host Ended Session",
          type: "info",
        })
        void navigate("/poll/join")
      } else if (session.state === SessionState.IN_PROGRESS) {
        setGettingStated(true)
      } else if (session.state === SessionState.FINISHED) {
        clearActiveSession()
        setAllowNavigation(true)
        snackbar.show({
          message: "Poll Session Finished!",
          type: "success",
        })
        /* navigate to submission */
        if (!user) return
        api.sessions.submissions
          .get(sref.id, user.uid)
          .then((x) => {
            void navigate(`/poll/submission/${x.ref.id}/results`, {
              state: {
                finished: true,
              },
            })
          })
          .catch((err) => console.debug(err))
      }
    }
  }, [session, sessionLoading, snackbar, navigate, sref.id, user])

  useEffect(() => {
    if (session && !sessionLoading) {
      saveActiveSession({ sid, roomCode: session.room_code })
    }
  }, [session, sessionLoading, sid])

  useEffect(() => {
    const int = setInterval(() => {
      /* check to ensure user is in session every few seconds */
      const aux = async () => {
        if (!user && !loading) {
          setAllowNavigation(true)
          void navigate("/")
        }
        if (!user) return
        const uid = user.uid
        const hasJoined = await api.sessions.hasJoined(sid, uid)
        if (!hasJoined) {
          setAllowNavigation(true)
          if (user.isAnonymous) {
            await user.delete()
            await navigate("/get-started")
          } else {
            await navigate("/poll/join")
          }
        } else {
          const wuref = api.sessions.waiting_users.collect(sid)
          void deleteDoc(doc(wuref, user.uid))
        }
      }
      void aux()
    }, CHECK_INTERVAL_MS)
    return () => {
      clearInterval(int)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    /* tell the user if they were correct */
    if (session?.results && user) {
      const correct = session.results.responses[user.uid].correct
      snackbar.show({
        message: correct ? "Correct!" : "Incorrect!",
        duration: 2000,
        type: correct ? "success" : "error",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, user])

  return (
    <React.Fragment>
      {/* {completedGame && <Confetti tweenDuration={5000} recycle={false} />} */}
      <ResponseDialog session={session} sref={sref} />
      <Header
        sid={sid}
        session={session}
        users={users}
        onAllowNavigation={() => setAllowNavigation(true)}
      />
      {!gettingstated && <LinearProgress />}
      <Container sx={{ mt: 2 }}>
        {!gettingstated && (
          <Typography variant='h5' mb={2}>
            Waiting for Host...
          </Typography>
        )}
        {session?.results && (
          <Box marginBlock={2}>
            <ResultsChart results={session.results} />
          </Box>
        )}
        {/* if we have results and leaderboard is enabled, render this */}
        {session?.results && session?.leaderboard_scores && (
          <LeaderboardCard
            leaderboard={session.leaderboard_scores}
            isAnonymous={
              Boolean(session?.anonymous) ||
              Boolean(session?.results?.question?.anonymous)
            }
          />
        )}
        {/* render the users who are in the poll session */}
        <UserSessionGrid
          users={users}
          results={session?.results}
          anonymous={
            Boolean(session?.anonymous) ||
            Boolean(session?.results?.question?.anonymous)
          }
        />
        {/* {session?.state === SessionState.OPEN && (
          <Box marginInline={8}>
            <MemoryGame
              gridNumber={4}
              foundCardsColor='hsl(45, 95%, 50%)'
              holeCardsColor='hsl(174, 80%, 42%)'
              gameFinished={() => setCompletedGame(true)}
            />
          </Box>
        )} */}
      </Container>

      {/* Navigation guard dialog — shown when user tries to leave via back/swipe */}
      <Dialog open={showLeaveDialog}>
        <DialogTitle>Leave session?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are still in an active session. If you leave now, you can rejoin
            from the banner on the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveDialog(false)}>Stay</Button>
          <Button
            color='error'
            onClick={() => {
              setShowLeaveDialog(false)
              setAllowNavigation(true)
              void navigate(-1)
            }}>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
