import { useState } from "react"
import { PollSessionContext } from "../contexts/PollSessionContext"
import { Session } from "../types"

export const PollSessionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [session, setSession] = useState<Session | null>(null)

  return (
    <PollSessionContext.Provider value={{ session, setSession }}>
      {children}
    </PollSessionContext.Provider>
  )
}
