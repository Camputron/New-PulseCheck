import { useNavigate } from "react-router-dom"
import { Button, SvgIcon } from "@mui/material"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import api from "@/api"

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

export default function GoogleAuthButton() {
  const navigate = useNavigate()
  const auth = getAuth()

  const handleRegister = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((res) => {
        console.debug("res.user.uid", res.user.uid)
        const user = res.user
        return api.users.create(user.uid, {
          email: user.email!,
          display_name: user.displayName!,
          photo_url: user.photoURL,
        })
      })
      .then(() => {
        void navigate("/dashboard")
      })
      .catch((error) => {
        console.debug(error)
      })
  }

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<GoogleLogo />}
      onClick={handleRegister}
      sx={{
        py: 1.5,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.95rem",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.23)" : "#dadce0",
        color: (theme) =>
          theme.palette.mode === "dark" ? "#e8eaed" : "#3c4043",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "transparent" : "#fff",
        "&:hover": {
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "#c6c6c6",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "#f7f8f8",
        },
      }}>
      Continue with Google
    </Button>
  )
}
