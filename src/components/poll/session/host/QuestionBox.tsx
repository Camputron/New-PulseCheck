import { CurrentQuestion } from "@/types"
import { Box, Typography } from "@mui/material"
import Image from "mui-image"
import React from "react"

interface QuestionBoxProps {
  question: CurrentQuestion
}

export default function QuestionBox(props: QuestionBoxProps) {
  const { question } = props
  return (
    <React.Fragment>
      <Box
        sx={{
          mb: 1,
          p: 2.5,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Question
        </Typography>
        {question.prompt.split(/\n/).map((x, i) => (
          <Typography textAlign="initial" key={i}>
            {x}
          </Typography>
        ))}
      </Box>
      <Box display={"flex"} justifyContent={"center"}>
        {question.prompt_img && <Image width={720} src={question.prompt_img} />}
      </Box>
    </React.Fragment>
  )
}
