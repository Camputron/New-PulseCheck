import api from "@/api"
import AddBankQuestionDialog from "@/components/banks/AddBankQuestionDialog"
import AddFromPollDialog from "@/components/banks/AddFromPollDialog"
import BankQuestionCard from "@/components/banks/BankQuestionCard"
import DeleteBankDialog from "@/components/banks/DeleteBankDialog"
import { useAuthContext } from "@/hooks"
import useRequireAuth from "@/hooks/useRequireAuth"
import useSnackbar from "@/hooks/useSnackbar"
import {
  Add,
  ArrowBack,
  DeleteOutline,
  Done,
  Edit,
  LibraryBooks,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore"
import { useNavigate, useParams } from "react-router-dom"
import { BankQuestion } from "@/types"

export default function BankDetail() {
  useRequireAuth({ blockGuests: true })
  const { user } = useAuthContext()
  const { bid } = useParams<{ bid: string }>()
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addQuestionOpen, setAddQuestionOpen] = useState(false)
  const [addFromPollOpen, setAddFromPollOpen] = useState(false)
  const [editing, setEditing] = useState<{
    qid: string
    data: BankQuestion
  } | null>(null)

  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState("")
  const [savingName, setSavingName] = useState(false)

  const uid = user?.uid ?? ""
  const safeBid = bid ?? ""
  const bankRef = api.banks.doc(uid, safeBid)
  const [bank, bankLoading] = useDocumentData(bankRef)
  const [questionsSnap] = useCollection(
    api.banks.questions.collect(uid, safeBid),
  )
  const questions =
    questionsSnap?.docs.map((d) => ({ qid: d.id, data: d.data() })) ?? []

  // Keep nameDraft in sync with the latest bank name when not actively editing.
  useEffect(() => {
    if (!isEditingName && bank) {
      setNameDraft(bank.name)
    }
  }, [bank, isEditingName])

  if (!bid) {
    return null
  }

  if (!bankLoading && !bank) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Bank not found
        </Typography>
      </Container>
    )
  }

  const startEditingName = () => {
    if (!bank) return
    setNameDraft(bank.name)
    setIsEditingName(true)
  }

  const cancelEditingName = () => {
    if (savingName) return
    setIsEditingName(false)
    if (bank) setNameDraft(bank.name)
  }

  const commitName = async () => {
    if (!bank) return
    const trimmed = nameDraft.trim()
    if (trimmed.length === 0) {
      snackbar.show({ type: "error", message: "Name can't be empty" })
      return
    }
    if (trimmed === bank.name) {
      setIsEditingName(false)
      return
    }
    setSavingName(true)
    try {
      await api.banks.update(bankRef, { name: trimmed })
      setIsEditingName(false)
    } catch (err) {
      console.error("Failed to rename bank", err)
      snackbar.show({ type: "error", message: "Failed to rename bank" })
    } finally {
      setSavingName(false)
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      void commitName()
    } else if (e.key === "Escape") {
      cancelEditingName()
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => void navigate("/banks")}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2,
              color: "primary.main",
              fontWeight: 600,
            }}>
            Question Bank
          </Typography>
          {isEditingName ? (
            <TextField
              size="small"
              fullWidth
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={handleNameKeyDown}
              disabled={savingName}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      color="primary"
                      onClick={() => void commitName()}
                      disabled={savingName || nameDraft.trim().length === 0}>
                      <Done />
                    </IconButton>
                  ),
                },
              }}
            />
          ) : (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                variant="h5"
                fontWeight={700}
                onDoubleClick={startEditingName}
                sx={{ cursor: bank ? "text" : "default" }}>
                {bank?.name ?? "Loading..."}
              </Typography>
              {bank && (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={startEditingName}
                  aria-label="Rename bank">
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      {bank?.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {bank.description}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary">
        {bank?.question_count ?? 0} question
        {bank?.question_count === 1 ? "" : "s"}
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 2 }}>
        <Button
          startIcon={<Add />}
          variant="contained"
          fullWidth
          onClick={() => setAddQuestionOpen(true)}
          sx={{
            py: 1.25,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}>
          Add Question
        </Button>
        <Button
          startIcon={<LibraryBooks />}
          variant="outlined"
          fullWidth
          onClick={() => setAddFromPollOpen(true)}
          sx={{
            py: 1.25,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}>
          Add from Poll
        </Button>
      </Stack>

      <Box sx={{ mt: 3 }}>
        {questions.length > 0 ? (
          <Stack spacing={1.5}>
            {questions.map((q, i) => (
              <BankQuestionCard
                key={q.qid}
                index={i}
                question={q.data}
                onClick={() => setEditing({ qid: q.qid, data: q.data })}
              />
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              mt: 6,
              textAlign: "center",
              color: "text.secondary",
            }}>
            <Typography variant="body2">
              No questions yet — add one above, or open a poll and use Save to
              Bank on a question.
            </Typography>
          </Box>
        )}
      </Box>

      {bank && (
        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
          <Button
            color="error"
            startIcon={<DeleteOutline />}
            onClick={() => setDeleteOpen(true)}
            sx={{ textTransform: "none" }}>
            Delete bank
          </Button>
        </Box>
      )}

      {bank && (
        <>
          <DeleteBankDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            bankRef={bankRef}
            bankName={bank.name}
            onDeleted={() => void navigate("/banks")}
          />
          <AddBankQuestionDialog
            open={addQuestionOpen}
            onClose={() => setAddQuestionOpen(false)}
            uid={uid}
            bid={safeBid}
          />
          <AddFromPollDialog
            open={addFromPollOpen}
            onClose={() => setAddFromPollOpen(false)}
            uid={uid}
            bid={safeBid}
          />
          <AddBankQuestionDialog
            open={editing !== null}
            onClose={() => setEditing(null)}
            uid={uid}
            bid={safeBid}
            editingQid={editing?.qid}
            initial={editing?.data}
          />
        </>
      )}
    </Container>
  )
}
