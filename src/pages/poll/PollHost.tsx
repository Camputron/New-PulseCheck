import api from "@/api"
import { useAuthContext } from "@/hooks"
import { SessionState, WaitingUser } from "@/types"
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
} from "@mui/material"
import { onSnapshot } from "firebase/firestore"
import React, { useEffect, useRef, useState } from "react"
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore"
import { useNavigate, useParams } from "react-router-dom"
import RoomCodeDisplay from "@/components/poll/session/host/RoomCodeDisplay"
import UserSessionGrid from "@/components/poll/session/UserSessionGrid"
import ResultsChart from "@/components/poll/session/ResultsChart"
import Header from "@/components/poll/session/host/Header"
import QuestionBox from "@/components/poll/session/host/QuestionBox"
import LeaderboardCard from "@/components/poll/session/LeaderboardCard"
import useRequireAuth from "@/hooks/useRequireAuth"
import { saveActiveSession, clearActiveSession } from "@/utils"

export default function PollHost() {
  useRequireAuth({ blockGuests: true })
  const params = useParams()
  const { user, loading } = useAuthContext()
  const sid = params.id ?? ""
  const sref = api.sessions.doc(sid)
  const [session, sessionLoading] = useDocumentData(sref)
  const [users] = useCollection(api.sessions.users.collect(sid))
  const navigate = useNavigate()
  /** the current questiont to be shown */
  const question = session?.question
  const [timeLeft, setTimeLeft] = useState(0)
  const sessionRef = useRef(session)
  sessionRef.current = session
  const [allowNavigation, setAllowNavigation] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)

  /* Block browser back / swipe-back via popstate.
     Pushes a duplicate history entry so pressing back lands on the same page,
     then shows a confirmation dialog instead of navigating away. */
  useEffect(() => {
    if (allowNavigation) return undefined

    window.history.pushState({ sentinel: true }, "")

    const handlePopState = () => {
      setShowLeaveDialog(true)
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
    let interval: NodeJS.Timeout | null = null
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            /* move to next question */
            clearInterval(interval!)
            return 0
          }
          return prev - 1000
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeLeft])

  useEffect(() => {
    /* set timer for question if it exists */
    if (session?.question?.time) {
      setTimeLeft(session.question.time)
    } else {
      setTimeLeft(NaN)
    }
  }, [session?.question])

  useEffect(() => {
    /* if session exists and is done loading */
    if (session) {
      if (session.state === SessionState.CLOSED) {
        clearActiveSession()
        setAllowNavigation(true)
        void navigate("/dashboard")
      } else if (session.state === SessionState.FINISHED) {
        /* session finished successfully! view the results */
        clearActiveSession()
        setAllowNavigation(true)
        void navigate(`/poll/session/${sref.id}/results`, {
          state: {
            finished: true,
          },
        })
      }
    }
  }, [session, navigate, sref])

  useEffect(() => {
    /* if session is defined and not loading, update active session */
    if (session && !sessionLoading) {
      saveActiveSession({
        sid,
        roomCode: session.room_code,
        role: "host",
      })
    }
  }, [session, sessionLoading, sid])

  useEffect(() => {
    /* ensure user is host */
    if (user && !loading) {
      api.sessions
        .isHost(sid, user.uid)
        .then((isHost) => {
          if (!isHost) {
            if (user.isAnonymous) {
              void navigate("/get-started")
            } else {
              void navigate("/poll/join")
            }
          }
        })
        .catch((err) => console.debug(err))
    }
  }, [user, loading, navigate, sid])

  useEffect(() => {
    if (!sid) {
      return
    }
    // const usersRef = api.sessions.users.collect(sid)
    const wuRef = api.sessions.waiting_users.collect(sid)
    const unsubscribeUsers = onSnapshot(wuRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        async function addUser(userId: string, data: WaitingUser) {
          try {
            await api.sessions.users.set(sid, userId, {
              display_name: data.display_name,
              photo_url: data.photo_url,
              incorrect: false,
            })
          } catch (err) {
            console.debug(err)
          }
        }
        if (change.type === "added") {
          const userId = change.doc.id
          const userData = change.doc.data()
          /* if the session state is open, then allow the user to join */
          if (
            sessionRef.current &&
            sessionRef.current.state === SessionState.OPEN
          ) {
            void addUser(userId, userData)
          }
        }
      })
    })
    // eslint-disable-next-line consistent-return
    return () => {
      unsubscribeUsers()
    }
  }, [sid])

  if (sessionLoading) {
    return <LinearProgress />
  }

  return (
    <React.Fragment>
      <Header sref={sref} session={session} users={users} timeLeft={timeLeft} />
      {session?.question &&
        (session.question.time ? (
          <LinearProgress
            variant={"determinate"}
            value={(timeLeft / session.question.time) * 100}
          />
        ) : (
          <LinearProgress />
        ))}
      <Container sx={{ mt: 2, mb: 2 }}>
        {session?.state === SessionState.OPEN && (
          <RoomCodeDisplay session={session} />
        )}
        {/* render the current question here */}
        {question && (
          <Box mb={2}>
            <QuestionBox question={question} />
          </Box>
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
        {/* render users currently in the poll session */}
        <UserSessionGrid
          users={users}
          results={session?.results}
          anonymous={
            Boolean(session?.anonymous) ||
            Boolean(session?.results?.question?.anonymous)
          }
        />
      </Container>

      {/* Navigation guard dialog — shown when host tries to leave via back/swipe */}
      <Dialog open={showLeaveDialog}>
        <DialogTitle>Leave this session?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your session will keep running. You can rejoin from the banner on
            the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveDialog(false)}>Stay</Button>
          <Button
            color="error"
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
