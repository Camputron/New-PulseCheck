import { Session, SessionState } from "@/types"
import { QRCodeSVG } from "qrcode.react"
import React from "react"

export default function QRCode({
  session,
  url,
}: {
  session?: Session
  url: string
}) {
  if (!session || session.state !== SessionState.OPEN) {
    return <></>
  }

  return (
    <React.Fragment>
      <QRCodeSVG value={url} width={256} height={256} />
    </React.Fragment>
  )
}
