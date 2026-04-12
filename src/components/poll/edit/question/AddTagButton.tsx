import AsyncButton from "@/components/AsyncButton"
import api from "@/api"
import { Sell } from "@mui/icons-material"

interface AddTagButtonProps {
  pid: string
  qid: string
}

export default function AddTagButton(props: AddTagButtonProps) {
  const { pid, qid } = props

  const callback = async () => {
    /* this */
    const ref = api.polls.questions.doc(pid, qid)
    await new Promise((resolve) => {
      /*  */
      resolve(ref)
    })
  }

  return (
    <AsyncButton callback={callback} endIcon={<Sell />}>
      Add Tag
    </AsyncButton>
  )
}
