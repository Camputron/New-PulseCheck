import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { FirebaseError } from "firebase/app"
import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getDoc } from "firebase/firestore"
import api from "@/api"
import useSnackbar from "@/hooks/useSnackbar"

const PASS_LEN = 6

type ErrorField = "displayName" | "email" | "password"

interface Props {
  open: boolean
  onClose: () => void
  sid: string
  uid: string
}

function GoogleLogo() {
  return (
    <SvgIcon viewBox="0 0 48 48" sx={{ fontSize: 20 }}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </SvgIcon>
  )
}

export default function UpgradeGuestDialog(props: Props) {
  const { open, onClose, sid, uid } = props
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    password: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [collisionError, setCollisionError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return undefined
    let cancelled = false
    getDoc(api.sessions.users.doc(sid, uid))
      .then((snap) => {
        if (cancelled) return
        const data = snap.data()
        if (data?.display_name) {
          setDisplayName(data.display_name)
        }
      })
      .catch((err) => console.debug("Failed to fetch session user", err))
    return () => {
      cancelled = true
    }
  }, [open, sid, uid])

  const setFieldError = (field: ErrorField, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }

  const clearFieldError = (field: ErrorField) => {
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    let ok = true
    if (!displayName.trim()) {
      setFieldError("displayName", "Display name required!")
      ok = false
    }
    if (!email.trim()) {
      setFieldError("email", "Email required!")
      ok = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError("email", "Invalid email!")
      ok = false
    }
    if (!password) {
      setFieldError("password", "Password required!")
      ok = false
    } else if (password.length < PASS_LEN) {
      setFieldError(
        "password",
        `Password needs to be at least ${PASS_LEN} characters.`,
      )
      ok = false
    }
    return ok
  }

  const handleEmailUpgrade = async () => {
    if (!validate()) return
    setSubmitting(true)
    setCollisionError(null)
    try {
      await api.auth.upgradeGuestWithEmail(email, password, displayName.trim())
      snackbar.show({
        message: "Account created — your results have been saved",
        type: "success",
      })
      onClose()
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/email-already-in-use" ||
          err.code === "auth/credential-already-in-use"
        ) {
          setCollisionError(
            "An account with this email already exists. You can sign in to it instead, but this session's results won't transfer over.",
          )
        } else if (err.code === "auth/weak-password") {
          setFieldError("password", "Password is too weak.")
        } else {
          snackbar.show({ message: err.message, type: "error" })
        }
      } else {
        snackbar.show({
          message: "Failed to create account. Please try again.",
          type: "error",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleUpgrade = async () => {
    setSubmitting(true)
    setCollisionError(null)
    try {
      await api.auth.upgradeGuestWithGoogle()
      snackbar.show({
        message: "Account linked — your results have been saved",
        type: "success",
      })
      onClose()
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/credential-already-in-use" ||
          err.code === "auth/email-already-in-use"
        ) {
          setCollisionError(
            "This Google account is already registered. You can sign in to it instead, but this session's results won't transfer over.",
          )
        } else if (err.code === "auth/popup-closed-by-user") {
          /* user cancelled — silent */
        } else {
          snackbar.show({ message: err.message, type: "error" })
        }
      } else {
        snackbar.show({
          message: "Failed to link Google account. Please try again.",
          type: "error",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignInInstead = async () => {
    try {
      await api.auth.logout()
    } catch (err) {
      console.debug("Logout before sign-in failed", err)
    }
    onClose()
    void navigate("/login")
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void handleEmailUpgrade()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}>
      <DialogTitle sx={{ pr: 6 }}>
        Save your results
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create an account to keep <strong>this session&apos;s</strong>{" "}
          results. Earlier guest sessions on this device won&apos;t be included.
        </Typography>

        {collisionError && (
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 1,
              backgroundColor: (t) => t.palette.error.main + "14",
              border: (t) => `1px solid ${t.palette.error.main}`,
            }}>
            <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
              {collisionError}
            </Typography>
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={() => void handleSignInInstead()}>
              Sign in instead
            </Button>
          </Box>
        )}

        <Stack
          spacing={2}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}>
          <TextField
            placeholder="Display Name"
            fullWidth
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
              clearFieldError("displayName")
            }}
            error={!!errors.displayName}
            helperText={errors.displayName}
          />
          <TextField
            placeholder="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError("email")
            }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            placeholder="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clearFieldError("password")
            }}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            fullWidth
            sx={{ borderRadius: 2, py: 1.25 }}>
            Create Account
          </Button>

          <Divider>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            disabled={submitting}
            startIcon={<GoogleLogo />}
            onClick={() => void handleGoogleUpgrade()}
            sx={{
              py: 1.25,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(255,255,255,0.23)"
                  : "#dadce0",
              color: (t) => (t.palette.mode === "dark" ? "#e8eaed" : "#3c4043"),
              backgroundColor: (t) =>
                t.palette.mode === "dark" ? "transparent" : "#fff",
              "&:hover": {
                borderColor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(255,255,255,0.4)"
                    : "#c6c6c6",
                backgroundColor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "#f7f8f8",
              },
            }}>
            Continue with Google
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
