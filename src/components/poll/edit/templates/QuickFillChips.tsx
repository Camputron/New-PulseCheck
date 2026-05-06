import { useState } from "react"
import { Chip, Stack, Typography } from "@mui/material"
import api from "@/api"
import { OPTION_PRESETS } from "./optionPresets"
import { OptionPreset } from "@/types"

interface Props {
  pid: string
  qid: string
}

export default function QuickFillChips(props: Props) {
  const { pid, qid } = props
  const [applying, setApplying] = useState(false)

  const handleApply = async (preset: OptionPreset) => {
    if (applying) return
    setApplying(true)
    try {
      const optionsCollection = api.polls.questions.options.collect({
        pid,
        qid,
      })
      for (let i = 0; i < preset.options.length; i++) {
        const oref = await api.polls.questions.options.create(optionsCollection)
        await api.polls.questions.options.updateByRef(oref, {
          text: preset.options[i],
          correct: preset.correctIndex === i,
        })
      }
    } catch (err) {
      console.error("Failed to apply option preset", err)
    } finally {
      setApplying(false)
    }
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ overflowX: "auto", py: 1 }}
      alignItems="center">
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ whiteSpace: "nowrap" }}>
        Quick fill:
      </Typography>
      {OPTION_PRESETS.map((preset) => (
        <Chip
          key={preset.id}
          label={preset.label}
          variant="outlined"
          size="small"
          disabled={applying}
          onClick={() => void handleApply(preset)}
          sx={{
            borderColor: "primary.main",
            "&:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
          }}
        />
      ))}
    </Stack>
  )
}
