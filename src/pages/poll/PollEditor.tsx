import {
  Container,
  Fab,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import Header from "@/components/poll/edit/header/Header"
import PreSessionConfig from "@/components/poll/edit/PreSessionConfig"
import { useNavigate, useParams } from "react-router-dom"
import { useDocumentData } from "react-firebase-hooks/firestore"
import QuestionList from "@/components/poll/edit/question/QuestionList"
import { useSnackbar } from "@/hooks"
import api from "@/api"
import { Add } from "@mui/icons-material"
import { RA } from "@/styles"
import useRequireAuth from "@/hooks/useRequireAuth"
import CompletionBar from "@/components/poll/edit/templates/CompletionBar"

export default function PollEditor() {
  useRequireAuth()
  const params = useParams()
  const id = params.id ?? ""
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  useEffect(() => {
    if (!id) {
      void navigate(-1)
    }
  }, [id, navigate])

  const [isConfiguring, setIsConfiguring] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [canHost, setCanHost] = useState(false)
  const prevQuestionCount = useRef(0)

  const pollRef = api.polls.doc(id)
  const [poll, loading, error] = useDocumentData(pollRef, {
    initialValue: undefined,
    snapshotOptions: {
      serverTimestamps: "previous",
    },
  })

  const questionCount = poll?.questions?.length ?? 0
  useEffect(() => {
    if (prevQuestionCount.current === 0 && questionCount > 0) {
      setExpandAll(true)
    }
    prevQuestionCount.current = questionCount
  }, [questionCount])

  const handleAddQuestion = () => {
    const aux = async () => {
      try {
        const ref = api.polls.questions.collect(id)
        await api.polls.questions.add(ref)
      } catch {
        snackbar.show({
          type: "error",
          message: "Failed to create question",
        })
      }
    }
    void aux()
  }

  if (loading) {
    return <LinearProgress />
  }

  if (error) {
    return <Typography>Failed to load Poll ({id})</Typography>
  }

  /* user wants to host poll, render poll session config view */
  if (isConfiguring && poll) {
    return (
      <PreSessionConfig
        pid={id}
        poll={poll}
        onBack={() => setIsConfiguring(false)}
      />
    )
  }

  return (
    <React.Fragment>
      {poll && (
        <Header
          pid={id}
          poll={poll}
          canHost={canHost}
          onStartConfig={() => setIsConfiguring(true)}
        />
      )}
      <Container sx={{ mt: 1, mb: 4 }} maxWidth="xl">
        {questionCount > 0 && poll && (
          <CompletionBar
            questions={poll.questions}
            onHost={() => setIsConfiguring(true)}
            onAllReadyChange={setCanHost}
          />
        )}
        <Stack spacing={2} alignItems={"center"}>
          <QuestionList
            pid={id}
            questions={poll?.questions ?? []}
            expandAll={expandAll}
          />
          <RA.Roll triggerOnce>
            <Tooltip title="New Question">
              <Fab
                color="secondary"
                disabled={!poll}
                onClick={handleAddQuestion}>
                <Add />
              </Fab>
            </Tooltip>
          </RA.Roll>
        </Stack>
      </Container>
    </React.Fragment>
  )
}
