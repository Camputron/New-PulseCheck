import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import api from "@/api"
import { useAuthContext } from "@/hooks"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import UserPollCard from "@/components/dashboard/UserPollCard"
import UserPollTable from "@/components/dashboard/UserPollTable"
import ViewToggle from "@/components/ViewToggle"
import { Add, HowToVote, Search } from "@mui/icons-material"
import MostRecentGaugeCard from "@/components/graphs/MostRecentGaugeCard"
import useRequireAuth from "@/hooks/useRequireAuth"
import useViewMode from "@/hooks/useViewMode"
import { RA } from "@/styles"
import RejoinBanner from "@/components/poll/join/RejoinBanner"

export default function Dashboard() {
  useRequireAuth({ blockGuests: true })
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [polls] = useCollectionOnce(api.polls.queryUserPolls(user?.uid ?? "1"))

  const { view, effectiveView, isMobile, setView } = useViewMode("polls:view")
  const [query, setQuery] = useState("")

  const handleCreatePoll = () => {
    if (user) {
      const host = api.users.doc(user.uid)
      void api.polls
        .add(host)
        .then((ref) => {
          void navigate(`/poll/${ref.id}/edit`)
        })
        .catch((err) => console.debug(err))
    }
  }

  const handleUserJoin = () => {
    void navigate("/poll/join")
  }

  const rows =
    polls?.docs.map((doc) => ({ id: doc.id, data: doc.data() })) ?? []
  /* filter polls by includes key word */
  const normalizedQuery = query.trim().toLowerCase()
  const filteredRows = normalizedQuery
    ? rows.filter(({ data }) =>
        data.title.toLowerCase().includes(normalizedQuery),
      )
    : rows

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          Home
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Dashboard
        </Typography>
      </RA.Fade>

      <RejoinBanner />
      <MostRecentGaugeCard mrpsd={1} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mt: 3,
        }}>
        <Button
          startIcon={<HowToVote />}
          variant="contained"
          onClick={handleUserJoin}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}>
          Join Poll
        </Button>
        <Button
          startIcon={<Add />}
          variant="outlined"
          fullWidth
          onClick={handleCreatePoll}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}>
          Create Poll
        </Button>
      </Box>

      {rows.length > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 5, mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Your Polls
          </Typography>
          {!isMobile && <ViewToggle value={view} onChange={setView} />}
        </Stack>
      )}

      {/* render filter by text input */}
      {rows.length > 0 && (
        <TextField
          fullWidth
          size="small"
          placeholder="Search polls by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />
      )}

      {filteredRows.length > 0 && effectiveView === "cards" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
          }}>
          {filteredRows.map(({ id, data }) => (
            <UserPollCard key={id} pid={id} poll={data} />
          ))}
        </Box>
      )}

      {filteredRows.length > 0 && effectiveView === "table" && (
        <UserPollTable polls={filteredRows} />
      )}

      {rows.length > 0 && filteredRows.length === 0 && (
        <Box sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">
            No polls match &ldquo;{query}&rdquo;.
          </Typography>
        </Box>
      )}
    </Container>
  )
}
