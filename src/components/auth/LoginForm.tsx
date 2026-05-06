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
import { auth } from "@/api"
import useSnackbar from "@/hooks/useSnackbar"
import { signInWithEmailAndPassword } from "firebase/auth"
import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import { FirebaseError } from "firebase/app"

type ErrorField = "email" | "password"

export default function LoginForm() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

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
    }
    return validated
  }

  const handleLogin = async () => {
    if (!validate()) {
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)

      // snackbar.show({
      //   message: "Get Ready to Poll Up",
      //   type: "success",
      // })

      void navigate("/dashboard")
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found") {
          setErrors((prev) => ({ ...prev, email: "User not found!" }))
        } else if (err.code === "auth/wrong-password") {
          setErrors((prev) => ({ ...prev, password: "Incorrect password!" }))
        } else {
          snackbar.show({
            message: "Incorrect Email or Password. Please try again.",
            type: "error",
          })
        }
      }
    }
  }

  const handleLink = () => {
    void navigate("/register")
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <RA.Fade triggerOnce duration={600}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Enter your credentials to continue.
        </Typography>

        <Stack component={"form"} spacing={2.5} noValidate autoComplete="off">
          <TextField
            placeholder="Email"
            type="email"
            fullWidth
            size="medium"
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
            fullWidth
            size="medium"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value)
              clearFieldError("password")
            }}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ borderRadius: 2 }}
            onClick={(e) => {
              e.preventDefault()
              void handleLogin()
            }}>
            Continue
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or sign in with
            </Typography>
          </Divider>

          <GoogleAuthButton />

          <Box display={"flex"} justifyContent={"center"}>
            <Link
              color="text.primary"
              onClick={handleLink}
              variant="body2"
              sx={{
                cursor: "pointer",
                transition: "color 0.2s",
                "&:hover": { color: "primary.main" },
              }}>
              Don't have an account yet? Register
            </Link>
          </Box>
        </Stack>
      </RA.Fade>
    </Box>
  )
}
