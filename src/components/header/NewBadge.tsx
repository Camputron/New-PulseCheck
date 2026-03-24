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

export default function NewBadge({
  defaultMinecraft = false,
}: {
  defaultMinecraft?: boolean
}) {
  const [minecraft, setMinecraft] = useState(defaultMinecraft)

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMinecraft((prev) => !prev)
  }

  if (minecraft) {
    return (
      /* Minecraft-style badge */
      <Typography
        onClick={toggle}
        sx={{
          position: "absolute",
          top: -4,
          left: -12,
          fontSize: "0.65rem",
          color: "#FFFF00",
          textShadow: "1px 1px 0 #040404, 1px 1px 0 #3F3F00",
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
    /* Default badge */
    <Typography
      onClick={toggle}
      sx={() => ({
        position: "absolute",
        top: -11,
        left: -15,
        fontSize: "0.65rem",
        fontWeight: 800,
        lineHeight: 1,
        px: 0.6,
        py: 0.3,
        transform: "rotate(-20deg)",
        transformOrigin: "bottom right",
        cursor: "pointer",
        userSelect: "none",
        zIndex: 1,
      })}>
      New!
    </Typography>
  )
}
