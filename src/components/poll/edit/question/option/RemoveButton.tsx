import api from "@/api"
import { PromptOption } from "@/types"
import { Clear } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { DocumentReference } from "firebase/firestore"
import React from "react"

interface Props {
  ref: DocumentReference<PromptOption>
}

/**
 * Deletes the prompt option using the given reference document.
 * @author Camputron, VerySirias
 */
export default function RemoveButton({ ref }: Props) {
  const handleRemove = () => {
    // console.debug(`remove option(${ref.id})`)
    void api.polls.questions.options.deleteByRef(ref)
  }

  return (
    <React.Fragment>
      <IconButton onClick={handleRemove}>
        <Clear />
      </IconButton>
    </React.Fragment>
  )
}
