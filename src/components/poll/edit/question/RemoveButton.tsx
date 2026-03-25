import AsyncButton from "@/components/AsyncButton"
import api from "@/api"
import { useSnackbar } from "@/hooks"
import { Clear } from "@mui/icons-material"

interface RemoveButtonProps {
  pid: string
  qid: string
}

export default function RemoveButton(props: RemoveButtonProps) {
  const { pid, qid } = props
  const snackbar = useSnackbar()

  const remove = async () => {
    /* delete question in poll(id) */
    try {
      const ref = api.polls.questions.doc(pid, qid)
      await api.polls.questions.delete(ref)
    } catch {
      snackbar.show({
        type: "error",
        message: "Failed to remove question",
      })
    }
  }

  return (
    <AsyncButton color='error' callback={remove} endIcon={<Clear />}>
      Remove
    </AsyncButton>
  )
}
