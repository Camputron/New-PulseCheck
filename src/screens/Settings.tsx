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
} from "@mui/material"
import { Edit, Check, Close, Google, Email, Logout } from "@mui/icons-material"
import { RA } from "@/styles"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api, { auth } from "@/lib/api/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import useSnackbar from "@/lib/hooks/useSnackbar"
import { firestore } from "@/lib/api/firebase"
import { doc, Timestamp, getDoc, updateDoc } from "firebase/firestore"
import {
  updateEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import ThemeSelect from "@/components/ThemeSelect"
import useRequireAuth from "@/lib/hooks/useRequireAuth"

type ErrorField = "displayName" | "email"

interface UserData {
  display_name: string
  created_at: Timestamp
  email?: string
}

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
        variant='body2'
        color='text.secondary'
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

  const [user] = useAuthState(auth)
  const [save, setSave] = useState(false)
  const [email, setEmail] = useState<string>("")
  const [originalEmail, setOriginalEmail] = useState<string>("")
  const [name, setName] = useState("")
  const [originalName, setOriginalName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [createdAt, setCreatedAt] = useState<Timestamp | null>(null)
  const [error, setError] = useState({
    displayName: "",
    username: "",
    email: "",
  })
  const [editUser, setEditUser] = useState<string | null>(null)
  const [tempVal, setTempVal] = useState("")

  useEffect(() => {
    console.debug("originalEmail", originalEmail)
    console.debug("name", name)
    console.debug("originalName", originalName)
  }, [originalEmail, name, originalName])

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setEmail(user.email ?? "")
        setOriginalEmail(user.email ?? "")
        setPhotoURL(user.photoURL ?? "")

        try {
          const userRef = doc(firestore, "users", user.uid)
          const userDoc = await getDoc(userRef)
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData
            const firestoreDisplayName = userData.display_name ?? ""
            const createdTimestamp = userData.created_at ?? null

            setCreatedAt(createdTimestamp)
            setName(firestoreDisplayName)
            setDisplayName(firestoreDisplayName)
            setOriginalName(firestoreDisplayName)
          } else {
            setName(user.displayName ?? "")
            setDisplayName(user.displayName ?? "")
            setOriginalName(user.displayName ?? "")
          }
        } catch (err) {
          console.error("Error fetching user data:", err)
          snackbar.show({
            message: "Failed to load profile data",
            type: "error",
          })
        }
      }
    }

    void loadUserData()
  }, [user, navigate, snackbar])

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

  const saveChanges = async (field: string): Promise<void> => {
    if (!user) {
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

      const userRef = doc(firestore, "users", user.uid)

      if (field === "displayName") {
        await updateProfile(user, { displayName: tempVal })
        await updateDoc(userRef, { display_name: tempVal })
        setName(tempVal)
        setDisplayName(tempVal)
        setOriginalName(tempVal)
      } else if (field === "email") {
        await updateEmail(user, tempVal)
        await updateDoc(userRef, { email: tempVal })
        setEmail(tempVal)
        setOriginalEmail(tempVal)
      }

      snackbar.show({
        message: "Profile updated successfully",
        type: "success",
      })
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
          message: "Profile update unsuccessful",
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

  const providerId = user?.providerData[0]?.providerId
  const isPasswordProvider = providerId === "password"

  const [changingPassword, setChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleChangePassword = async () => {
    if (!user?.email) return
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
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
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

  const handleSignOut = () => {
    void api.auth.logout().then(() => {
      void navigate("/")
    })
  }

  return (
    <Container maxWidth='sm' sx={{ py: { xs: 3, md: 5 }, textAlign: "left" }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography
          variant='overline'
          sx={{
            letterSpacing: 2,
            color: "primary.main",
            fontWeight: 600,
          }}>
          Account
        </Typography>
        <Typography variant='h4' fontWeight={700} sx={{ mb: 4 }}>
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
              bgcolor: "primary.main",
            }}>
            {displayName ? displayName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant='h6' fontWeight={600}>
              {displayName || <Skeleton width={120} />}
            </Typography>
            {createdAt ? (
              <Typography variant='body2' color='text.secondary'>
                Member since {createdAt.toDate().toLocaleDateString()}
              </Typography>
            ) : (
              <Skeleton variant='text' width={160} />
            )}
          </Box>
        </Box>
      </RA.Fade>

      <RA.Fade triggerOnce duration={600} delay={200}>
        <Paper variant='outlined' sx={{ borderRadius: 2, overflow: "hidden" }}>
          <SettingsRow label='Display Name'>
            <Box flex={1}>
              {editUser === "displayName" ? (
                <TextField
                  placeholder='Enter display name'
                  value={tempVal}
                  onChange={(e) => {
                    setTempVal(e.target.value)
                    clearFieldError("displayName")
                  }}
                  error={!!error.displayName}
                  helperText={error.displayName}
                  fullWidth
                  size='small'
                />
              ) : (
                <Typography>{displayName}</Typography>
              )}
            </Box>
            {editUser === "displayName" ? (
              <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                <IconButton
                  color='primary'
                  onClick={handleSaveDisplayName}
                  disabled={save}
                  size='small'>
                  <Check fontSize='small' />
                </IconButton>
                <IconButton color='error' onClick={cancelEdit} size='small'>
                  <Close fontSize='small' />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => handleEdit("displayName", displayName)}
                size='small'
                sx={{ ml: 1 }}>
                <Edit fontSize='small' />
              </IconButton>
            )}
          </SettingsRow>

          <Divider />

          <SettingsRow label='Email'>
            <Typography flex={1}>{email}</Typography>
          </SettingsRow>

          <Divider />

          <SettingsRow label='Appearance'>
            <Box flex={1}>
              <ThemeSelect size='small' sx={{ minWidth: 160 }} />
            </Box>
          </SettingsRow>

          <Divider />

          <SettingsRow label='Provider'>
            <Chip
              icon={providerId === "google.com" ? <Google /> : <Email />}
              label={providerId === "google.com" ? "Google" : "Email"}
              size='small'
              variant='outlined'
            />
          </SettingsRow>

          {isPasswordProvider && (
            <>
              <Divider />
              <SettingsRow label='Password'>
                <Box flex={1}>
                  {changingPassword ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}>
                      <TextField
                        placeholder='Current password'
                        type='password'
                        size='small'
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <TextField
                        placeholder='New password'
                        type='password'
                        size='small'
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <TextField
                        placeholder='Confirm new password'
                        type='password'
                        size='small'
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant='contained'
                          size='small'
                          disabled={save}
                          onClick={() => void handleChangePassword()}>
                          Save
                        </Button>
                        <Button
                          variant='outlined'
                          size='small'
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
                      variant='outlined'
                      size='small'
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
          variant='outlined'
          color='error'
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
