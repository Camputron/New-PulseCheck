import { useAuthContext } from "@/hooks"
import { Box, Typography } from "@mui/material"
import Image from "mui-image"
import { Link } from "react-router-dom"
import NewBadge from "./NewBadge"

const SZ = 32

export default function AppTitle({ minecraft }: { minecraft?: boolean }) {
  const { user } = useAuthContext()
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      gap={1}
      component={Link}
      to={user && !user.isAnonymous ? "/dashboard" : "/"}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: "inherit",
        textDecoration: "none",
        "&:hover": {
          color: "inherit",
        },
      }}>
      <Box position="relative" display="inline-flex">
        <NewBadge defaultMinecraft={minecraft} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "text.primary",
            pr: `${SZ / 2 + 2}px`,
          }}>
          PulseCheck
        </Typography>
        <Box
          sx={{
            position: "absolute",
            bottom: -8,
            right: -4,
          }}>
          <Image
            src="/favicon.svg"
            width={SZ}
            height={SZ}
            style={{ borderRadius: 4 }}
          />
        </Box>
      </Box>
    </Box>
  )
}
