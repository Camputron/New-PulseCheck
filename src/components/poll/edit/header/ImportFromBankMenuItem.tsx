import { Inventory2 } from "@mui/icons-material"
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material"
import { useState } from "react"
import ImportFromBankDialog from "./ImportFromBankDialog"

interface ImportFromBankMenuItemProps {
  pid: string
  onClick?: () => void
  mobile?: boolean
}

export default function ImportFromBankMenuItem(
  props: ImportFromBankMenuItemProps,
) {
  const { pid, onClick, mobile } = props
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    onClick?.()
    setOpen(true)
  }

  return (
    <>
      <MenuItem onClick={handleClick} sx={mobile ? { py: 1.5 } : undefined}>
        <ListItemIcon>
          <Inventory2 />
        </ListItemIcon>
        <ListItemText>Import from Bank</ListItemText>
      </MenuItem>
      <ImportFromBankDialog
        open={open}
        onClose={() => setOpen(false)}
        pid={pid}
      />
    </>
  )
}
