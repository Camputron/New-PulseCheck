import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import api, { storage } from "@/api"
import {
  CloudUpload,
  Delete,
  ImageOutlined,
  SwapHoriz,
} from "@mui/icons-material"
import useSnackbar from "@/hooks/useSnackbar"

interface Props {
  pid: string
  qid: string
  url: string | null
}

const MAX_FILE_SIZE_MB = 10

export default function UploadImageBox(props: Props) {
  const questionDocRef = api.polls.questions.doc(props.pid, props.qid)
  const snackbar = useSnackbar()
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageURL, setImageURL] = useState<string | null>(props.url)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setImageURL(props.url)
  }, [props.url])

  const uploadFile = async (file: File) => {
    setLoading(true)
    try {
      const fileRef = ref(storage, `poll-images/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      await api.polls.questions.update(questionDocRef, {
        prompt_img: downloadURL,
      })
      setImageURL(downloadURL)
    } catch (err) {
      console.error("Failed to upload image", err)
      snackbar.show({ type: "error", message: "Failed to upload image" })
    } finally {
      setLoading(false)
    }
  }

  const validateAndUpload = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      snackbar.show({ type: "error", message: "Please upload an image file" })
      return
    }
    if (file.size / (1024 * 1024) >= MAX_FILE_SIZE_MB) {
      snackbar.show({
        type: "error",
        message: `Image must be smaller than ${MAX_FILE_SIZE_MB}MB`,
      })
      return
    }
    void uploadFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndUpload(e.target.files?.[0])
    e.target.value = ""
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    const aux = async () => {
      try {
        setImageURL(null)
        await api.polls.questions.update(questionDocRef, { prompt_img: null })
      } catch (err) {
        console.error("Failed to remove image", err)
        snackbar.show({ type: "error", message: "Failed to remove image" })
      }
    }
    void aux()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    validateAndUpload(e.dataTransfer.files?.[0])
  }

  const openPicker = () => inputRef.current?.click()

  if (imageURL) {
    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 0.75,
          borderRadius: 1.5,
          border: 1,
          borderColor: isDragging ? "primary.main" : "divider",
          bgcolor: (t) =>
            isDragging ? alpha(t.palette.primary.main, 0.08) : "transparent",
          transition: "all 150ms ease",
        }}>
        <Box
          component="img"
          src={imageURL}
          alt="question"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
          Image attached
        </Typography>
        <Tooltip title="Replace image">
          <span>
            <IconButton
              size="small"
              onClick={openPicker}
              disabled={loading}
              color="primary">
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                <SwapHoriz fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Remove image">
          <IconButton size="small" onClick={handleDelete} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileInput}
        />
      </Stack>
    )
  }

  return (
    <Box
      onClick={openPicker}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openPicker()
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1,
        cursor: loading ? "default" : "pointer",
        borderRadius: 1.5,
        border: "1px dashed",
        borderColor: isDragging ? "primary.main" : "divider",
        bgcolor: (t) =>
          isDragging ? alpha(t.palette.primary.main, 0.08) : "transparent",
        color: "text.secondary",
        transition: "all 150ms ease",
        "&:hover": {
          borderColor: "primary.main",
          color: "primary.main",
          bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
        },
      }}>
      {loading ? (
        <CircularProgress size={18} />
      ) : isDragging ? (
        <CloudUpload fontSize="small" />
      ) : (
        <ImageOutlined fontSize="small" />
      )}
      <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
        {loading
          ? "Uploading..."
          : isDragging
            ? "Drop image here"
            : "Drop image or click to upload"}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileInput}
      />
    </Box>
  )
}
