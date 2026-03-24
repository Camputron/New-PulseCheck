/* eslint-disable react-hooks/exhaustive-deps */
import api from "@/api"
import { Typography, Box, Button, LinearProgress } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import useSnackbar from "@/hooks/useSnackbar"
import { useAuthContext } from "@/hooks"
import useRequireAuth from "@/hooks/useRequireAuth"

const CHECK_INTERVAL_MS = 2000

export default function PollSession() {
  useRequireAuth()
  const params = useParams()
  const sid = params.id ?? ""
  const { user, loading } = useAuthContext()
  const snackbar = useSnackbar()
  const navigate = useNavigate()
  const [status, setStatus] = useState("Joining Session...")

  useEffect(() => {
    const aux = async () => {
      if (!user || loading) {
        return
      }
      try {
        const uid = user.uid
        const hasJoined = await api.sessions.hasJoined(sid, uid)
        /* check if user has joined */
        if (hasJoined) {
          void navigate(`/poll/session/${sid}/participate`)
        }
        const isWaiting = await api.sessions.isWaitingForEntry(sid, uid)
        if (!isWaiting) {
          setStatus("Access Denied!")
          if (user.isAnonymous) {
            await user.delete()
            await navigate("/get-started", { replace: true })
            throw new Error("Unauthorized (Guest-Poll-Session)")
          } else {
            await navigate("/poll/join", { replace: true })
            throw new Error("Unauthorized (User-Poll-Session)")
          }
        } else {
          setStatus("Waiting to Join Session...")
        }
      } catch (err) {
        console.debug(err)
      }
    }
    /* check every now and then if user has joined the session */
    const int = setInterval(() => {
      void aux()
    }, CHECK_INTERVAL_MS)
    return () => {
      clearInterval(int)
    }
  }, [])

  function handleLeave() {
    async function aux() {
      if (!user) {
        return
      }
      try {
        const uid = user.uid
        if (await api.sessions.isWaitingForEntry(sid, uid)) {
          await api.sessions.leaveQueue(sid, uid)
        } else if (await api.sessions.hasJoined(sid, uid)) {
          await api.sessions.leaveSession(sid, uid)
        }
        snackbar.show({
          message: `You left the session`,
          type: "info",
        })
        if (user.isAnonymous) {
          await user.delete()
          void navigate("/get-started", { replace: true })
        } else {
          void navigate("/poll/join", { replace: true })
        }
      } catch (err: unknown) {
        console.error(err)
      }
    }
    void aux()
  }

  return (
    <Box
      position={"relative"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"80vh"}>
      <Box>
        <Typography variant='h6'>{status}</Typography>
        {/* <Typography variant='h6'>Waiting for host approval...</Typography> */}
        <LinearProgress />
      </Box>
      <Box position={"absolute"} bottom={8} display={"flex"} flex={1}>
        <Button variant='contained' onClick={handleLeave}>
          Leave
        </Button>
      </Box>
    </Box>
  )
}
