import { Box } from "@mui/material"
import { Gauge, gaugeClasses } from "@mui/x-charts"
import { useEffect, useRef, useState } from "react"
import type { Theme } from "@mui/material/styles"

interface PulseGaugeProps {
  score: number
  size?: number
  fontSize?: string
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function scoreColor(pct: number, palette: Theme["palette"]): string {
  if (pct >= 80) return palette.primary.main
  if (pct >= 60) return palette.primary.light
  if (pct >= 40) return palette.warning.main
  if (pct >= 20) return palette.warning.dark
  return palette.error.main
}

export default function PulseGauge(props: PulseGaugeProps) {
  const { size, fontSize = "1.5em" } = props
  const [score, setScore] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const target = props.score
    const duration = 1200
    let start: number | null = null

    const animate = (ts: number) => {
      if (start === null) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      setScore(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [props.score])

  return (
    <Box
      sx={{
        width: size ?? "100%",
        maxWidth: size ?? 250,
        aspectRatio: "4 / 3",
        mx: "auto",
      }}>
      <Gauge
        cornerRadius={6}
        value={score}
        startAngle={-110}
        endAngle={110}
        text={({ value, valueMax }) => `${value} / ${valueMax}`}
        sx={(theme) => ({
          width: "100%",
          height: "100%",
          [`& .${gaugeClasses.valueText}`]: {
            fontSize,
            fontWeight: 600,
            transition: "fill 100ms ease",
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: scoreColor(score, theme.palette),
            transition: "fill 100ms ease",
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    </Box>
  )
}
