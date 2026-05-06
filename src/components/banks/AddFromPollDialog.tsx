import api from "@/api"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import SlideUpTransition from "@/components/transition/SlideUpTransition"
import { Question } from "@/types"
import { ArrowBack, KeyboardArrowRight, Description } from "@mui/icons-material"
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
  Typography,
} from "@mui/material"
import { getDoc } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"
import CancelButton from "../CancelButton"

interface AddFromPollDialogProps {
  open: boolean
  onClose: () => void
  uid: string
  bid: string
}

interface PollQuestionRow {
  qid: string
  prompt: string
  optionCount: number
  data: Question
}

export default function AddFromPollDialog(props: AddFromPollDialogProps) {
  const { open, onClose, uid, bid } = props
  const { user } = useAuthContext()
  const snackbar = useSnackbar()

  const pollsQuery = useMemo(
    () => (user && open ? api.polls.queryUserPolls(user.uid) : undefined),
    [user, open],
  )
  const [snap] = useCollection(pollsQuery)
  const polls = snap?.docs.map((d) => ({ id: d.id, ...d.data() })) ?? []

  const [selectedPid, setSelectedPid] = useState<string | null>(null)
  const [questions, setQuestions] = useState<PollQuestionRow[] | null>(null)
  const [loadingQs, setLoadingQs] = useState(false)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelectedPid(null)
      setQuestions(null)
      setChecked(new Set())
    }
  }, [open])

  useEffect(() => {
    if (!selectedPid) return
    const poll = polls.find((p) => p.id === selectedPid)
    if (!poll) return
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
  }, [selectedPid])

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleBack = () => {
    setSelectedPid(null)
    setQuestions(null)
    setChecked(new Set())
  }

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

  const handleSave = async () => {
    if (!questions || !selectedPid) return
    const selected = questions.filter((q) => checked.has(q.qid))
    if (selected.length === 0) return
    setSubmitting(true)
    try {
      const snapshots = await Promise.all(
        selected.map((q) => api.polls.snapshotPollQuestion(selectedPid, q.qid)),
      )
      await api.banks.questions.addMany(uid, bid, snapshots)
      snackbar.show({
        type: "success",
        message: `Added ${selected.length} question${selected.length === 1 ? "" : "s"}`,
      })
      onClose()
    } catch (err) {
      console.error("Failed to add poll questions to bank", err)
      snackbar.show({ type: "error", message: "Failed to add questions" })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedPoll = polls.find((p) => p.id === selectedPid)
  const allChecked =
    !!questions && questions.length > 0 && checked.size === questions.length

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: SlideUpTransition }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {selectedPid && (
          <IconButton size="small" onClick={handleBack} disabled={submitting}>
            <ArrowBack fontSize="small" />
          </IconButton>
        )}
        <Box flex={1}>
          {selectedPid ? (selectedPoll?.title ?? "Poll") : "Add from Poll"}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {!selectedPid && (
          <>
            {polls.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}>
                You don't have any polls yet.
              </Typography>
            ) : (
              <List dense disablePadding>
                {polls.map((p) => (
                  <ListItemButton
                    key={p.id}
                    onClick={() => setSelectedPid(p.id)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Description fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={p.title}
                      secondary={
                        p.questions.length === 1
                          ? "1 question"
                          : `${p.questions.length} questions`
                      }
                    />
                    <KeyboardArrowRight color="action" />
                  </ListItemButton>
                ))}
              </List>
            )}
          </>
        )}
        {selectedPid && (
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
                This poll has no questions.
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
        {selectedPid && (
          <Button
            onClick={() => void handleSave()}
            variant="text"
            disabled={submitting || checked.size === 0}>
            {submitting
              ? "Adding..."
              : `Add ${checked.size} question${checked.size === 1 ? "" : "s"}`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
