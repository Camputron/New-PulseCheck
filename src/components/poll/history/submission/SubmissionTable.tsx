import { Submission } from "@/types"
import { tstos } from "@/utils"
import { KeyboardArrowRight } from "@mui/icons-material"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { useNavigate } from "react-router-dom"

interface SubmissionTableProps {
  submissions: QueryDocumentSnapshot<Submission>[]
}

export default function SubmissionTable(props: SubmissionTableProps) {
  const { submissions } = props
  const navigate = useNavigate()

  const handleRowClick = (sid: string) => {
    void navigate(`/poll/submission/${sid}/results`)
  }

  return (
    <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Submitted by</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Score
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Submitted
            </TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((doc) => {
            const x = doc.data()
            const hasValidScore = x.max_score > 0 && isFinite(x.score_100)
            const scoreLabel = hasValidScore
              ? `${x.score}/${x.max_score} (${x.score_100.toFixed(0)}%)`
              : "No score"
            return (
              <TableRow
                key={doc.id}
                hover
                onClick={() => handleRowClick(doc.id)}
                sx={{
                  cursor: "pointer",
                  "&:last-child td": { border: 0 },
                }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {x.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {x.display_name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    color={hasValidScore ? "text.primary" : "text.disabled"}>
                    {scoreLabel}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" color="text.secondary">
                    {tstos(x.submitted_at)}
                  </Typography>
                </TableCell>
                <TableCell padding="checkbox">
                  <KeyboardArrowRight
                    fontSize="small"
                    sx={{ color: "action.active" }}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
