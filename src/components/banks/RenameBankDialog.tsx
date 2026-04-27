import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { QuestionBank } from "@/types"
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
import { useEffect, useState } from "react"
import CancelButton from "../CancelButton"

interface RenameBankDialogProps {
  open: boolean
  onClose: () => void
  bankRef: DocumentReference<QuestionBank>
  bank: QuestionBank
}

export default function RenameBankDialog(props: RenameBankDialogProps) {
  const { open, onClose, bankRef, bank } = props
  const snackbar = useSnackbar()
  const [name, setName] = useState(bank.name)
  const [description, setDescription] = useState(bank.description ?? "")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName(bank.name)
      setDescription(bank.description ?? "")
    }
  }, [open, bank.name, bank.description])

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await api.banks.update(bankRef, {
        name: name.trim(),
        description: description.trim() || null,
      })
      snackbar.show({ type: "success", message: "Bank updated" })
      onClose()
    } catch (err) {
      console.error("Failed to update question bank", err)
      snackbar.show({ type: "error", message: "Failed to update bank" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Rename Bank</DialogTitle>
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
          {submitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
