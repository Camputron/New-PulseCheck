import api from "@/api"
import { useAuthContext } from "@/hooks"
import { useSnackbar } from "@/hooks"
import { Session } from "@/types"
import { RA } from "@/styles"
import { Download } from "@mui/icons-material"
import {
  Box,
  Grid2,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { SelectChangeEvent } from "@mui/material/Select"
import { QueryDocumentSnapshot } from "firebase/firestore"
import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import SessionCard from "./SessionCard"

export type SessionSortOption =
  | "date-desc"
  | "date-asc"
  | "score-desc"
  | "score-asc"
  | "participants"
export type SessionDateFilter = "all" | "7d" | "30d" | "90d"

type SortOption = SessionSortOption
type DateFilter = SessionDateFilter

function matchesDateFilter(millis: number, dateFilter: DateFilter): boolean {
  if (dateFilter === "all") return true
  const now = Date.now()
  const days = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 90
  return now - millis < days * 86_400_000
}

function sortSessions(
  a: QueryDocumentSnapshot<Session>,
  b: QueryDocumentSnapshot<Session>,
  sortBy: SortOption
): number {
  const ad = a.data()
  const bd = b.data()
  switch (sortBy) {
    case "date-desc":
      return bd.created_at.toMillis() - ad.created_at.toMillis()
    case "date-asc":
      return ad.created_at.toMillis() - bd.created_at.toMillis()
    case "score-desc":
      return (bd.summary?.average_100 || 0) - (ad.summary?.average_100 || 0)
    case "score-asc":
      return (ad.summary?.average_100 || 0) - (bd.summary?.average_100 || 0)
    case "participants":
      return (
        (bd.summary?.total_participants || 0) -
        (ad.summary?.total_participants || 0)
      )
    default:
      return 0
  }
}

function exportSessionsCSV(sessions: QueryDocumentSnapshot<Session>[]) {
  const header = "Title,Date,Participants,Avg Score,State\n"
  const rows = sessions.map((x) => {
    const d = x.data()
    const date = d.created_at.toDate().toISOString().split("T")[0]
    const participants = d.summary?.total_participants || 0
    const rawAvg = d.summary?.average_100
    const avg =
      rawAvg !== undefined && isFinite(rawAvg) ? rawAvg.toFixed(1) : "N/A"
    const title = d.title.replace(/,/g, ";")
    return `${title},${date},${participants},${avg},${d.state}`
  })
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "sessions.csv"
  a.click()
  URL.revokeObjectURL(url)
}

interface PollSessionHistoryProps {
  query: string
  sort: string
  dateFilter: string
  onParamChange: (
    key: string,
    value: string,
    defaults?: Record<string, string>
  ) => void
}

export default function PollSessionHistory(props: PollSessionHistoryProps) {
  const { query, sort, dateFilter: dateFilterParam, onParamChange } = props
  const { user, loading } = useAuthContext()
  const snackbar = useSnackbar()
  const [sessions, setSessions] = useState<QueryDocumentSnapshot<Session>[]>([])
  const [filteredSessions, setFilteredSessions] = useState<
    QueryDocumentSnapshot<Session>[]
  >([])
  const sortBy = (sort || "date-desc") as SortOption
  const dateFilter = (dateFilterParam || "7d") as DateFilter
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = sessions
        .filter((x) => {
          const d = x.data()
          const matchesText = d.title
            .toLowerCase()
            .includes(query.toLowerCase())
          const matchesDate = matchesDateFilter(
            d.created_at.toMillis(),
            dateFilter
          )
          return matchesText && matchesDate
        })
        .sort((a, b) => sortSessions(a, b, sortBy))
      setFilteredSessions(filtered)
    }, 250)
    return () => clearTimeout(timeout)
  }, [query, sessions, sortBy, dateFilter])

  useEffect(() => {
    if (user && !loading) {
      setFetching(true)
      api.sessions
        .findUserSessions(user.uid)
        .then((x) => {
          setSessions(x)
        })
        .catch(() => {
          snackbar.show({ message: "Failed to load sessions", type: "error" })
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
          placeholder='Search your poll sessions by name...'
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
            <MenuItem value='score-desc'>Highest avg score</MenuItem>
            <MenuItem value='score-asc'>Lowest avg score</MenuItem>
            <MenuItem value='participants'>Most participants</MenuItem>
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
            Showing {filteredSessions.length} of {sessions.length}
          </Typography>
          {filteredSessions.length > 0 && (
            <Tooltip title='Export CSV'>
              <IconButton
                size='small'
                onClick={() => exportSessionsCSV(filteredSessions)}>
                <Download fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Grid2 container spacing={2}>
          {fetching &&
            [0, 1, 2].map((i) => (
              <Grid2 key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant='rounded' height={120} />
              </Grid2>
            ))}
          {!fetching &&
            filteredSessions.map((x) => (
              <Grid2 key={x.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <RA.Fade triggerOnce cascade>
                  <SessionCard sid={x.id} session={x.data()} />
                </RA.Fade>
              </Grid2>
            ))}
        </Grid2>
        {!fetching && filteredSessions.length === 0 && sessions.length > 0 && (
          <Typography
            variant='body2'
            color='text.secondary'
            textAlign='center'
            mt={2}>
            No sessions match your filters.
          </Typography>
        )}
      </Box>
    </React.Fragment>
  )
}
