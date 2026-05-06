import { useNavigate } from "react-router-dom"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import api from "@/api"
import { useAuthContext } from "@/hooks"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import UserPollCard from "@/components/dashboard/UserPollCard"
import UserPollTable from "@/components/dashboard/UserPollTable"
import ViewToggle from "@/components/ViewToggle"
import { Add, HowToVote } from "@mui/icons-material"
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

      {rows.length > 0 && effectiveView === "cards" && (
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
          {rows.map(({ id, data }) => (
            <UserPollCard key={id} pid={id} poll={data} />
          ))}
        </Box>
      )}

      {rows.length > 0 && effectiveView === "table" && (
        <UserPollTable polls={rows} />
      )}
    </Container>
  )
}
