import { Divider, MenuList, useMediaQuery, useTheme } from "@mui/material"
import MenuItem from "./MenuItem"
import {
  BarChart,
  Dashboard,
  ExitToApp,
  HowToVote,
  Settings,
} from "@mui/icons-material"
import api from "@/lib/api/firebase"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "@/lib/hooks"

interface AuthMenuListProps {
  handleClose: () => void
}

export default function AuthMenuList(props: AuthMenuListProps) {
  const { handleClose } = props
  const navigate = useNavigate()
  const { user, loading, error } = useAuthContext()
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"))

  const handleLogout = () => {
    api.auth
      .logout()
      .then(() => {
        console.debug("logged out user!")
        void navigate("/get-started")
        handleClose()
      })
      .catch((err) => console.debug(err))
  }

  if (error) {
    console.error(error)
    return <></>
  }

  if (loading) {
    return <></>
  }

  if (!user || user?.isAnonymous) {
    return <></>
  }

  return (
    <MenuList sx={{ py: 1 }}>
      {isPhone && (
        <>
          <MenuItem icon={Dashboard} to='/dashboard' onClick={handleClose}>
            Dashboard
          </MenuItem>
          <MenuItem icon={HowToVote} to='/poll/join' onClick={handleClose}>
            Join Poll
          </MenuItem>
          <MenuItem icon={BarChart} to='/poll/history' onClick={handleClose}>
            History
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
        </>
      )}
      <MenuItem icon={Settings} to={"/settings"} onClick={handleClose}>
        Settings
      </MenuItem>
      <MenuItem
        icon={ExitToApp}
        onClick={handleLogout}
        sx={{ color: "error.main" }}>
        Sign Out
      </MenuItem>
    </MenuList>
  )
}
