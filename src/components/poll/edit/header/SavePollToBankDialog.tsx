import api from "@/api"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import SlideUpTransition from "@/components/transition/SlideUpTransition"
import { Poll, Question } from "@/types"
import {
  AddCircleOutline,
  ArrowBack,
  Inventory2,
  KeyboardArrowRight,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { getDoc } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"
import CancelButton from "@/components/CancelButton"

interface SavePollToBankDialogProps {
  open: boolean
  onClose: () => void
  pid: string
  poll: Poll
}

interface PollQuestionRow {
  qid: string
  prompt: string
  optionCount: number
  data: Question
}

const NEW_BANK_VALUE = "__new__"

type Step = "bank" | "questions"

export default function SavePollToBankDialog(props: SavePollToBankDialogProps) {
  const { open, onClose, pid, poll } = props
  const { user } = useAuthContext()
  const snackbar = useSnackbar()
  const uid = user?.uid ?? ""

  const banksQuery = useMemo(
    () => (uid && open ? api.banks.queryUserBanks(uid) : undefined),
    [uid, open],
  )
  const [snap] = useCollection(banksQuery)
  const banks = snap?.docs.map((d) => ({ id: d.id, ...d.data() })) ?? []

  const [step, setStep] = useState<Step>("bank")
  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [questions, setQuestions] = useState<PollQuestionRow[] | null>(null)
  const [loadingQs, setLoadingQs] = useState(false)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setStep("bank")
      setSelectedBid(null)
      setNewName("")
      setNewDescription("")
      setQuestions(null)
      setChecked(new Set())
    }
  }, [open])

  // Lazily load poll questions on transition to step 2.
  useEffect(() => {
    if (step !== "questions" || questions !== null) return
    setLoadingQs(true)
    Promise.all(poll.questions.map((qref) => getDoc(qref)))
      .then((snaps) => {
        const rows: PollQuestionRow[] = snaps
          .map((s) => {
            const data = s.data()
            if (!data) return null
            return {
              qid: s.id,
              prompt: data.prompt,
              optionCount: data.options.length,
              data,
            }
          })
          .filter((r): r is PollQuestionRow => r !== null)
        setQuestions(rows)
        setChecked(new Set(rows.map((r) => r.qid)))
      })
      .catch((err) => {
        console.error("Failed to load poll questions", err)
        snackbar.show({ type: "error", message: "Failed to load questions" })
      })
      .finally(() => setLoadingQs(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleBack = () => {
    setStep("bank")
    setQuestions(null)
    setChecked(new Set())
  }

  const isNewBank = selectedBid === NEW_BANK_VALUE
  const canAdvance = !!selectedBid && (!isNewBank || newName.trim().length > 0)

  const toggleAll = () => {
    if (!questions) return
    if (checked.size === questions.length) {
      setChecked(new Set())
    } else {
      setChecked(new Set(questions.map((q) => q.qid)))
    }
  }

  const toggleOne = (qid: string) => {
    const next = new Set(checked)
    if (next.has(qid)) next.delete(qid)
    else next.add(qid)
    setChecked(next)
  }

  const handleSubmit = async () => {
    if (!user || !questions || !selectedBid) return
    const selected = questions.filter((q) => checked.has(q.qid))
    if (selected.length === 0) return
    setSubmitting(true)
    try {
      let bid: string
      let bankName: string

      if (isNewBank) {
        const ownerRef = api.users.doc(user.uid)
        const ref = await api.banks.add(
          ownerRef,
          newName.trim(),
          newDescription.trim() || null,
        )
        bid = ref.id
        bankName = newName.trim()
      } else {
        bid = selectedBid
        const target = banks.find((b) => b.id === selectedBid)
        bankName = target?.name ?? "bank"
      }

      const snapshots = await Promise.all(
        selected.map((q) => api.polls.snapshotPollQuestion(pid, q.qid)),
      )
      await api.banks.questions.addMany(uid, bid, snapshots)

      snackbar.show({
        type: "success",
        message: `Saved ${selected.length} question${selected.length === 1 ? "" : "s"} to "${bankName}"`,
      })
      onClose()
    } catch (err) {
      console.error("Failed to save poll questions to bank", err)
      snackbar.show({ type: "error", message: "Failed to save questions" })
    } finally {
      setSubmitting(false)
    }
  }

  const allChecked =
    !!questions && questions.length > 0 && checked.size === questions.length

  const targetBankName = isNewBank
    ? newName.trim() || "new bank"
    : (banks.find((b) => b.id === selectedBid)?.name ?? "bank")

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: SlideUpTransition }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {step === "questions" && (
          <IconButton size="small" onClick={handleBack} disabled={submitting}>
            <ArrowBack fontSize="small" />
          </IconButton>
        )}
        <Box flex={1}>
          {step === "bank" ? "Save to Bank" : `Save to "${targetBankName}"`}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {step === "bank" && (
          <>
            {banks.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}>
                You don't have any banks yet. Create one below.
              </Typography>
            )}
            <List dense disablePadding>
              {banks.map((b) => (
                <ListItemButton
                  key={b.id}
                  selected={selectedBid === b.id}
                  onClick={() => setSelectedBid(b.id)}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
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
                  {selectedBid === b.id && (
                    <KeyboardArrowRight color="action" />
                  )}
                </ListItemButton>
              ))}
              <ListItemButton
                selected={isNewBank}
                onClick={() => setSelectedBid(NEW_BANK_VALUE)}>
                <ListItemIcon sx={{ minWidth: 36 }}>
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
                    size="small"
                    placeholder="Bank name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    fullWidth
                    disabled={submitting}
                  />
                  <TextField
                    size="small"
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    disabled={submitting}
                  />
                </Stack>
              </Box>
            )}
          </>
        )}
        {step === "questions" && (
          <>
            {loadingQs && (
              <Stack spacing={1}>
                <Skeleton height={48} />
                <Skeleton height={48} />
                <Skeleton height={48} />
              </Stack>
            )}
            {!loadingQs && questions && questions.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}>
                This poll has no questions to save.
              </Typography>
            )}
            {!loadingQs && questions && questions.length > 0 && (
              <>
                <ListItemButton onClick={toggleAll} sx={{ borderRadius: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={allChecked}
                      indeterminate={
                        checked.size > 0 && checked.size < questions.length
                      }
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={allChecked ? "Deselect all" : "Select all"}
                  />
                </ListItemButton>
                <List dense disablePadding>
                  {questions.map((q, i) => (
                    <ListItemButton
                      key={q.qid}
                      onClick={() => toggleOne(q.qid)}
                      sx={{ borderRadius: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={checked.has(q.qid)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${i + 1}. ${q.prompt}`}
                        secondary={`${q.optionCount} option${q.optionCount === 1 ? "" : "s"}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose} disabled={submitting} />
        {step === "bank" && (
          <Button
            onClick={() => setStep("questions")}
            variant="contained"
            disabled={!canAdvance}>
            Next
          </Button>
        )}
        {step === "questions" && (
          <Button
            onClick={() => void handleSubmit()}
            // variant='contained'
            disabled={submitting || checked.size === 0}>
            {submitting
              ? "Saving..."
              : `Save ${checked.size} to "${targetBankName}"`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
