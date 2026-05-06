import { useThemeContext } from "@/hooks"
import { Session, SessionState } from "@/types"
import { ntops, stoc, tstos } from "@/utils"
import { BarChart, KeyboardArrowRight } from "@mui/icons-material"
import {
  Avatar,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { QueryDocumentSnapshot } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

interface SessionTableProps {
  sessions: QueryDocumentSnapshot<Session>[]
}

export default function SessionTable(props: SessionTableProps) {
  const { sessions } = props
  const navigate = useNavigate()
  const theme = useThemeContext()

  const handleRowClick = (sid: string) => {
    void navigate(`/poll/session/${sid}/results`)
  }

  return (
    <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Questions
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Participants
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Avg Score
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Hosted
            </TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((doc) => {
            const x = doc.data()
            const avg = x.summary?.average_100
            const questionCount = x.questions?.length ?? 0
            const hasAvg = avg !== null && avg !== undefined && isFinite(avg)
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
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: stoc(x.title),
                      }}>
                      <BarChart
                        sx={{ fontSize: 16 }}
                        color={theme.mode === "light" ? "inherit" : "action"}
                      />
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {x.title}
                    </Typography>
                    {x.state === SessionState.CLOSED && (
                      <Chip size="small" label="Closed" color="warning" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{questionCount}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {ntops(x.summary?.total_participants)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {hasAvg ? (
                    <Typography variant="body2">{`${avg.toFixed(0)}%`}</Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" color="text.secondary">
                    {tstos(x.created_at)}
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
