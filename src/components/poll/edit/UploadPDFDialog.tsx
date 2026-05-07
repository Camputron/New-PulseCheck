import SlideUpTransition from "@/components/transition/SlideUpTransition"
import api, { storage } from "@/api"
import { CloudUpload, PictureAsPdf } from "@mui/icons-material"
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Slider,
  Stack,
  styled,
  Typography,
} from "@mui/material"
import { ref, uploadBytes } from "firebase/storage"
import React, { useState } from "react"

interface UploadPDFBoxProps {
  pid: string
  open: boolean
  onClose: () => void
}

const MIN_QUESTIONS = 1
const MAX_QUESTIONS = 10
const DEFAULT_QUESTIONS = 5
const MAX_FILE_MB = 100

export default function UploadPDFDialog(props: UploadPDFBoxProps) {
  const { pid, open, onClose } = props
  const [error, setError] = useState("")
  const [statusText, setStatusText] = useState("")
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTIONS)
  const [isDragging, setIsDragging] = useState(false)

  const isBusy = statusText !== ""

  const handleClose = () => {
    if (isBusy) return
    setError("")
    onClose()
  }

  const processFile = async (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024)
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported")
      return
    }
    if (fileSizeMB >= MAX_FILE_MB) {
      setError(`File size cannot exceed ${MAX_FILE_MB} MB`)
      return
    }
    try {
      setError("")
      setStatusText("Uploading your PDF...")
      const downloadURL = await uploadFile(file)
      setStatusText(
        `Analyzing with AI (${questionCount} question${questionCount === 1 ? "" : "s"})...`,
      )
      const questions = await api.vertex.generatePollQuestions(
        questionCount,
        downloadURL,
      )
      setStatusText("Creating your questions...")
      await api.polls.generateQuestions(pid, questions)
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setStatusText("")
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const fileRef = ref(storage, `ai/${file.name}`)
    const ss = await uploadBytes(fileRef, file)
    return `gs://${ss.ref.bucket}/${ss.ref.fullPath}`
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    void processFile(files[0])
    event.target.value = ""
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (isBusy) return
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    if (isBusy) return
    const files = event.dataTransfer.files
    if (!files || files.length === 0) return
    void processFile(files[0])
  }

  const handleSliderChange = (_: Event, value: number | number[]) => {
    setQuestionCount(Array.isArray(value) ? value[0] : value)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: SlideUpTransition }}>
      <DialogTitle>Generate Questions from a PDF</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Upload course material and we&apos;ll generate AI-powered
          multiple-choice questions for you.
        </Typography>

        {error && (
          <Box mb={2}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Box>
        )}

        <Stack spacing={1} mb={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Typography variant="subtitle2">Number of questions</Typography>
            <Typography
              variant="subtitle2"
              color="primary.main"
              fontWeight={600}>
              {questionCount}
            </Typography>
          </Stack>
          <Slider
            value={questionCount}
            onChange={handleSliderChange}
            min={MIN_QUESTIONS}
            max={MAX_QUESTIONS}
            step={1}
            marks
            disabled={isBusy}
            valueLabelDisplay="auto"
            aria-label="Number of questions"
          />
        </Stack>

        <DropZone
          htmlFor={isBusy ? undefined : "upload-pdf-input"}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={(theme) => ({
            borderColor: isDragging
              ? theme.palette.primary.main
              : theme.palette.divider,
            backgroundColor: isDragging
              ? theme.palette.action.hover
              : "transparent",
            cursor: isBusy ? "default" : "pointer",
          })}>
          {isBusy ? (
            <Stack alignItems="center" spacing={2} width="100%">
              <PictureAsPdf color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="subtitle1">{statusText}</Typography>
              <LinearProgress sx={{ width: "100%" }} />
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={1.5}>
              <IconButton
                component="span"
                color="primary"
                size="large"
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                  pointerEvents: "none",
                }}>
                <CloudUpload />
              </IconButton>
              <Typography variant="subtitle1" fontWeight={600}>
                Drop a PDF here or click to upload
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PDF files only · up to {MAX_FILE_MB} MB
              </Typography>
              <VisuallyHiddenInput
                id="upload-pdf-input"
                type="file"
                accept="application/pdf"
                onChange={handleFileInput}
              />
            </Stack>
          )}
        </DropZone>
      </DialogContent>
    </Dialog>
  )
}

const DropZone = styled("label")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 220,
  border: "2px dashed",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: "center",
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
}))

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})
