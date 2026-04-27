import { OptionPreset } from "@/types"

export const OPTION_PRESETS: OptionPreset[] = [
  {
    id: "tf",
    label: "T / F",
    options: ["True", "False"],
    correctIndex: 0,
  },
  {
    id: "yn",
    label: "Yes / No",
    options: ["Yes", "No"],
  },
  {
    id: "agree5",
    label: "Agree Scale",
    options: [
      "Strongly Agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly Disagree",
    ],
  },
  {
    id: "rate5",
    label: "Rating 1-5",
    options: ["1", "2", "3", "4", "5"],
  },
  {
    id: "conf",
    label: "Confidence",
    options: ["Very Confident", "Somewhat Confident", "Not Confident", "Lost"],
  },
  {
    id: "freq",
    label: "Frequency",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: "blank4",
    label: "Blank (4)",
    options: ["", "", "", ""],
  },
]
