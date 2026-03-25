import {
  Divider,
  FormControlLabel,
  Grid2,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import TimerSwitch from "./TimerSwitch"
import React, { useEffect, useState } from "react"
import useSnackbar from "@/hooks/useSnackbar"
import api from "@/api"

interface Props {
  pid: string /* poll id */
  qid: string /* question id */
  points: number /* amount of points the question is worth  */
  anonymous: boolean /* when users answer this question, is it public? */
  time: number | null /* is this question timed? */
}

/**
 * Allows users to set the settings for a question of a poll.
 * @author VerySirias
 * @returns {JSX.Element}
 */

export default function Settings(props: Props) {
  const { pid, qid, time } = props
  const [points, setPoints] = useState(props.points)
  const [anonymous, setAnonymous] = useState(props.anonymous)
  const [graded, setGraded] = useState(props.points ? true : false)
  const snackbar = useSnackbar()

  useEffect(() => {
    async function savePoints(num: number) {
      try {
        if (num < 0) {
          return
        }
        if (num === props.points) {
          return
        }

        const ref = api.polls.questions.doc(pid, qid)
        await api.polls.questions.update(ref, {
          points: num,
        })
      } catch {
        snackbar.show({
          message: "Failed to update",
          type: "error",
        })
      }
    }
    void savePoints(points)
  }, [pid, props.points, points, snackbar, qid])

  useEffect(() => {
    async function saveAnonymous(bool: boolean) {
      try {
        if (bool === props.anonymous) {
          return
        }
        const ref = api.polls.questions.doc(pid, qid)
        await api.polls.questions.update(ref, {
          anonymous: bool,
        })
      } catch {
        snackbar.show({
          message: "Failed to update",
          type: "error",
        })
      }
    }
    void saveAnonymous(anonymous)
  }, [pid, props.anonymous, anonymous, snackbar, qid])

  useEffect(() => {
    async function saveGraded(bool: boolean) {
      try {
        if (bool === true) {
          return
        }
        const ref = api.polls.questions.doc(pid, qid)
        await api.polls.questions.update(ref, {
          points: 0,
        })
      } catch {
        snackbar.show({
          message: "Failed to update",
          type: "error",
        })
      }
    }
    void saveGraded(graded)
  }, [pid, props.points, graded, snackbar, qid])

  const handleGraded = () => {
    if (!graded) {
      setGraded(true)
    } else {
      setGraded(false)
    }
    return graded
  }
  return (
    <React.Fragment>
      <Divider>
        <Typography>Question Settings</Typography>
      </Divider>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }}>
          <FormControlLabel
            label='Anonymous'
            checked={anonymous}
            control={
              <Switch onChange={(e) => setAnonymous(e.target.checked)} />
            }
          />
        </Grid2>
        <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }}>
          <TimerSwitch pid={pid} qid={qid} time={time} />
        </Grid2>
        <Grid2 size={{ xl: 3, lg: 3, md: 4, sm: 6, xs: 12 }}>
          <FormControlLabel
            label='Points'
            checked={graded}
            control={<Switch onChange={handleGraded} />}
          />
          {/* {graded && ( */}
          <TextField
            style={{ opacity: graded ? 1 : 0 }}
            type='number'
            size='small'
            placeholder='1'
            hiddenLabel
            defaultValue={props.points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
            error={points < 0}
            helperText={points < 0 ? "invalid number" : ""}
          />
          {/* )} */}
        </Grid2>
      </Grid2>
    </React.Fragment>
  )
}
