import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { TextField } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

interface Props {
  pid: string
  qid: string
  prompt: string
  autoFocus?: boolean
}

const SAVE_DELAY = 1000

export default function PromptField(props: Props) {
  const { pid, qid } = props
  const [prompt, setPrompt] = useState(props.prompt)
  const snackbar = useSnackbar()
  const isUserEditing = useRef(false)

  /* sync local state when the prop changes externally (e.g. template apply) */
  useEffect(() => {
    if (!isUserEditing.current) {
      setPrompt(props.prompt)
    }
  }, [props.prompt])

  useEffect(() => {
    async function savePrompt(text: string) {
      try {
        if (text === props.prompt) {
          return
        }
        const ref = api.polls.questions.doc(pid, qid)
        await api.polls.questions.update(ref, {
          prompt: text,
        })
      } catch {
        snackbar.show({
          message: "Failed to update question",
          type: "error",
        })
      }
    }
    const timer = setTimeout(() => {
      void savePrompt(prompt)
      isUserEditing.current = false
    }, SAVE_DELAY)
    return () => {
      clearTimeout(timer)
    }
  }, [props.prompt, prompt, pid, qid, snackbar])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserEditing.current = true
    setPrompt(e.target.value)
  }

  return (
    <React.Fragment>
      <TextField
        placeholder="Type Your Question Here"
        value={prompt}
        autoFocus={props.autoFocus}
        multiline
        minRows={1}
        maxRows={4}
        size="small"
        onChange={handleChange}
      />
    </React.Fragment>
  )
}
