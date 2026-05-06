import { BankQuestion, PROMPT_TYPE_CHOICES } from "@/types"
import { CheckCircle } from "@mui/icons-material"
import { Box, CardActionArea, Chip, Stack, Typography } from "@mui/material"

interface BankQuestionCardProps {
  index: number
  question: BankQuestion
  onClick?: () => void
}

export default function BankQuestionCard(props: BankQuestionCardProps) {
  const { index, question, onClick } = props

  const promptTypeLabel =
    PROMPT_TYPE_CHOICES.find((c) => c.value === question.prompt_type)?.name ??
    question.prompt_type

  return (
    <CardActionArea
      onClick={onClick}
      disabled={!onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        textAlign: "left",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              borderColor: "primary.main",
            }
          : undefined,
      }}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={700}
          sx={{ minWidth: 24, mt: 0.25 }}>
          {index + 1}.
        </Typography>
        <Box flex={1}>
          <Typography variant="body1" fontWeight={600}>
            {question.prompt}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1.5 }}>
            <Chip
              label={promptTypeLabel}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
            <Chip
              label={`${question.points} pt${question.points === 1 ? "" : "s"}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </Stack>
          <Stack spacing={0.5}>
            {question.options.map((opt, i) => (
              <Stack
                key={i}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  color: opt.correct ? "success.main" : "text.secondary",
                }}>
                <CheckCircle
                  sx={{
                    fontSize: 14,
                    visibility: opt.correct ? "visible" : "hidden",
                  }}
                />
                <Typography variant="body2">{opt.text || "—"}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </CardActionArea>
  )
}
