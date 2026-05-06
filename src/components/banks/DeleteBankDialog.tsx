import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { QuestionBank } from "@/types"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { DocumentReference } from "firebase/firestore"
import { useState } from "react"
import CancelButton from "../CancelButton"

interface DeleteBankDialogProps {
  open: boolean
  onClose: () => void
  bankRef: DocumentReference<QuestionBank>
  bankName: string
  onDeleted?: () => void
}

export default function DeleteBankDialog(props: DeleteBankDialogProps) {
  const { open, onClose, bankRef, bankName, onDeleted } = props
  const snackbar = useSnackbar()
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await api.banks.delete(bankRef)
      snackbar.show({ type: "success", message: `Deleted "${bankName}"` })
      onDeleted?.()
      onClose()
    } catch (err) {
      console.error(`Failed to delete bank ${bankRef.id}`, err)
      snackbar.show({ type: "error", message: "Failed to delete bank" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Bank?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Delete "${bankName}" and all its saved questions? This can't be undone.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} disabled={submitting} />
        <Button
          onClick={() => void handleDelete()}
          color="error"
          disabled={submitting}>
          {submitting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
