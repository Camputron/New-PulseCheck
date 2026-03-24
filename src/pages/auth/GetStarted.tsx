/* eslint-disable react-hooks/exhaustive-deps */
import GuestJoin from "@/components/poll/join/GuestJoin"
import { useAuthContext } from "@/hooks"
import useRedirectIfAuthenticated from "@/hooks/useRedirectIfAuthenticated"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function GetStarted() {
  useRedirectIfAuthenticated()
  const auth = useAuthContext()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    /* if the user is logged in and not a guest, redirect to /poll/join */
    if (auth.user && !auth.user.isAnonymous && !auth.loading) {
      const code = params.get("code")
      /* if query param code is defined, pass it */
      if (code) {
        void navigate(`/poll/join?code=${code}`)
      } else {
        void navigate("/poll/join")
      }
    }
  }, [auth])

  return <GuestJoin />
}
