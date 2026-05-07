import { Checkbox, Radio } from "@mui/material"
import React, { useEffect, useState } from "react"
import useSnackbar from "@/hooks/useSnackbar"
import api from "@/api"
import { DocumentReference } from "firebase/firestore"
import { PromptOption, PromptType } from "@/types"

interface Props {
  ref: DocumentReference<PromptOption>
  correct: boolean
  promptType: PromptType
}

/**
 * @todo add docs
 * @author Camputron, VerySirias
 * @returns {JSX.Element}
 */
export default function CorrectToggleButton(props: Props) {
  const { ref, promptType, correct } = props
  const snackbar = useSnackbar()
  const [pending, setPending] = useState<boolean | null>(null)

  /* re-sync to Firestore whenever the source-of-truth flag changes,
     unless we have an unflushed user toggle in flight */
  const displayed = pending ?? correct

  useEffect(() => {
    if (pending === null) {
      return undefined
    }
    if (pending === correct) {
      setPending(null)
      return undefined
    }
    let cancelled = false
    void (async () => {
      try {
        await api.polls.questions.options.updateByRef(ref, {
          correct: pending,
        })
      } catch (err: unknown) {
        console.warn(err)
        /* if (!cancelled) {
          snackbar.show({
            message: "Failed to update option",
            type: "error",
          })
        } */
      } finally {
        if (!cancelled) setPending(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pending, correct, ref, snackbar])

  const handleCheckToggle = () => {
    setPending(!displayed)
  }

  return (
    <React.Fragment>
      {promptType === "multi-select" && (
        <Checkbox checked={displayed} onClick={handleCheckToggle} />
      )}
      {promptType === "multiple-choice" && (
        <Radio checked={displayed} onClick={handleCheckToggle} />
      )}
    </React.Fragment>
  )
}
