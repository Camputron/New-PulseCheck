import {
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import TimerSwitch from "./TimerSwitch"
import { useEffect, useState } from "react"
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
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      flexWrap="wrap"
      sx={{
        pt: 1,
        mt: 0.5,
        borderTop: 1,
        borderColor: "divider",
      }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5, mr: 1 }}>
        Settings
      </Typography>
      <FormControlLabel
        label="Anonymous"
        checked={anonymous}
        control={
          <Switch
            size="small"
            onChange={(e) => setAnonymous(e.target.checked)}
          />
        }
        slotProps={{ typography: { variant: "body2" } }}
      />
      <TimerSwitch pid={pid} qid={qid} time={time} />
      <Stack direction="row" spacing={1} alignItems="center">
        <FormControlLabel
          label="Points"
          checked={graded}
          control={<Switch size="small" onChange={handleGraded} />}
          slotProps={{ typography: { variant: "body2" } }}
        />
        <TextField
          sx={{
            width: "8ch",
            opacity: graded ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
          type="number"
          size="small"
          placeholder="1"
          hiddenLabel
          defaultValue={props.points}
          onChange={(e) => setPoints(parseInt(e.target.value))}
          error={points < 0}
        />
      </Stack>
    </Stack>
  )
}
