import { Box, Divider, IconButton, Stack, Typography } from "@mui/material"
import { DarkMode, LightMode } from "@mui/icons-material"
import { useThemeContext } from "@/hooks/useThemeContext"

// HSL-based color scales for the proposed design system
const teal = {
  50: "hsl(174, 80%, 95%)",
  100: "hsl(174, 80%, 90%)",
  200: "hsl(174, 80%, 80%)",
  300: "hsl(174, 80%, 65%)",
  400: "hsl(174, 80%, 42%)",
  500: "hsl(174, 85%, 35%)",
  600: "hsl(174, 90%, 28%)",
  700: "hsl(174, 95%, 22%)",
  800: "hsl(174, 100%, 15%)",
  900: "hsl(174, 100%, 10%)",
}

const amber = {
  50: "hsl(45, 100%, 96%)",
  100: "hsl(45, 100%, 90%)",
  200: "hsl(45, 100%, 80%)",
  300: "hsl(45, 95%, 65%)",
  400: "hsl(45, 95%, 50%)",
  500: "hsl(45, 95%, 43%)",
  600: "hsl(40, 96%, 36%)",
  700: "hsl(38, 97%, 28%)",
  800: "hsl(35, 100%, 20%)",
  900: "hsl(33, 100%, 14%)",
}

const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 25%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 15%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 10%)",
  900: "hsl(220, 35%, 5%)",
}

const green = {
  50: "hsl(150, 80%, 95%)",
  100: "hsl(150, 75%, 87%)",
  200: "hsl(150, 70%, 72%)",
  300: "hsl(150, 65%, 55%)",
  400: "hsl(150, 70%, 40%)",
  500: "hsl(150, 75%, 32%)",
  600: "hsl(150, 80%, 25%)",
  700: "hsl(150, 85%, 18%)",
  800: "hsl(150, 90%, 12%)",
  900: "hsl(150, 95%, 7%)",
}

const orange = {
  50: "hsl(30, 100%, 96%)",
  100: "hsl(30, 95%, 88%)",
  200: "hsl(28, 90%, 76%)",
  300: "hsl(25, 90%, 62%)",
  400: "hsl(22, 90%, 50%)",
  500: "hsl(20, 92%, 42%)",
  600: "hsl(18, 95%, 34%)",
  700: "hsl(16, 97%, 26%)",
  800: "hsl(14, 100%, 18%)",
  900: "hsl(12, 100%, 12%)",
}

const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 90%, 90%)",
  200: "hsl(0, 85%, 80%)",
  300: "hsl(0, 80%, 68%)",
  400: "hsl(0, 80%, 55%)",
  500: "hsl(0, 80%, 45%)",
  600: "hsl(0, 85%, 36%)",
  700: "hsl(0, 90%, 28%)",
  800: "hsl(0, 95%, 20%)",
  900: "hsl(0, 100%, 12%)",
}

type ScaleKey =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"

function ColorScale({
  name,
  scale,
}: {
  name: string
  scale: Record<string, string>
}) {
  const steps: ScaleKey[] = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ]
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={600}
        sx={{ mb: 0.5, display: "block" }}>
        {name}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        {steps.map((step) => {
          const isDarkStep = Number(step) >= 400
          return (
            <Box
              key={step}
              sx={{
                bgcolor: scale[step],
                color: isDarkStep ? "white" : gray[900],
                width: "100%",
                height: 56,
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                pb: 0.5,
                border: "1px solid",
                borderColor: "divider",
              }}>
              <Typography variant="caption" fontSize="0.6rem" fontWeight={500}>
                {step}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{
        fontWeight: 700,
        letterSpacing: 1,
        color: "text.secondary",
        mt: 4,
        mb: 2,
        display: "block",
        fontSize: "0.8rem",
      }}>
      {children}
    </Typography>
  )
}

export default function DesignSystemTab() {
  const { mode, toggleTheme } = useThemeContext()
  const isDark = mode === "dark"

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            fontFamily="Inter, sans-serif">
            PulseCheck Design System
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontFamily="Inter, sans-serif">
            Teal Primary + Amber/Gold Secondary — Inter Font — MUI v7 Template
            Style
          </Typography>
        </Box>
        <IconButton onClick={toggleTheme} size="large">
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* COLOR PALETTE */}
      <SectionTitle>Color Palette</SectionTitle>
      <Stack spacing={2}>
        <ColorScale name="Teal (Primary)" scale={teal} />
        <ColorScale name="Amber (Secondary)" scale={amber} />
        <ColorScale name="Gray (Neutral)" scale={gray} />
        <ColorScale name="Green (Success)" scale={green} />
        <ColorScale name="Orange (Warning)" scale={orange} />
        <ColorScale name="Red (Error)" scale={red} />
      </Stack>
    </Box>
  )
}
