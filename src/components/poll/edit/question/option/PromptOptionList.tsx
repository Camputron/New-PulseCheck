import { PromptOption, PromptType } from "@/types"
import { Stack } from "@mui/material"
import { DocumentReference } from "firebase/firestore"
import PromptOptionEditor from "./PromptOptionEditor"

interface Props {
  options: DocumentReference<PromptOption>[]
  promptType: PromptType
}

export default function PromptOptionList(props: Props) {
  const { options, promptType } = props

  if (options.length === 0) {
    return null
  }

  return (
    <Stack spacing={0.75}>
      {options.map((x, i) => (
        <PromptOptionEditor
          key={x.id}
          ref={x}
          index={i}
          promptType={promptType}
        />
      ))}
    </Stack>
  )
}
