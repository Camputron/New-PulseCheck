import api from "@/api"
import { QuestionBank } from "@/types"
import { ntoq, stoc, tstos } from "@/utils"
import {
  DriveFileRenameOutline,
  Inventory2,
  MoreVert,
  QuestionAnswer,
  DeleteOutline,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  CardActionArea,
  Chip,
  IconButton,
  // ListItemIcon,
  // ListItemText,
  // Menu,
  // MenuItem,
  Typography,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
// import RenameBankDialog from "./RenameBankDialog"
// import DeleteBankDialog from "./DeleteBankDialog"

interface UserBankCardProps {
  bid: string
  bank: QuestionBank
}

export default function UserBankCard(props: UserBankCardProps) {
  const { bid, bank } = props
  const navigate = useNavigate()
  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  // const [renameOpen, setRenameOpen] = useState(false)
  // const [deleteOpen, setDeleteOpen] = useState(false)

  // const bankRef = api.banks.doc(bank.owner.id, bid)

  const handleClick = () => {
    void navigate(`/banks/${bid}`)
  }

  // const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   event.stopPropagation()
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleMenuClose = () => setAnchorEl(null)

  // const openRename = (event: React.MouseEvent<HTMLElement>) => {
  //   event.stopPropagation()
  //   handleMenuClose()
  //   setRenameOpen(true)
  // }

  // const openDelete = (event: React.MouseEvent<HTMLElement>) => {
  //   event.stopPropagation()
  //   handleMenuClose()
  //   setDeleteOpen(true)
  // }

  return (
    <Box sx={{ position: "relative" }}>
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
        <Box display="flex" alignItems="center" gap={1.5} width="100%" pr={4}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: stoc(bank.name),
              flexShrink: 0,
            }}>
            <Inventory2 sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            flex={1}
            textAlign="left">
            {bank.name}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mt="auto"
          pt={1.5}
          width="100%">
          <Chip
            label={ntoq(bank.question_count)}
            size="small"
            icon={<QuestionAnswer fontSize="small" />}
            variant="outlined"
            sx={{ pl: 0.5, fontSize: "0.7rem", height: 22 }}
          />
          <Typography variant="caption" color="text.secondary" ml="auto">
            {tstos(bank.updated_at)}
          </Typography>
        </Box>
      </CardActionArea>
      {/* <IconButton
        size="small"
        onClick={handleMenuOpen}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
        }}
        aria-label="Bank actions">
        <MoreVert fontSize="small" />
      </IconButton> */}
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              minWidth: 180,
            },
          },
        }}>
        <MenuItem onClick={openRename}>
          <ListItemIcon>
            <DriveFileRenameOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={openDelete}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu> */}
      {/* <RenameBankDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        bankRef={bankRef}
        bank={bank}
      />
      <DeleteBankDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        bankRef={bankRef}
        bankName={bank.name}
      /> */}
    </Box>
  )
}
