import { PollTemplate } from "@/types"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material"
import SlideUpTransition from "@/components/transition/SlideUpTransition"

interface Props {
  template: PollTemplate | null
  open: boolean
  onClose: () => void
  onApply: () => void
  isApplying: boolean
}

export default function TemplatePreviewDialog(props: Props) {
  const { template, open, onClose, onApply, isApplying } = props

  if (!template) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      slots={{ transition: SlideUpTransition }}>
      <DialogTitle>{template.name}</DialogTitle>
      <DialogContent dividers>
        <TemplateQuestionsList template={template} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='contained'
          onClick={onApply}
          disabled={isApplying}
          startIcon={
            isApplying ? <CircularProgress size={16} color='inherit' /> : null
          }>
          Use Template
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function TemplateQuestionsList(props: { template: PollTemplate }) {
  const { template } = props
  return (
    <>
      {template.questions.map((q, qi) => (
        <Box key={qi} sx={{ mb: qi < template.questions.length - 1 ? 3 : 0 }}>
          <Typography variant='subtitle2' fontWeight={700} gutterBottom>
            {qi + 1}. {q.question}
          </Typography>
          <List dense disablePadding>
            <TemplateOptionsList
              options={q.options}
              correct_answer={q.correct_answer}
            />
          </List>
        </Box>
      ))}
    </>
  )
}

function TemplateOptionsList(props: {
  options: string[]
  correct_answer: string
}) {
  const { options, correct_answer } = props
  const isCorrect = options.map(
    (x) => correct_answer !== "" && x === correct_answer
  )
  return (
    <>
      {options.map((opt, oi) => (
        <ListItem key={oi} disableGutters sx={{ py: 0 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {isCorrect[oi] ? (
              <CheckCircleOutline fontSize='small' color='success' />
            ) : (
              <RadioButtonUnchecked fontSize='small' color='disabled' />
            )}
          </ListItemIcon>
          <ListItemText
            primary={opt || "(empty)"}
            primaryTypographyProps={{
              variant: "body2",
              color: opt ? "text.primary" : "text.disabled",
            }}
          />
        </ListItem>
      ))}
    </>
  )
}
