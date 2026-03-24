import React from "react"
import "./styles/App.css"
import { Route, Routes } from "react-router-dom"
import { Screen } from "./screens"
import AppBar from "./components/header/AppBar"

export default function App() {
  return (
    <React.Fragment>
      <AppBar />
      <Routes>
        <Route path='/' element={<Screen.Splash />} />
        <Route path='/debug' element={<Screen.Debug />} />
        <Route path='/login' element={<Screen.Login />} />
        <Route path='/register' element={<Screen.Register />} />
        <Route path='/get-started' element={<Screen.GetStarted />} />
        <Route path='/privacy-policy' element={<Screen.PrivacyPolicy />} />
        <Route path='/terms-of-service' element={<Screen.TermsOfService />} />
        <Route path='/contributors' element={<Screen.Contributors />} />
        <Route path='/dashboard' element={<Screen.Dashboard />} />
        {/* poll session routes */}
        <Route path='/poll/join' element={<Screen.PollJoin />} />
        <Route path='/poll/session/:id/host' element={<Screen.PollHost />} />
        <Route path='/poll/session/:id' element={<Screen.PollSession />} />
        <Route
          path='/poll/session/:id/participate'
          element={<Screen.PollParticipate />}
        />
        {/* poll routes */}
        <Route path='/poll/:id/edit' element={<Screen.PollEditor />} />
        <Route
          path='/poll/submission/:id/results'
          element={<Screen.SubmissionResults />}
        />
        <Route
          path='/poll/session/:id/results'
          element={<Screen.SessionResults />}
        />
        <Route path='/poll/history/' element={<Screen.PollHistory />} />
        {/* <Route path='/poll/:id/overview' element={<Screen.PollView />} /> */}
        <Route path='/settings' element={<Screen.Settings />} />
        <Route path='*' element={<Screen.NotFound />} />
      </Routes>
    </React.Fragment>
  )
}
