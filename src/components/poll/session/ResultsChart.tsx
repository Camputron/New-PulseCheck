import { SessionQuestionResults } from "@/types"
import { Typography } from "@mui/material"
import { PieChart } from "@mui/x-charts"
import React from "react"

interface Props {
  results: SessionQuestionResults
}

export default function ResultsChart(props: Props) {
  const { results } = props
  // const barchart = results.barchart
  // console.debug("series", results.barchart)
  // const series = Object.values(results.series).map((x) => ({
  //   data: x.data,
  //   label: x.text,
  // }))
  // console.debug("series", series)
  // const yAxisData = Object.values(results.series).map((x) => x.text)
  // console.debug("yAxisData", yAxisData)
  // const dataSeries: number[] = []
  // series.forEach((x) => dataSeries.push(x.data[0]))
  // console.debug(dataSeries)

  const total = results.piechart.reduce((x, y) => x + y.value, 0)

  return (
    <React.Fragment>
      <Typography>{results.question.prompt}</Typography>
      {results.question.prompt_type !== "ranking-poll" &&
        results.opts_correct.map((x) => (
          <Typography key={x.id} variant="body2" color="textSecondary">
            {x.text}
          </Typography>
        ))}
      <PieChart
        series={[
          {
            arcLabel: (item) => `${((item.value / total) * 100).toFixed()}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: "60%",
            data: results.piechart,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        slotProps={{
          legend: {
            sx: {
              blockOverflow: "clip",
              justifyContent: "center",
            },
            direction: "horizontal",
            position: {
              horizontal: "center",
              vertical: "bottom",
            },
          },
        }}
        height={256}
      />
    </React.Fragment>
  )
}
