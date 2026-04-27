import MenuItem from "@/components/appbar/MenuItem"
import { PictureAsPdf } from "@mui/icons-material"
import { Poll } from "@/types"
import useSnackbar from "@/hooks/useSnackbar"
import fetchPollPDFData from "@/utils/pdf/fetchPollPDFData"
import generatePollPDF from "@/utils/pdf/generatePollPDF"

interface DownloadPDFMenuItemProps {
  poll: Poll
  onClick?: () => void
}

export default function DownloadPDFMenuItem(props: DownloadPDFMenuItemProps) {
  const { poll } = props
  const snackbar = useSnackbar()

  const handleClick = () => {
    if (props.onClick) {
      props.onClick()
    }

    if (poll.questions.length === 0) {
      snackbar.show({
        type: "warning",
        message: "Add questions before downloading PDF",
      })
      return
    }

    async function downloadAsync() {
      try {
        const data = await fetchPollPDFData(poll)
        generatePollPDF(data)
      } catch (err) {
        console.error("Failed to generate PDF", err)
        snackbar.show({
          type: "error",
          message: "Failed to generate PDF",
        })
      }
    }
    void downloadAsync()
  }

  return (
    <MenuItem icon={PictureAsPdf} onClick={handleClick}>
      Download PDF
    </MenuItem>
  )
}
