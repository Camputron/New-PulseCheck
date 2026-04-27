import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import {
  BankQuestion,
  PromptType,
  PROMPT_TYPE_CHOICES,
  PromptOption,
} from "@/types"
import {
  Add,
  CheckCircle,
  CheckCircleOutline,
  Close,
  DeleteOutline,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import CancelButton from "../CancelButton"

interface AddBankQuestionDialogProps {
  open: boolean
  onClose: () => void
  uid: string
  bid: string
  /** When provided, the dialog edits this existing snapshot instead of creating a new one. */
  editingQid?: string
  initial?: BankQuestion
}

const blankOption = (): PromptOption => ({ text: "", correct: false })

export default function AddBankQuestionDialog(
  props: AddBankQuestionDialogProps,
) {
  const { open, onClose, uid, bid, editingQid, initial } = props
  const snackbar = useSnackbar()
  const isEditing = Boolean(editingQid)
  const [prompt, setPrompt] = useState("")
  const [promptType, setPromptType] = useState<PromptType>("multiple-choice")
  const [points, setPoints] = useState(1)
  const [options, setOptions] = useState<PromptOption[]>([
    blankOption(),
    blankOption(),
  ])
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!open) {
      setPrompt("")
      setPromptType("multiple-choice")
      setPoints(1)
      setOptions([blankOption(), blankOption()])
      return
    }
    if (initial) {
      setPrompt(initial.prompt)
      setPromptType(initial.prompt_type)
      setPoints(initial.points)
      setOptions(
        initial.options.length > 0
          ? initial.options.map((o) => ({ text: o.text, correct: o.correct }))
          : [blankOption(), blankOption()],
      )
    }
  }, [open, initial])

  const handleClose = () => {
    if (submitting || deleting) return
    onClose()
  }

  const updateOption = (i: number, patch: Partial<PromptOption>) => {
    setOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)),
    )
  }

  const removeOption = (i: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== i))
  }

  const toggleCorrect = (i: number) => {
    if (promptType === "multi-select") {
      updateOption(i, { correct: !options[i].correct })
    } else {
      // single-correct: clear others
      setOptions((prev) => prev.map((o, idx) => ({ ...o, correct: idx === i })))
    }
  }

  const validNonEmptyOptions = options.filter((o) => o.text.trim().length > 0)
  const canSubmit =
    !submitting &&
    prompt.trim().length > 0 &&
    validNonEmptyOptions.length >= 2 &&
    points > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const cleaned = options
        .filter((o) => o.text.trim().length > 0)
        .map((o) => ({ text: o.text.trim(), correct: o.correct }))
      if (isEditing && editingQid) {
        const ref = api.banks.questions.doc(uid, bid, editingQid)
        await api.banks.questions.update(ref, {
          prompt: prompt.trim(),
          prompt_type: promptType,
          prompt_img: initial?.prompt_img ?? null,
          options: cleaned,
          points,
        })
        /* too verbose because ui talks */
        // snackbar.show({ type: "success", message: "Question updated" })
      } else {
        await api.banks.questions.add(uid, bid, {
          prompt: prompt.trim(),
          prompt_type: promptType,
          prompt_img: null,
          options: cleaned,
          points,
          anonymous: false,
          time: null,
        })
        snackbar.show({ type: "success", message: "Question added to bank" })
      }
      onClose()
    } catch (err) {
      console.error("Failed to save question", err)
      snackbar.show({ type: "error", message: "Failed to save question" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!editingQid) return
    setDeleting(true)
    try {
      const ref = api.banks.questions.doc(uid, bid, editingQid)
      await api.banks.questions.delete(ref)
      snackbar.show({ type: "success", message: "Question removed" })
      onClose()
    } catch (err) {
      console.error("Failed to delete bank question", err)
      snackbar.show({ type: "error", message: "Failed to remove question" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Question" : "Add Question"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            autoFocus
            size="small"
            placeholder="Question prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            disabled={submitting}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              select
              label="Type"
              value={promptType}
              onChange={(e) => setPromptType(e.target.value as PromptType)}
              sx={{ flex: 1 }}
              disabled={submitting}>
              {PROMPT_TYPE_CHOICES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              type="number"
              label="Points"
              value={points}
              onChange={(e) =>
                setPoints(Math.max(1, Number(e.target.value) || 1))
              }
              sx={{ width: 100 }}
              disabled={submitting}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Options — tap the circle to mark correct answers
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {options.map((opt, i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => toggleCorrect(i)}
                    color={opt.correct ? "success" : "default"}
                    disabled={submitting}>
                    {opt.correct ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <CheckCircleOutline fontSize="small" />
                    )}
                  </IconButton>
                  <TextField
                    size="small"
                    placeholder={`Option ${i + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(i, { text: e.target.value })}
                    fullWidth
                    disabled={submitting}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeOption(i)}
                    disabled={submitting || options.length <= 2}>
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Box>
                <Button
                  startIcon={<Add />}
                  size="small"
                  onClick={() => setOptions((p) => [...p, blankOption()])}
                  disabled={submitting}>
                  Add Option
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        {isEditing && (
          <Button
            color="error"
            startIcon={<DeleteOutline />}
            onClick={() => void handleDelete()}
            disabled={submitting || deleting}
            sx={{ mr: "auto" }}>
            {deleting ? "Removing..." : "Remove"}
          </Button>
        )}
        <CancelButton onClick={handleClose} disabled={submitting || deleting} />
        <Button
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || deleting}>
          {submitting
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
              ? "Save"
              : "Add to Bank"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
