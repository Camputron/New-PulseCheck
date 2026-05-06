import AsyncButton from "@/components/AsyncButton"
import api from "@/api"
import { useSnackbar } from "@/hooks"
import { Delete } from "@mui/icons-material"

interface RemoveButtonProps {
  pid: string
  qid: string
}

export default function RemoveButton(props: RemoveButtonProps) {
  const { pid, qid } = props
  const snackbar = useSnackbar()

  const remove = async () => {
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
    <AsyncButton
      size="small"
      color="error"
      callback={remove}
      startIcon={<Delete />}>
      Remove
    </AsyncButton>
  )
}
