import api from "@/api"
import { SessionOption, SessionQuestion, SessionResponse } from "@/types"
import { Typography, CardMedia, Box } from "@mui/material"
import {
  DocumentReference,
  getDoc,
  QueryDocumentSnapshot,
  refEqual,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"

interface Props {
  sid: string
  uid: string
  qref: DocumentReference<SessionQuestion>
}

/**
 * UI for answer card showing users what was the right answer
 * @author VerySirias
 * @returns {JSX.Element}
 */
export default function AnswerCard(props: Props) {
  const { sid, uid, qref } = props
  /* stores question data */
  const [question, setQuestion] = useState<SessionQuestion | null>(null)
  const [options, setOptions] = useState<
    QueryDocumentSnapshot<SessionOption>[]
  >([])
  const [res, setRes] = useState<SessionResponse | null>(null)

  /* fetch question on mount */
  useEffect(() => {
    getDoc(qref)
      .then((x) => {
        if (x.exists()) {
          setQuestion(x.data())
        }
      })
      .catch((err) => console.debug(err))
  }, [qref])

  useEffect(() => {
    /* fetch question's options */
    if (question) {
      void api.sessions.questions.options
        .getAllByRef(qref)
        .then((x) => {
          setOptions(x.docs)
        })
        .catch((err) => console.debug(err))
    }
  }, [question, qref])

  useEffect(() => {
    /* fetch user's response for this question */
    if (question) {
      void api.sessions.questions.responses
        .get(sid, qref.id, uid)
        .then((x) => {
          if (x.exists()) {
            setRes(x.data())
          }
        })
        .catch((err) => console.debug(err))
    }
  }, [uid, question, qref, sid])

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}>
      <Typography gutterBottom fontWeight={500}>
        {question?.prompt}
      </Typography>
      {question?.prompt_img && (
        <CardMedia
          component="img"
          sx={{ objectFit: "contain", mb: 1, borderRadius: 1 }}
          image={question?.prompt_img ?? ""}
        />
      )}
      {res?.choices.length === 0 ? (
        /* if the user chose nothing, display blank response */
        <React.Fragment>
          <Typography color="error">Response left blank</Typography>
          {!res?.correct &&
            options.map((x) => {
              if (!x.data().correct) return <></>
              return (
                <Typography key={x.id} color="success">
                  {"•"} {x.data().text}
                </Typography>
              )
            })}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {options
            ?.filter((x) => res?.choices.some((y) => refEqual(x.ref, y)))
            .map((x) => (
              <Typography key={x.id} color={res?.correct ? "success" : "error"}>
                {"•"} {x.data().text}
              </Typography>
            ))}
          {/* if the user got this question wrong, render the correct results */}
          {!res?.correct &&
            options.map((x) => {
              if (!x.data().correct) return <></>
              return (
                <Typography key={x.id} color="success">
                  {"•"} {x.data().text}
                </Typography>
              )
            })}
        </React.Fragment>
      )}
      <Box display="flex" justifyContent="end">
        <Typography variant="caption" color="text.secondary">
          {question?.points} point(s)
        </Typography>
      </Box>
    </Box>
  )
}
