import api from "@/api"
import { mmsston, ntommss, stommss } from "@/utils"
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material"
import React, { useEffect, useState } from "react"

interface Props {
  pid: string
  time: number | null
}

const DEFAULT_DURATION = 600000

export default function TimerSwitch(props: Props) {
  const { pid } = props
  /* milliseconds */
  const [time, setTime] = useState(props.time)
  /* MM:SS string format */
  const [timeFormatted, setTimeFormatted] = useState(ntommss(props.time))

  useEffect(() => {
    setTime(mmsston(timeFormatted))
  }, [timeFormatted])

  useEffect(() => {
    const updateTime = async (newTime: number | null) => {
      if (newTime === props.time) {
        return
      }
      try {
        const ref = api.polls.doc(pid)
        await api.polls.update(ref, { time: newTime })
      } catch (err: unknown) {
        console.error(err)
      }
    }
    void updateTime(time)
  }, [pid, time, props.time])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedTime = stommss(e.target.value)
    setTimeFormatted(formattedTime)
  }

  const formatTimeHelper = () => {
    if (time === null) {
      return ""
    }
    if (time <= 0) {
      return "Invalid Time"
    }

    const totalSeconds = Math.floor(time / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    let result = ""
    if (minutes > 0) {
      result += `${minutes} minute${minutes !== 1 ? "s" : ""}`
    }
    if (seconds > 0) {
      if (result.length > 0) {
        result += ", "
      }
      result += `${seconds} second${seconds !== 1 ? "s" : ""}`
    }

    return result || "0 seconds"
  }

  return (
    <Box>
      <FormControlLabel
        labelPlacement="end"
        label="Timed"
        checked={time !== null}
        onChange={(_, checked) => {
          if (checked) {
            setTime(DEFAULT_DURATION)
            setTimeFormatted(ntommss(DEFAULT_DURATION))
          } else {
            setTime(null)
            setTimeFormatted("")
          }
        }}
        control={<Switch />}
      />
      {/* {timed && ( */}
      <Tooltip title={formatTimeHelper()}>
        <TextField
          // style={{ opacity: time ? 1 : 0 }}
          size="small"
          placeholder="MM:SS"
          value={timeFormatted}
          // disabled={Boolean(!time)}
          onChange={handleChange}
          error={time === 0}
          style={{ width: "12ch" }}
        />
      </Tooltip>
      {/* <Typography color='textDisabled' variant='body2'>
        {formatTimeHelper()}
      </Typography> */}
      {/* )} */}
    </Box>
  )
}
