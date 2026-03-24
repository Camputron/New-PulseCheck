import SlideUpTransition from "@/components/transition/SlideUpTransition"
import api, { storage } from "@/api"
import { Upload } from "@mui/icons-material"
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  LinearProgress,
  styled,
  Typography,
} from "@mui/material"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useState } from "react"

interface UploadPDFBoxProps {
  pid: string
  open: boolean
  onClose: () => void
}

export default function UploadPDFDialog(props: UploadPDFBoxProps) {
  const { pid, open, onClose } = props
  const [error, setError] = useState("")
  const [text, setText] = useState("")

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!(files && files.length > 0)) return
    const selectedFile = files[0]
    const byteSize = selectedFile.size
    const fileSize = byteSize / (1024 * 1024)
    if (fileSize >= 100) {
      setError("File size cannot exceed 100 MB!")
      return
    }
    /* upload file to GCS */
    async function extractText(payload: File) {
      try {
        setError("")
        setText("Uploading your PDF...")
        const downloadURL = await uploadFile(payload)
        setText("Analyzing with AI...")
        const questions = await api.vertex.generatePollQuestions(5, downloadURL)
        setText("Creating your questions...")
        await api.polls.generateQuestions(pid, questions)
        onClose()
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setText("")
      }
    }
    void extractText(selectedFile)
  }

  const uploadFile = async (payload: File): Promise<string> => {
    const fileRef = ref(storage, `ai/${payload.name}`)
    const ss = await uploadBytes(fileRef, payload)
    const downloadURL = await getDownloadURL(ss.ref)
    return downloadURL
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='sm'
        slots={{
          transition: SlideUpTransition,
        }}>
        <DialogTitle>Upload a PDF to Generate Questions</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Upload a PDF and we'll generate five AI-powered questions for you!
          </Typography>
          {error && (
            <Box mb={2}>
              <Alert severity='error' onClose={() => setError("")}>
                {error}
              </Alert>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              minHeight: 200,
              border: "2px dashed",
              borderColor: "primary.main",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: text ? "default" : "pointer",
              transition: "background-color 0.3s",
              // "&:hover": {
              //   backgroundColor: text ? "inherit" : "action.hover",
              // },
            }}>
            {text ? (
              <>
                <Typography variant='h6'>{text}</Typography>
                <LinearProgress sx={{ width: "100%" }} />
              </>
            ) : (
              <>
                <Fab component='label' color='primary' size='large'>
                  <Upload />
                  <VisuallyHiddenInput
                    type='file'
                    accept='application/pdf'
                    onChange={handleFile}
                  />
                </Fab>
                <Typography variant='subtitle1' color='textSecondary'>
                  Click the button above to upload a PDF
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

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
