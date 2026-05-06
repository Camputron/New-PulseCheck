import api from "@/api"
import CancelButton from "@/components/CancelButton"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import { AddCircleOutline, Inventory2 } from "@mui/icons-material"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { getDoc } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

interface SaveQuestionToBankDialogProps {
  open: boolean
  onClose: () => void
  pid: string
  qid: string
}

const NEW_BANK_VALUE = "__new__"

export default function SaveQuestionToBankDialog(
  props: SaveQuestionToBankDialogProps,
) {
  const { open, onClose, pid, qid } = props
  const { user } = useAuthContext()
  const snackbar = useSnackbar()
  const uid = user?.uid ?? ""

  const banksQuery = useMemo(
    () => (uid && open ? api.banks.queryUserBanks(uid) : undefined),
    [uid, open],
  )
  const [snap] = useCollection(banksQuery)
  const banks = snap?.docs.map((d) => ({ id: d.id, ...d.data() })) ?? []

  const [selected, setSelected] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelected(null)
      setNewName("")
      setNewDescription("")
    }
  }, [open])

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const isNewBank = selected === NEW_BANK_VALUE
  const submitDisabled =
    submitting || !selected || (isNewBank && !newName.trim())

  const handleSubmit = async () => {
    if (!user || !selected) return
    setSubmitting(true)
    try {
      let bid: string
      let bankName: string

      if (isNewBank) {
        if (!newName.trim()) return
        const ownerRef = api.users.doc(user.uid)
        const ref = await api.banks.add(
          ownerRef,
          newName.trim(),
          newDescription.trim() || null,
        )
        bid = ref.id
        bankName = newName.trim()
      } else {
        bid = selected
        const target = banks.find((b) => b.id === selected)
        bankName = target?.name ?? "bank"
        const exists = (await getDoc(api.banks.doc(uid, bid))).exists()
        if (!exists) {
          snackbar.show({ type: "error", message: "Bank no longer exists" })
          setSelected(null)
          return
        }
      }

      const snapshot = await api.polls.snapshotPollQuestion(pid, qid)
      await api.banks.questions.add(uid, bid, snapshot)

      snackbar.show({ type: "success", message: `Saved to "${bankName}"` })
      onClose()
    } catch (err) {
      console.error("Failed to save question to bank", err)
      snackbar.show({ type: "error", message: "Failed to save to bank" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Save Question to Bank</DialogTitle>
      <DialogContent dividers>
        {banks.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            You don't have any banks yet. Create one below.
          </Typography>
        )}
        <List dense disablePadding>
          {banks.map((b) => (
            <ListItemButton
              key={b.id}
              selected={selected === b.id}
              onClick={() => setSelected(b.id)}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Radio checked={selected === b.id} size="small" />
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Inventory2 fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={b.name}
                secondary={
                  b.question_count === 1
                    ? "1 question"
                    : `${b.question_count} questions`
                }
              />
            </ListItemButton>
          ))}
          <ListItemButton
            selected={selected === NEW_BANK_VALUE}
            onClick={() => setSelected(NEW_BANK_VALUE)}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Radio checked={selected === NEW_BANK_VALUE} size="small" />
            </ListItemIcon>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <AddCircleOutline fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Create new bank" />
          </ListItemButton>
        </List>
        {isNewBank && (
          <Box sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <TextField
                autoFocus
                placeholder="Bank name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
                size="small"
                disabled={submitting}
              />
              <TextField
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
                disabled={submitting}
              />
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} disabled={submitting} />
        <Button
          onClick={() => void handleSubmit()}
          disabled={submitDisabled}
          variant="text">
          {submitting ? "Saving..." : isNewBank ? "Create & Save" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
