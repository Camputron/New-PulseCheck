import api from "@/api"
import { mmsston, ntommss, stommss } from "@/utils"
import { FormControlLabel, Switch, TextField, Tooltip } from "@mui/material"
import React, { useEffect, useState } from "react"

interface Props {
  pid: string
  qid: string
  time: number | null
}

// const SAVE_DELAY = 1000
const DEFAULT_DURATION = 10000

export default function TimerSwitch(props: Props) {
  const { pid, qid } = props
  const [time, setTime] = useState(props.time)
  const [timeFormatted, setTimeFormatted] = useState(ntommss(props.time))
  // const [timed, setTimed] = useState(props.time ? true : false)

  // useEffect(() => {
  //   if (!timed) {
  //     setTime(null)
  //   } else {
  //     setTimeFormatted(ntommss(DEFAULT_DURATION))
  //   }
  // }, [timed])

  useEffect(() => {
    setTime(mmsston(timeFormatted))
  }, [timeFormatted])

  useEffect(() => {
    const updateTime = async (newTime: number | null) => {
      if (newTime === props.time) {
        return
      }
      try {
        // if (newTime !== null && newTime <= 0) {
        //   return
        // }
        // if (newTime === props.time) {
        //   return
        // }
        const ref = api.polls.questions.doc(pid, qid)
        await api.polls.questions.update(ref, { time: newTime })
      } catch (err: unknown) {
        console.error(err)
      }
    }
    void updateTime(time)
    // const timer = setTimeout(() => {
    //   void updateTime(time)
    // }, SAVE_DELAY)
    // return () => {
    //   clearTimeout(timer)
    // }
  }, [pid, qid, time, props.time])

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
    <React.Fragment>
      <FormControlLabel
        labelPlacement='end'
        label='Timed'
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
          // style={{ opacity: timed ? 1 : 0 }}
          size='small'
          placeholder='MM:SS'
          value={timeFormatted}
          onChange={handleChange}
          error={time === 0}
          style={{ width: "12ch" }}
        />
      </Tooltip>
      {/* )} */}
    </React.Fragment>
  )
}
