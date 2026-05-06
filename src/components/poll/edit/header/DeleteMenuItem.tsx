import MenuItem from "@/components/appbar/MenuItem"
import api from "@/api"
import { Delete } from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CancelButton from "@/components/CancelButton"

interface DeleteMenuItemProps {
  pid: string
  onClick?: () => void
}

export default function DeleteMenuItem(props: DeleteMenuItemProps) {
  const { pid } = props
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const onClick = () => {
    setOpen(true)
    if (props.onClick) {
      props.onClick()
    }
  }

  const handleDelete = () => {
    async function deleteAsync() {
      try {
        const pref = api.polls.doc(pid)
        console.debug(pref.path)
        await api.polls.delete(pref)
        void navigate("/dashboard")
      } catch (err) {
        console.debug(err)
      } finally {
        handleClose()
      }
    }
    void deleteAsync()
  }

  const handleClose = () => setOpen(false)
  /* TODO, decouple dialog to header */
  return (
    <>
      <MenuItem icon={Delete} onClick={onClick}>
        Delete
      </MenuItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Are you sure you want to delete me? :("}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose} />
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
