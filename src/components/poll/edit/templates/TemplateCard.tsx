import { PollTemplate } from "@/types"
import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  QuizOutlined,
  RuleOutlined,
  AbcOutlined,
  ExitToAppOutlined,
  PollOutlined,
  Diversity3Outlined,
  PsychologyOutlined,
  ForumOutlined,
  VisibilityOutlined,
} from "@mui/icons-material"
import React from "react"

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  quiz: <QuizOutlined sx={{ fontSize: 36 }} />,
  "true-false": <RuleOutlined sx={{ fontSize: 36 }} />,
  vocab: <AbcOutlined sx={{ fontSize: 36 }} />,
  "exit-ticket": <ExitToAppOutlined sx={{ fontSize: 36 }} />,
  survey: <PollOutlined sx={{ fontSize: 36 }} />,
  icebreaker: <Diversity3Outlined sx={{ fontSize: 36 }} />,
  muddiest: <PsychologyOutlined sx={{ fontSize: 36 }} />,
  discussion: <ForumOutlined sx={{ fontSize: 36 }} />,
}

interface Props {
  template: PollTemplate
  isApplying: boolean
  anyApplying: boolean
  onApply: () => void
  onPreview: () => void
}

export default function TemplateCard(props: Props) {
  const { template, isApplying, anyApplying, onApply, onPreview } = props

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPreview()
  }

  return (
    <Box
      onClick={anyApplying ? undefined : onApply}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        cursor: anyApplying ? "default" : "pointer",
        opacity: anyApplying && !isApplying ? 0.5 : 1,
        transition: "border-color 0.2s, box-shadow 0.2s, opacity 0.2s",
        "&:hover": anyApplying
          ? {}
          : {
              borderColor: "primary.main",
              boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
            },
      }}>
      {isApplying ? (
        <Stack spacing={2} justifyContent="center" sx={{ height: "100%" }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Creating questions...
          </Typography>
          <LinearProgress />
        </Stack>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start">
            <Box sx={{ color: "primary.main", mb: 1.5 }}>
              {TEMPLATE_ICONS[template.icon]}
            </Box>
            <Tooltip title="Preview">
              <IconButton size="small" onClick={handlePreview}>
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            {template.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {template.description}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${template.questions.length} questions`}
              size="small"
              variant="outlined"
            />
            <Chip label={template.category} size="small" variant="outlined" />
          </Stack>
        </>
      )}
    </Box>
  )
}
