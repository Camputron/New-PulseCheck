import api from "@/api"
import UserBankCard from "@/components/banks/UserBankCard"
import CreateBankDialog from "@/components/banks/CreateBankDialog"
import { useAuthContext } from "@/hooks"
import useRequireAuth from "@/hooks/useRequireAuth"
import { RA } from "@/styles"
import { Add } from "@mui/icons-material"
import { Box, Button, Container, Typography } from "@mui/material"
import { useState } from "react"
import { useCollectionOnce } from "react-firebase-hooks/firestore"

export default function BankManager() {
  useRequireAuth({ blockGuests: true })
  const { user } = useAuthContext()
  const [banks] = useCollectionOnce(api.banks.queryUserBanks(user?.uid ?? "1"))
  const [createOpen, setCreateOpen] = useState(false)

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
          Library
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Question Banks
        </Typography>
      </RA.Fade>

      <Button
        startIcon={<Add />}
        variant="contained"
        fullWidth
        onClick={() => setCreateOpen(true)}
        sx={{
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
        }}>
        New Bank
      </Button>

      {banks && banks.docs.length > 0 && (
        <Typography variant="h6" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
          Your Banks
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
        {banks?.docs.map((x) => (
          <UserBankCard key={x.id} bid={x.id} bank={x.data()} />
        ))}
      </Box>

      {banks && banks.docs.length === 0 && (
        <Box
          sx={{
            mt: 6,
            textAlign: "center",
            color: "text.secondary",
          }}>
          <Typography variant="body2">
            No banks yet. Create one above, or open a poll and use Save to Bank
            on a question.
          </Typography>
        </Box>
      )}

      <CreateBankDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Container>
  )
}
