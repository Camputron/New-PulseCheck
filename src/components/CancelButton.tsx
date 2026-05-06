import { Button } from "@mui/material"
import { ComponentProps } from "react"

export default function CancelButton(props: ComponentProps<typeof Button>) {
  return (
    <Button color="inherit" {...props}>
      Cancel
    </Button>
  )
}
