import api from "@/api"
import UserBankCard from "@/components/banks/UserBankCard"
import UserBankTable from "@/components/banks/UserBankTable"
import CreateBankDialog from "@/components/banks/CreateBankDialog"
import ViewToggle from "@/components/ViewToggle"
import { useAuthContext } from "@/hooks"
import useRequireAuth from "@/hooks/useRequireAuth"
import useViewMode from "@/hooks/useViewMode"
import { RA } from "@/styles"
import { Add } from "@mui/icons-material"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useCollectionOnce } from "react-firebase-hooks/firestore"

export default function BankManager() {
  useRequireAuth({ blockGuests: true })
  const { user } = useAuthContext()
  const [banks] = useCollectionOnce(api.banks.queryUserBanks(user?.uid ?? "1"))
  const [createOpen, setCreateOpen] = useState(false)

  const { view, effectiveView, isMobile, setView } = useViewMode("banks:view")

  const rows =
    banks?.docs.map((doc) => ({ id: doc.id, data: doc.data() })) ?? []

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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 5, mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Your Banks
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
            <UserBankCard key={id} bid={id} bank={data} />
          ))}
        </Box>
      )}

      {rows.length > 0 && effectiveView === "table" && (
        <UserBankTable banks={rows} />
      )}

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
