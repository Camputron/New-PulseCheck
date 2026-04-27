import { useState } from "react"
import { Box, Chip, Stack, Typography } from "@mui/material"
import { RA } from "@/styles"
import { PollTemplate, TemplateCategory } from "@/types"
import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import TemplateCard from "./TemplateCard"
import TemplatePreviewDialog from "./TemplatePreviewDialog"
import { POLL_TEMPLATES } from "./pollTemplates"

const CATEGORIES: { label: string; value: TemplateCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Assessment", value: "assessment" },
  { label: "Feedback", value: "feedback" },
  { label: "Engagement", value: "engagement" },
]

interface Props {
  pid: string
}

export default function TemplatePicker(props: Props) {
  const { pid } = props
  const snackbar = useSnackbar()

  const [applying, setApplying] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<
    TemplateCategory | "all"
  >("all")
  const [previewTemplate, setPreviewTemplate] = useState<PollTemplate | null>(
    null
  )

  const filteredTemplates =
    categoryFilter === "all"
      ? POLL_TEMPLATES
      : POLL_TEMPLATES.filter((t) => t.category === categoryFilter)

  const handleApply = async (template: PollTemplate) => {
    if (applying) return
    setApplying(template.id)
    try {
      await api.polls.generateQuestions(pid, template.questions)
    } catch {
      snackbar.show({
        type: "error",
        message: "Failed to create template questions",
      })
      setApplying(null)
    }
  }

  const handlePreviewApply = async () => {
    if (!previewTemplate) return
    setPreviewTemplate(null)
    await handleApply(previewTemplate)
  }

  return (
    <>
      <Stack spacing={3} alignItems='center' sx={{ py: 4, px: 2 }}>
        <RA.Fade triggerOnce duration={600}>
          <Stack spacing={1} alignItems='center' textAlign='center'>
            <Typography
              variant='overline'
              sx={{
                letterSpacing: 2,
                color: "primary.main",
                fontWeight: 600,
              }}>
              Templates
            </Typography>
            <Typography variant='h5' fontWeight={700}>
              Start with a template
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Pick a template to scaffold your poll instantly, then customize as
              needed.
            </Typography>
          </Stack>
        </RA.Fade>

        <Stack
          direction='row'
          spacing={1}
          flexWrap='wrap'
          justifyContent='center'>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              variant={categoryFilter === cat.value ? "filled" : "outlined"}
              color={categoryFilter === cat.value ? "primary" : "default"}
              onClick={() => setCategoryFilter(cat.value)}
            />
          ))}
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
            width: "100%",
            maxWidth: 900,
          }}>
          {filteredTemplates.map((template, index) => (
            <RA.Fade
              triggerOnce
              duration={600}
              delay={index * 80}
              key={template.id}>
              <TemplateCard
                template={template}
                isApplying={applying === template.id}
                anyApplying={applying !== null}
                onApply={() => void handleApply(template)}
                onPreview={() => setPreviewTemplate(template)}
              />
            </RA.Fade>
          ))}
        </Box>

        <Typography variant='body2' color='text.secondary'>
          or add questions manually with the + button below
        </Typography>
      </Stack>

      <TemplatePreviewDialog
        template={previewTemplate}
        open={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        onApply={() => void handlePreviewApply()}
        isApplying={applying !== null}
      />
    </>
  )
}
