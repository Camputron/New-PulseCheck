import { PromptOption, PromptType } from "@/types"
import { Box, Skeleton, TextField, Typography } from "@mui/material"
import { DocumentReference } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"
import CorrectToggleButton from "./CorrectToggleButton"
import RemoveButton from "./RemoveButton"
import api from "@/api"

interface Props {
  ref: DocumentReference<PromptOption>
  index: number
  promptType: PromptType
}

const SAVE_DELAY = 1000

/**
 * Editor for options of a question (prompt).
 * @author Camputron, VerySirias
 */
export default function PromptOptionEditor(props: Props) {
  const { ref, index, promptType } = props
  const [opt, loading, error] = useDocumentData(ref)
  const [text, setText] = useState("")

  useEffect(() => {
    async function savePrompt(newText: string | undefined) {
      try {
        if (!newText || !opt || newText === opt?.text) {
          return
        }
        await api.polls.questions.options.updateByRef(ref, {
          text: newText,
        })
      } catch (err) {
        console.debug(err)
      }
    }
    const timeout = setTimeout(() => {
      void savePrompt(text)
    }, SAVE_DELAY)
    return () => {
      clearTimeout(timeout)
    }
  }, [ref, text, opt])

  useEffect(() => {
    if (opt && !loading) {
      setText(opt.text)
    }
  }, [opt, loading])

  if (error) {
    return (
      <Box display={"flex"} alignItems={"center"}>
        <Typography>Failed to load option!</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box display={"flex"} alignItems={"center"}>
        <Skeleton variant='rounded' animation='wave' />
      </Box>
    )
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  return (
    <Box display={"flex"} flex={1} alignItems={"center"}>
      <TextField
        placeholder={`Option ${index + 1}`}
        value={text}
        fullWidth
        multiline
        // variant='standard'
        // size='small'
        onChange={handleTextChange}
        slotProps={{
          input: {
            size: "small",
            startAdornment: opt && (
              <CorrectToggleButton
                ref={ref}
                correct={opt.correct}
                promptType={promptType}
              />
            ),
            endAdornment: <RemoveButton ref={ref} />,
          },
        }}
      />
    </Box>
  )
}
