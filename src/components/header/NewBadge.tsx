import { Typography, keyframes } from "@mui/material"
import { useState } from "react"

const bounce = keyframes`
  0%, 100% {
    transform: rotate(-20deg) scale(1);
  }
  50% {
    transform: rotate(-20deg) scale(1.3);
  }
`

export default function NewBadge() {
  const [minecraft, setMinecraft] = useState(false)

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMinecraft((prev) => !prev)
  }

  if (minecraft) {
    return (
      <Typography
        // variant='caption'
        // fontWeight={900}
        onClick={toggle}
        sx={{
          position: "absolute",
          top: -2,
          left: -10,
          lineHeight: 1,
          color: "#FFFF00",
          textShadow: "1px 1px 0 #3F3F00, -1px -1px 0 #3F3F00",
          transform: "rotate(-20deg) scale(1)",
          transformOrigin: "center center",
          animation: `${bounce} 0.8s ease-in-out infinite`,
          cursor: "pointer",
          userSelect: "none",
        }}>
        New!
      </Typography>
    )
  }

  return (
    <Typography
      // variant='caption'
      onClick={toggle}
      sx={{
        position: "absolute",
        top: -6,
        left: -10,
        lineHeight: 1,
        transform: "rotate(-20deg) scale(1)",
        transformOrigin: "bottom right",
        cursor: "pointer",
        userSelect: "none",
      }}>
      New
    </Typography>
  )
}
