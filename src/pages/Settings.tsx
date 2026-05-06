import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
  TextField,
  Avatar,
  Skeleton,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material"
import { Edit, Check, Close, Google, Email, Logout } from "@mui/icons-material"
import { RA } from "@/styles"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { FirebaseError } from "firebase/app"
import ThemeSelect from "@/components/ThemeSelect"
import useRequireAuth from "@/hooks/useRequireAuth"
import { useUser } from "@/hooks"
import { stoc, stoni } from "@/utils"

type ErrorField = "displayName" | "email"

function SettingsRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
      }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ width: 140, flexShrink: 0 }}>
        {label}
      </Typography>
      {children}
    </Box>
  )
}

/**
 * Displays authenticated user's profile information
 * @author tdhillon113
 */
export default function Settings() {
  useRequireAuth({ blockGuests: true })
  const snackbar = useSnackbar()
  const navigate = useNavigate()

  const {
    user: profile,
    authUser,
    updateDisplayName,
    updateEmail: updateUserEmail,
    updatePassword: updateUserPassword,
    updateSessionDefaults,
  } = useUser()

  const [save, setSave] = useState(false)
  const [originalEmail, setOriginalEmail] = useState<string>("")
  const [originalName, setOriginalName] = useState("")
  const [error, setError] = useState({
    displayName: "",
    username: "",
    email: "",
  })
  const [editUser, setEditUser] = useState<string | null>(null)
  const [tempVal, setTempVal] = useState("")

  const email = profile?.email ?? authUser?.email ?? ""
  const displayName = profile?.display_name ?? authUser?.displayName ?? ""
  const photoURL = profile?.photo_url ?? authUser?.photoURL ?? ""
  const createdAt = profile?.created_at ?? null

  useEffect(() => {
    setOriginalEmail(email)
  }, [email])

  useEffect(() => {
    setOriginalName(displayName)
  }, [displayName])

  const clearFieldError = (field: ErrorField) => {
    setError((prev) => ({ ...prev, [field]: "" }))
  }

  const handleEdit = (field: string, value: string) => {
    setEditUser(field)
    setTempVal(value)
  }

  const cancelEdit = () => {
    setEditUser(null)
    setTempVal("")
  }

  const saveChanges = async (field: "displayName" | "email"): Promise<void> => {
    if (!authUser) {
      return
    }
    setSave(true)

    try {
      if (field === "displayName" && tempVal === originalName) {
        cancelEdit()
        setSave(false)
        return
      } else if (field === "email" && tempVal === originalEmail) {
        cancelEdit()
        setSave(false)
        return
      }

      if (field === "displayName") {
        await updateDisplayName(tempVal)
        setOriginalName(tempVal)
      } else if (field === "email") {
        await updateUserEmail(tempVal)
        setOriginalEmail(tempVal)
      }
      /* verbose */
      // snackbar.show({
      //   message: "Profile updated successfully",
      //   type: "success",
      // })
    } catch (err: unknown) {
      console.error("Error updating", err)
      if (err instanceof FirebaseError) {
        if (err.code === "email in use <3 ") {
          setError((prev) => ({ ...prev, email: "Email already in use!" }))
        } else if (err.code === "requires login!") {
          snackbar.show({
            message: "Please login again to update your profile",
            type: "error",
          })
          void navigate("/login", { state: { requiresReauth: true } })
        } else {
          snackbar.show({
            message: `Error: ${err.message}`,
            type: "error",
          })
        }
      } else {
        snackbar.show({
          message: "Failed to update profile",
          type: "error",
        })
      }
    } finally {
      setSave(false)
      setEditUser(null)
    }
  }

  const handleSaveDisplayName = (): void => {
    void saveChanges("displayName")
  }

  const providerId = authUser?.providerData[0]?.providerId
  const isPasswordProvider = providerId === "password"

  const [changingPassword, setChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleChangePassword = async () => {
    if (!authUser?.email) return
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    setSave(true)
    setPasswordError("")
    try {
      await updateUserPassword(currentPassword, newPassword)
      snackbar.show({
        message: "Password updated successfully",
        type: "success",
      })
      setChangingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/wrong-password") {
          setPasswordError("Current password is incorrect")
        } else {
          setPasswordError(err.message)
        }
      } else {
        setPasswordError("Failed to update password")
      }
    } finally {
      setSave(false)
    }
  }

  const sessionDefaults = profile?.session_defaults
  const isAnonymousDefault = sessionDefaults?.isAnonymous ?? false
  const hasLeaderboardDefault = sessionDefaults?.hasLeaderboard ?? false

  const handleToggleSessionDefault = async (
    field: "isAnonymous" | "hasLeaderboard",
    next: boolean,
  ) => {
    try {
      await updateSessionDefaults({
        isAnonymous: field === "isAnonymous" ? next : isAnonymousDefault,
        hasLeaderboard:
          field === "hasLeaderboard" ? next : hasLeaderboardDefault,
      })
      // snackbar.show({
      //   message: "Session defaults updated",
      //   type: "success",
      // })
    } catch (err) {
      console.error("Failed to update settings (session defaults)", err)
      snackbar.show({
        message: "Failed to update settings",
        type: "error",
      })
    }
  }

  const handleSignOut = () => {
    void api.auth.logout().then(() => {
      void navigate("/")
    })
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 }, textAlign: "left" }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          Account
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          Settings
        </Typography>
      </RA.Fade>

      <RA.Fade triggerOnce duration={600} delay={100}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}>
          <Avatar
            src={photoURL}
            alt={displayName}
            sx={{
              width: 56,
              height: 56,
              fontSize: 22,
              bgcolor: stoc(displayName),
            }}>
            {stoni(displayName)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {displayName || <Skeleton width={120} />}
            </Typography>
            {createdAt ? (
              <Typography variant="body2" color="text.secondary">
                Member since {createdAt.toDate().toLocaleDateString()}
              </Typography>
            ) : (
              <Skeleton variant="text" width={160} />
            )}
          </Box>
        </Box>
      </RA.Fade>

      <RA.Fade triggerOnce duration={600} delay={200}>
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <SettingsRow label="Display Name">
            <Box flex={1}>
              {editUser === "displayName" ? (
                <TextField
                  placeholder="Enter display name"
                  value={tempVal}
                  onChange={(e) => {
                    setTempVal(e.target.value)
                    clearFieldError("displayName")
                  }}
                  onKeyUp={(e) => {
                    if (e.code === 'Enter') {
                      saveChanges()
                    }
                  }}
                  error={!!error.displayName}
                  helperText={error.displayName}
                  fullWidth
                  size="small"
                />
              ) : (
                <Typography>{displayName}</Typography>
              )}
            </Box>
            {editUser === "displayName" ? (
              <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                <IconButton
                  color="primary"
                  onClick={handleSaveDisplayName}
                  disabled={save}
                  size="small">
                  <Check fontSize="small" />
                </IconButton>
                <IconButton color="error" onClick={cancelEdit} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => handleEdit("displayName", displayName)}
                size="small"
                sx={{ ml: 1 }}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </SettingsRow>

          <Divider />

          <SettingsRow label="Email">
            <Typography flex={1}>{email}</Typography>
          </SettingsRow>

          <Divider />

          <SettingsRow label="Appearance">
            <Box flex={1}>
              <ThemeSelect size="small" sx={{ minWidth: 160 }} />
            </Box>
          </SettingsRow>

          <Divider />

          <SettingsRow label="Session Defaults">
            <Stack flex={1} spacing={0.5}>
              <FormControlLabel
                label="Anonymous Mode"
                control={
                  <Switch
                    size="small"
                    checked={isAnonymousDefault}
                    onChange={(e) =>
                      void handleToggleSessionDefault(
                        "isAnonymous",
                        e.target.checked,
                      )
                    }
                  />
                }
              />
              <FormControlLabel
                label="Leaderboard"
                control={
                  <Switch
                    size="small"
                    checked={hasLeaderboardDefault}
                    onChange={(e) =>
                      void handleToggleSessionDefault(
                        "hasLeaderboard",
                        e.target.checked,
                      )
                    }
                  />
                }
              />
            </Stack>
          </SettingsRow>

          <Divider />

          <SettingsRow label="Provider">
            <Chip
              icon={providerId === "google.com" ? <Google /> : <Email />}
              label={providerId === "google.com" ? "Google" : "Email"}
              size="small"
              variant="outlined"
            />
          </SettingsRow>

          {isPasswordProvider && (
            <>
              <Divider />
              <SettingsRow label="Password">
                <Box flex={1}>
                  {changingPassword ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}>
                      <TextField
                        placeholder="Current password"
                        type="password"
                        size="small"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <TextField
                        placeholder="New password"
                        type="password"
                        size="small"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <TextField
                        placeholder="Confirm new password"
                        type="password"
                        size="small"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={save}
                          onClick={() => void handleChangePassword()}>
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setChangingPassword(false)
                            setCurrentPassword("")
                            setNewPassword("")
                            setConfirmPassword("")
                            setPasswordError("")
                          }}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setChangingPassword(true)}>
                      Change Password
                    </Button>
                  )}
                </Box>
              </SettingsRow>
            </>
          )}
        </Paper>
      </RA.Fade>

      <RA.Fade triggerOnce duration={600} delay={300}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Logout />}
          onClick={handleSignOut}
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}>
          Sign Out
        </Button>
      </RA.Fade>
    </Container>
  )
}
