import AsyncButton from "@/components/AsyncButton"
import api from "@/api"
import { Session } from "@/types"
import { DocumentReference } from "firebase/firestore"

interface StartButtonProps {
  sref: DocumentReference<Session>
}

/**
 * @brief Starts the session for everyone.
 */
export default function StartButton(props: StartButtonProps) {
  const { sref } = props

  const callback = async () => {
    await api.sessions.start(sref)
  }

  return <AsyncButton callback={callback}>Start</AsyncButton>
}
