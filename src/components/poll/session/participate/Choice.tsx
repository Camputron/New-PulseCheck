import { PromptType } from "@/types"
import {
  Card,
  CardActionArea,
  Checkbox,
  FormControlLabel,
  Radio,
} from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { DocumentReference, refEqual } from "firebase/firestore"
import { SessionOption } from "@/types"

//chosenones changes to specify what type it is
//string of objects in array
interface ChoiceProps {
  text: string
  //added in ref to specify what type it is
  ref: DocumentReference<SessionOption>
  promptType: PromptType
  theChosenOnes: DocumentReference<SessionOption>[]
  setTheChosenOnes: Dispatch<SetStateAction<DocumentReference<SessionOption>[]>>
}

// const handleChange  = () => void

export default function Choice(props: ChoiceProps) {
  const { text, ref, promptType, theChosenOnes, setTheChosenOnes } = props
  const handleCheck = (event: React.SyntheticEvent) => {
    event.preventDefault()
    switch (promptType) {
      case "multiple-choice": {
        setTheChosenOnes([ref])
        break
      }
      case "multi-select": {
        if (theChosenOnes.find((x) => refEqual(x, ref))) {
          const newChosenOnes = theChosenOnes.filter((x) => !refEqual(x, ref))
          setTheChosenOnes(newChosenOnes)
        } else {
          setTheChosenOnes([...theChosenOnes, ref])
        }
        break
      }
      case "ranking-poll": {
        setTheChosenOnes([ref])
        break
      }
      default: {
        throw new Error("what the figma")
      }
    }
  }
  return (
    <Card sx={{ p: 0 }}>
      <CardActionArea>
        <FormControlLabel
          onChange={handleCheck}
          value={props.text}
          sx={{
            m: 1,
            px: 1,
            "& .MuiFormControlLabel-label": { p: 1 },
          }}
          checked={Boolean(theChosenOnes.find((x) => refEqual(x, ref)))}
          control={
            promptType === "multi-select" ? (
              <Checkbox sx={{ p: 0 }} />
            ) : (
              <Radio sx={{ p: 0 }} />
            )
          }
          label={text}
        />
      </CardActionArea>
    </Card>
  )
}
