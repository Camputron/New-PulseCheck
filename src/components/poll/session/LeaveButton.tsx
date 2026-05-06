import { ArrowBack } from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import React, { useState } from "react"

interface Props {
  callback: () => void
  dialogTitle?: string
  dialogContent: string
}

export default function LeaveButton(props: Props) {
  const [open, setOpen] = useState(false)

  const handleLeave = () => {
    props.callback()
    setOpen(false)
  }

  return (
    <React.Fragment>
      <IconButton onClick={() => setOpen(true)}>
        <ArrowBack />
      </IconButton>
      <Dialog open={open}>
        <DialogTitle>{props.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>No</Button>
          <Button color="error" onClick={handleLeave}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
