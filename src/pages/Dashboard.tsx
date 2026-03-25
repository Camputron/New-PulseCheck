import { useNavigate } from "react-router-dom"
import { Button, Box, Container, Typography } from "@mui/material"
import api from "@/api"
import { useAuthContext } from "@/hooks"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import UserPollCard from "@/components/dashboard/UserPollCard"
import { Add, HowToVote } from "@mui/icons-material"
import MostRecentGaugeCard from "@/components/graphs/MostRecentGaugeCard"
import useRequireAuth from "@/hooks/useRequireAuth"
import { RA } from "@/styles"

export default function Dashboard() {
  useRequireAuth({ blockGuests: true })
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [polls] = useCollectionOnce(api.polls.queryUserPolls(user?.uid ?? "1"))

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

  return (
    <Container maxWidth='md' sx={{ py: { xs: 3, md: 5 } }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant='overline'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          Home
        </Typography>
        <Typography variant='h4' fontWeight={700} sx={{ mb: 4 }}>
          Dashboard
        </Typography>
      </RA.Fade>

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
          variant='contained'
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
          variant='outlined'
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

      {polls && polls.docs.length > 0 && (
        <Typography variant='h6' fontWeight={600} sx={{ mt: 5, mb: 2 }}>
          Your Polls
        </Typography>
      )}
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
        {polls?.docs.map((x) => (
          <UserPollCard key={x.id} pid={x.id} poll={x.data()} />
        ))}
      </Box>
    </Container>
  )
}
