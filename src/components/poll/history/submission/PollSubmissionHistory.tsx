import api from "@/lib/api/firebase"
import { useAuthContext } from "@/lib/hooks"
import { useSnackbar } from "@/lib/hooks"
import { Submission } from "@/lib/types"
import { RA } from "@/styles"
import { Download } from "@mui/icons-material"
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import SubmissionCard from "./SubmissionCard"

type SortOption =
  | "date-desc"
  | "date-asc"
  | "score-desc"
  | "score-asc"
  | "alpha"
type DateFilter = "all" | "7d" | "30d" | "90d"

interface PollSubmissionHistoryProps {
  query: string
  sort: string
  dateFilter: string
  onParamChange: (
    key: string,
    value: string,
    defaults?: Record<string, string>
  ) => void
}

function matchesDateFilter(millis: number, dateFilter: DateFilter): boolean {
  if (dateFilter === "all") return true
  const now = Date.now()
  const days = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 90
  return now - millis < days * 86_400_000
}

function sortSubmissions(
  a: QueryDocumentSnapshot<Submission>,
  b: QueryDocumentSnapshot<Submission>,
  sortBy: SortOption
): number {
  const ad = a.data()
  const bd = b.data()
  switch (sortBy) {
    case "date-desc":
      return bd.submitted_at.toMillis() - ad.submitted_at.toMillis()
    case "date-asc":
      return ad.submitted_at.toMillis() - bd.submitted_at.toMillis()
    case "score-desc":
      return (bd.score_100 || 0) - (ad.score_100 || 0)
    case "score-asc":
      return (ad.score_100 || 0) - (bd.score_100 || 0)
    case "alpha":
      return ad.title.localeCompare(bd.title)
    default:
      return 0
  }
}

function exportSubmissionsCSV(
  submissions: QueryDocumentSnapshot<Submission>[]
) {
  const header = "Title,Date,Score,Max Score,Score %\n"
  const rows = submissions.map((x) => {
    const d = x.data()
    const date = d.submitted_at.toDate().toISOString().split("T")[0]
    const title = d.title.replace(/,/g, ";")
    const pct = isFinite(d.score_100) ? d.score_100.toFixed(1) : "N/A"
    return `${title},${date},${d.score},${d.max_score},${pct}`
  })
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "submissions.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export default function PollSubmissionHistory(
  props: PollSubmissionHistoryProps
) {
  const { query, sort, dateFilter: dateFilterParam, onParamChange } = props
  const { user, loading } = useAuthContext()
  const snackbar = useSnackbar()
  const [submissions, setSubmissions] = useState<
    QueryDocumentSnapshot<Submission>[]
  >([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    QueryDocumentSnapshot<Submission>[]
  >([])
  const sortBy = (sort || "date-desc") as SortOption
  const dateFilter = (dateFilterParam || "7d") as DateFilter
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = submissions
        .filter((x) => {
          const d = x.data()
          const matchesText = d.title
            .toLowerCase()
            .includes(query.toLowerCase())
          const matchesDate = matchesDateFilter(
            d.submitted_at.toMillis(),
            dateFilter
          )
          return matchesText && matchesDate
        })
        .sort((a, b) => sortSubmissions(a, b, sortBy))
      setFilteredSubmissions(filtered)
    }, 250)
    return () => clearTimeout(timeout)
  }, [query, submissions, sortBy, dateFilter])

  useEffect(() => {
    if (user && !loading) {
      setFetching(true)
      api.submissions
        .findUserSubmissions(user.uid)
        .then((x) => {
          setSubmissions(x)
        })
        .catch(() => {
          snackbar.show({
            message: "Failed to load submissions",
            type: "error",
          })
        })
        .finally(() => setFetching(false))
    }
  }, [user, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onParamChange("q", e.target.value)
  }

  const onSortChange = useCallback(
    (e: SelectChangeEvent) => {
      onParamChange("sort", e.target.value, { sort: "date-desc" })
    },
    [onParamChange]
  )

  const onDateFilterChange = useCallback(
    (e: SelectChangeEvent) => {
      onParamChange("date", e.target.value, { date: "7d" })
    },
    [onParamChange]
  )

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          placeholder='Filter your submissions by poll title...'
          fullWidth
          value={query}
          onChange={onChange}
        />
        <Box display='flex' alignItems='center' gap={1} flexWrap='wrap'>
          <Select
            size='small'
            value={sortBy}
            onChange={onSortChange}
            sx={{ minWidth: 160 }}>
            <MenuItem value='date-desc'>Newest first</MenuItem>
            <MenuItem value='date-asc'>Oldest first</MenuItem>
            <MenuItem value='score-desc'>Highest score</MenuItem>
            <MenuItem value='score-asc'>Lowest score</MenuItem>
            <MenuItem value='alpha'>Alphabetical</MenuItem>
          </Select>
          <Select
            size='small'
            value={dateFilter}
            onChange={onDateFilterChange}
            sx={{ minWidth: 130 }}>
            <MenuItem value='all'>All time</MenuItem>
            <MenuItem value='7d'>Last 7 days</MenuItem>
            <MenuItem value='30d'>Last 30 days</MenuItem>
            <MenuItem value='90d'>Last 90 days</MenuItem>
          </Select>
          <Typography variant='body2' color='text.secondary' flex={1}>
            Showing {filteredSubmissions.length} of {submissions.length}
          </Typography>
          {filteredSubmissions.length > 0 && (
            <Tooltip title='Export CSV'>
              <IconButton
                size='small'
                onClick={() => exportSubmissionsCSV(filteredSubmissions)}>
                <Download fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}>
          {fetching &&
            [0, 1, 2].map((i) => (
              <Skeleton key={i} variant='rounded' height={120} />
            ))}
          {!fetching &&
            filteredSubmissions.map((x) => (
              <RA.Fade key={x.id} triggerOnce cascade>
                <SubmissionCard sid={x.id} submission={x.data()} />
              </RA.Fade>
            ))}
        </Box>
        {!fetching &&
          filteredSubmissions.length === 0 &&
          submissions.length > 0 && (
            <Typography
              variant='body2'
              color='text.secondary'
              textAlign='center'
              mt={2}>
              No submissions match your filters.
            </Typography>
          )}
      </Box>
    </React.Fragment>
  )
}
