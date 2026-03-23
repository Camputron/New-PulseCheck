import { Box } from "@mui/material"
import { Gauge, gaugeClasses } from "@mui/x-charts"
import { useEffect, useRef, useState } from "react"

interface PulseGaugeProps {
  score: number
  size?: number
  fontSize?: string
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function scoreColor(pct: number): string {
  if (pct >= 80) return "#009688"
  if (pct >= 60) return "#26a69a"
  if (pct >= 40) return "#ffc107"
  if (pct >= 20) return "#ff9800"
  return "#f44336"
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
            fontWeight: 700,
            transition: "fill 0.3s ease",
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: scoreColor(score),
            transition: "fill 0.3s ease",
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    </Box>
  )
}
