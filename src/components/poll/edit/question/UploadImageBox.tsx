import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useState, useEffect } from "react"
import React from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import api, { storage } from "@/api"
import { CloudUpload, Delete } from "@mui/icons-material"
interface Props {
  pid: string
  qid: string
  url: string | null
}

/**
 * An image upload component that allows users to upload images to go
 * along with their prompt of their poll.
 * Users clicks the upload button to upload a file from their device.
 * Displays image when the user uploads.
 * @returns {JSX.Element}
 */

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

/**
 * Handles uploading question images to fire cloud storage.
 * @author Bran7tastic
 */
export default function UploadImageBox(props: Props) {
  /**
   * @Bran7astic
   * You're going to have to use a mix of the useState and useRef hook.
   * At the moment, I have not yet received the debit card to upload the
   * firebase plan, so the most you can do is allow the user to click a
   * 'button' to upload an image. It must be an image, you can filter by
   * file extensions. Refer to UQC-B on Github Projects.
   * @see https://github.com/orgs/CSC190-289/projects/1/views/1?pane=issue&itemId=99567048&issue=CSC190-289%7CPulseCheck%7C50
   *
   * Since we don't have access to Cloud Storage yet, you can implement
   * the UI and the functions to upload an image and display it on the app.
   *
   * Ideally, I hope I can get the card by Monday (3/17), so instead of
   * display the user's image from their computer, you can upload the image
   * to the cloud and use the link to the image and display it.
   *
   * To be clear, the UI doesn't have to be 100% perfect, you may set the
   * limits of what the user can upload (e.g. file type, file size) as long
   * as it's reasonable.
   *
   * In my mind, the UI should have the following:
   * - Similar to the figma, a dotted border of where the image will be displayed
   *   if uploaded. This will act as the button to allow the user to upload their image.
   * - On click on "Link", the user's default file manager will open to allow the user
   *   to upload their image. Also, cursor should be set as a pointer when hovering over
   *   the upload box.
   * - If you're a giga-chad, allow the user to drag and drop their file.
   * - After uploading the user's image, display it where the dotted-box use to be.
   * - If the user wants to replace the uploaded image, display an edit icon over the
   *   uploaded image to indicate to the user you can upload a new image OR drag-and-drop
   *   like a giga-chad.
   */

  const questionDocRef = api.polls.questions.doc(props.pid, props.qid)

  const [imageURL, setImageURL] = useState<string | null>("") // Sets image url once image is uploaded to cloud firestore
  const [loading, setLoading] = useState<boolean>(false) // Sets loading state to prompt loading icon
  useEffect(() => {
    setImageURL(props.url)
  }, [props.url])

  useEffect(() => {
    // console.debug("Image URL: ", imageURL)
  }, [imageURL])
  // Asynchronously uploads file to cloud firestore and sets image url
  const fileUpload = async (fileToUpload: File, storagePath: string) => {
    setLoading(true)
    const fileRef = ref(storage, storagePath)

    try {
      const snapshot = await uploadBytes(fileRef, fileToUpload) // Uploads image
      const downloadURL = await getDownloadURL(snapshot.ref) // Gets download URL from firestore
      await api.polls.questions.update(questionDocRef, {
        prompt_img: downloadURL,
      })
      setImageURL(downloadURL)
    } catch (error) {
      console.debug("An error has occurred: ", error)
    }
    setLoading(false)
  }

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.debug("File Uploading")
    const processFile = async () => {
      const selectedFile = event.target.files?.[0]
      if (selectedFile) {
        // Checks if file is an image
        if (!selectedFile.type.startsWith("image/")) {
          alert("Please upload an image.")
          return
        }
        // Prevents files greater than 10mb
        const fileSize = selectedFile.size / (1024 * 1024)
        if (fileSize >= 10) {
          alert("Please upload a file smaller than 10mb")
          return
        }
        await fileUpload(selectedFile, `poll-images/${selectedFile.name}`)
      }
    }

    processFile().catch((error) => {
      console.error("Error processing file", error)
    })
  }

  const handleDelete = () => {
    const deleteFile = async () => {
      setImageURL(null)
      await api.polls.questions.update(questionDocRef, {
        prompt_img: null,
      })
    }
    deleteFile().catch((error) => {
      console.error("Error deleting file", error)
    })
  }

  return (
    <Box
      sx={{
        // display: "flex",
        // //flex: 1,
        // width: "100%",
        // justifyContent: "center",
        // alignItems: "center",
        display: "grid",
        placeItems: "center",
        width: "100%",
      }}>
      <Card
        variant="outlined"
        sx={{
          // padding: 5,
          borderStyle: imageURL ? "none" : "dashed",
          borderWidth: 2,
          borderRadius: 3,
        }}>
        {imageURL && (
          <CardMedia
            sx={{ objectFit: "contain" }}
            component="img"
            alt="img"
            // height='200'
            // width='113'
            image={imageURL}
          />
        )}
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "center" }}>
          {loading ? (
            <CircularProgress color="primary" size={25} />
          ) : (
            <Tooltip title="Upload Image">
              <IconButton component="label" color="primary" size="large">
                <CloudUpload fontSize="inherit" />
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </IconButton>
            </Tooltip>
          )}
          {imageURL && (
            <Tooltip title="Delete Image">
              <IconButton onClick={handleDelete} color="primary" size="large">
                <Delete fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Card>
    </Box>
  )
}
