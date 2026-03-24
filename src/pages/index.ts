import Contributors from "./legal/Contributors"
import Dashboard from "./Dashboard"
import Debug from "./Debug"
import GetStarted from "./auth/GetStarted"
import Login from "./auth/Login"
import NotFound from "./NotFound"
import PollEditor from "./poll/PollEditor"
import PollHost from "./poll/PollHost"
import PollJoin from "./poll/PollJoin"
import PollSession from "./poll/PollSession"
import PollSubmissionResults from "./poll/PollSubmissionResults"
import PollSessionResults from "./poll/PollSessionResults"
import PollView from "./poll/PollView"
import PrivacyPolicy from "./legal/PrivacyPolicy"
import Settings from "./Settings"
import Register from "./auth/Register"
import Splash from "./Splash"
import TermsOfService from "./legal/TermsOfService"
import PollParticipate from "./poll/PollParticipate"
import PollHistory from "./poll/PollHistory"

export const Page = {
  Splash,
  Contributors,
  Debug,
  Login,
  Register,
  GetStarted,
  PollHost,
  PollParticipate,
  PollSession,
  PrivacyPolicy,
  TermsOfService,
  Dashboard,
  PollJoin,
  PollEditor,
  SubmissionResults: PollSubmissionResults,
  SessionResults: PollSessionResults,
  PollHistory,
  PollView,
  Settings,
  NotFound,
}
