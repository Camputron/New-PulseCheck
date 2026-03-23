import {
  Box,
  Container,
  Typography,
  TextField,
  Avatar,
  Skeleton,
  IconButton,
} from "@mui/material"
import { Edit, Check, Close } from "@mui/icons-material"
import { RA } from "@/styles"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "@/lib/api/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import useSnackbar from "@/lib/hooks/useSnackbar"
import { firestore } from "@/lib/api/firebase"
import { doc, Timestamp, getDoc, updateDoc } from "firebase/firestore"
import { updateEmail, updateProfile } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import ThemeSelect from "@/components/ThemeSelect"
import useRequireAuth from "@/lib/hooks/useRequireAuth"

type ErrorField = "displayName" | "email"

interface UserData {
  display_name: string
  created_at: Timestamp
  email?: string
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
            sx={{ width: 48, height: 48, fontSize: 20 }}>
            {displayName ? displayName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>
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

      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}>
        <RA.Fade triggerOnce duration={600} delay={200}>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
            }}>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ width: 140 }}>
              Display Name
            </Typography>
            <Box flex={1}>
              {editUser === "displayName" ? (
                <TextField
                  variant='standard'
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
                sx={{ ml: 1, color: "text.secondary" }}>
                <Edit fontSize='small' />
              </IconButton>
            )}
          </Box>
        </RA.Fade>

        <RA.Fade triggerOnce duration={600} delay={300}>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
            }}>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ width: 140 }}>
              Email
            </Typography>
            <Typography flex={1}>{email}</Typography>
          </Box>
        </RA.Fade>

        <RA.Fade triggerOnce duration={600} delay={400}>
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
              sx={{ width: 140 }}>
              Theme
            </Typography>
            <Box flex={1}>
              <ThemeSelect size='small' sx={{ minWidth: 160 }} />
            </Box>
          </Box>
        </RA.Fade>
      </Box>
    </Container>
  )
}
