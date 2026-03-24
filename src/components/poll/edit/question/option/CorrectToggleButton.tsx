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

const SAVE_DELAY = 1000

/**
 * @todo add docs
 * @author Camputron, VerySirias
 * @returns {JSX.Element}
 */
export default function CorrectToggleButton(props: Props) {
  const { ref, promptType } = props
  const [correct, setCorrect] = useState(props.correct)
  const snackbar = useSnackbar()

  useEffect(() => {
    async function saveChecked(bool: boolean) {
      try {
        await api.polls.questions.options.updateByRef(ref, {
          correct: bool,
        })
      } catch {
        snackbar.show({
          message: "Failed to update option",
          type: "error",
        })
      }
    }
    const timer = setTimeout(() => {
      void saveChecked(correct)
    }, SAVE_DELAY)
    return () => {
      clearTimeout(timer)
    }
  }, [props.correct, correct, ref, snackbar])

  const handleCheckToggle = () => {
    setCorrect(!correct)
  }

  return (
    <React.Fragment>
      {promptType === "multi-select" && (
        <Checkbox checked={correct} onClick={handleCheckToggle} />
      )}
      {promptType === "multiple-choice" && (
        <Radio checked={correct} onClick={handleCheckToggle} />
      )}
    </React.Fragment>
  )
}
