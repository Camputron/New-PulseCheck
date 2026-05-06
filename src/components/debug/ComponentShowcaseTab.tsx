/* eslint-disable */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Avatar,
  AvatarGroup,
  Backdrop,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
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
  Rating,
  Select,
  Skeleton,
  Slider,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
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
  Toolbar,
  Tooltip,
  Typography,
  AppBar as MuiAppBar,
  Drawer,
  ListItemButton,
  Modal,
  Popover,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material"
import {
  Add,
  ArrowBack,
  BarChart,
  Check,
  Close,
  ContentCopy,
  DarkMode,
  Description,
  Edit,
  ExpandMore,
  Favorite,
  FavoriteBorder,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Home,
  Inbox,
  LightMode,
  LocationOn,
  Mail,
  Menu as MenuIcon,
  Navigation,
  Notifications,
  Person,
  PlayArrow,
  Print,
  Restore,
  Save,
  Settings,
  Share,
  Star,
  VolumeDown,
  VolumeUp,
} from "@mui/icons-material"
import { useThemeContext } from "@/hooks/useThemeContext"
import { useState, type SyntheticEvent } from "react"
import CancelButton from "../CancelButton"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
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
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
      {children}
    </Paper>
  )
}

const COLORS = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
] as const

const AUTOCOMPLETE_OPTIONS = [
  "Multiple Choice",
  "Multi-Select",
  "Ranking Poll",
  "True / False",
  "Short Answer",
  "Fill in the Blank",
]

export default function ComponentShowcaseTab() {
  const { mode, toggleTheme } = useThemeContext()
  const isDark = mode === "dark"

  // Local state for interactive demos
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [toggleValue, setToggleValue] = useState("left")
  const [toggleFormats, setToggleFormats] = useState<string[]>([])
  const [switchChecked, setSwitchChecked] = useState(true)
  const [selectValue, setSelectValue] = useState("option1")
  const [sliderValue, setSliderValue] = useState(30)
  const [ratingValue, setRatingValue] = useState<number | null>(3)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [backdropOpen, setBackdropOpen] = useState(false)
  const [bottomNavValue, setBottomNavValue] = useState(0)
  const [activeStep, setActiveStep] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null)
  const [transferLeft, setTransferLeft] = useState([0, 1, 2, 3])
  const [transferRight, setTransferRight] = useState([4, 5, 6, 7])
  const [transferChecked, setTransferChecked] = useState<number[]>([])

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Component Showcase
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All MUI components rendered with the current theme
          </Typography>
        </Box>
        <IconButton onClick={toggleTheme} size="large">
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ═══════════════════════════════════════════
          INPUTS
          ═══════════════════════════════════════════ */}

      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Inputs
      </Typography>

      {/* BUTTONS — ALL VARIANTS × COLORS */}
      <SectionTitle>Buttons</SectionTitle>
      {(["contained", "outlined", "text"] as const).map((variant) => (
        <ShowcaseCard key={variant} title={`${variant} buttons`}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {COLORS.map((color) => (
              <Button key={color} variant={variant} color={color}>
                {color}
              </Button>
            ))}
            <Button variant={variant} disabled>
              Disabled
            </Button>
          </Stack>
        </ShowcaseCard>
      ))}

      <ShowcaseCard title="Icon Buttons">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {COLORS.map((color) => (
            <IconButton key={color} color={color} size="small">
              <Star fontSize="small" />
            </IconButton>
          ))}
          <IconButton disabled size="small">
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </ShowcaseCard>

      <ShowcaseCard title="Button Sizes">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="contained" size="small">
            Small
          </Button>
          <Button variant="contained" size="medium">
            Medium
          </Button>
          <Button variant="contained" size="large">
            Large
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="contained" color="primary" startIcon={<PlayArrow />}>
            With Icon
          </Button>
          <Button variant="outlined" startIcon={<Edit />}>
            Edit
          </Button>
          <Button variant="text" startIcon={<ArrowBack />}>
            Back
          </Button>
        </Stack>
      </ShowcaseCard>

      {/* BUTTON GROUP */}
      <SectionTitle>Button Group</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        {(["contained", "outlined", "text"] as const).map((variant) => (
          <ShowcaseCard key={variant} title={`${variant}`}>
            <ButtonGroup variant={variant}>
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </ShowcaseCard>
        ))}
      </Box>

      {/* FAB */}
      <SectionTitle>Floating Action Button</SectionTitle>
      <ShowcaseCard title="FAB variants">
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Fab color="primary" size="small">
            <Add />
          </Fab>
          <Fab color="secondary">
            <Edit />
          </Fab>
          <Fab variant="extended" color="primary">
            <Navigation sx={{ mr: 1 }} />
            Navigate
          </Fab>
          <Fab disabled>
            <Favorite />
          </Fab>
        </Stack>
      </ShowcaseCard>

      {/* TOGGLE BUTTONS */}
      <SectionTitle>Toggle Buttons</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title="Exclusive selection">
          <ToggleButtonGroup
            value={toggleValue}
            exclusive
            onChange={(_, val: string | null) => {
              if (val) setToggleValue(val)
            }}>
            <ToggleButton value="left">
              <FormatAlignLeft />
            </ToggleButton>
            <ToggleButton value="center">
              <FormatAlignCenter />
            </ToggleButton>
            <ToggleButton value="right">
              <FormatAlignRight />
            </ToggleButton>
          </ToggleButtonGroup>
        </ShowcaseCard>
        <ShowcaseCard title="Multiple selection">
          <ToggleButtonGroup
            value={toggleFormats}
            onChange={(_, val: string[]) => setToggleFormats(val)}>
            <ToggleButton value="bold">
              <FormatBold />
            </ToggleButton>
            <ToggleButton value="italic">
              <FormatItalic />
            </ToggleButton>
            <ToggleButton value="underlined">
              <FormatUnderlined />
            </ToggleButton>
          </ToggleButtonGroup>
        </ShowcaseCard>
      </Box>

      {/* TEXT FIELDS */}
      <SectionTitle>Text Fields</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title="Variants & states">
          <TextField placeholder="Outlined (default)" size="small" fullWidth />
          <TextField
            placeholder="Filled"
            variant="filled"
            size="small"
            fullWidth
          />
          <TextField
            placeholder="Standard"
            variant="standard"
            size="small"
            fullWidth
          />
          <TextField placeholder="Disabled" size="small" fullWidth disabled />
          <TextField
            placeholder="With error"
            size="small"
            fullWidth
            error
            helperText="This field is required"
          />
        </ShowcaseCard>
        <ShowcaseCard title="Sizes & multiline">
          <TextField placeholder="Small" size="small" fullWidth />
          <TextField placeholder="Medium" size="medium" fullWidth />
          <TextField
            placeholder="Multiline"
            multiline
            rows={3}
            fullWidth
            size="small"
          />
        </ShowcaseCard>
      </Box>

      {/* AUTOCOMPLETE */}
      <SectionTitle>Autocomplete</SectionTitle>
      <ShowcaseCard title="Autocomplete">
        <Autocomplete
          options={AUTOCOMPLETE_OPTIONS}
          size="small"
          sx={{ maxWidth: 400 }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Question type" />
          )}
        />
      </ShowcaseCard>

      {/* SELECT */}
      <SectionTitle>Select</SectionTitle>
      <ShowcaseCard title="Select">
        <Select
          size="small"
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          sx={{ maxWidth: 400 }}>
          <MenuItem value="option1">Multiple Choice</MenuItem>
          <MenuItem value="option2">Multi-Select</MenuItem>
          <MenuItem value="option3">Ranking Poll</MenuItem>
        </Select>
      </ShowcaseCard>

      {/* CHECKBOX */}
      <SectionTitle>Checkboxes</SectionTitle>
      <ShowcaseCard title="Checkbox variants">
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Checked"
          />
          <FormControlLabel control={<Checkbox />} label="Unchecked" />
          <FormControlLabel
            control={<Checkbox indeterminate />}
            label="Indeterminate"
          />
          <FormControlLabel control={<Checkbox disabled />} label="Disabled" />
        </Stack>
        <Stack direction="row" spacing={0} flexWrap="wrap">
          {COLORS.map((color) => (
            <Checkbox key={color} defaultChecked color={color} />
          ))}
        </Stack>
      </ShowcaseCard>

      {/* RADIO */}
      <SectionTitle>Radio Buttons</SectionTitle>
      <ShowcaseCard title="Radio group">
        <RadioGroup row defaultValue="a">
          <FormControlLabel value="a" control={<Radio />} label="Option A" />
          <FormControlLabel value="b" control={<Radio />} label="Option B" />
          <FormControlLabel value="c" control={<Radio />} label="Option C" />
          <FormControlLabel
            value="d"
            control={<Radio disabled />}
            label="Disabled"
          />
        </RadioGroup>
        <Stack direction="row" spacing={0} flexWrap="wrap">
          {COLORS.map((color) => (
            <Radio key={color} checked color={color} />
          ))}
        </Stack>
      </ShowcaseCard>

      {/* SWITCH */}
      <SectionTitle>Switches</SectionTitle>
      <ShowcaseCard title="Switch variants">
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                checked={switchChecked}
                onChange={(e) => setSwitchChecked(e.target.checked)}
              />
            }
            label="Controlled"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Default On"
          />
          <FormControlLabel control={<Switch disabled />} label="Disabled" />
        </Stack>
        <Stack direction="row" spacing={0} flexWrap="wrap">
          {COLORS.map((color) => (
            <Switch key={color} defaultChecked color={color} />
          ))}
        </Stack>
      </ShowcaseCard>

      {/* SLIDER */}
      <SectionTitle>Slider</SectionTitle>
      <ShowcaseCard title="Slider variants">
        <Box sx={{ px: 2 }}>
          <Stack
            spacing={2}
            direction="row"
            sx={{ alignItems: "center", mb: 2 }}>
            <VolumeDown />
            <Slider
              value={sliderValue}
              onChange={(_, v) => setSliderValue(v as number)}
            />
            <VolumeUp />
          </Stack>
          <Slider defaultValue={30} disabled />
          <Slider defaultValue={[20, 60]} />
          <Slider
            defaultValue={40}
            step={10}
            marks
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </Box>
      </ShowcaseCard>

      {/* RATING */}
      <SectionTitle>Rating</SectionTitle>
      <ShowcaseCard title="Rating variants">
        <Stack spacing={1}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Controlled
            </Typography>
            <Rating
              value={ratingValue}
              onChange={(_, v) => setRatingValue(v)}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Half stars
            </Typography>
            <Rating defaultValue={2.5} precision={0.5} />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Read only
            </Typography>
            <Rating value={4} readOnly />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Disabled
            </Typography>
            <Rating value={3} disabled />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 80 }}>
              Custom
            </Typography>
            <Rating
              defaultValue={3}
              icon={<Favorite sx={{ color: "error.main" }} />}
              emptyIcon={<FavoriteBorder />}
            />
          </Stack>
        </Stack>
      </ShowcaseCard>

      {/* ═══════════════════════════════════════════
          DATA DISPLAY
          ═══════════════════════════════════════════ */}

      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Data Display
      </Typography>

      {/* TYPOGRAPHY */}
      <SectionTitle>Typography</SectionTitle>
      <ShowcaseCard title="Type Scale">
        <Typography variant="h1">h1 Heading</Typography>
        <Typography variant="h2">h2 Heading</Typography>
        <Typography variant="h3">h3 Heading</Typography>
        <Typography variant="h4">h4 Heading</Typography>
        <Typography variant="h5">h5 Heading</Typography>
        <Typography variant="h6">h6 Heading</Typography>
        <Divider />
        <Typography variant="subtitle1">subtitle1 — Supporting text</Typography>
        <Typography variant="subtitle2">subtitle2 — Supporting text</Typography>
        <Typography variant="body1">
          body1 — The quick brown fox jumps over the lazy dog.
        </Typography>
        <Typography variant="body2">
          body2 — The quick brown fox jumps over the lazy dog.
        </Typography>
        <Typography variant="caption">
          caption — Additional metadata or helper text
        </Typography>
        <Typography variant="overline">overline — Section label</Typography>
        <Typography variant="button" display="block">
          button — Button text
        </Typography>
      </ShowcaseCard>

      {/* CHIPS — ALL VARIANTS × COLORS */}
      <SectionTitle>Chips</SectionTitle>
      {(["filled", "outlined"] as const).map((variant) => (
        <ShowcaseCard key={variant} title={`${variant} chips`}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Chip label="Default" variant={variant} />
            {COLORS.map((color) => (
              <Chip key={color} label={color} color={color} variant={variant} />
            ))}
          </Stack>
        </ShowcaseCard>
      ))}
      <ShowcaseCard title="Chip extras">
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip label="With Icon" icon={<Check />} color="success" />
          <Chip
            label="Deletable"
            onDelete={() => {
              /* noop */
            }}
          />
          <Chip
            label="Clickable"
            onClick={() => {
              /* noop */
            }}
          />
          <Chip avatar={<Avatar>MC</Avatar>} label="With Avatar" />
          <Chip label="Small" size="small" />
          <Chip label="Small Success" size="small" color="success" />
        </Stack>
      </ShowcaseCard>

      {/* AVATARS */}
      <SectionTitle>Avatars</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title="Variants & sizes">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main" }}>MC</Avatar>
            <Avatar sx={{ bgcolor: "secondary.main" }}>JD</Avatar>
            <Avatar sx={{ bgcolor: "error.main" }}>AB</Avatar>
            <Avatar variant="rounded" sx={{ bgcolor: "success.main" }}>
              <Settings />
            </Avatar>
            <Avatar variant="square" sx={{ bgcolor: "warning.main" }}>
              N
            </Avatar>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>S</Avatar>
            <Avatar>M</Avatar>
            <Avatar sx={{ width: 56, height: 56, fontSize: 24 }}>L</Avatar>
          </Stack>
        </ShowcaseCard>
        <ShowcaseCard title="Avatar Group">
          <AvatarGroup max={4}>
            <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
            <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
            <Avatar sx={{ bgcolor: "error.main" }}>C</Avatar>
            <Avatar sx={{ bgcolor: "success.main" }}>D</Avatar>
            <Avatar sx={{ bgcolor: "warning.main" }}>E</Avatar>
          </AvatarGroup>
        </ShowcaseCard>
      </Box>

      {/* BADGES */}
      <SectionTitle>Badges</SectionTitle>
      <ShowcaseCard title="Badge variants & colors">
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          {COLORS.map((color) => (
            <Badge key={color} badgeContent={4} color={color}>
              <Mail />
            </Badge>
          ))}
        </Stack>
        <Stack direction="row" spacing={3} alignItems="center">
          <Badge badgeContent={99} color="error">
            <Notifications />
          </Badge>
          <Badge badgeContent={1000} max={999} color="primary">
            <Mail />
          </Badge>
          <Badge variant="dot" color="success">
            <Person />
          </Badge>
          <Badge
            overlap="circular"
            variant="dot"
            color="success"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
          </Badge>
        </Stack>
      </ShowcaseCard>

      {/* TOOLTIPS */}
      <SectionTitle>Tooltips</SectionTitle>
      <ShowcaseCard title="Tooltip placements">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Tooltip title="Top" placement="top">
            <Button variant="outlined" size="small">
              Top
            </Button>
          </Tooltip>
          <Tooltip title="Right" placement="right">
            <Button variant="outlined" size="small">
              Right
            </Button>
          </Tooltip>
          <Tooltip title="Bottom" placement="bottom">
            <Button variant="outlined" size="small">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip title="Left" placement="left">
            <Button variant="outlined" size="small">
              Left
            </Button>
          </Tooltip>
          <Tooltip title="With arrow" arrow>
            <Button variant="outlined" size="small">
              Arrow
            </Button>
          </Tooltip>
        </Stack>
      </ShowcaseCard>

      {/* TABLE */}
      <SectionTitle>Table</SectionTitle>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  name: "Alice Chen",
                  initials: "AC",
                  score: "18/20 (90%)",
                  time: "2m 34s",
                  status: "Correct",
                  color: "success" as const,
                },
                {
                  name: "Bob Johnson",
                  initials: "BJ",
                  score: "15/20 (75%)",
                  time: "3m 12s",
                  status: "Partial",
                  color: "default" as const,
                },
                {
                  name: "Carol Williams",
                  initials: "CW",
                  score: "8/20 (40%)",
                  time: "4m 01s",
                  status: "Incorrect",
                  color: "error" as const,
                },
                {
                  name: "David Martinez",
                  initials: "DM",
                  score: "20/20 (100%)",
                  time: "1m 48s",
                  status: "Perfect",
                  color: "success" as const,
                },
              ].map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {row.initials}
                      </Avatar>
                      <Typography variant="body2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.color}
                      size="small"
                      icon={row.status === "Perfect" ? <Star /> : undefined}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* DIVIDERS */}
      <SectionTitle>Dividers</SectionTitle>
      <ShowcaseCard title="Divider variants">
        <Divider>Full width with text</Divider>
        <Divider textAlign="left">Left aligned</Divider>
        <Divider textAlign="right">Right aligned</Divider>
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}>
          <Typography variant="body2">Item 1</Typography>
          <Typography variant="body2">Item 2</Typography>
          <Typography variant="body2">Item 3</Typography>
        </Stack>
      </ShowcaseCard>

      {/* SKELETON */}
      <SectionTitle>Skeleton</SectionTitle>
      <ShowcaseCard title="Skeleton variants">
        <Stack spacing={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" width="60%" sx={{ fontSize: "1rem" }} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton
                variant="text"
                width="80%"
                sx={{ fontSize: "0.75rem" }}
              />
            </Box>
          </Stack>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rounded" height={60} />
        </Stack>
      </ShowcaseCard>

      {/* LIST */}
      <SectionTitle>Lists</SectionTitle>
      <ShowcaseCard title="List with icons">
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText
              primary="Active Sessions"
              secondary="3 sessions running"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Mail />
            </ListItemIcon>
            <ListItemText primary="Notifications" secondary="12 unread" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Students" secondary="142 enrolled" />
          </ListItem>
        </List>
      </ShowcaseCard>

      {/* ═══════════════════════════════════════════
          FEEDBACK
          ═══════════════════════════════════════════ */}

      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Feedback
      </Typography>

      {/* ALERTS — ALL VARIANTS × SEVERITIES */}
      <SectionTitle>Alerts</SectionTitle>
      {(["standard", "outlined", "filled"] as const).map((variant) => (
        <ShowcaseCard key={variant} title={`${variant} alerts`}>
          <Stack spacing={1}>
            {(["success", "info", "warning", "error"] as const).map(
              (severity) => (
                <Alert key={severity} severity={severity} variant={variant}>
                  {severity} — {variant} variant
                </Alert>
              ),
            )}
          </Stack>
        </ShowcaseCard>
      ))}

      {/* PROGRESS */}
      <SectionTitle>Progress</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}>
        <ShowcaseCard title="Linear Progress">
          <LinearProgress />
          <LinearProgress variant="determinate" value={45} />
          <LinearProgress variant="determinate" value={78} />
          <LinearProgress variant="buffer" value={60} valueBuffer={80} />
          <LinearProgress color="secondary" variant="determinate" value={60} />
          <LinearProgress color="success" variant="determinate" value={90} />
        </ShowcaseCard>
        <ShowcaseCard title="Circular Progress">
          <Stack direction="row" spacing={3} alignItems="center">
            <CircularProgress />
            <CircularProgress color="secondary" />
            <CircularProgress variant="determinate" value={25} />
            <CircularProgress variant="determinate" value={50} />
            <CircularProgress variant="determinate" value={75} />
            <CircularProgress variant="determinate" value={100} />
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <CircularProgress size={20} />
            <CircularProgress size={30} />
            <CircularProgress size={40} />
            <CircularProgress size={50} />
          </Stack>
        </ShowcaseCard>
      </Box>

      {/* SNACKBAR */}
      <SectionTitle>Snackbar</SectionTitle>
      <ShowcaseCard title="Snackbar">
        <Button variant="outlined" onClick={() => setSnackbarOpen(true)}>
          Open Snackbar
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Response submitted successfully"
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}>
              <Close fontSize="small" />
            </IconButton>
          }
        />
      </ShowcaseCard>

      {/* DIALOG */}
      <SectionTitle>Dialog</SectionTitle>
      <ShowcaseCard title="Alert dialog">
        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
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
            <CancelButton onClick={() => setDialogOpen(false)} />
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              End Session
            </Button>
          </DialogActions>
        </Dialog>
      </ShowcaseCard>

      {/* BACKDROP */}
      <SectionTitle>Backdrop</SectionTitle>
      <ShowcaseCard title="Backdrop with spinner">
        <Button variant="outlined" onClick={() => setBackdropOpen(true)}>
          Open Backdrop
        </Button>
        <Backdrop
          sx={{ color: "#fff", zIndex: (t) => t.zIndex.drawer + 1 }}
          open={backdropOpen}
          onClick={() => setBackdropOpen(false)}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </ShowcaseCard>

      {/* ═══════════════════════════════════════════
          SURFACES
          ═══════════════════════════════════════════ */}

      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Surfaces
      </Typography>

      {/* CARDS */}
      <SectionTitle>Cards</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 3,
        }}>
        <Card>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: "primary.main" }}>S</Avatar>}
            title="Session Card"
            subheader="Default card variant"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Default elevation-0 style with a border and gap.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">View</Button>
            <Button size="small">Share</Button>
          </CardActions>
        </Card>

        <Card variant="outlined">
          <CardHeader title="Outlined Card" subheader='variant="outlined"' />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Outlined variant with a different background in dark mode.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" color="primary">
              Action
            </Button>
          </CardActions>
        </Card>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Paper (outlined)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Elevation-0 paper with border. Used for content containers
            throughout the app.
          </Typography>
        </Paper>
      </Box>

      {/* ACCORDION */}
      <SectionTitle>Accordion</SectionTitle>
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography fontWeight={600}>How do I create a poll?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
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
            <Typography variant="body2" color="text.secondary">
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
            <Typography variant="body2" color="text.secondary">
              Each question has a point value. Correct answers earn full points,
              incorrect answers earn zero.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* ═══════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════ */}

      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Navigation
      </Typography>

      {/* TABS */}
      <SectionTitle>Tabs</SectionTitle>
      <ShowcaseCard title="Tab navigation">
        <Tabs
          value={tabValue}
          onChange={(_: SyntheticEvent, v: number) => setTabValue(v)}>
          <Tab label="Sessions" />
          <Tab label="Submissions" />
          <Tab label="Analytics" />
          <Tab label="Settings" disabled />
        </Tabs>
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            mt: -0.5,
          }}>
          <Typography variant="body2" color="text.secondary">
            {tabValue === 0 &&
              "View all your hosted sessions and their results."}
            {tabValue === 1 &&
              "Review student submissions and individual scores."}
            {tabValue === 2 && "Analyze performance trends across sessions."}
          </Typography>
        </Box>
      </ShowcaseCard>

      {/* MENU */}
      <SectionTitle>Menu</SectionTitle>
      <ShowcaseCard title="Dropdown menu">
        <Button
          variant="outlined"
          onClick={(e) => setMenuAnchor(e.currentTarget)}>
          Open Menu
        </Button>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <Description fontSize="small" />
            </ListItemIcon>
            My Polls
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <BarChart fontSize="small" />
            </ListItemIcon>
            History
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Menu>
      </ShowcaseCard>

      {/* BREADCRUMBS */}
      <SectionTitle>Breadcrumbs</SectionTitle>
      <ShowcaseCard title="Breadcrumb navigation">
        <Breadcrumbs>
          <Link href="#" color="inherit">
            Dashboard
          </Link>
          <Link href="#" color="inherit">
            Polls
          </Link>
          <Typography color="text.primary">CS 300 Midterm Review</Typography>
        </Breadcrumbs>
        <Breadcrumbs separator=">">
          <Link href="#" color="inherit">
            <Home sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home
          </Link>
          <Link href="#" color="inherit">
            Sessions
          </Link>
          <Typography color="text.primary">Room ABC123</Typography>
        </Breadcrumbs>
      </ShowcaseCard>

      {/* LINKS */}
      <SectionTitle>Links</SectionTitle>
      <ShowcaseCard title="Link variants">
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          <Link href="#">Default Link</Link>
          <Link href="#" color="secondary">
            Secondary
          </Link>
          <Link href="#" color="text.primary">
            Text Link
          </Link>
          <Link href="#" underline="hover">
            Underline Hover
          </Link>
          <Link href="#" underline="always">
            Underline Always
          </Link>
        </Stack>
      </ShowcaseCard>

      {/* PAGINATION */}
      <SectionTitle>Pagination</SectionTitle>
      <ShowcaseCard title="Pagination variants">
        <Stack spacing={2}>
          <Pagination count={10} shape="rounded" />
          <Pagination count={10} variant="outlined" shape="rounded" />
          <Pagination count={10} color="primary" shape="rounded" />
          <Pagination count={10} color="secondary" shape="rounded" />
          <Pagination
            count={10}
            shape="rounded"
            size="small"
            showFirstButton
            showLastButton
          />
        </Stack>
      </ShowcaseCard>

      {/* STEPPER */}
      <SectionTitle>Stepper</SectionTitle>
      <ShowcaseCard title="Horizontal stepper">
        <Stepper activeStep={activeStep}>
          {["Create Poll", "Add Questions", "Configure Settings", "Review"].map(
            (label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ),
          )}
        </Stepper>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            size="small"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => s - 1)}>
            Back
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={activeStep === 3}
            onClick={() => setActiveStep((s) => s + 1)}>
            {activeStep === 3 ? "Finish" : "Next"}
          </Button>
        </Stack>
      </ShowcaseCard>

      {/* BOTTOM NAVIGATION */}
      <SectionTitle>Bottom Navigation</SectionTitle>
      <ShowcaseCard title="Bottom navigation">
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={(_, v) => setBottomNavValue(v)}>
            <BottomNavigationAction label="Recents" icon={<Restore />} />
            <BottomNavigationAction label="Favorites" icon={<Favorite />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
          </BottomNavigation>
        </Paper>
      </ShowcaseCard>

      {/* DRAWER */}
      <SectionTitle>Drawer</SectionTitle>
      <ShowcaseCard title="Temporary drawer">
        <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
          Open Drawer
        </Button>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}>
            <List>
              {["Dashboard", "My Polls", "History", "Settings"].map(
                (text, i) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {
                          [
                            <Home />,
                            <Description />,
                            <BarChart />,
                            <Settings />,
                          ][i]
                        }
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ),
              )}
            </List>
            <Divider />
            <List>
              {["Notifications", "Profile"].map((text, i) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {[<Notifications />, <Person />][i]}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </ShowcaseCard>

      {/* SPEED DIAL */}
      <SectionTitle>Speed Dial</SectionTitle>
      <ShowcaseCard title="Speed dial">
        <Box sx={{ height: 200, position: "relative" }}>
          <SpeedDial
            ariaLabel="Speed dial demo"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}>
            {[
              { icon: <ContentCopy />, name: "Copy" },
              { icon: <Save />, name: "Save" },
              { icon: <Print />, name: "Print" },
              { icon: <Share />, name: "Share" },
            ].map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial>
        </Box>
      </ShowcaseCard>

      {/* ═══════════════════════════════════════════
          UTILS & OVERLAYS
          ═══════════════════════════════════════════ */}

      <Divider sx={{ my: 5 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Utils & Overlays
      </Typography>

      {/* APP BAR */}
      <SectionTitle>App Bar</SectionTitle>
      <ShowcaseCard title="Basic app bar">
        <MuiAppBar position="static" sx={{ borderRadius: 1 }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              PulseCheck
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </MuiAppBar>
      </ShowcaseCard>

      {/* MODAL */}
      <SectionTitle>Modal</SectionTitle>
      <ShowcaseCard title="Basic modal">
        <Button variant="outlined" onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}>
            <Typography variant="h6" gutterBottom>
              Modal Title
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a basic modal. It uses the Modal component directly
              instead of Dialog, giving you full control over the content.
            </Typography>
          </Box>
        </Modal>
      </ShowcaseCard>

      {/* POPOVER */}
      <SectionTitle>Popover</SectionTitle>
      <ShowcaseCard title="Basic popover">
        <Button
          variant="outlined"
          onClick={(e) => setPopoverAnchor(e.currentTarget)}>
          Open Popover
        </Button>
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          onClose={() => setPopoverAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
          <Typography sx={{ p: 2 }} variant="body2">
            The content of the Popover.
          </Typography>
        </Popover>
      </ShowcaseCard>

      {/* TRANSFER LIST */}
      <SectionTitle>Transfer List</SectionTitle>
      <ShowcaseCard title="Transfer list">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center">
          <Paper
            variant="outlined"
            sx={{ width: 200, height: 230, overflow: "auto" }}>
            <List dense>
              {transferLeft.map((value) => (
                <ListItemButton
                  key={value}
                  onClick={() => {
                    setTransferChecked((prev) =>
                      prev.includes(value)
                        ? prev.filter((v) => v !== value)
                        : [...prev, value],
                    )
                  }}>
                  <ListItemIcon>
                    <Checkbox
                      checked={transferChecked.includes(value)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={`Item ${value + 1}`} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
          <Stack spacing={0.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const moving = transferLeft.filter((v) =>
                  transferChecked.includes(v),
                )
                setTransferRight((prev) => [...prev, ...moving])
                setTransferLeft((prev) =>
                  prev.filter((v) => !moving.includes(v)),
                )
                setTransferChecked((prev) =>
                  prev.filter((v) => !moving.includes(v)),
                )
              }}
              disabled={!transferLeft.some((v) => transferChecked.includes(v))}>
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const moving = transferRight.filter((v) =>
                  transferChecked.includes(v),
                )
                setTransferLeft((prev) => [...prev, ...moving])
                setTransferRight((prev) =>
                  prev.filter((v) => !moving.includes(v)),
                )
                setTransferChecked((prev) =>
                  prev.filter((v) => !moving.includes(v)),
                )
              }}
              disabled={
                !transferRight.some((v) => transferChecked.includes(v))
              }>
              &lt;
            </Button>
          </Stack>
          <Paper
            variant="outlined"
            sx={{ width: 200, height: 230, overflow: "auto" }}>
            <List dense>
              {transferRight.map((value) => (
                <ListItemButton
                  key={value}
                  onClick={() => {
                    setTransferChecked((prev) =>
                      prev.includes(value)
                        ? prev.filter((v) => v !== value)
                        : [...prev, value],
                    )
                  }}>
                  <ListItemIcon>
                    <Checkbox
                      checked={transferChecked.includes(value)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={`Item ${value + 1}`} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Stack>
      </ShowcaseCard>

      <Divider sx={{ my: 3 }} />
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 4 }}>
        Toggle dark mode (top-right) to preview both themes
      </Typography>
    </Box>
  )
}
