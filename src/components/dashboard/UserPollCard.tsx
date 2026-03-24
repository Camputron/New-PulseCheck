import { Poll } from "@/lib/types"
import { ntoq, stoc, tstos } from "@/utils"
import { Description, QuestionAnswer } from "@mui/icons-material"
import { Avatar, Box, CardActionArea, Chip, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

interface UserPolLCardProps {
  pid: string
  poll: Poll
}

export default function UserPollCard(props: UserPolLCardProps) {
  const { pid, poll } = props
  const navigate = useNavigate()

  const handleClick = () => {
    void navigate(`/poll/${pid}/edit`)
  }

  return (
    <CardActionArea
      onClick={handleClick}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        minHeight: 120,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: (t) =>
            `0 4px 20px ${t.palette.mode === "dark" ? "rgba(0,150,136,0.15)" : "rgba(0,150,136,0.1)"}`,
          transform: "translateY(-2px)",
        },
      }}>
      <Box display='flex' alignItems='center' gap={1.5} width='100%'>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: stoc(poll.title),
            flexShrink: 0,
          }}>
          <Description sx={{ fontSize: 20 }} />
        </Avatar>
        <Typography
          variant='subtitle1'
          fontWeight={700}
          // noWrap
          flex={1}
          textAlign='left'>
          {poll.title}
        </Typography>
      </Box>
      <Box
        display='flex'
        alignItems='center'
        gap={1}
        mt='auto'
        pt={1.5}
        width='100%'>
        <Chip
          label={ntoq(poll.questions.length)}
          size='small'
          icon={<QuestionAnswer fontSize='small' />}
          variant='outlined'
          sx={{ pl: 0.5, fontSize: "0.7rem", height: 22 }}
        />
        <Typography variant='caption' color='text.secondary' ml='auto'>
          {tstos(poll.updated_at)}
        </Typography>
      </Box>
    </CardActionArea>
  )
}
