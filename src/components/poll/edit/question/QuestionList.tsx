import { Stack } from "@mui/material"
import { DocumentReference } from "firebase/firestore"
import QuestionEditor from "./QuestionEditor"
import { Question } from "@/types"
import TemplatePicker from "../templates/TemplatePicker"

interface Props {
  pid: string
  questions: DocumentReference<Question>[]
  expandAll?: boolean
}

export default function QuestionList(props: Props) {
  const { pid, questions, expandAll } = props

  if (questions.length === 0) {
    return <TemplatePicker pid={pid} />
  }

  return (
    <Stack textAlign={"initial"} spacing={1} width="100%">
      {questions.map((x, i) => (
        <QuestionEditor
          key={x.id}
          pid={pid}
          qid={x.id}
          index={i}
          qref={x}
          defaultExpanded={expandAll}
          autoFocus={expandAll && i === 0}
        />
      ))}
    </Stack>
  )
}
