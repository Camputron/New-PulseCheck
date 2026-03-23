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
import { auth } from "@/lib/api/firebase"
import useSnackbar from "@/lib/hooks/useSnackbar"
import { signInWithEmailAndPassword } from "firebase/auth"
import SignInWGoogleButton from "@/components/auth/ContinueWGoogleButton"
import { FirebaseError } from "firebase/app"

type ErrorField = "email" | "password"

export default function UserLogin() {
  const navigate = useNavigate()
  const snackbar = useSnackbar()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })
  // const [displayName, setDisplayName] = useState("")

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
    // throw new Error(message)
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

  const handleRegClick = async () => {
    if (!validate()) {
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)

      snackbar.show({
        message: "Get Ready to Poll Up",
      })

      void navigate("/dashboard")
    } catch (err: unknown) {
      //error handling method used from firebase authentication page
      if (err instanceof FirebaseError) {
        // if (err.code === "auth/user-not-found" || "auth/wrong-password") {
        //   setErrors((prev) => ({ ...prev, email, password: "User not found!" }));
        // } tried both in one if statement, didn't end up working so split them up
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
        <Typography variant='h5' fontWeight={700} sx={{ mb: 1 }}>
          Sign In
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
          Enter your credentials to continue.
        </Typography>

        <SignInWGoogleButton />

        <Divider sx={{ my: 3 }}>
          <Typography variant='body2' color='text.secondary'>
            or continue with email
          </Typography>
        </Divider>

        <Stack component={"form"} spacing={2.5} noValidate autoComplete='off'>
          <TextField
            id='user-email'
            label='Email'
            type='email'
            variant='outlined'
            fullWidth
            size='medium'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError("email")
            }}
            // onKeyDown={() => clearFieldError("email")}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            id='input-password'
            label='Password'
            fullWidth
            size='medium'
            value={password}
            // type={showPassword ? "text" : "password"}
            type='password'
            onChange={(e) => {
              setPassword(e.target.value)
              clearFieldError("password")
            }}
            // onKeyDown={() => clearFieldError("password")}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            }}
            onClick={(e) => {
              /*
                  setting the button type to submit allows you to fire
                  the button's on click event with the 'Enter' key
                */
              e.preventDefault()
              void handleRegClick()
            }}>
            Sign In
          </Button>

          <Box display={"flex"} justifyContent={"center"}>
            <Link
              color='textPrimary'
              onClick={handleLink}
              variant='body2'
              sx={{
                cursor: "pointer",
                transition: "color 0.2s",
                "&:hover": { color: "primary.main" },
              }}>
              Don't have an account? Register
            </Link>
          </Box>
        </Stack>
      </RA.Fade>
    </Box>
  )
}
