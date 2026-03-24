import { PieItemId } from "@mui/x-charts"
import { DocumentReference, Timestamp } from "firebase/firestore"

/**
 * Represents a user in the system.
 */
export enum ThemeType {
  SYSTEM_THEME = "system-theme",
  LIGHT = "light",
  DARK = "dark",
}

export interface User {
  display_name: string
  email: string
  photo_url: string | null
  created_at: Timestamp
}

/**
 * Represents a poll created by a user.
 */
export interface Poll {
  owner: DocumentReference<User>
  title: string
  async: boolean
  anonymous: boolean | null
  time: number | null
  questions: DocumentReference<Question>[]
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Question {
  prompt_type: PromptType
  prompt: string
  prompt_img: string | null
  options: DocumentReference<PromptOption>[]
  points: number
  anonymous: boolean
  time: number | null
  created_at: Timestamp
  updated_at: Timestamp
}

export type PromptType = "multiple-choice" | "multi-select" | "ranking-poll"

export interface PromptTypeChoice {
  name: string
  value: PromptType
}

export const PROMPT_TYPE_CHOICES = [
  {
    name: "Multiple Choice",
    value: "multiple-choice",
  },
  {
    name: "Multi-Select",
    value: "multi-select",
  },
  {
    name: "Ranking Poll",
    value: "ranking-poll",
  },
] as PromptTypeChoice[]

export interface PromptOption {
  text: string
  correct: boolean
}

/** states for a poll session */
export enum SessionState {
  /* if a session is closed, then the session was ended by the host */
  CLOSED = "closed",
  /* if a session is in-progress, then it was started by the host */
  IN_PROGRESS = "in-progress",
  /* if a session is open, then the host hasn't started the session yet */
  OPEN = "open",
  /* if a session is done, the host showed all questions in the session */
  DONE = "done",
  /* the session was able to ask all questions, session is closed without issue  */
  FINISHED = "finished",
}

export interface SessionSummary {
  total_participants: number
  median: number
  median_100: number
  average: number
  average_100: number
  low: number
  low_100: number
  high: number
  high_100: number
  lower_quartile: number
  lower_quartile_100: number
  upper_quartile: number
  upper_quartile_100: number
  max_score: number
}

/** data model of a poll session document */
export interface Session {
  summary: SessionSummary
  host: DocumentReference<User>
  poll: DocumentReference<Poll>
  room_code: string
  title: string
  async: boolean
  anonymous: boolean | null
  time: number | null
  /* the current question to display */
  question: CurrentQuestion | null
  /* results of user responses for a question */
  results: SessionQuestionResults | null
  /* list of questions left to display in the session */
  questions_left: DocumentReference<SessionQuestion>[]
  /* list of questions */
  questions: DocumentReference<SessionQuestion>[]
  /* current state of the session */
  state: SessionState
  created_at: Timestamp
}

/** data model of the current question to display to all users in a session */
export interface CurrentQuestion {
  ref: DocumentReference<SessionQuestion>
  prompt_type: PromptType
  prompt: string
  prompt_img: string | null
  options: SessionChoice[]
  anonymous: boolean | null
  time: number | null
}

/** data model to display question results of user responses  */
export interface SessionQuestionResults {
  question: CurrentQuestion
  opts_correct: { id: string; text: string }[]
  barchart: {
    labels: string[]
    data: number[]
  }
  /* series model for PieChart */
  piechart: { id: PieItemId; value: number; label: string }[]
  // series: Record<string, { text: string; data: number[] }>
  responses: Record<string, SessionResponse>
}

/** data model of the possible choices for the current question  */
export interface SessionChoice {
  ref: DocumentReference<SessionOption>
  text: string
}

// export interface SessionAnswer {
//   choices: DocumentReference<SessionOption>
//   created_at: Timestamp
// }

export interface SessionUser {
  photo_url: string | null
  display_name: string
  joined_at: Timestamp
  incorrect: boolean
}

export interface WaitingUser {
  photo_url: string | null
  display_name: string
}

export interface SessionChat {
  user: DocumentReference<User>
  display_name: string
  photo_url: string | null
  message: string
  created_at: Timestamp
}

export interface SessionQuestion {
  prompt_type: PromptType
  prompt: string
  prompt_img: string | null
  // options: PromptOption[] delete this later
  points: number
  anonymous: boolean | null
  time: number | null
}

export interface SessionOption {
  correct: boolean
  text: string
}

export interface SessionResponse {
  user: DocumentReference<User>
  choices: DocumentReference<SessionOption>[]
  correct: boolean
  created_at: Timestamp
}

/** data model to display a user's score */
export interface Submission {
  title: string
  session: DocumentReference<Session>
  user: DocumentReference<User>
  display_name: string
  score: number
  max_score: number
  score_100: number
  submitted_at: Timestamp
  photo_url: string | null
  email: string | null
}

export interface SessionSubmission {
  ref: DocumentReference<Submission>
}

export type AIQuestions = {
  question: string
  options: string[]
  correct_answer: string
}[]
