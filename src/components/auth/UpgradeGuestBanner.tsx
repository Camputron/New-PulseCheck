import { Alert, Button, Stack, Typography } from "@mui/material"

interface Props {
  onUpgrade: () => void
}

export default function UpgradeGuestBanner(props: Props) {
  const { onUpgrade } = props
  return (
    <Alert
      severity="info"
      variant="outlined"
      sx={{
        // borderRadius: 2,
        alignItems: "center",
        "& .MuiAlert-action": { alignItems: "center", pt: 0, mr: 0 },
      }}
      action={
        <Button
          color="primary"
          variant="text"
          size="small"
          onClick={onUpgrade}
          sx={{ textTransform: "none", fontWeight: 600 }}>
          Save my results
        </Button>
      }>
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" fontWeight={700}>
          Save your results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create an account to keep this session&apos;s results. Earlier guest
          sessions on this device won&apos;t be included.
        </Typography>
      </Stack>
    </Alert>
  )
}
