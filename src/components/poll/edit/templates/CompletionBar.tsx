import { useCallback, useEffect, useRef, useState } from "react"
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material"
import { ScreenShare } from "@mui/icons-material"
import { DocumentReference } from "firebase/firestore"
import { Question } from "@/types"
import { useDocumentData } from "react-firebase-hooks/firestore"

interface Props {
  questions: DocumentReference<Question>[]
  onHost: () => void
  onAllReadyChange?: (allReady: boolean) => void
}

const PLACEHOLDER_PROMPTS = new Set([
  "Untitled Question",
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5",
])

function QuestionReadyTracker(props: {
  qref: DocumentReference<Question>
  onReadyChange: (id: string, isReady: boolean) => void
}) {
  const [data] = useDocumentData(props.qref)

  const isReady =
    !!data && data.prompt.length > 0 && !PLACEHOLDER_PROMPTS.has(data.prompt)

  useEffect(() => {
    props.onReadyChange(props.qref.id, isReady)
  }, [isReady, props])

  return null
}

export default function CompletionBar(props: Props) {
  const { questions, onHost } = props
  const totalQuestions = questions.length
  const [readyCount, setReadyCount] = useState(0)
  const readyMap = useRef(new Map<string, boolean>())

  const handleReadyChange = useCallback((id: string, isReady: boolean) => {
    const prev = readyMap.current.get(id)
    if (prev === isReady) return
    readyMap.current.set(id, isReady)
    const count = Array.from(readyMap.current.values()).filter(Boolean).length
    setReadyCount(count)
  }, [])

  const allReady = readyCount >= totalQuestions && totalQuestions > 0

  useEffect(() => {
    props.onAllReadyChange?.(allReady)
  }, [allReady, props])

  const progress = totalQuestions > 0 ? (readyCount / totalQuestions) * 100 : 0

  return (
    <Box sx={{ width: "90vw", mx: "auto", mb: 1 }}>
      {questions.map((qref) => (
        <QuestionReadyTracker
          key={qref.id}
          qref={qref}
          onReadyChange={handleReadyChange}
        />
      ))}
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            sx={{ mb: 0.5 }}>
            <Typography variant='caption' color='text.secondary'>
              {readyCount}/{totalQuestions} questions ready
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {Math.round(progress)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant='determinate'
            value={progress}
            sx={{ borderRadius: 1, height: 6 }}
          />
        </Box>
        <Button
          variant='contained'
          size='small'
          startIcon={<ScreenShare />}
          onClick={onHost}
          disabled={readyCount < totalQuestions}>
          Host
        </Button>
      </Stack>
    </Box>
  )
}
