import api from "@/api"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material"
import { DocumentReference } from "firebase/firestore"
import { useState } from "react"
import { QuestionBank } from "@/types"
import { useNavigate } from "react-router-dom"
import CancelButton from "../CancelButton"

interface CreateBankDialogProps {
  open: boolean
  onClose: () => void
  onCreated?: (ref: DocumentReference<QuestionBank>) => void
}

export default function CreateBankDialog(props: CreateBankDialogProps) {
  const { open, onClose, onCreated } = props
  const { user } = useAuthContext()
  const snackbar = useSnackbar()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleClose = () => {
    if (submitting) return
    setName("")
    setDescription("")
    onClose()
  }

  const handleSubmit = async () => {
    if (!user || !name.trim()) return
    setSubmitting(true)
    try {
      const ownerRef = api.users.doc(user.uid)
      const ref = await api.banks.add(
        ownerRef,
        name.trim(),
        description.trim() || null,
      )
      /* too verbose because ui talks */
      // snackbar.show({ type: "success", message: `Created "${name.trim()}"` })
      onCreated?.(ref)
      setName("")
      setDescription("")
      onClose()
      void navigate(`/banks/${ref.id}/`)
    } catch (err) {
      console.error("Failed to create question bank", err)
      snackbar.show({ type: "error", message: "Failed to create bank" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>New Question Bank</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            size="small"
            placeholder="Bank name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled={submitting}
          />
          <TextField
            size="small"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            disabled={submitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} disabled={submitting} />
        <Button
          onClick={() => void handleSubmit()}
          disabled={submitting || !name.trim()}>
          {submitting ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
