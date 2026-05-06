import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Stack,
  Button,
  Skeleton,
  Chip,
  Tooltip,
} from "@mui/material"
import {
  Add,
  BookmarkAdd,
  DragIndicator,
  ExpandMore,
  Image as ImageIcon,
  Schedule,
  Star,
  VisibilityOff,
} from "@mui/icons-material"
import UploadImageBox from "./UploadImageBox"
import { Question } from "@/types"
import PromptField from "./PromptField"
import PromptTypeField from "./PromptTypeField"
import Settings from "./Settings"
import api from "@/api"
import PromptOptionList from "./option/PromptOptionList"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { DocumentReference } from "firebase/firestore"
import RemoveButton from "./RemoveButton"
import QuickFillChips from "../templates/QuickFillChips"
import SaveQuestionToBankDialog from "./SaveQuestionToBankDialog"
import { Fragment, useState } from "react"
import { PROMPT_TYPE_CHOICES } from "@/types"

interface Props {
  pid: string
  qid: string
  index: number
  defaultExpanded?: boolean
  autoFocus?: boolean
  qref: DocumentReference<Question>
}

export default function QuestionEditor(props: Props) {
  const { pid, qid, index, qref } = props
  const [data, loading, error] = useDocumentData(qref)
  const [saveOpen, setSaveOpen] = useState(false)

  const handleAddOption = () => {
    const aux = async () => {
      const ocref = api.polls.questions.options.collect({ pid, qid })
      await api.polls.questions.options.create(ocref)
    }
    void aux()
  }

  if (error || loading || !data) {
    return <Skeleton variant="rounded" sx={{ width: "100%", height: 56 }} />
  }

  const promptTypeLabel = PROMPT_TYPE_CHOICES.find(
    (x) => x.value === data.prompt_type,
  )?.name

  const optionCount = data.options.length
  const hasImage = !!data.prompt_img
  const isTimed = data.time !== null
  const isGraded = data.points > 0
  const isAnonymous = data.anonymous

  return (
    <Fragment>
      <Accordion
        defaultExpanded={props.defaultExpanded}
        disableGutters
        elevation={0}
        slotProps={{
          transition: { unmountOnExit: true },
        }}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            borderColor: "primary.main",
          },
        }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            minHeight: 48,
            px: 1.5,
            "& .MuiAccordionSummary-content": {
              my: 1,
              alignItems: "center",
              gap: 1,
              overflow: "hidden",
            },
          }}>
          <DragIndicator color="action" fontSize="small" />
          <Typography fontWeight={700}>{index + 1}.</Typography>
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: data.prompt ? "text.primary" : "text.disabled",
            }}>
            {data.prompt || "Untitled Question"}
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              flexShrink: 0,
              display: { xs: "none", sm: "flex" },
            }}>
            {hasImage && (
              <Tooltip title="Has image">
                <ImageIcon fontSize="small" color="action" />
              </Tooltip>
            )}
            {isTimed && (
              <Tooltip title="Timed">
                <Schedule fontSize="small" color="action" />
              </Tooltip>
            )}
            {isGraded && (
              <Tooltip
                title={`${data.points} pt${data.points !== 1 ? "s" : ""}`}>
                <Star fontSize="small" color="action" />
              </Tooltip>
            )}
            {isAnonymous && (
              <Tooltip title="Anonymous">
                <VisibilityOff fontSize="small" color="action" />
              </Tooltip>
            )}
            <Chip
              label={promptTypeLabel}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: "0.7rem" }}
            />
            <Chip
              label={`${optionCount} opt${optionCount !== 1 ? "s" : ""}`}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: "0.7rem" }}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 1.5, px: 1.5 }}>
          <Stack spacing={1.25}>
            <PromptField
              pid={pid}
              qid={qid}
              prompt={data.prompt}
              autoFocus={props.autoFocus}
            />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", sm: "flex-start" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <PromptTypeField
                  pid={pid}
                  qid={qid}
                  promptType={data.prompt_type}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <UploadImageBox pid={pid} qid={qid} url={data.prompt_img} />
              </Box>
            </Stack>
            <PromptOptionList
              options={data.options}
              promptType={data.prompt_type}
            />
            {data.options.length === 0 && (
              <QuickFillChips pid={pid} qid={qid} />
            )}
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                size="small"
                startIcon={<Add />}
                onClick={handleAddOption}>
                Add Option
              </Button>
            </Box>
            <Settings
              pid={pid}
              qid={qid}
              points={data.points}
              anonymous={data.anonymous}
              time={data.time}
            />
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{
                pt: 1,
                borderTop: 1,
                borderColor: "divider",
              }}>
              <Button
                size="small"
                startIcon={<BookmarkAdd />}
                onClick={() => setSaveOpen(true)}>
                Save to Bank
              </Button>
              <RemoveButton pid={pid} qid={qid} />
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <SaveQuestionToBankDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        pid={pid}
        qid={qid}
      />
    </Fragment>
  )
}
