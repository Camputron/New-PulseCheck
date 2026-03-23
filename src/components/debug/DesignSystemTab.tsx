import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import {
  Add,
  CheckCircle,
  Close,
  DarkMode,
  Edit,
  LightMode,
  PlayArrow,
  Search,
  TrendingUp,
} from "@mui/icons-material"
import { useThemeContext } from "@/lib/hooks/useThemeContext"

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
        variant='caption'
        fontWeight={600}
        sx={{ mb: 0.5, display: "block" }}>
        {name}
      </Typography>
      <Stack direction='row' spacing={0.5}>
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
              <Typography variant='caption' fontSize='0.6rem' fontWeight={500}>
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
      variant='overline'
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
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 1 }}>
        <Box>
          <Typography
            variant='h4'
            fontWeight={700}
            fontFamily='Inter, sans-serif'>
            PulseCheck Design System
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            fontFamily='Inter, sans-serif'>
            Teal Primary + Amber/Gold Secondary — Inter Font — MUI v7 Template
            Style
          </Typography>
        </Box>
        <IconButton onClick={toggleTheme} size='large'>
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* COLOR PALETTE */}
      <SectionTitle>Color Palette</SectionTitle>
      <Stack spacing={2}>
        <ColorScale name='Teal (Primary)' scale={teal} />
        <ColorScale name='Amber (Secondary)' scale={amber} />
        <ColorScale name='Gray (Neutral)' scale={gray} />
        <ColorScale name='Green (Success)' scale={green} />
        <ColorScale name='Orange (Warning)' scale={orange} />
        <ColorScale name='Red (Error)' scale={red} />
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* OLD vs NEW */}
      <SectionTitle>Old vs New</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        {/* Old */}
        <Paper
          variant='outlined'
          sx={{
            p: 2.5,
            borderWidth: 2,
            borderColor: "divider",
          }}>
          <Chip
            label='CURRENT'
            size='small'
            sx={{ mb: 1.5, fontWeight: 700 }}
          />
          <Stack direction='row' spacing={1} sx={{ mb: 1.5 }}>
            <Button
              variant='contained'
              sx={{
                bgcolor: "#00796B",
                fontFamily: "monospace",
                "&:hover": { bgcolor: "#004D40" },
              }}>
              Primary #00796B
            </Button>
            <Button
              variant='contained'
              sx={{
                bgcolor: "#EC407A",
                fontFamily: "monospace",
                "&:hover": { bgcolor: "#C2185B" },
              }}>
              Secondary Pink
            </Button>
          </Stack>
          <Typography
            variant='body2'
            color='text.secondary'
            fontFamily='monospace'
            fontSize='0.8rem'>
            Monospace font — flat colors — no gradients — default MUI elevation
          </Typography>
        </Paper>

        {/* New */}
        <Paper
          variant='outlined'
          sx={{
            p: 2.5,
            borderWidth: 2,
            borderColor: teal[300],
            ...(isDark && { borderColor: teal[700] }),
          }}>
          <Chip
            label='PROPOSED'
            size='small'
            sx={{
              mb: 1.5,
              fontWeight: 700,
              bgcolor: teal[50],
              color: teal[700],
              ...(isDark && { bgcolor: teal[900], color: teal[300] }),
            }}
          />
          <Stack direction='row' spacing={1} sx={{ mb: 1.5 }}>
            <Button
              variant='contained'
              sx={{
                background: `linear-gradient(to bottom, ${teal[400]}, ${teal[500]})`,
                fontFamily: "Inter, sans-serif",
                boxShadow: `inset 0 1px 0 hsla(174, 80%, 80%, 0.25), inset 0 -1px 0 hsla(174, 100%, 10%, 0.2)`,
                "&:hover": { background: teal[500] },
              }}>
              Primary Teal
            </Button>
            <Button
              variant='contained'
              sx={{
                background: `linear-gradient(to bottom, ${amber[400]}, ${amber[500]})`,
                color: gray[900],
                fontFamily: "Inter, sans-serif",
                boxShadow: `inset 0 1px 0 hsla(45, 100%, 80%, 0.3), inset 0 -1px 0 hsla(45, 95%, 30%, 0.2)`,
                "&:hover": { background: amber[500] },
              }}>
              Secondary Amber
            </Button>
          </Stack>
          <Typography
            variant='body2'
            color='text.secondary'
            fontFamily='Inter, sans-serif'
            fontSize='0.8rem'>
            Inter font — gradient buttons — HSL scales — elevation 0 + borders
          </Typography>
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* EXAMPLE UI COMPONENTS */}
      <SectionTitle>Example UI Components</SectionTitle>

      {/* AppBar Preview */}
      <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
        AppBar (Glass-morphism)
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          px: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backdropFilter: "blur(24px)",
          bgcolor: isDark ? "hsla(220, 35%, 5%, 0.7)" : "hsla(0, 0%, 99%, 0.7)",
        }}>
        <Typography
          fontWeight={700}
          color={teal[500]}
          fontFamily='Inter, sans-serif'>
          PulseCheck
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          size='small'
          sx={{ color: "text.secondary", fontFamily: "Inter, sans-serif" }}>
          Dashboard
        </Button>
        <Button
          size='small'
          sx={{ color: "text.secondary", fontFamily: "Inter, sans-serif" }}>
          Join Poll
        </Button>
        <Button
          size='small'
          sx={{ color: "text.secondary", fontFamily: "Inter, sans-serif" }}>
          History
        </Button>
        <Avatar
          sx={{
            bgcolor: teal[400],
            width: 32,
            height: 32,
            fontSize: "0.8rem",
          }}>
          MC
        </Avatar>
      </Paper>

      {/* Buttons */}
      <Paper
        variant='outlined'
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
        <Typography variant='subtitle2' fontWeight={600}>
          Buttons
        </Typography>
        <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
          <Button
            variant='contained'
            startIcon={<PlayArrow />}
            sx={{
              background: `linear-gradient(to bottom, ${teal[400]}, ${teal[500]})`,
              boxShadow: `inset 0 1px 0 hsla(174, 80%, 80%, 0.25), inset 0 -1px 0 hsla(174, 100%, 10%, 0.2)`,
              borderRadius: 2,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              "&:hover": { background: teal[500] },
            }}>
            Start Session
          </Button>

          <Button
            variant='contained'
            startIcon={<Add />}
            sx={{
              background: `linear-gradient(to bottom, ${amber[400]}, ${amber[500]})`,
              color: gray[900],
              boxShadow: `inset 0 1px 0 hsla(45, 100%, 80%, 0.3), inset 0 -1px 0 hsla(45, 95%, 30%, 0.2)`,
              borderRadius: 2,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              "&:hover": { background: amber[500] },
            }}>
            Generate Questions
          </Button>

          <Button
            variant='contained'
            sx={{
              background: isDark
                ? `linear-gradient(to bottom, ${gray[100]}, ${gray[50]})`
                : `linear-gradient(to bottom, ${gray[700]}, ${gray[800]})`,
              color: isDark ? gray[900] : "white",
              borderRadius: 2,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              "&:hover": {
                background: isDark ? gray[200] : gray[800],
              },
            }}>
            Create Poll
          </Button>

          <Button
            variant='outlined'
            sx={{
              borderColor: isDark ? gray[600] : gray[200],
              color: isDark ? gray[300] : gray[700],
              borderRadius: 2,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              "&:hover": { bgcolor: isDark ? gray[700] : gray[50] },
            }}>
            Cancel
          </Button>

          <Button
            sx={{
              color: teal[500],
              borderRadius: 2,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              "&:hover": {
                bgcolor: isDark ? "hsla(174, 80%, 42%, 0.1)" : teal[50],
              },
            }}>
            Learn More
          </Button>
        </Stack>
      </Paper>

      {/* Stat Cards + Inputs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 3,
        }}>
        {/* Stat Card - Sessions */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "all 100ms ease",
            "&:hover": {
              boxShadow: isDark
                ? "0 4px 16px hsla(220, 30%, 5%, 0.5)"
                : "0 4px 16px hsla(220, 30%, 5%, 0.07)",
            },
          }}>
          <Typography variant='caption' color='text.secondary' fontWeight={500}>
            Total Sessions
          </Typography>
          <Stack direction='row' alignItems='baseline' spacing={1}>
            <Typography
              variant='h4'
              fontWeight={700}
              sx={{ color: teal[isDark ? "300" : "500"] }}>
              142
            </Typography>
            <Typography variant='caption' fontWeight={500} color={green[500]}>
              <TrendingUp
                sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }}
              />
              +12% this week
            </Typography>
          </Stack>
          <LinearProgress
            variant='determinate'
            value={72}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: isDark ? gray[700] : gray[200],
              "& .MuiLinearProgress-bar": {
                bgcolor: teal[400],
                borderRadius: 3,
              },
            }}
          />
        </Paper>

        {/* Stat Card - Avg Score */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "all 100ms ease",
            "&:hover": {
              boxShadow: isDark
                ? "0 4px 16px hsla(220, 30%, 5%, 0.5)"
                : "0 4px 16px hsla(220, 30%, 5%, 0.07)",
            },
          }}>
          <Typography variant='caption' color='text.secondary' fontWeight={500}>
            Average Score
          </Typography>
          <Stack direction='row' alignItems='baseline' spacing={1}>
            <Typography
              variant='h4'
              fontWeight={700}
              sx={{ color: amber[isDark ? "300" : "500"] }}>
              78.4%
            </Typography>
            <Typography variant='caption' fontWeight={500} color={green[500]}>
              <TrendingUp
                sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }}
              />
              +3.2%
            </Typography>
          </Stack>
          <LinearProgress
            variant='determinate'
            value={78}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: isDark ? gray[700] : gray[200],
              "& .MuiLinearProgress-bar": {
                bgcolor: amber[400],
                borderRadius: 3,
              },
            }}
          />
        </Paper>

        {/* Inputs */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          <Typography variant='subtitle2' fontWeight={600}>
            Inputs
          </Typography>
          <TextField
            placeholder='Enter room code...'
            size='small'
            fullWidth
            InputProps={{
              sx: {
                borderRadius: 2,
                fontFamily: "Inter, sans-serif",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: teal[400],
                  boxShadow: `0 0 0 3px hsla(174, 80%, 42%, 0.2)`,
                },
              },
            }}
          />
          <TextField
            placeholder='Search polls...'
            size='small'
            fullWidth
            InputProps={{
              startAdornment: (
                <Search sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
              ),
              sx: {
                borderRadius: 2,
                fontFamily: "Inter, sans-serif",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: teal[400],
                  boxShadow: `0 0 0 3px hsla(174, 80%, 42%, 0.2)`,
                },
              },
            }}
          />
        </Paper>

        {/* Chips */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          <Typography variant='subtitle2' fontWeight={600}>
            Chips
          </Typography>
          <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap>
            <Chip
              label='Default'
              size='small'
              variant='outlined'
              sx={{ borderRadius: 999, fontFamily: "Inter, sans-serif" }}
            />
            <Chip
              label='Active'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? teal[900] : teal[50],
                color: isDark ? teal[300] : teal[600],
                border: "1px solid",
                borderColor: isDark ? teal[600] : teal[300],
              }}
            />
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label='Correct'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? green[900] : green[50],
                color: isDark ? green[300] : green[600],
                border: "1px solid",
                borderColor: isDark ? green[600] : green[300],
                "& .MuiChip-icon": { color: "inherit" },
              }}
            />
            <Chip
              icon={<Close sx={{ fontSize: 16 }} />}
              label='Incorrect'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? red[900] : red[50],
                color: isDark ? red[300] : red[500],
                border: "1px solid",
                borderColor: isDark ? red[600] : red[300],
                "& .MuiChip-icon": { color: "inherit" },
              }}
            />
            <Chip
              label='Pending'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? orange[900] : orange[50],
                color: isDark ? orange[300] : orange[600],
                border: "1px solid",
                borderColor: isDark ? orange[600] : orange[300],
              }}
            />
          </Stack>
          <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap>
            <Chip
              label='OPEN'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? teal[900] : teal[50],
                color: isDark ? teal[300] : teal[600],
                border: "1px solid",
                borderColor: isDark ? teal[600] : teal[300],
              }}
            />
            <Chip
              label='IN_PROGRESS'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? green[900] : green[50],
                color: isDark ? green[300] : green[600],
                border: "1px solid",
                borderColor: isDark ? green[600] : green[300],
              }}
            />
            <Chip
              label='DONE'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? orange[900] : orange[50],
                color: isDark ? orange[300] : orange[600],
                border: "1px solid",
                borderColor: isDark ? orange[600] : orange[300],
              }}
            />
            <Chip
              label='FINISHED'
              size='small'
              variant='outlined'
              sx={{ borderRadius: 999, fontFamily: "Inter, sans-serif" }}
            />
            <Chip
              label='CLOSED'
              size='small'
              sx={{
                borderRadius: 999,
                fontFamily: "Inter, sans-serif",
                bgcolor: isDark ? red[900] : red[50],
                color: isDark ? red[300] : red[500],
                border: "1px solid",
                borderColor: isDark ? red[600] : red[300],
              }}
            />
          </Stack>
        </Paper>
      </Box>

      {/* Alerts */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 3,
        }}>
        <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 2 }}>
          Alerts
        </Typography>
        <Stack spacing={1}>
          <Alert
            severity='success'
            sx={{
              borderRadius: 2,
              fontFamily: "Inter, sans-serif",
              border: "1px solid",
              borderColor: isDark ? green[700] : green[200],
              bgcolor: isDark ? "hsla(150, 70%, 15%, 0.3)" : green[50],
            }}>
            Session completed successfully — 24 participants responded
          </Alert>
          <Alert
            severity='warning'
            sx={{
              borderRadius: 2,
              fontFamily: "Inter, sans-serif",
              border: "1px solid",
              borderColor: isDark ? orange[700] : orange[200],
              bgcolor: isDark ? "hsla(30, 90%, 15%, 0.3)" : orange[50],
            }}>
            AI generation may take a few seconds...
          </Alert>
          <Alert
            severity='error'
            sx={{
              borderRadius: 2,
              fontFamily: "Inter, sans-serif",
              border: "1px solid",
              borderColor: isDark ? red[700] : red[200],
              bgcolor: isDark ? "hsla(0, 80%, 15%, 0.3)" : red[50],
            }}>
            Failed to join session — room code invalid
          </Alert>
        </Stack>
      </Paper>

      {/* Poll Card + Score Card */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 3,
        }}>
        {/* Poll Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "all 100ms ease",
            "&:hover": {
              boxShadow: isDark
                ? "0 4px 16px hsla(220, 30%, 5%, 0.5)"
                : "0 4px 16px hsla(220, 30%, 5%, 0.07)",
            },
          }}>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Avatar
              sx={{ bgcolor: teal[400], fontFamily: "Inter, sans-serif" }}>
              CS
            </Avatar>
            <Box>
              <Typography
                variant='subtitle2'
                fontWeight={600}
                fontFamily='Inter, sans-serif'>
                CS 300 — Midterm Review
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                5 questions &middot; Multiple choice
              </Typography>
            </Box>
          </Stack>
          <Stack direction='row' spacing={0.75}>
            <Chip
              label='Active'
              size='small'
              sx={{
                borderRadius: 999,
                bgcolor: isDark ? teal[900] : teal[50],
                color: isDark ? teal[300] : teal[600],
                border: "1px solid",
                borderColor: isDark ? teal[600] : teal[300],
              }}
            />
            <Chip
              label='Room: 4821'
              size='small'
              variant='outlined'
              sx={{ borderRadius: 999 }}
            />
          </Stack>
          <Stack direction='row' spacing={1}>
            <Button
              fullWidth
              variant='contained'
              startIcon={<PlayArrow />}
              sx={{
                background: `linear-gradient(to bottom, ${teal[400]}, ${teal[500]})`,
                borderRadius: 2,
                textTransform: "none",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                boxShadow: `inset 0 1px 0 hsla(174, 80%, 80%, 0.25), inset 0 -1px 0 hsla(174, 100%, 10%, 0.2)`,
                "&:hover": { background: teal[500] },
              }}>
              Host Session
            </Button>
            <IconButton
              sx={{
                border: "1px solid",
                borderColor: isDark ? gray[600] : gray[200],
                borderRadius: 2,
              }}>
              <Edit fontSize='small' />
            </IconButton>
          </Stack>
        </Paper>

        {/* Score Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "all 100ms ease",
            "&:hover": {
              boxShadow: isDark
                ? "0 4px 16px hsla(220, 30%, 5%, 0.5)"
                : "0 4px 16px hsla(220, 30%, 5%, 0.07)",
            },
          }}>
          <Typography variant='caption' color='text.secondary' fontWeight={500}>
            Latest Score
          </Typography>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Box
              sx={{
                width: 80,
                height: 44,
                borderRadius: "80px 80px 0 0",
                border: `6px solid ${teal[400]}`,
                borderBottom: "none",
                position: "relative",
                flexShrink: 0,
              }}>
              <Typography
                fontWeight={700}
                fontSize='1.25rem'
                sx={{
                  position: "absolute",
                  bottom: -4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: isDark ? teal[300] : teal[500],
                }}>
                85
              </Typography>
            </Box>
            <Box>
              <Typography
                variant='subtitle2'
                fontWeight={600}
                fontFamily='Inter, sans-serif'>
                Data Structures Quiz
              </Typography>
              <Stack
                direction='row'
                spacing={0.5}
                sx={{ mt: 0.5 }}
                flexWrap='wrap'
                useFlexGap>
                <Chip
                  label='85%'
                  size='small'
                  sx={{
                    borderRadius: 999,
                    bgcolor: isDark ? green[900] : green[50],
                    color: isDark ? green[300] : green[600],
                    border: "1px solid",
                    borderColor: isDark ? green[600] : green[300],
                  }}
                />
                <Chip
                  label='17/20 pts'
                  size='small'
                  variant='outlined'
                  sx={{ borderRadius: 999 }}
                />
                <Chip
                  label='Class avg: 72%'
                  size='small'
                  sx={{
                    borderRadius: 999,
                    bgcolor: isDark ? teal[900] : teal[50],
                    color: isDark ? teal[300] : teal[600],
                    border: "1px solid",
                    borderColor: isDark ? teal[600] : teal[300],
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Data Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          mb: 3,
        }}>
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant='subtitle2' fontWeight={600}>
            Session History
          </Typography>
        </Box>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: isDark ? gray[800] : gray[50],
                  "& th": {
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    borderColor: "divider",
                    fontFamily: "Inter, sans-serif",
                  },
                }}>
                <TableCell>Poll Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Avg Score</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& td": {
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8125rem",
                  borderColor: "divider",
                },
              }}>
              <TableRow>
                <TableCell>CS 300 — Midterm Review</TableCell>
                <TableCell>Mar 22, 2026</TableCell>
                <TableCell>32</TableCell>
                <TableCell>78.4%</TableCell>
                <TableCell>
                  <Chip
                    label='Finished'
                    size='small'
                    variant='outlined'
                    sx={{ borderRadius: 999 }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Algorithms — Week 9 Quiz</TableCell>
                <TableCell>Mar 20, 2026</TableCell>
                <TableCell>28</TableCell>
                <TableCell>82.1%</TableCell>
                <TableCell>
                  <Chip
                    label='Finished'
                    size='small'
                    variant='outlined'
                    sx={{ borderRadius: 999 }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Data Structures Exit Ticket</TableCell>
                <TableCell>Mar 18, 2026</TableCell>
                <TableCell>45</TableCell>
                <TableCell>65.3%</TableCell>
                <TableCell>
                  <Chip
                    label='Closed'
                    size='small'
                    sx={{
                      borderRadius: 999,
                      bgcolor: isDark ? red[900] : red[50],
                      color: isDark ? red[300] : red[500],
                      border: "1px solid",
                      borderColor: isDark ? red[600] : red[300],
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Divider sx={{ my: 3 }} />
      <Typography
        variant='body2'
        color='text.secondary'
        textAlign='center'
        sx={{ mb: 4 }}>
        Toggle dark mode (top-right) to preview both themes
      </Typography>
    </Box>
  )
}
