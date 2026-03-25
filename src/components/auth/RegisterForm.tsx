import {
  Button,
  Stack,
  TextField,
  Divider,
  Typography,
  Link,
  Box,
} from "@mui/material"
import { RA } from "@/styles"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import api, { auth } from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { createUserWithEmailAndPassword } from "firebase/auth"
import GoogleAuthButton from "./GoogleAuthButton"
import { FirebaseError } from "firebase/app"

const PASS_LEN = 6
type ErrorField = "displayName" | "email" | "password" | "retypePassword"

export default function RegisterForm() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState("")
  const [retypePassword, setRetypePassword] = useState("")
  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    password: "",
    retypePassword: "",
  })
  const [displayName, setDisplayName] = useState("")

  const clearFieldError = (field: ErrorField) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  const setFieldError = (field: ErrorField, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }))
  }

  const validate = () => {
    let validated = true
    if (!displayName) {
      setFieldError("displayName", "Display name required!")
      validated = false
    }
    if (!email) {
      setFieldError("email", "Email required!")
      validated = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError("email", "Invalid email!")
      validated = false
    }
    if (!password) {
      setFieldError("password", "Password required!")
      validated = false
    } else if (password.length < PASS_LEN) {
      setFieldError(
        "password",
        `Password needs to be at least ${PASS_LEN} characters.`
      )
      validated = false
    }

    if (password && password !== retypePassword) {
      setFieldError("retypePassword", "Passwords don't match")
      validated = false
    }
    return validated
  }

  const handleRegClick = async () => {
    if (!validate()) {
      return
    }
    try {
      const UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = UserCredential.user

      await api.users.create(user.uid, {
        email: user.email!,
        display_name: displayName,
        photo_url: user.photoURL,
      })

      snackbar.show({
        message: "Get Ready to Poll Up",
      })

      void navigate("/dashboard")
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setErrors((prev) => ({ ...prev, email: "Email already in use!" }))
        }
      }
    }
  }

  const handleLink = () => {
    void navigate("/login")
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography variant='h5' fontWeight={700} sx={{ mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
          Sign up to start using PulseCheck.
        </Typography>

        <Stack component={"form"} spacing={2.5} noValidate autoComplete='off'>
          <TextField
            placeholder='Display Name'
            fullWidth
            size='medium'
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value)
              clearFieldError("displayName")
            }}
            error={!!errors.displayName}
            helperText={errors.displayName}
          />
          <TextField
            placeholder='Email'
            type='email'
            fullWidth
            size='medium'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError("email")
            }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            placeholder='Password'
            fullWidth
            size='medium'
            value={password}
            type='password'
            onChange={(e) => {
              setPassword(e.target.value)
              clearFieldError("password")
            }}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            placeholder='Confirm Password'
            fullWidth
            size='medium'
            value={retypePassword}
            type='password'
            onChange={(e) => {
              setRetypePassword(e.target.value)
              clearFieldError("retypePassword")
            }}
            error={!!errors.retypePassword}
            helperText={errors.retypePassword}
          />

          <Button
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
            sx={{ borderRadius: 2 }}
            onClick={(e) => {
              e.preventDefault()
              void handleRegClick()
            }}>
            Create Account
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant='body2' color='text.secondary'>
              or register with
            </Typography>
          </Divider>

          <GoogleAuthButton />

          <Box display={"flex"} justifyContent={"center"}>
            <Link
              color='text.secondary'
              onClick={handleLink}
              variant='body2'
              sx={{
                cursor: "pointer",
                transition: "color 0.2s",
                "&:hover": { color: "primary.main" },
              }}>
              Already have an account? Sign In
            </Link>
          </Box>
        </Stack>
      </RA.Fade>
    </Box>
  )
}
