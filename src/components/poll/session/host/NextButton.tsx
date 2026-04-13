import AsyncButton from "@/components/AsyncButton"
import api from "@/api"
import { Session } from "@/types"
import { DocumentReference } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"

interface NextButtonProps {
  sref: DocumentReference<Session>
  session?: Session | null
  timeLeft: number
}

export default function NextButton(props: NextButtonProps) {
  const { sref, session, timeLeft } = props
  const [text, setText] = useState("Next")
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (timeLeft <= 0) {
      buttonRef.current?.click()
    }
  }, [timeLeft])

  const callback = async () => {
    if (!session) throw new Error("session is null!")
    const currentQuestion = session.question
    if (currentQuestion) {
      await api.sessions.closeQuestion(currentQuestion.ref)
      await api.sessions.gradeQuestion(sref, currentQuestion)
      await api.sessions.clearQuestion(sref)
      if (session.leaderboard) {
        await api.sessions.computeLeaderboard(sref, currentQuestion.ref.id)
      }
      await api.sessions.displayUserResponses(sref, currentQuestion)
      setText("Next")
    } else {
      /* load next question or mark session as DONE */
      await api.sessions.nextQuestion(sref)
      setText("Show Results")
    }
  }

  return (
    <AsyncButton ref={buttonRef} callback={callback}>
      {text}
    </AsyncButton>
  )
}
