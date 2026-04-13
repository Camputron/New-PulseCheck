import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import { EmojiEvents, ExpandMore } from "@mui/icons-material"
import { LeaderboardData } from "@/types"
import { stoc, stoni } from "@/utils"

interface LeaderboardAccordionProps {
  leaderboard: LeaderboardData | null | undefined
  isAnonymous: boolean
}

const MAX_ENTRIES = 10

export default function LeaderboardAccordion(props: LeaderboardAccordionProps) {
  const { leaderboard, isAnonymous } = props

  if (!leaderboard || leaderboard.entries.length === 0) {
    return null
  }

  const sorted = [...leaderboard.entries].sort(
    (a, b) => b.cumulativeScore - a.cumulativeScore
  )
  const entries = sorted.slice(0, MAX_ENTRIES)

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: "8px !important",
        "&::before": { display: "none" },
      }}>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 0.5 }}>
        <Stack direction='row' alignItems='center' spacing={1}>
          <EmojiEvents sx={{ color: "secondary.main" }} />
          <Typography fontWeight={600}>Leaderboard</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1, pb: 2 }}>
        <List disablePadding>
          {entries.map((entry, index) => {
            const displayName = isAnonymous
              ? `Player ${index + 1}`
              : entry.displayName
            const rank = index + 1

            return (
              <ListItem key={entry.uid} sx={{ px: 2, py: 0.75 }}>
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
                    src={
                      isAnonymous ? undefined : (entry.photoUrl ?? undefined)
                    }
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
                    fontSize: "0.9rem",
                    noWrap: true,
                  }}
                />
                <Typography fontWeight={700} fontSize='0.9rem'>
                  {entry.cumulativeScore}
                </Typography>
              </ListItem>
            )
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
