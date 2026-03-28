import { QRCodeSVG } from "qrcode.react"
import React from "react"

export default function QRCode({ url }: { url: string }) {
  return (
    <React.Fragment>
      <QRCodeSVG value={url} width={256} height={256} />
    </React.Fragment>
  )
}
