import { createContext, Dispatch, SetStateAction } from "react"
import { Session } from "../types"

interface PollSessionContextType {
  session: Session | null
  setSession: Dispatch<SetStateAction<Session | null>>
}

export const PollSessionContext = createContext<PollSessionContextType | null>(
  null
)
