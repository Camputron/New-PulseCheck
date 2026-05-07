import { Session, SessionOption } from "@/types"
import {
  Dialog,
  Toolbar,
  Typography,
  AppBar,
  Box,
  Stack,
  DialogContent,
  Card,
  CardContent,
} from "@mui/material"
import Choice from "./Choice"

import { DocumentReference } from "firebase/firestore"
import { useEffect, useState } from "react"
import api from "@/api"
import { useAuthContext } from "@/hooks"
import Image from "mui-image"
import { QuestionAnswer } from "@mui/icons-material"
import SlideUpTransition from "@/components/transition/SlideUpTransition"

interface ResponseDialogProps {
  sref: DocumentReference<Session>
  session?: Session
}

/**
 * User answers the current question here.
 * @author tdhillion113, Bran7tastic, Camputron
 */
export default function ResponseDialog(props: ResponseDialogProps) {
  const auth = useAuthContext()
  const { sref } = props
  const currentQuestion = props.session?.question

  const [selectedOptions, setSelectedOptions] = useState<
    DocumentReference<SessionOption>[]
  >([])

  useEffect(() => {
    return () => {
      /* reset the selected options on unmount */
      setSelectedOptions([])
    }
  }, [currentQuestion])

  useEffect(() => {
    /* save users response */
    if (auth.user && currentQuestion) {
      void api.sessions.questions.responses.answer(
        sref.id,
        currentQuestion.ref.id,
        auth.user.uid,
        selectedOptions,
      )
    }
  }, [auth.user, currentQuestion, sref.id, selectedOptions])

  return (
    <Dialog
      fullScreen
      open={currentQuestion !== null}
      disablePortal={false}
      slots={{
        transition: SlideUpTransition,
      }}>
      <AppBar position="relative" enableColorOnDark>
        <Toolbar>
          <Stack spacing={1} direction={"row"}>
            <QuestionAnswer />
            <Typography fontWeight={"bold"}>
              {`Question (${currentQuestion?.prompt_type})`}
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Card sx={{ mb: 1 }}>
          <CardContent>
            {/* <Typography gutterBottom variant='body2' color='textSecondary'>
              Question
            </Typography> */}
            {currentQuestion?.prompt.split(/\r\n|\r|\n/).map((x, i) => (
              <Typography key={i} fontWeight={700}>
                {x}
              </Typography>
            ))}
          </CardContent>
        </Card>
        {currentQuestion?.prompt_img && (
          <Box display={"flex"} justifyContent={"center"}>
            <Image width={720} src={currentQuestion.prompt_img} />
          </Box>
        )}
        {currentQuestion && (
          <Box mb={1}>
            {/* render question choices */}
            <Stack spacing={1} mt={2} direction={"column"}>
              {currentQuestion.options.map((x) => (
                <Choice
                  key={x.ref.path}
                  ref={x.ref}
                  text={x.text}
                  promptType={currentQuestion.prompt_type}
                  theChosenOnes={selectedOptions}
                  setTheChosenOnes={setSelectedOptions}
                />
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
