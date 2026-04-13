import {
  Avatar,
  Box,
  Card,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { EmojiEvents } from "@mui/icons-material"
import { useAuthContext } from "@/hooks"
import { LeaderboardData } from "@/types"
import { stoc, stoni } from "@/utils"

interface LeaderboardCardProps {
  leaderboard: LeaderboardData | null
  isAnonymous: boolean
}

const MAX_ENTRIES = 10

export default function LeaderboardCard(props: LeaderboardCardProps) {
  const { leaderboard, isAnonymous } = props
  const auth = useAuthContext()

  if (!leaderboard || leaderboard.entries.length === 0) {
    return null
  }

  const entries = leaderboard.entries.slice(0, MAX_ENTRIES)

  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        my: 2,
      }}>
      <Stack direction='row' alignItems='center' spacing={1}>
        <EmojiEvents sx={{ color: "secondary.main" }} />
        <Typography variant='h6' fontWeight={600}>
          Leaderboard
        </Typography>
      </Stack>
      <List disablePadding>
        {entries.map((entry, index) => {
          const isCurrentUser = entry.uid === auth.user?.uid
          const displayName = isAnonymous
            ? `Player ${index + 1}`
            : entry.displayName
          const rank = index + 1

          return (
            <ListItem
              key={entry.uid}
              sx={{
                bgcolor: isCurrentUser
                  ? (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)"
                  : "transparent",
                px: 2,
                py: 0.75,
              }}>
              <Typography
                sx={{
                  width: 28,
                  fontWeight: 700,
                  color: rank <= 3 ? "secondary.main" : "text.secondary",
                  fontSize: "0.9rem",
                }}>
                {rank}
              </Typography>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  src={isAnonymous ? undefined : (entry.photoUrl ?? undefined)}
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.8rem",
                    bgcolor: stoc(displayName),
                  }}>
                  {stoni(displayName)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={displayName}
                primaryTypographyProps={{
                  fontWeight: isCurrentUser ? 700 : 400,
                  fontSize: "0.9rem",
                  noWrap: true,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`+${entry.questionScore}`}
                  size='small'
                  color={entry.questionScore > 0 ? "success" : "default"}
                  variant='outlined'
                  sx={{ minWidth: 52 }}
                />
                <Typography
                  fontWeight={700}
                  fontSize='0.9rem'
                  sx={{ minWidth: 48, textAlign: "right" }}>
                  {entry.cumulativeScore}
                </Typography>
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Card>
  )
}
