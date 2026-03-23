import { Divider, MenuList, useMediaQuery, useTheme } from "@mui/material"
import MenuItem from "./MenuItem"
import { Help, HowToReg, Info, Login, Star } from "@mui/icons-material"
import { useAuthContext } from "@/lib/hooks"

interface GuestMenuListProps {
  handleClose?: () => void
}

export default function GuestMenuList(props: GuestMenuListProps) {
  const { handleClose } = props
  const { user, loading, error } = useAuthContext()
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"))

  if (error) {
    console.error(error)
    return <></>
  }

  if (loading) {
    return <></>
  }

  if (user) {
    return <></>
  }

  return (
    <MenuList sx={{ py: 1 }}>
      {isPhone && (
        <>
          <MenuItem
            icon={Info}
            to='/'
            opts={{ state: { scrollTo: "about" } }}
            onClick={handleClose}>
            About
          </MenuItem>
          <MenuItem
            icon={Star}
            to='/'
            opts={{ state: { scrollTo: "features" } }}
            onClick={handleClose}>
            Features
          </MenuItem>
          <MenuItem
            icon={Help}
            to='/'
            opts={{ state: { scrollTo: "faqs" } }}
            onClick={handleClose}>
            FAQs
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
        </>
      )}
      <MenuItem icon={Login} to='/login' onClick={handleClose}>
        Sign In
      </MenuItem>
      <MenuItem icon={HowToReg} to='/register' onClick={handleClose}>
        Register
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem to='/terms-of-service' onClick={handleClose} sx={{ py: 0.75 }}>
        Terms of Service
      </MenuItem>
      <MenuItem to='/privacy-policy' onClick={handleClose} sx={{ py: 0.75 }}>
        Privacy Policy
      </MenuItem>
    </MenuList>
  )
}
