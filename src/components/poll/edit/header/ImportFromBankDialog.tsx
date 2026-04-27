import api from "@/api"
import { useAuthContext } from "@/hooks"
import useSnackbar from "@/hooks/useSnackbar"
import SlideUpTransition from "@/components/transition/SlideUpTransition"
import { BankQuestion } from "@/types"
import {
  ArrowBack,
  CheckCircle,
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
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"
import CancelButton from "@/components/CancelButton"

interface ImportFromBankDialogProps {
  open: boolean
  onClose: () => void
  pid: string
}

export default function ImportFromBankDialog(props: ImportFromBankDialogProps) {
  const { open, onClose, pid } = props
  const { user } = useAuthContext()
  const snackbar = useSnackbar()
  const uid = user?.uid ?? ""

  const banksQuery = useMemo(
    () => (uid && open ? api.banks.queryUserBanks(uid) : undefined),
    [uid, open],
  )
  const [snap] = useCollection(banksQuery)
  const banks = snap?.docs.map((d) => ({ id: d.id, ...d.data() })) ?? []

  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [questions, setQuestions] = useState<BankQuestion[] | null>(null)
  const [loadingQs, setLoadingQs] = useState(false)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelectedBid(null)
      setQuestions(null)
      setChecked(new Set())
    }
  }, [open])

  useEffect(() => {
    if (!selectedBid || !uid) return
    setLoadingQs(true)
    api.banks.questions
      .list(uid, selectedBid)
      .then((qs) => {
        setQuestions(qs)
        setChecked(new Set(qs.map((_, i) => i)))
      })
      .catch((err) => {
        console.error("Failed to load bank questions", err)
        snackbar.show({ type: "error", message: "Failed to load questions" })
      })
      .finally(() => setLoadingQs(false))
  }, [selectedBid, uid, snackbar])

  const handleClose = () => {
    if (submitting) return
    onClose()
  }

  const handleBack = () => {
    setSelectedBid(null)
    setQuestions(null)
    setChecked(new Set())
  }

  const toggleAll = () => {
    if (!questions) return
    if (checked.size === questions.length) {
      setChecked(new Set())
    } else {
      setChecked(new Set(questions.map((_, i) => i)))
    }
  }

  const toggleOne = (i: number) => {
    const next = new Set(checked)
    if (next.has(i)) {
      next.delete(i)
    } else {
      next.add(i)
    }
    setChecked(next)
  }

  const handleImport = async () => {
    if (!questions) return
    const selected = questions.filter((_, i) => checked.has(i))
    if (selected.length === 0) return
    setSubmitting(true)
    try {
      await api.polls.importBankQuestions(pid, selected)
      snackbar.show({
        type: "success",
        message: `Imported ${selected.length} question${selected.length === 1 ? "" : "s"}`,
      })
      onClose()
    } catch (err) {
      console.error("Failed to import bank questions", err)
      snackbar.show({ type: "error", message: "Failed to import questions" })
    } finally {
      setSubmitting(false)
    }
  }

  const selectedBank = banks.find((b) => b.id === selectedBid)
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
        {selectedBid && (
          <IconButton size="small" onClick={handleBack} disabled={submitting}>
            <ArrowBack fontSize="small" />
          </IconButton>
        )}
        <Box flex={1}>
          {selectedBid ? (selectedBank?.name ?? "Bank") : "Import from Bank"}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {!selectedBid && (
          <>
            {banks.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}>
                You don't have any banks yet. Open a poll question and use Save
                to Bank to start one.
              </Typography>
            ) : (
              <List dense disablePadding>
                {banks.map((b) => (
                  <ListItemButton
                    key={b.id}
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
                    <KeyboardArrowRight color="action" />
                  </ListItemButton>
                ))}
              </List>
            )}
          </>
        )}
        {selectedBid && (
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
                This bank has no questions yet.
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
                      key={i}
                      onClick={() => toggleOne(i)}
                      sx={{ borderRadius: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={checked.has(i)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={q.prompt}
                        secondary={`${q.options.length} option${q.options.length === 1 ? "" : "s"}`}
                      />
                      {q.options.some((o) => o.correct) && (
                        <CheckCircle
                          color="success"
                          sx={{ fontSize: 16, opacity: 0.7 }}
                        />
                      )}
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
        {selectedBid && (
          <Button
            onClick={() => void handleImport()}
            variant="contained"
            disabled={submitting || checked.size === 0}>
            {submitting
              ? "Importing..."
              : `Import ${checked.size} question${checked.size === 1 ? "" : "s"}`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
