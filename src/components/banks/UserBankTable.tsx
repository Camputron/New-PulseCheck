import { QuestionBank } from "@/types"
import { ntoq, stoc, tstos } from "@/utils"
import { Inventory2, KeyboardArrowRight } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useNavigate } from "react-router-dom"

interface UserBankTableProps {
  banks: { id: string; data: QuestionBank }[]
}

export default function UserBankTable(props: UserBankTableProps) {
  const { banks } = props
  const navigate = useNavigate()

  const handleRowClick = (bid: string) => {
    void navigate(`/banks/${bid}`)
  }

  return (
    <TableContainer
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Questions
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Updated
            </TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {banks.map(({ id, data }) => (
            <TableRow
              key={id}
              hover
              onClick={() => handleRowClick(id)}
              sx={{
                cursor: "pointer",
                "&:last-child td": { border: 0 },
              }}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.25}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: stoc(data.name),
                    }}>
                    <Inventory2 sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" fontWeight={600}>
                    {data.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color={data.description ? "text.secondary" : "text.disabled"}
                  sx={{
                    fontStyle: data.description ? "normal" : "italic",
                    maxWidth: 360,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  {data.description ?? "No description"}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {ntoq(data.question_count)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="caption" color="text.secondary">
                  {tstos(data.updated_at)}
                </Typography>
              </TableCell>
              <TableCell padding="checkbox">
                <Box sx={{ display: "flex", color: "action.active" }}>
                  <KeyboardArrowRight fontSize="small" />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
