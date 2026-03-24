import {
  Box,
  Container,
  Divider,
  Link as MuiLink,
  Typography,
} from "@mui/material"
import { useNavigate } from "react-router-dom"

const footerLinks = [
  {
    heading: "Product",
    links: [
      { text: "About", action: { type: "scroll" as const, target: "about" } },
      {
        text: "Features",
        action: { type: "scroll" as const, target: "features" },
      },
      { text: "FAQs", action: { type: "scroll" as const, target: "faqs" } },
      {
        text: "Contributors",
        action: { type: "navigate" as const, path: "/contributors" },
      },
    ],
  },
  {
    heading: "Legal",
    links: [
      {
        text: "Privacy Policy",
        action: { type: "navigate" as const, path: "/privacy-policy" },
      },
      {
        text: "Terms of Service",
        action: { type: "navigate" as const, path: "/terms-of-service" },
      },
    ],
  },
]

interface Props {
  onScrollTo?: (target: string) => void
}

export default function Footer({ onScrollTo }: Props) {
  const navigate = useNavigate()

  const handleClick = (
    action: (typeof footerLinks)[number]["links"][number]["action"]
  ) => {
    if (action.type === "scroll" && onScrollTo) {
      onScrollTo(action.target)
    } else if (action.type === "navigate") {
      void navigate(action.path)
      window.scrollTo(0, 0)
    }
  }

  return (
    <Box component='footer' sx={{ mt: 8 }}>
      <Divider />
      <Container maxWidth='md' sx={{ py: 6, textAlign: "left" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: { xs: 4, sm: 2 },
          }}>
          {/* Branding */}
          <Box sx={{ maxWidth: 280 }}>
            <Typography variant='h6' fontWeight={700} sx={{ mb: 1 }}>
              PulseCheck
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ lineHeight: 1.6 }}>
              Real-time classroom polling that keeps every student engaged.
            </Typography>
          </Box>

          {/* Link columns */}
          <Box sx={{ display: "flex", gap: { xs: 6, sm: 8 } }}>
            {footerLinks.map((column) => (
              <Box key={column.heading}>
                <Typography
                  variant='caption'
                  fontWeight={600}
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    color: "text.secondary",
                    mb: 1.5,
                    display: "block",
                  }}>
                  {column.heading}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}>
                  {column.links.map((link) => (
                    <MuiLink
                      key={link.text}
                      component='button'
                      variant='body2'
                      underline='none'
                      onClick={() => handleClick(link.action)}
                      sx={{
                        color: "text.secondary",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "color 0.2s",
                        "&:hover": { color: "primary.main" },
                      }}>
                      {link.text}
                    </MuiLink>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Copyright */}
        <Divider sx={{ my: 4 }} />
        <Typography variant='body2' color='text.secondary' textAlign='center'>
          &copy; {new Date().getFullYear()} PulseCheck. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}
