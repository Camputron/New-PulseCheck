import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  Add,
  ArrowBack,
  BarChart,
  CheckCircle,
  Close,
  DarkMode,
  Delete,
  Description,
  Edit,
  ExpandMore,
  Home,
  Inbox,
  LightMode,
  Mail,
  Notifications,
  Person,
  PlayArrow,
  Search,
  Settings,
  Star,
} from "@mui/icons-material"
import { useThemeContext } from "@/lib/hooks/useThemeContext"
import { useState, type SyntheticEvent } from "react"

// PulseCheck components (standalone-renderable)
import AsyncButton from "@/components/AsyncButton"
import NewBadge from "@/components/header/NewBadge"
import AuthBranding from "@/components/auth/AuthBranding"
import RecentPollCard from "@/components/dashboard/RecentPollCard"
import PulseGauge from "@/components/graphs/PulseGauge"
import SessionGaugeCard from "@/components/graphs/SessionGaugeCard"
import PollMetricsCard from "@/components/poll/results/PollMetricsCard"
import UserAvatar from "@/components/poll/results/UserAvatar"
import LeaveButton from "@/components/poll/session/LeaveButton"
import Features from "@/components/splash/Features"
import About from "@/components/splash/About"
import FAQs from "@/components/splash/FAQs"
import { SessionSummary } from "@/lib/types"
import { Timestamp } from "firebase/firestore"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant='overline'
      sx={{
        fontWeight: 700,
        letterSpacing: 1,
        color: "text.secondary",
        mt: 5,
        mb: 2,
        display: "block",
        fontSize: "0.8rem",
      }}>
      {children}
    </Typography>
  )
}

function ShowcaseCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Paper
      variant='outlined'
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
      <Typography variant='subtitle2' fontWeight={600}>
        {title}
      </Typography>
      {children}
    </Paper>
  )
}

// Mock data
const mockSummary: SessionSummary = {
  total_participants: 32,
  median: 16,
  median_100: 76,
  average: 15.2,
  average_100: 72,
  low: 8,
  low_100: 38,
  high: 20,
  high_100: 95,
  lower_quartile: 12,
  lower_quartile_100: 57,
  upper_quartile: 18,
  upper_quartile_100: 86,
  max_score: 21,
}

export default function ComponentShowcaseTab() {
  const { mode, toggleTheme } = useThemeContext()
  const isDark = mode === "dark"

  // Local state for interactive demos
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [toggleValue, setToggleValue] = useState("list")
  const [switchChecked, setSwitchChecked] = useState(true)
  const [selectValue, setSelectValue] = useState("option1")

  return (
    <Box>
      {/* Header */}
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 1 }}>
        <Box>
          <Typography variant='h4' fontWeight={700}>
            Component Showcase
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            All MUI + PulseCheck components rendered with the current theme
          </Typography>
        </Box>
        <IconButton onClick={toggleTheme} size='large'>
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ═══════════════════════════════════════════
          MUI COMPONENTS
          ═══════════════════════════════════════════ */}

      <Typography variant='h5' fontWeight={700} sx={{ mb: 1 }}>
        MUI Components
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Standard Material UI components styled by the theme customizations
      </Typography>

      {/* BUTTONS */}
      <SectionTitle>Buttons</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title='Contained Buttons'>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <Button variant='contained' color='primary'>
              Primary
            </Button>
            <Button variant='contained' color='secondary'>
              Secondary
            </Button>
            <Button variant='contained' disabled>
              Disabled
            </Button>
            <Button
              variant='contained'
              color='primary'
              startIcon={<PlayArrow />}>
              Start
            </Button>
            <Button variant='contained' color='secondary' startIcon={<Add />}>
              Generate
            </Button>
          </Stack>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <Button variant='contained' color='primary' size='small'>
              Small
            </Button>
            <Button variant='contained' color='primary' size='medium'>
              Medium
            </Button>
          </Stack>
        </ShowcaseCard>

        <ShowcaseCard title='Outlined Buttons'>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <Button variant='outlined'>Default</Button>
            <Button variant='outlined' color='secondary'>
              Secondary
            </Button>
            <Button variant='outlined' disabled>
              Disabled
            </Button>
            <Button variant='outlined' startIcon={<Edit />}>
              Edit
            </Button>
            <Button variant='outlined' color='secondary' startIcon={<Star />}>
              Favorite
            </Button>
          </Stack>
        </ShowcaseCard>

        <ShowcaseCard title='Text Buttons'>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <Button variant='text'>Default</Button>
            <Button variant='text' color='secondary'>
              Secondary
            </Button>
            <Button variant='text' disabled>
              Disabled
            </Button>
            <Button variant='text' startIcon={<ArrowBack />}>
              Back
            </Button>
          </Stack>
        </ShowcaseCard>

        <ShowcaseCard title='Icon Buttons'>
          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <IconButton size='small'>
              <Edit fontSize='small' />
            </IconButton>
            <IconButton size='medium'>
              <Delete />
            </IconButton>
            <IconButton size='small'>
              <Search fontSize='small' />
            </IconButton>
            <IconButton size='small'>
              <Settings fontSize='small' />
            </IconButton>
            <IconButton disabled size='small'>
              <Close fontSize='small' />
            </IconButton>
          </Stack>
        </ShowcaseCard>
      </Box>

      {/* INPUTS */}
      <SectionTitle>Inputs & Form Controls</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title='Text Fields'>
          <TextField placeholder='Default input' size='small' fullWidth />
          <TextField placeholder='Medium input' size='medium' fullWidth />
          <TextField placeholder='Room Code' size='small' fullWidth />
          <TextField placeholder='Disabled' size='small' fullWidth disabled />
          <TextField
            placeholder='With error'
            size='small'
            fullWidth
            error
            helperText='This field is required'
          />
        </ShowcaseCard>

        <ShowcaseCard title='Select, Checkbox, Radio, Switch'>
          <Select
            size='small'
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            fullWidth>
            <MenuItem value='option1'>Multiple Choice</MenuItem>
            <MenuItem value='option2'>Multi-Select</MenuItem>
            <MenuItem value='option3'>Ranking Poll</MenuItem>
          </Select>
          <Stack direction='row' spacing={1} alignItems='center'>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label='Option A'
            />
            <FormControlLabel control={<Checkbox />} label='Option B' />
            <FormControlLabel
              control={<Checkbox disabled />}
              label='Disabled'
            />
          </Stack>
          <RadioGroup row defaultValue='a'>
            <FormControlLabel value='a' control={<Radio />} label='Choice A' />
            <FormControlLabel value='b' control={<Radio />} label='Choice B' />
            <FormControlLabel
              value='c'
              control={<Radio disabled />}
              label='Disabled'
            />
          </RadioGroup>
          <Stack direction='row' spacing={2} alignItems='center'>
            <FormControlLabel
              control={
                <Switch
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                />
              }
              label='Timer'
            />
            <FormControlLabel control={<Switch disabled />} label='Disabled' />
          </Stack>
        </ShowcaseCard>

        <ShowcaseCard title='Toggle Buttons'>
          <ToggleButtonGroup
            value={toggleValue}
            exclusive
            onChange={(_, val: string | null) => {
              if (val) setToggleValue(val)
            }}>
            <ToggleButton value='list'>List</ToggleButton>
            <ToggleButton value='grid'>Grid</ToggleButton>
            <ToggleButton value='chart'>Chart</ToggleButton>
          </ToggleButtonGroup>
        </ShowcaseCard>
      </Box>

      {/* CHIPS */}
      <SectionTitle>Chips</SectionTitle>
      <ShowcaseCard title='Chip Variants & Colors'>
        <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap>
          <Chip label='Default' />
          <Chip label='Success' color='success' />
          <Chip label='Error' color='error' />
          <Chip label='Default Outlined' variant='outlined' />
          <Chip label='With Icon' icon={<CheckCircle />} color='success' />
          <Chip
            label='Deletable'
            onDelete={() => {
              /* noop demo */
            }}
          />
          <Chip
            label='Clickable'
            onClick={() => {
              /* noop demo */
            }}
          />
          <Chip avatar={<Avatar>MC</Avatar>} label='With Avatar' />
        </Stack>
        <Stack direction='row' spacing={0.75} flexWrap='wrap' useFlexGap>
          <Chip label='Small' size='small' />
          <Chip label='Small Success' size='small' color='success' />
          <Chip label='Small Error' size='small' color='error' />
          <Chip label='Medium' size='medium' />
          <Chip label='Medium Success' size='medium' color='success' />
        </Stack>
      </ShowcaseCard>

      {/* CARDS & SURFACES */}
      <SectionTitle>Cards & Surfaces</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        <Card>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar>}
            title='Session Card'
            subheader='Default card variant'
          />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              This card uses the default elevation-0 style with a border and
              gap.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small'>View</Button>
            <Button size='small'>Share</Button>
          </CardActions>
        </Card>

        <Card variant='outlined'>
          <CardHeader title='Outlined Card' subheader='variant="outlined"' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              Outlined variant with a different background in dark mode.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' variant='contained' color='primary'>
              Action
            </Button>
          </CardActions>
        </Card>

        <Paper variant='outlined' sx={{ p: 2 }}>
          <Typography variant='subtitle2' fontWeight={600} gutterBottom>
            Paper (outlined)
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Elevation-0 paper with border. Used for content containers
            throughout the app.
          </Typography>
        </Paper>
      </Box>

      {/* ACCORDIONS */}
      <SectionTitle>Accordions</SectionTitle>
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>How do I create a poll?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2' color='text.secondary'>
              Navigate to the dashboard and click "Create Poll". Fill in your
              questions and options, then start a live session.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>
              Can students join without an account?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2' color='text.secondary'>
              Yes, students can join as guests using just a room code. No
              account required.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>How are scores calculated?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body2' color='text.secondary'>
              Each question has a point value. Correct answers earn full points,
              incorrect answers earn zero.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* ALERTS & FEEDBACK */}
      <SectionTitle>Alerts & Feedback</SectionTitle>
      <Stack spacing={1.5}>
        <Alert severity='success'>
          Session completed successfully — 24 participants responded
        </Alert>
        <Alert severity='info'>
          Your session is ready. Share the room code with your class.
        </Alert>
        <Alert severity='warning'>
          AI question generation may take a few seconds...
        </Alert>
        <Alert severity='error'>
          Failed to join session — room code invalid or expired
        </Alert>
        <Alert severity='success' variant='outlined'>
          Outlined success alert
        </Alert>
        <Alert severity='error' variant='filled'>
          Filled error alert
        </Alert>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <ShowcaseCard title='Linear Progress'>
          <LinearProgress />
          <LinearProgress variant='determinate' value={45} />
          <LinearProgress variant='determinate' value={78} />
          <LinearProgress variant='buffer' value={60} valueBuffer={80} />
        </ShowcaseCard>
      </Box>

      {/* DIALOG */}
      <SectionTitle>Dialog</SectionTitle>
      <Box>
        <Button variant='outlined' onClick={() => setDialogOpen(true)}>
          Open Dialog
        </Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>End Session?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to end this session? All participants will
              be disconnected and final scores will be calculated.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant='contained' onClick={() => setDialogOpen(false)}>
              End Session
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* TABS */}
      <SectionTitle>Tabs</SectionTitle>
      <ShowcaseCard title='Tab Navigation'>
        <Tabs
          value={tabValue}
          onChange={(_: SyntheticEvent, v: number) => setTabValue(v)}>
          <Tab label='Sessions' />
          <Tab label='Submissions' />
          <Tab label='Analytics' />
          <Tab label='Settings' disabled />
        </Tabs>
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            mt: -0.5,
          }}>
          <Typography variant='body2' color='text.secondary'>
            {tabValue === 0 &&
              "View all your hosted sessions and their results."}
            {tabValue === 1 &&
              "Review student submissions and individual scores."}
            {tabValue === 2 && "Analyze performance trends across sessions."}
          </Typography>
        </Box>
      </ShowcaseCard>

      {/* NAVIGATION */}
      <SectionTitle>Navigation & Menus</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title='Menu'>
          <Button
            variant='outlined'
            onClick={(e) => setMenuAnchor(e.currentTarget)}>
            Open Menu
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <ListItemIcon>
                <Home fontSize='small' />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <ListItemIcon>
                <Description fontSize='small' />
              </ListItemIcon>
              My Polls
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <ListItemIcon>
                <BarChart fontSize='small' />
              </ListItemIcon>
              History
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <ListItemIcon>
                <Settings fontSize='small' />
              </ListItemIcon>
              Settings
            </MenuItem>
          </Menu>
        </ShowcaseCard>

        <ShowcaseCard title='Links & Pagination'>
          <Stack direction='row' spacing={2}>
            <Link href='#'>Default Link</Link>
            <Link href='#' color='secondary'>
              Secondary
            </Link>
            <Link href='#' color='text.primary'>
              Text Link
            </Link>
          </Stack>
          <Pagination count={10} shape='rounded' />
        </ShowcaseCard>
      </Box>

      {/* DATA DISPLAY */}
      <SectionTitle>Data Display</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title='List'>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText
                primary='Active Sessions'
                secondary='3 sessions running'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary='Notifications' secondary='12 unread' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary='Students' secondary='142 enrolled' />
            </ListItem>
          </List>
        </ShowcaseCard>

        <ShowcaseCard title='Avatars & Badges'>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Avatar sx={{ bgcolor: "primary.main" }}>MC</Avatar>
            <Avatar sx={{ bgcolor: "secondary.main" }}>JD</Avatar>
            <Avatar sx={{ bgcolor: "error.main" }}>AB</Avatar>
            <Badge badgeContent={4} color='primary'>
              <Notifications />
            </Badge>
            <Badge badgeContent={99} color='error'>
              <Mail />
            </Badge>
            <Badge variant='dot' color='success'>
              <Person />
            </Badge>
          </Stack>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Tooltip title='Small avatar'>
              <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>S</Avatar>
            </Tooltip>
            <Tooltip title='Default avatar'>
              <Avatar>D</Avatar>
            </Tooltip>
            <Tooltip title='Large avatar'>
              <Avatar sx={{ width: 56, height: 56, fontSize: 24 }}>L</Avatar>
            </Tooltip>
          </Stack>
        </ShowcaseCard>
      </Box>

      {/* TABLE */}
      <SectionTitle>Tables</SectionTitle>
      <Paper variant='outlined' sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      AC
                    </Avatar>
                    <Typography variant='body2'>Alice Chen</Typography>
                  </Stack>
                </TableCell>
                <TableCell>18/20 (90%)</TableCell>
                <TableCell>2m 34s</TableCell>
                <TableCell>
                  <Chip label='Correct' color='success' size='small' />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      BJ
                    </Avatar>
                    <Typography variant='body2'>Bob Johnson</Typography>
                  </Stack>
                </TableCell>
                <TableCell>15/20 (75%)</TableCell>
                <TableCell>3m 12s</TableCell>
                <TableCell>
                  <Chip label='Partial' size='small' />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      CW
                    </Avatar>
                    <Typography variant='body2'>Carol Williams</Typography>
                  </Stack>
                </TableCell>
                <TableCell>8/20 (40%)</TableCell>
                <TableCell>4m 01s</TableCell>
                <TableCell>
                  <Chip label='Incorrect' color='error' size='small' />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      DM
                    </Avatar>
                    <Typography variant='body2'>David Martinez</Typography>
                  </Stack>
                </TableCell>
                <TableCell>20/20 (100%)</TableCell>
                <TableCell>1m 48s</TableCell>
                <TableCell>
                  <Chip
                    label='Perfect'
                    color='success'
                    size='small'
                    icon={<Star />}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* TYPOGRAPHY */}
      <SectionTitle>Typography</SectionTitle>
      <ShowcaseCard title='Type Scale'>
        <Typography variant='h1'>h1 — Heading</Typography>
        <Typography variant='h2'>h2 — Heading</Typography>
        <Typography variant='h3'>h3 — Heading</Typography>
        <Typography variant='h4'>h4 — Heading</Typography>
        <Typography variant='h5'>h5 — Heading</Typography>
        <Typography variant='h6'>h6 — Heading</Typography>
        <Divider />
        <Typography variant='subtitle1'>subtitle1 — Supporting text</Typography>
        <Typography variant='subtitle2'>subtitle2 — Supporting text</Typography>
        <Typography variant='body1'>
          body1 — The quick brown fox jumps over the lazy dog. PulseCheck
          enables real-time classroom polling.
        </Typography>
        <Typography variant='body2'>
          body2 — The quick brown fox jumps over the lazy dog. PulseCheck
          enables real-time classroom polling.
        </Typography>
        <Typography variant='caption'>
          caption — Additional metadata or helper text
        </Typography>
        <Typography variant='overline'>overline — Section label</Typography>
      </ShowcaseCard>

      <Divider sx={{ my: 5 }} />

      {/* ═══════════════════════════════════════════
          PULSECHECK COMPONENTS
          ═══════════════════════════════════════════ */}

      <Typography variant='h5' fontWeight={700} sx={{ mb: 1 }}>
        PulseCheck Components
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Custom app components rendered with dummy data
      </Typography>

      {/* ASYNC BUTTON */}
      <SectionTitle>AsyncButton</SectionTitle>
      <ShowcaseCard title='Async buttons with loading state (click to trigger)'>
        <Stack direction='row' spacing={1.5} flexWrap='wrap' useFlexGap>
          <AsyncButton
            variant='contained'
            color='primary'
            callback={() => new Promise((r) => setTimeout(r, 1500))}>
            Submit Response
          </AsyncButton>
          <AsyncButton
            variant='contained'
            color='secondary'
            startIcon={<Add />}
            callback={() => new Promise((r) => setTimeout(r, 1500))}>
            Add Question
          </AsyncButton>
          <AsyncButton
            variant='outlined'
            callback={() => new Promise((r) => setTimeout(r, 1500))}>
            Save Draft
          </AsyncButton>
        </Stack>
      </ShowcaseCard>

      {/* NEW BADGE */}
      <SectionTitle>NewBadge</SectionTitle>
      <ShowcaseCard title='Animated badge (click to toggle style)'>
        <Box
          sx={{ position: "relative", display: "inline-block", ml: 3, mt: 2 }}>
          <Typography variant='h6' fontWeight={700}>
            PulseCheck
          </Typography>
          <NewBadge />
        </Box>
      </ShowcaseCard>

      {/* AUTH BRANDING */}
      <SectionTitle>AuthBranding</SectionTitle>
      <Paper variant='outlined' sx={{ borderRadius: 2, overflow: "hidden" }}>
        <AuthBranding
          heading='Welcome Back'
          subtext='Sign in to create polls, host live sessions, and track student engagement in real time.'
        />
      </Paper>

      {/* LEAVE BUTTON */}
      <SectionTitle>LeaveButton</SectionTitle>
      <ShowcaseCard title='Back button with confirmation dialog'>
        <Stack direction='row' spacing={2} alignItems='center'>
          <LeaveButton
            callback={() => {
              /* noop demo */
            }}
            dialogTitle='Leave Session?'
            dialogContent='Are you sure you want to leave? Your responses will still be saved.'
          />
          <Typography variant='body2' color='text.secondary'>
            Click the arrow to see the confirmation dialog
          </Typography>
        </Stack>
      </ShowcaseCard>

      {/* DASHBOARD CARDS */}
      <SectionTitle>Dashboard Cards</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        <RecentPollCard
          pollTitle='CS 300 — Midterm Review'
          result='Average: 78% | 32 students'
        />
        <RecentPollCard
          pollTitle='Algorithms Quiz #9'
          result='Average: 82% | 28 students'
        />
        <RecentPollCard
          pollTitle='Data Structures Exit Ticket'
          result='Average: 65% | 45 students'
        />
      </Box>

      {/* POLL METRICS */}
      <SectionTitle>PollMetricsCard</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <PollMetricsCard sum={mockSummary} />
        <PollMetricsCard
          sum={{
            ...mockSummary,
            average_100: 91,
            median_100: 94,
            low_100: 72,
            high_100: 100,
            lower_quartile_100: 85,
            upper_quartile_100: 98,
            total_participants: 18,
          }}
        />
      </Box>

      {/* USER AVATAR */}
      <SectionTitle>UserAvatar</SectionTitle>
      <ShowcaseCard title='User avatars with initials'>
        <Stack direction='row' spacing={2}>
          <UserAvatar uid='1' displayName='Miguel Campos' />
          <UserAvatar uid='2' displayName='John Doe' />
          <UserAvatar uid='3' displayName='Alice Bob Charlie' />
          <UserAvatar uid='4' displayName='X' />
        </Stack>
      </ShowcaseCard>

      {/* GAUGES */}
      <SectionTitle>Gauge Charts</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title='PulseGauge — High Score'>
          <PulseGauge score={92} size={180} />
        </ShowcaseCard>
        <ShowcaseCard title='PulseGauge — Medium Score'>
          <PulseGauge score={58} size={180} />
        </ShowcaseCard>
        <ShowcaseCard title='PulseGauge — Low Score'>
          <PulseGauge score={23} size={180} />
        </ShowcaseCard>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mt: 3,
        }}>
        <SessionGaugeCard
          score={72}
          title='CS 300 — Midterm Review'
          timestamp={Timestamp.now()}
        />
        <SessionGaugeCard
          score={85}
          title='Algorithms Quiz #9'
          timestamp={Timestamp.now()}
        />
      </Box>

      {/* SPLASH COMPONENTS */}
      <SectionTitle>Splash — Features</SectionTitle>
      <Paper variant='outlined' sx={{ p: 3, borderRadius: 2 }}>
        <Features />
      </Paper>

      <SectionTitle>Splash — About</SectionTitle>
      <Paper variant='outlined' sx={{ p: 3, borderRadius: 2 }}>
        <About />
      </Paper>

      <SectionTitle>Splash — FAQs</SectionTitle>
      <Paper variant='outlined' sx={{ p: 3, borderRadius: 2 }}>
        <FAQs />
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* COMPONENTS NOT RENDERED */}
      <Typography variant='h6' fontWeight={600} sx={{ mb: 1 }}>
        Components Not Shown
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        The following components require Firebase, API connections, or complex
        context providers and cannot be rendered standalone with dummy data:
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}>
        {[
          {
            category: "Auth",
            items: [
              "UserLogin",
              "RegisterJoin",
              "ContinueWGoogleButton",
              "SignOutButton",
            ],
          },
          {
            category: "Header",
            items: [
              "AppBar",
              "AppTitle",
              "ProfileIcon",
              "MenuButton",
              "NavItems",
              "AuthMenuList",
              "GuestMenuList",
            ],
          },
          {
            category: "Poll Edit",
            items: [
              "Header",
              "QuestionEditor",
              "QuestionList",
              "PromptField",
              "PromptTypeField",
              "PromptOptionEditor",
              "Settings",
              "TimerSwitch",
              "UploadPDFDialog",
              "DeleteMenuItem",
            ],
          },
          {
            category: "Poll Session",
            items: [
              "HostButton",
              "StartButton",
              "NextButton",
              "FinishButton",
              "Host Header",
              "Participate Header",
              "ResponseDialog",
              "Choice",
            ],
          },
          {
            category: "Poll History",
            items: [
              "PollSessionHistory",
              "PollSubmissionHistory",
              "SessionCard*",
              "SubmissionCard*",
            ],
          },
          {
            category: "Graphs",
            items: [
              "MostRecentGaugeCard",
              "NoRecentPoll",
              "ScoreGaugeCard*",
              "SessionScatterChart",
            ],
          },
        ].map((group) => (
          <Paper
            key={group.category}
            variant='outlined'
            sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant='subtitle2' fontWeight={600} gutterBottom>
              {group.category}
            </Typography>
            {group.items.map((item) => (
              <Typography
                key={item}
                variant='caption'
                display='block'
                color='text.secondary'>
                {item}
              </Typography>
            ))}
          </Paper>
        ))}
      </Box>
      <Typography
        variant='caption'
        color='text.secondary'
        display='block'
        sx={{ mt: 1 }}>
        * Requires Firestore DocumentReference in props
      </Typography>

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
